using System;
using GraphQL.Resolvers;
using GraphQL.Subscription;
using GraphQL.Types;
using GraphQL;
using Moonshot.Server.Models;
using Moonshot.Server.MoonSchema.GraphQLTypes;
using System.Linq;

namespace Moonshot.Server.MoonSchema
{
    public class ChatSubscriptions : ObjectGraphType<object>
    {
        private readonly IChat _chat;

        public ChatSubscriptions(IChat chat)
        {
            _chat = chat;

            AddField(new EventStreamFieldType
            {
                Name = "gameStream",
                Type = typeof(GameStreamGraphType),
                Arguments = new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "gameName" }
                    ),
                Resolver = new FuncFieldResolver<GameStreamEvent>(context => context.Source as GameStreamEvent),
                Subscriber = new EventStreamResolver<GameStreamEvent>(context =>
                {
                    var gameName = context.GetArgument<string>("gameName");
                    var g = _chat.AddGame(gameName);

                    return g.EventStream;
                })
            });
        }
    }
}
