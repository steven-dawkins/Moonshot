using GraphQL.Types;

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
