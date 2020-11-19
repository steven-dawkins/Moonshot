using FluentAssertions;
using GraphQL;
using Moonshot_Server;
using Moonshot_Server.Models;
using System.Threading.Tasks;
using Xunit;

namespace Moonshot.Tests
{
    public class PlayerTests
    {
        private GraphQLRequest playersRequest = new GraphQLRequest
        {
            Query = @"
                {
                    players
                }"
        };

        [Fact]
        public async Task NoPlayersInitially()
        {
            using var fixture = new ApiFixture();

            var graphQLResponse = await fixture.Execute<GraphQlPlayerModel>(playersRequest);

            graphQLResponse.Players.Length.Should().Be(0);
        }

        [Fact]
        public async Task PlayerJoin()
        {
            using var fixture = new ApiFixture();

            var playersMutationRequest = new GraphQLRequest
            {
                Query = @"mutation Join($name: String) {
                    join(name: $name)
                  }",
                Variables = new
                {
                    name = "Steve"
                }
            };

            await fixture.SendMutation<GraphQlPlayerModelRoot>(playersMutationRequest);
            await fixture.SendMutation<GraphQlPlayerModelRoot>(playersMutationRequest);

            var graphQLResponse = await fixture.Execute<GraphQlPlayerModel>(playersRequest);

            graphQLResponse.Players.Length.Should().Be(1);
            graphQLResponse.Players[0].Name.Should().Be("Steve");
        }

        public class GraphQlModel
        {
            public string[] Messages { get; set; }
        }

        public class GraphQlPlayerModel
        {   
            public Player [] Players { get; set; }
        }

        public class GraphQlPlayerModelRoot
        {
            public string Join { get; set; }
        }
    }
}
