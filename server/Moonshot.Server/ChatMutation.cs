using GraphQL.Types;
using GraphQL;
using Moonshot_Server.Models;

namespace Moonshot_Server
{
    public class ChatMutation : ObjectGraphType<object>
    {
        public ChatMutation(IChat chat)
        {
            Field<StringGraphType>("join",
                arguments: new QueryArguments(
                    new QueryArgument<StringGraphType> { Name = "name" }
                ),
                resolve: context =>
                {
                    var receivedMessage = context.GetArgument<string>("name");
                    var message = chat.AddPlayer(new Player(receivedMessage));
                    return message;
                });

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
