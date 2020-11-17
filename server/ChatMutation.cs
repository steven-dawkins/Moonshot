﻿using GraphQL.Types;
using GraphQL;

namespace Moonshot_Server
{
    public class ChatMutation : ObjectGraphType<object>
    {
        public ChatMutation(IChat chat)
        {
            Field<StringGraphType>("addMessage",
                arguments: new QueryArguments(
                    new QueryArgument<StringGraphType> { Name = "message" }
                ),
                resolve: context =>
                {
                    var receivedMessage = context.GetArgument<string>("message");
                    var message = chat.AddMessage(receivedMessage);
                    return message;
                });
        }
    }
}
