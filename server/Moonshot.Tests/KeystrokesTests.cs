using FluentAssertions;
using GraphQL;
using Moonshot_Server;
using System.Threading.Tasks;
using Xunit;

namespace Moonshot.Tests
{
    public class KeystrokesTests
    {
        private GraphQLRequest keystrokesRequest = new GraphQLRequest
        {
            Query = @"
                {
                    keystrokes
                    {
                        playerName
                        keystroke
                    }
                }"
        };

        [Fact]
        public async Task ReadEmptyKeystrokes()
        {
            using var fixture = new ApiFixture(5012);

            var graphQLResponse = await fixture.Execute<GraphQlModel>(keystrokesRequest);

            graphQLResponse.Keystrokes.Length.Should().Be(0);
        }

        [Fact]
        public async Task KeystrokeMutation()
        {
            using var fixture = new ApiFixture(5013);

            var playersMutationRequest = new GraphQLRequest
            {
                Query = @"mutation AddKeystroke($playerName: String, $keystroke: String) {
                    addKeystroke(playerName: $playerName, keystroke: $keystroke) {
                        playerName
                        keystroke
                    }
                  }",
                Variables = new
                {
                    playerName = "Steve",
                    keystroke = "S"
                }
            };

            await fixture.SendMutation<GraphQlPlayerModelRoot>(playersMutationRequest);
            await fixture.SendMutation<GraphQlPlayerModelRoot>(playersMutationRequest);

            var graphQLResponse = await fixture.Execute<GraphQlModel>(keystrokesRequest);

            graphQLResponse.Keystrokes.Length.Should().Be(2);
            graphQLResponse.Keystrokes[0].PlayerName.Should().Be("Steve");
            graphQLResponse.Keystrokes[0].Keystroke.Should().Be("S");
            graphQLResponse.Keystrokes[1].PlayerName.Should().Be("Steve");
            graphQLResponse.Keystrokes[1].Keystroke.Should().Be("S");
        }

        public class GraphQlKeystroke
        {
            public string PlayerName { get; set; }
            public string Keystroke { get; set; }
        }

        public class GraphQlModel
        {
            public GraphQlKeystroke[] Keystrokes { get; set; }
        }

        public class GraphQlPlayerModelRoot
        {
            public GraphQlKeystroke AddKeystroke { get; set; }
        }
    }
}
