using GraphQL.Types;
using Moonshot.Server.Models;

namespace Moonshot.Server.MoonSchema.GraphQLTypes
{
    public class GameGraphType : ObjectGraphType<Game>
    {
        public GameGraphType()
        {
            _ = Field(x => x.Name, type: typeof(NonNullGraphType<StringGraphType>));
            _ = Field(x => x.Players, type: typeof(NonNullGraphType<ListGraphType<NonNullGraphType<PlayerGraphType>>>));
            _ = Field(x => x.GameText, type: typeof(NonNullGraphType<StringGraphType>));
            _ = Field(x => x.Started, type: typeof(NonNullGraphType<BooleanGraphType>));
        }
    }
}
