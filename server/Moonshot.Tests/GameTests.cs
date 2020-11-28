using FluentAssertions;
using GraphQL;
using Moonshot.Server.Models;
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

            var gameMutationRequest = new GraphQLRequest
            {
                Query = @"mutation CreateGame($name: String) {
                    createGame(name: $name) {
                        name
                    }
                  }",
                Variables = new
                {
                    name = "Game1"
                }
            };

            var r = await fixture.SendMutation<GraphQlPlayerModelRoot>(gameMutationRequest);
            await fixture.SendMutation<GraphQlPlayerModelRoot>(gameMutationRequest);

            var graphQLResponse = await fixture.Execute<GraphQlGameModel>(gamesRequest);

            graphQLResponse.Games.Length.Should().Be(1);
            graphQLResponse.Games[0].Name.Should().Be("Game1");
        }

        [Fact]
        public async Task PlayerJoin()
        {
            using var fixture = new ApiFixture(5014);

            var joinGameRequest = new GraphQLRequest
            {
                Query = @"mutation Join($gameName: String!, $playerName: String!) {
                    joinGame(gameName: $gameName, playerName: $playerName) {
                        name
                        players {
                            name
                            index
                        }
                    }
                  }",
                Variables = new
                {
                    gameName = "Game1",
                    playerName = "Steve"
                }
            };

            await fixture.SendMutation<GraphQlPlayerModelRoot>(joinGameRequest);
            await fixture.SendMutation<GraphQlPlayerModelRoot>(joinGameRequest);

            var graphQLResponse = await fixture.Execute<GraphQlGameModel>(gamesRequest);

            graphQLResponse.Games.Length.Should().Be(1);
            graphQLResponse.Games[0].Name.Should().Be("Game1");
            graphQLResponse.Games[0].Players.Count().Should().Be(1);
            graphQLResponse.Games[0].Players.Single().Name.Should().Be("Steve");
        }

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
