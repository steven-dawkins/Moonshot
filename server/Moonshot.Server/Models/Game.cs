using Moonshot_Server.Services;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;

namespace Moonshot.Server.Models
{
    public class Game
    {
        private ConcurrentDictionary<string, Player> players { get; }
        private readonly MessageObserver<Player> playerObserver;
        private readonly MessageObserver<PlayerKeystroke> playerKeystrokeObserver;
        private readonly ConcurrentQueue<PlayerKeystroke> playerKeystrokes;

        public string Name { get; }

        public IEnumerable<Player> Players => this.players.Values;

        public IEnumerable<PlayerKeystroke> Keystrokes => this.playerKeystrokes;

        public IObservable<Player> PlayersStream => this.playerObserver;

        public IObservable<PlayerKeystroke> PlayersKeystrokeStream => this.playerKeystrokeObserver;

        public Game(string name)
        {
            this.Name = name ?? throw new ArgumentNullException(nameof(name));
            this.players = new ConcurrentDictionary<string, Player>();
            this.playerObserver = new MessageObserver<Player>();
            this.playerKeystrokes = new ConcurrentQueue<PlayerKeystroke>();
            this.playerKeystrokeObserver = new MessageObserver<PlayerKeystroke>();
        }

        public Player AddPlayer(string name)
        {
            Player p;

            lock (this.players)
            {
                if (this.players.TryGetValue(name, out var existing))
                {
                    return existing;
                }

                p = new Player(name, this.players.Count);

                this.players[name] = p;
            }

            this.playerObserver.Observe(p);

            return p;
        }

        public PlayerKeystroke AddKeystroke(PlayerKeystroke playerKeystroke)
        {
            this.playerKeystrokes.Enqueue(playerKeystroke);
            this.playerKeystrokeObserver.Observe(playerKeystroke);
            return playerKeystroke;
        }
    }
}
