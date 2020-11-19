using System;
using GraphQL.Types;

namespace Moonshot.Server.MoonSchema
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
