using FluentAssertions;
using GraphQL;
using Moonshot.Server.Models;
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
                    players {
                        name
                    }
                }"
        };

        [Fact]
        public async Task NoPlayersInitially()
        {
            using var fixture = new ApiFixture(5010);

            var graphQLResponse = await fixture.Execute<GraphQlPlayerModel>(playersRequest);

            graphQLResponse.Players.Length.Should().Be(0);
        }

        [Fact]
        public async Task PlayerJoin()
        {
            using var fixture = new ApiFixture(5011);

            var playersMutationRequest = new GraphQLRequest
            {
                Query = @"mutation Join($name: String) {
                    join(name: $name) {
                        name
                    }
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

        public class GraphQlPlayerModel
        {   
            public Player [] Players { get; set; }
        }

        public class GraphQlPlayerModelRoot
        {
            public Player Join { get; set; }
        }
    }
}
