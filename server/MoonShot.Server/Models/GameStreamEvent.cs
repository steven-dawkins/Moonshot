using System;
using static Moonshot.Server.Models.Game;

namespace Moonshot.Server.Models
{
    public class GameStreamEvent
    {
        public enum EventType { PlayerJoined, GameStateChanged, Keystroke, };

        public GameStreamEvent(
            EventType type, 
            string playerName, 
            string keystroke,
            Guid? keystrokeId,
            int? playerIndex,
            GameState? gameState,
            string countdown)
        {
            this.Type = type;
            this.PlayerName = playerName;
            this.Keystroke = keystroke;
            this.KeystrokeId = keystrokeId;
            this.PlayerIndex = playerIndex;
            this.GameState = gameState;
            this.Countdown = countdown;
        }

        public EventType Type { get; }

        public string PlayerName { get; }

        public string Keystroke { get; }

        public Guid? KeystrokeId { get; }

        public int? PlayerIndex { get; }

        public GameState? GameState { get; }

        public string Countdown { get; }
    }
}
