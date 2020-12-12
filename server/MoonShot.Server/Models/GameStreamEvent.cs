using System;

namespace Moonshot.Server.Models
{
    public class GameStreamEvent
    {
        public enum EventType { PlayerJoined, GameStarted, Keystroke, };

        public GameStreamEvent(EventType type, string playerName, string keystroke, Guid? keystrokeId, int? playerIndex)
        {
            this.Type = type;
            this.PlayerName = playerName;
            this.Keystroke = keystroke;
            this.KeystrokeId = keystrokeId;
            this.PlayerIndex = playerIndex;
        }

        public EventType Type { get; }

        public string PlayerName { get; }

        public string Keystroke { get; }

        public Guid? KeystrokeId { get; }

        public int? PlayerIndex { get; }
    }
}
