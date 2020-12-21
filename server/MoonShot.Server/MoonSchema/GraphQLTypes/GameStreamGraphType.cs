using GraphQL.Types;
using Moonshot.Server.Models;

namespace Moonshot.Server.MoonSchema.GraphQLTypes
{
    public class GameStreamGraphType : ObjectGraphType<GameStreamEvent>
    {
        public GameStreamGraphType()
        {
            _ = Field(x => x.PlayerName, type: typeof(StringGraphType));
            _ = Field(x => x.PlayerIndex, type: typeof(IntGraphType));
            _ = Field(x => x.Type, type: typeof(NonNullGraphType<EnumerationGraphType<GameStreamEvent.EventType>>));
            _ = Field(x => x.Keystroke, type: typeof(StringGraphType));
            _ = Field(x => x.KeystrokeId, type: typeof(StringGraphType));
            _ = Field(x => x.GameState, type: typeof(EnumerationGraphType<Game.GameState>));
            _ = Field(x => x.Countdown, type: typeof(StringGraphType));
        }
    }
}
