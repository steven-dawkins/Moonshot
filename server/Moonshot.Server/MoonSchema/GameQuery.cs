using System.Linq;
using GraphQL.Types;
using Moonshot.Server.Models;
using Moonshot.Server.MoonSchema.GraphQLTypes;

namespace Moonshot.Server.MoonSchema
{
    public class GameQuery : ObjectGraphType
    {
        public GameQuery(IChat chat)
        {
            Field<ListGraphType<PlayerKeystrokeGraphType>>("keystrokes", resolve: context => chat.AllMessages.Take(100));

            Field<ListGraphType<PlayerGraphType>>("players", resolve: context => chat.Players.Take(100));

            Field<ListGraphType<GameGraphType>>("games", resolve: context => chat.Games.Take(100));
        }
    }
}
