﻿using System;
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


            AddField(new EventStreamFieldType
            {
                Name = "playerJoined",
                Type = typeof(PlayerGraphType),
                Resolver = new FuncFieldResolver<Player>(ResolvePlayerJoinMessage),
                Subscriber = new EventStreamResolver<Player>(SubscribePlayerJoin)
            });

            AddField(new EventStreamFieldType
            {
                Name = "keystrokeAdded",
                Type = typeof(PlayerKeystrokeGraphType),
                Resolver = new FuncFieldResolver<PlayerKeystroke>(ResolveKeystroke),
                Subscriber = new EventStreamResolver<PlayerKeystroke>(SubscribeKeystrokes)
            });
        }

        private Player ResolvePlayerJoinMessage(IResolveFieldContext context)
        {
            var message = context.Source as Player;

            return message;
        }

        private IObservable<Player> SubscribePlayerJoin(IResolveEventStreamContext context)
        {
            //var messageContext = context.UserContext.As<MessageHandlingContext>();
            //var user = messageContext.Get<ClaimsPrincipal>("user");

            //string sub = "Anonymous";
            //if (user != null)
            //    sub = user.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;

            return _chat.PlayersStream;
        }

        private PlayerKeystroke ResolveKeystroke(IResolveFieldContext context)
        {
            var keystroke = context.Source as PlayerKeystroke;

            return keystroke;
        }

        private IObservable<PlayerKeystroke> SubscribeKeystrokes(IResolveEventStreamContext context)
        {
            //var messageContext = context.UserContext.As<MessageHandlingContext>();
            //var user = messageContext.Get<ClaimsPrincipal>("user");

            //string sub = "Anonymous";
            //if (user != null)
            //    sub = user.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;

            return _chat.MessagesStream;
        }
    }
}
