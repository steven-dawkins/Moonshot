﻿using System;
using GraphQL.Resolvers;
using GraphQL.Subscription;
using GraphQL.Types;
using GraphQL;
using Moonshot.Server.Models;
using Moonshot.Server.MoonSchema.GraphQLTypes;

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
                Name = "playerJoined",
                Type = typeof(PlayerGraphType),
                Resolver = new FuncFieldResolver<Player>(ResolvePlayerJoinMessage),
                Subscriber = new EventStreamResolver<Player>(SubscribePlayerJoin)
            });

            AddField(new EventStreamFieldType
            {
                Name = "messageAdded",
                Type = typeof(StringGraphType),
                Resolver = new FuncFieldResolver<string>(ResolveMessage),
                Subscriber = new EventStreamResolver<string>(Subscribe)
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

        private string ResolveMessage(IResolveFieldContext context)
        {
            var message = context.Source as string;

            return message;
        }

        private IObservable<string> Subscribe(IResolveEventStreamContext context)
        {
            //var messageContext = context.UserContext.As<MessageHandlingContext>();
            //var user = messageContext.Get<ClaimsPrincipal>("user");

            //string sub = "Anonymous";
            //if (user != null)
            //    sub = user.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;

            return _chat.MessagesStram;
        }
    }
}
