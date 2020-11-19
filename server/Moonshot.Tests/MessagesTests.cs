using FluentAssertions;
using GraphQL;
using Moonshot_Server;
using System.Threading.Tasks;
using Xunit;

namespace Moonshot.Tests
{
    public class MessagesTests
    {
        [Fact]
        public async Task Test1()
        {
            using var fixture = new ApiFixture();

            var heroRequest = new GraphQLRequest
            {
                Query = @"
                {
                    messages
                }"
            };

            var graphQLResponse = await fixture.Execute<GraphQlModel>(heroRequest);

            graphQLResponse.Messages.Length.Should().Be(0);
        }

        public class GraphQlModel
        {
            public string[] Messages { get; set; }
        }
    }
}
