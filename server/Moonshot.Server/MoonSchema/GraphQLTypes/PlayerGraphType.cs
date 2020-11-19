using GraphQL.Types;
using Moonshot_Server.Models;

namespace Moonshot_Server.MoonSchema.GraphQLTypes
{
    public class PlayerGraphType : ObjectGraphType<Player>
    {
        public PlayerGraphType()
        {
            _ = Field(x => x.Name, type: typeof(StringGraphType));
        }
    }
}
