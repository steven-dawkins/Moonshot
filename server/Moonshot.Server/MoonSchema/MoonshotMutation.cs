using GraphQL.Types;
using GraphQL;
using Moonshot.Server.Models;
using Moonshot.Server.MoonSchema.GraphQLTypes;
using System.Linq;

namespace Moonshot.Server.MoonSchema
{
    public class MoonshotMutation : ObjectGraphType<object>
    {
        public MoonshotMutation(IChat chat)
        {
            // todo: remove?
            Field<NonNullGraphType<GameGraphType>>("createGame",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "name" },
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "gameText" },
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "playerName" }
                ),
                resolve: context =>
                {
                    var name = context.GetArgument<string>("name");
                    var gameText = context.GetArgument<string>("gameText");
                    var playerName = context.GetArgument<string>("playerName");
                    var game = chat.AddGame(name, gameText);
                    var player = game.AddPlayer(playerName);
                    return game;
                });

            Field<NonNullGraphType<GameGraphType>>("startGame",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "name" },
                    new QueryArgument<NonNullGraphType<EnumerationGraphType<Game.GameState>>> { Name = "state" },
                    new QueryArgument<StringGraphType> { Name = "countdown" }
                ),
                resolve: context =>
                {
                    var name = context.GetArgument<string>("name");
                    var gameState = context.GetArgument<Game.GameState>("state");
                    var countdown = context.GetArgument<string>("countdown");

                    var game = chat.AddGame(name);

                    game.SetGameState(gameState, countdown);

                    return game;
                });

            Field<NonNullGraphType<GameGraphType>>("joinGame",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "gameName" },
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "gameText" },
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "playerName" }
                ),
                resolve: context =>
                {
                    var gameName = context.GetArgument<string>("gameName");
                    var gameText = context.GetArgument<string>("gameText");
                    var playerName = context.GetArgument<string>("playerName");
                    var game = chat.AddGame(gameName, gameText);
                    var player = game.AddPlayer(playerName);

                    return game;
                });

            Field<PlayerKeystrokeGraphType>("addGameKeystroke",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "gameName" },
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = nameof(PlayerKeystroke.PlayerName) },
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = nameof(PlayerKeystroke.Keystroke) }
                ),
                resolve: context =>
                {
                    var gameName = context.GetArgument<string>("gameName");
                    var game = chat.AddGame(gameName);

                    var playerName = context.GetArgument<string>(nameof(PlayerKeystroke.PlayerName));

                    var keystroke = context.GetArgument<string>(nameof(PlayerKeystroke.Keystroke));
                    var message = game.AddKeystroke(new PlayerKeystroke(playerName, keystroke.Single()));
                    return message;
                });
        }
    }
}
