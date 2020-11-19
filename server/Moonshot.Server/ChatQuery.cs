using System.Linq;
using GraphQL.Types;
using Moonshot_Server.MoonSchema.GraphQLTypes;

namespace Moonshot_Server
{
    public class ChatQuery : ObjectGraphType
    {
        public ChatQuery(IChat chat)
        {
            Field<ListGraphType<StringGraphType>>("messages", resolve: context => chat.AllMessages.Take(100));

            Field<ListGraphType<PlayerGraphType>>("players", resolve: context => chat.Players.Take(100));
        }
    }
}
