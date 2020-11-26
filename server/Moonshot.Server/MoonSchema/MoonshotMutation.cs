using GraphQL.Types;
using GraphQL;
using Moonshot.Server.Models;
using Moonshot.Server.MoonSchema.GraphQLTypes;

namespace Moonshot.Server.MoonSchema
{
    public class MoonshotMutation : ObjectGraphType<object>
    {
        public MoonshotMutation(IChat chat)
        {
            Field<NonNullGraphType<PlayerGraphType>>("join",
                arguments: new QueryArguments(
                    new QueryArgument<StringGraphType> { Name = "name" }
                ),
                resolve: context =>
                {
                    var receivedMessage = context.GetArgument<string>("name");
                    var player = chat.AddPlayer(receivedMessage);
                    return player;
                });

            Field<NonNullGraphType<GameGraphType>>("createGame",
                arguments: new QueryArguments(
                    new QueryArgument<StringGraphType> { Name = "name" }
                ),
                resolve: context =>
                {
                    var name = context.GetArgument<string>("name");
                    var game = chat.AddGame(name);
                    return game;
                });

            Field<NonNullGraphType<GameGraphType>>("joinGame",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "gameName" },
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "playerName" }
                ),
                resolve: context =>
                {
                    var gameName = context.GetArgument<string>("gameName");
                    var playerName = context.GetArgument<string>("playerName");
                    var game = chat.AddGame(gameName);
                    game.AddPlayer(playerName);

                    return game;
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
