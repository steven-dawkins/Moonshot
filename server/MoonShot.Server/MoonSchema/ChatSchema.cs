using System;
using GraphQL.Types;
using Moonshot.Server.Models;

namespace Moonshot.Server.MoonSchema
{
    public class ChatSchema : Schema
    {
        public ChatSchema(IChat chat, IServiceProvider provider) : base(provider)
        {
            Query = new GameQuery(chat);
            Mutation = new ChatMutation(chat);
            Subscription = new ChatSubscriptions(chat);
        }
    }
}
