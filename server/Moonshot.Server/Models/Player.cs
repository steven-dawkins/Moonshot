using System;

namespace Moonshot.Server.Models
{
    public class Player
    {
        public Player(string name, int index)
        {
            this.Name = name ?? throw new ArgumentNullException(nameof(name));
            this.Index = index;
        }

        public string Name { get; }

        public int Index { get; }
    }
}
