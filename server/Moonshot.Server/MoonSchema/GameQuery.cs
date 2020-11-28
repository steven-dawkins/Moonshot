using System.Linq;
using GraphQL;
using GraphQL.Types;
using Moonshot.Server.Models;
using Moonshot.Server.MoonSchema.GraphQLTypes;

namespace Moonshot.Server.MoonSchema
{
    public class GameQuery : ObjectGraphType
    {
        public GameQuery(IChat chat)
        {
            Field<ListGraphType<NonNullGraphType<PlayerKeystrokeGraphType>>>("keystrokes", resolve: context => chat.AllMessages.Take(100));

            Field<ListGraphType<NonNullGraphType<PlayerGraphType>>>("players", resolve: context => chat.Players.Take(100));

            Field<ListGraphType<NonNullGraphType<GameGraphType>>>("games",
                arguments: new QueryArguments(
                    new QueryArgument<StringGraphType> { Name = "gameName" }
                ),
                resolve: context => {
                    var gameName = context.GetArgument<string>("gameName");

                    var games = chat.Games;

                    if (!string.IsNullOrWhiteSpace(gameName))
                    {
                        return games.Where(g => g.Name.Equals(gameName));
                    }

                    return games.Take(100);
                    });
        }
    }
}
