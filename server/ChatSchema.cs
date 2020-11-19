﻿using System;
using GraphQL.Types;

namespace Moonshot_Server
{
    public class ChatSchema : Schema
    {
        public ChatSchema(IChat chat, IServiceProvider provider) : base(provider)
        {
            Query = new ChatQuery(chat);
            Mutation = new ChatMutation(chat);
            Subscription = new ChatSubscriptions(chat);
        }
    }
}