using FluentAssertions;
using GraphQL;
using Moonshot.Server.Models;
using System;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace Moonshot.Tests
{
    public class GameTests
    {
        private GraphQLRequest gamesRequest(bool? started = null) => new GraphQLRequest
        {
            Query = @"
                query getGames($started: Boolean) {
                    games(started: $started) {
                        name
                        gameText
                        started
                        players {
                            name
                            index
                            keystrokes
                        }
                    }
                }",
            Variables = new
            {
                started = started
            }
        };

        private Func<string, string, string, GraphQLRequest> createGameRequest = (gameName, gameText, playerName) => new GraphQLRequest
        {
            Query = @"mutation CreateGame($name: String!, $gameText: String!, $playerName: String!) {
                    createGame(name: $name, gameText: $gameText, playerName: $playerName) {
                        name
                        gameText
                    }
                  }",
            Variables = new
            {
                name = gameName,
                gameText = gameText,
                playerName = playerName
            }
        };

        private Func<string, GraphQLRequest> startGameRequest = (gameName) => new GraphQLRequest
        {
            Query = @"mutation StartGame($name: String!, $state: GameState!) {
                    startGame(name: $name, state: $state) {
                        name
                        gameText
                    }
                  }",
            Variables = new
            {
                name = gameName,
                state = Game.GameState.Started
            }
        };



        Func<string, string, string, GraphQLRequest> joinGameRequest = (gameName, playerName, gameText) => new GraphQLRequest
        {
            Query = @"mutation Join($gameName: String!, $playerName: String!, $gameText: String!) {
                    joinGame(gameName: $gameName, playerName: $playerName, gameText: $gameText) {
                        name
                        players {
                            name
                            index
                        }
                    }
                  }",
            Variables = new
            {
                gameName = gameName,
                playerName = playerName,
                gameText = gameText
            }
        };

        [Fact]
        public async Task NoGamesInitially()
        {
            using var fixture = new ApiFixture(5016);

            var graphQLResponse = await fixture.Execute<GraphQlGameModel>(gamesRequest());

            graphQLResponse.Games.Length.Should().Be(0);
        }

        [Fact]
        public async Task CreateGame()
        {
            using var fixture = new ApiFixture(5015);

            var r = await fixture.SendMutation<GraphQlPlayerModelRoot>(createGameRequest("Game1", "Lorem Ipsum", "Player1"));
            await fixture.SendMutation<GraphQlPlayerModelRoot>(createGameRequest("Game1", "Lorem Ipsum", "Player1"));

            var graphQLResponse = await fixture.Execute<GraphQlGameModel>(gamesRequest());

            graphQLResponse.Games.Length.Should().Be(1);
            graphQLResponse.Games[0].Name.Should().Be("Game1");
            graphQLResponse.Games[0].Started.Should().Be(false);
            graphQLResponse.Games[0].GameText.Should().Be("Lorem Ipsum");
            graphQLResponse.Games[0].Players.Length.Should().Be(1);
        }

        [Fact]
        public async Task StartGame()
        {
            using var fixture = new ApiFixture(5019);

            var r = await fixture.SendMutation<GraphQlPlayerModelRoot>(createGameRequest("Game1", "Lorem Ipsum", "Player1"));

            await fixture.SendMutation<GraphQlGameModel>(startGameRequest("Game1"));

            var graphQLResponse = await fixture.Execute<GraphQlGameModel>(gamesRequest());

            graphQLResponse.Games[0].Started.Should().Be(true);
        }

        [Fact]
        public async Task GetStartedGames()
        {
            using var fixture = new ApiFixture(5020);

            await fixture.SendMutation<GraphQlPlayerModelRoot>(createGameRequest("Game1", "Lorem Ipsum", "Player1"));
            await fixture.SendMutation<GraphQlPlayerModelRoot>(createGameRequest("Game2", "Lorem Ipsum", "Player1"));

            await fixture.SendMutation<GraphQlGameModel>(startGameRequest("Game2"));

            var graphQLResponse = await fixture.Execute<GraphQlGameModel>(gamesRequest(true));

            graphQLResponse.Games.Length.Should().Be(1);
            graphQLResponse.Games[0].Started.Should().Be(true);
            graphQLResponse.Games[0].Name.Should().Be("Game2");
        }

        [Fact]
        public async Task PlayerJoin()
        {
            using var fixture = new ApiFixture(5014);

            // todo: gameText shouldn't be required
            await fixture.SendMutation<GraphQlPlayerModelRoot>(joinGameRequest("Game1", "Steve", "Lorem Ipsum"));
            await fixture.SendMutation<GraphQlPlayerModelRoot>(joinGameRequest("Game1", "Steve", "Lorem Ipsum"));

            var graphQLResponse = await fixture.Execute<GraphQlGameModel>(gamesRequest());

            graphQLResponse.Games.Length.Should().Be(1);
            graphQLResponse.Games[0].Name.Should().Be("Game1");
            graphQLResponse.Games[0].Players.Count().Should().Be(1);
            graphQLResponse.Games[0].Players.Single().Name.Should().Be("Steve");
        }

        [Fact]
        public async Task PlayerCantJoinStartedGame()
        {
            using var fixture = new ApiFixture(5014);

            await fixture.SendMutation<GraphQlPlayerModelRoot>(createGameRequest("Game1", "Lorem Ipsum", "Player 1"));

            await fixture.SendMutation<GraphQlGameModel>(startGameRequest("Game1"));

            try
            {
                await fixture.SendMutation<GraphQlPlayerModelRoot>(joinGameRequest("Game1", "Player2", "Lorem Ipsum"));
            }
            catch
            {
            }

            var graphQLResponse = await fixture.Execute<GraphQlGameModel>(gamesRequest());

            graphQLResponse.Games.Length.Should().Be(1);
            graphQLResponse.Games[0].Name.Should().Be("Game1");
            graphQLResponse.Games[0].Players.Count().Should().Be(1);
            graphQLResponse.Games[0].Players.Single().Name.Should().Be("Player 1");
        }

        [Fact]
        public async Task PlayerKeystroke()
        {
            using var fixture = new ApiFixture(5017);

            var playerName = "Player 1";
            var gameName = "Game1";

            var playerKeystrokeRequest = new GraphQLRequest
            {
                Query = @"mutation Keystroke($gameName: String!, $playerName: String!, $keystroke: String!) {
                    addGameKeystroke(gameName: $gameName, playerName: $playerName, keystroke: $keystroke) {
                        playerName
                        keystroke
                        id
                    }
                  }",
                Variables = new
                {
                    gameName = gameName,
                    playerName = playerName,
                    keystroke = "A"
                }
            };

            await fixture.SendMutation<GraphQlPlayerModelRoot>(joinGameRequest(gameName, playerName, "Lorem Ipsum"));

            await fixture.SendMutation<GraphQlGameModel>(startGameRequest(gameName));

            await fixture.SendMutation<GraphQlPlayerModelRoot>(playerKeystrokeRequest);
            await fixture.SendMutation<GraphQlPlayerModelRoot>(playerKeystrokeRequest);

            var graphQLResponse = await fixture.Execute<GraphQlGameModel>(gamesRequest());

            graphQLResponse.Games.Length.Should().Be(1);
            graphQLResponse.Games[0].Name.Should().Be(gameName);
            graphQLResponse.Games[0].Players.Count().Should().Be(1);
            var p = graphQLResponse.Games[0].Players.Single();
            p.Name.Should().Be(playerName);
            p.Keystrokes.ElementAt(0).Should().Be("A");
            p.Keystrokes.ElementAt(1).Should().Be("A");
        }

        public class GraphQlGameModel
        {
            public GraphQlGameModel2[] Games { get; set; }
        }

        public class GraphQlGameModel2
        {
            public string Name { get; set; }

            public bool Started { get; set; }

            public string GameText { get; set; }

            public GraphQlPlayerModel[] Players { get; set; }
        }

        public class GraphQlPlayerModel
        {
            public string Name { get; set; }
            public int Index { get; set; }
            public string[] Keystrokes { get; set; }
        }

        public class GraphQlPlayerKeystroke
        {
            public string PlayerName { get; set; }
            public string Id { get; set; }
            public string Keystroke { get; set; }
        }

        public class GraphQlPlayerModelRoot
        {
            public Game CreateGame { get; set; }
        }
    }
}
