using FluentAssertions;
using GraphQL;
using GraphQL.Client.Http;
using GraphQL.Client.Serializer.Newtonsoft;
using Microsoft.Extensions.Hosting;
using Moonshot_Server;
using System;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace Moonshot.Tests
{
    public class ApiFixture : IDisposable
    {
        public ApiFixture()
        {
            this.host = Program.CreateHostBuilder(new string[] { }).Build();

            this.ServerRunning = host.StartAsync();
        }

        public void Dispose()
        {
            host.StopAsync().Wait();
        }

        private readonly IHost host;

        public Task ServerRunning { get; }
    }


    public class UnitTest1
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

    public class PlayerTests
    {
        [Fact]
        public async Task NoPlayersInitially()
        {
            using var fixture = new ApiFixture();

            var playersRequest = new GraphQLRequest
            {
                Query = @"
                {
                    players
                }"
            };

            var graphQLResponse = await fixture.Execute<GraphQlPlayerModel>(playersRequest);

            graphQLResponse.Players.Length.Should().Be(0);
        }

        [Fact]
        public async Task PlayerJoin()
        {
            using var fixture = new ApiFixture();

            var playersMutationRequest = new GraphQLRequest
            {
                Query = @"mutation($name: String) {
                    join(name: $name)
                  }",
                Variables = new
                {
                    name = "Steve"
                }
            };

            await fixture.SendMutation<string>(playersMutationRequest);
            await fixture.SendMutation<string>(playersMutationRequest);

            var playersRequest = new GraphQLRequest
            {
                Query = @"
                {
                    players
                }"
            };

            var graphQLResponse = await fixture.Execute<GraphQlPlayerModel>(playersRequest);

            graphQLResponse.Players.Length.Should().Be(1);
            graphQLResponse.Players.ElementAt(0).Name.Should().Be("Steve");
        }

        public class GraphQlModel
        {
            public string[] Messages { get; set; }
        }

        public class GraphQlPlayerModel
        {
            public Player [] Players { get; set; }
        }
    }

    internal static class GraphQLClientHelper
    {
        internal static Task<T> SendMutation<T>(this ApiFixture fixture, GraphQLRequest heroRequest)
        {
            return Apply(graphQLClient => graphQLClient.SendMutationAsync<T>(heroRequest), fixture);
        }

        internal static Task<T> Execute<T>(this ApiFixture fixture, GraphQLRequest heroRequest)
        {
            return Apply(graphQLClient => graphQLClient.SendQueryAsync<T>(heroRequest), fixture);
        }

        internal static async Task<T> Apply<T>(Func<GraphQLHttpClient, Task<GraphQLResponse<T>>> func, ApiFixture fixture)
        {
            await fixture.ServerRunning;

            var graphQLClient = new GraphQLHttpClient("https://localhost:5001/graphql/", new NewtonsoftJsonSerializer());

            var graphQLResponse = await func(graphQLClient);

            if (graphQLResponse.Errors?.Any() ?? false)
            {
                throw new System.Exception(graphQLResponse.Errors.First().Message);
            }

            return graphQLResponse.Data;
        }
    }
}
