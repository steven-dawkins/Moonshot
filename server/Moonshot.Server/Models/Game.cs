using System;

namespace Moonshot.Server.Models
{
    public class Game
    {
        public string Name { get; }

        public Game(string name)
        {
            this.Name = name ?? throw new ArgumentNullException(nameof(name));
        }
    }
}
