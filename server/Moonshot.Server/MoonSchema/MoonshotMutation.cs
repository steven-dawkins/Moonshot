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

            Field<NonNullGraphType<PlayerGraphType>>("joinGame",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "gameName" },
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "playerName" }
                ),
                resolve: context =>
                {
                    var gameName = context.GetArgument<string>("gameName");
                    var playerName = context.GetArgument<string>("playerName");
                    var game = chat.AddGame(gameName);
                    var player = game.AddPlayer(playerName);

                    return player;
                });

            Field<PlayerKeystrokeGraphType>("addKeystroke",
                arguments: new QueryArguments(
                    new QueryArgument<StringGraphType> { Name = nameof(PlayerKeystroke.PlayerName) },
                    new QueryArgument<StringGraphType> { Name = nameof(PlayerKeystroke.Keystroke) }
                ),
                resolve: context =>
                {
                    var playerName = context.GetArgument<string>(nameof(PlayerKeystroke.PlayerName));
                    var keystroke = context.GetArgument<string>(nameof(PlayerKeystroke.Keystroke));
                    var message = chat.AddKeystroke(new PlayerKeystroke(playerName, keystroke));
                    return message;
                });

            Field<PlayerKeystrokeGraphType>("addGameKeystroke",
                arguments: new QueryArguments(
                    new QueryArgument<StringGraphType> { Name = "gameName" },
                    new QueryArgument<StringGraphType> { Name = nameof(PlayerKeystroke.PlayerName) },
                    new QueryArgument<StringGraphType> { Name = nameof(PlayerKeystroke.Keystroke) }
                ),
                resolve: context =>
                {
                    var gameName = context.GetArgument<string>("gameName");
                    var game = chat.AddGame(gameName);

                    var playerName = context.GetArgument<string>(nameof(PlayerKeystroke.PlayerName));

                    game.AddPlayer(playerName);

                    var keystroke = context.GetArgument<string>(nameof(PlayerKeystroke.Keystroke));
                    var message = game.AddKeystroke(new PlayerKeystroke(playerName, keystroke));
                    return message;
                });
        }
    }
}
