using GraphQL.Types;
using GraphQL;
using Moonshot.Server.Models;
using Moonshot.Server.MoonSchema.GraphQLTypes;

namespace Moonshot.Server.MoonSchema
{
    public class ChatMutation : ObjectGraphType<object>
    {
        public ChatMutation(IChat chat)
        {
            Field<NonNullGraphType<PlayerGraphType>>("join",
                arguments: new QueryArguments(
                    new QueryArgument<StringGraphType> { Name = "name" }
                ),
                resolve: context =>
                {
                    var receivedMessage = context.GetArgument<string>("name");
                    var message = chat.AddPlayer(receivedMessage);
                    return message;
                });

            Field<PlayerKeystrokeGraphType>("addKeystroke",
                arguments: new QueryArguments(
                    new QueryArgument<StringGraphType> { Name = nameof(PlayerKeystroke.PlayerName) },
                    new QueryArgument<StringGraphType> { Name = nameof(PlayerKeystroke.Keystroke) }
                ),
                resolve: context =>
                {
                    var playerName = context.GetArgument<string>(nameof(PlayerKeystroke.PlayerName));
                    var receivedMessage = context.GetArgument<string>(nameof(PlayerKeystroke.Keystroke));
                    var message = chat.AddMessage(new PlayerKeystroke(playerName, receivedMessage));
                    return message;
                });
        }
    }
}
