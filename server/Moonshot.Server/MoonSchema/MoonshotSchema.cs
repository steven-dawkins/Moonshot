using System;
using GraphQL.Types;
using Moonshot.Server.Models;

namespace Moonshot.Server.MoonSchema
{
    public class MoonshotSchema : Schema
    {
        public MoonshotSchema(IChat chat, IServiceProvider provider) : base(provider)
        {
            Query = new MoonshotQuery(chat);
            Mutation = new MoonshotMutation(chat);
            Subscription = new ChatSubscriptions(chat);
        }
    }
}
