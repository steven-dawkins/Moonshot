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
        private GraphQLRequest gamesRequest = new GraphQLRequest
        {
            Query = @"
                {
                    games {
                        name
                        gameText
                        players {
                            name
                            index
                        }
                        keystrokes {
                            id
                            playerName
                            keystroke
                        }
                    }
                }"
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

            var graphQLResponse = await fixture.Execute<GraphQlGameModel>(gamesRequest);

            graphQLResponse.Games.Length.Should().Be(0);
        }

        [Fact]
        public async Task CreateGame()
        {
            using var fixture = new ApiFixture(5015);

            var r = await fixture.SendMutation<GraphQlPlayerModelRoot>(createGameRequest("Game1", "Lorem Ipsum", "Player1"));
            await fixture.SendMutation<GraphQlPlayerModelRoot>(createGameRequest("Game1", "Lorem Ipsum", "Player1"));

            var graphQLResponse = await fixture.Execute<GraphQlGameModel>(gamesRequest);

            graphQLResponse.Games.Length.Should().Be(1);
            graphQLResponse.Games[0].Name.Should().Be("Game1");
            graphQLResponse.Games[0].GameText.Should().Be("Lorem Ipsum");
        }

        [Fact]
        public async Task PlayerJoin()
        {
            using var fixture = new ApiFixture(5014);

            // todo: gameText shouldn't be required
            await fixture.SendMutation<GraphQlPlayerModelRoot>(joinGameRequest("Game1", "Steve", "Lorem Ipsum"));
            await fixture.SendMutation<GraphQlPlayerModelRoot>(joinGameRequest("Game1", "Steve", "Lorem Ipsum"));

            var graphQLResponse = await fixture.Execute<GraphQlGameModel>(gamesRequest);

            graphQLResponse.Games.Length.Should().Be(1);
            graphQLResponse.Games[0].Name.Should().Be("Game1");
            graphQLResponse.Games[0].Players.Count().Should().Be(1);
            graphQLResponse.Games[0].Players.Single().Name.Should().Be("Steve");
        }

        //[Fact]
        //public async Task PlayerCantJoinStartedGame()
        //{
        //    using var fixture = new ApiFixture(5014);

        //    await fixture.SendMutation<GraphQlPlayerModelRoot>(createGameRequest("Game1", "Lorem Ipsum"));
        //    // todo: start game
        //    await fixture.SendMutation<GraphQlPlayerModelRoot>(joinGameRequest("Game1", "Steve"));

        //    var graphQLResponse = await fixture.Execute<GraphQlGameModel>(gamesRequest);

        //    graphQLResponse.Games.Length.Should().Be(1);
        //    graphQLResponse.Games[0].Name.Should().Be("Game1");
        //    graphQLResponse.Games[0].Players.Count().Should().Be(1);
        //    graphQLResponse.Games[0].Players.Single().Name.Should().Be("Steve");
        //}

        [Fact]
        public async Task PlayerKeystroke()
        {
            using var fixture = new ApiFixture(5017);

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
                    gameName = "Game1",
                    playerName = "Steve",
                    keystroke = "A"
                }
            };

            await fixture.SendMutation<GraphQlPlayerModelRoot>(playerKeystrokeRequest);
            await fixture.SendMutation<GraphQlPlayerModelRoot>(playerKeystrokeRequest);

            var graphQLResponse = await fixture.Execute<GraphQlGameModel>(gamesRequest);

            graphQLResponse.Games.Length.Should().Be(1);
            graphQLResponse.Games[0].Name.Should().Be("Game1");
            graphQLResponse.Games[0].Players.Count().Should().Be(1);
            graphQLResponse.Games[0].Players.Single().Name.Should().Be("Steve");
            graphQLResponse.Games[0].Keystrokes.ElementAt(0).Keystroke.Should().Be("A");
            graphQLResponse.Games[0].Keystrokes.ElementAt(1).PlayerName.Should().Be("Steve");
            graphQLResponse.Games[0].Keystrokes.ElementAt(1).Keystroke.Should().Be("A");
            graphQLResponse.Games[0].Keystrokes.ElementAt(1).PlayerName.Should().Be("Steve");
        }

        public class GraphQlGameModel
        {
            public GraphQlGameModel2[] Games { get; set; }
        }

        public class GraphQlGameModel2
        {
            public string Name { get; set; }

            public string GameText { get; set; }

            public GraphQlPlayerModel[] Players { get; set; }

            public GraphQlPlayerKeystroke[] Keystrokes { get; set; }
        }

        public class GraphQlPlayerModel
        {
            public string Name { get; set; }
            public int Index { get; set; }
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
