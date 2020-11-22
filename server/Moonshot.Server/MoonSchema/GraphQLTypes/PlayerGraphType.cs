using GraphQL.Types;
using Moonshot.Server.Models;

namespace Moonshot.Server.MoonSchema.GraphQLTypes
{

    public class PlayerGraphType : ObjectGraphType<Player>
    {
        public PlayerGraphType()
        {
            _ = Field(x => x.Name, type: typeof(StringGraphType));
            _ = Field(x => x.Index, type: typeof(IntGraphType));
        }
    }
}
