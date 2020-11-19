using System.Linq;
using GraphQL.Types;
using Moonshot.Server.Models;
using Moonshot.Server.MoonSchema.GraphQLTypes;

namespace Moonshot.Server.MoonSchema
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
