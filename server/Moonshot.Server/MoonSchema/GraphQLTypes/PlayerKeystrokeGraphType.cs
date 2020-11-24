using GraphQL.Types;
using Moonshot.Server.Models;

namespace Moonshot.Server.MoonSchema.GraphQLTypes
{
    public class PlayerKeystrokeGraphType : ObjectGraphType<PlayerKeystroke>
    {
        public PlayerKeystrokeGraphType()
        {
            _ = Field(x => x.PlayerName, type: typeof(StringGraphType));
            _ = Field(x => x.Keystroke, type: typeof(StringGraphType));
            _ = Field(x => x.Id, type: typeof(StringGraphType));
        }
    }
}
