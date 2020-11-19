﻿using System.Linq;
using GraphQL.Types;

namespace Moonshot_Server
{
    public class ChatQuery : ObjectGraphType
    {
        public ChatQuery(IChat chat)
        {
            Field<ListGraphType<StringGraphType>>("messages", resolve: context => chat.AllMessages.Take(100));

            Field<ListGraphType<StringGraphType>>("players", resolve: context => chat.Players.Take(100));
        }
    }
}