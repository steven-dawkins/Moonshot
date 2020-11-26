using System;
using System.Collections.Concurrent;
using System.Collections.Generic;

namespace Moonshot.Server.Models
{
    public class Game
    {
        private ConcurrentDictionary<string, Player> players { get; }

        public string Name { get; }

        public IEnumerable<Player> Players => this.players.Values;

        public Game(string name)
        {
            this.Name = name ?? throw new ArgumentNullException(nameof(name));
            this.players = new ConcurrentDictionary<string, Player>();
        }

        public Player AddPlayer(string name)
        {
            lock (this.players)
            {
                if (this.players.TryGetValue(name, out var existing))
                {
                    return existing;
                }

                var p = new Player(name, this.players.Count);

                this.players[name] = p;
                return p;
            }
        }
    }
}
