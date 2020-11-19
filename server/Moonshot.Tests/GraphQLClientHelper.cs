using GraphQL;
using GraphQL.Client.Http;
using GraphQL.Client.Serializer.Newtonsoft;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Moonshot.Tests
{
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

            var graphQLClient = new GraphQLHttpClient(fixture.Url, new NewtonsoftJsonSerializer());

            var graphQLResponse = await func(graphQLClient);

            if (graphQLResponse.Errors?.Any() ?? false)
            {
                throw new System.Exception(graphQLResponse.Errors.First().Message);
            }

            return graphQLResponse.Data;
        }
    }
}
