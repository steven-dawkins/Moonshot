using System;

namespace Moonshot.Server.Models
{
    public class PlayerKeystroke
    {
        public PlayerKeystroke(string playerName, char message)
        {
            this.PlayerName = playerName;
            this.Keystroke = message;
            this.Id = Guid.NewGuid();
        }

        public string PlayerName { get; }

        public char Keystroke { get; }

        public Guid Id { get; }
    }
}
