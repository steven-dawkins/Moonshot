using Moonshot_Server.Services;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;

namespace Moonshot.Server.Models
{
    public class Chat : IChat
    {
        private readonly ConcurrentDictionary<string, Game> games;
        private readonly ConcurrentDictionary<string, Player> players;
        private readonly List<PlayerKeystroke> messages;
        private readonly MessageObserver<PlayerKeystroke> messageObserver;
        private readonly MessageObserver<Player> playerObserver;

        public IEnumerable<PlayerKeystroke> AllMessages => this.messages;

        public IObservable<PlayerKeystroke> MessagesStream => this.messageObserver;

        public IObservable<Player> PlayersStream => this.playerObserver;

        public IEnumerable<Player> Players => this.players.Values;

        public IEnumerable<Game> Games => this.games.Values;

        public Chat()
        {
            this.games = new ConcurrentDictionary<string, Game>();
            this.players = new ConcurrentDictionary<string, Player>();
            this.messages = new List<PlayerKeystroke>();
            this.messageObserver = new MessageObserver<PlayerKeystroke>();
            this.playerObserver = new MessageObserver<Player>();
        }

        public Player AddPlayer(string name)
        {
            lock (this.players)
            {
                if (!this.players.TryGetValue(name, out Player existingPlayer))
                {
                    Player player = new Player(name, this.players.Count);
                    this.players.TryAdd(name, player);

                    this.playerObserver.Observe(player);
                    return player;
                }
                else
                {
                    return existingPlayer;
                }
            }
        }

        public Game AddGame(string name)
        {
            return AddGame(name, "");
        }

        public Game AddGame(string name, string gameText)
        {
            lock (this.games)
            {
                if (!this.games.TryGetValue(name, out Game existingPlayer))
                {
                    Game game = new Game(name, gameText);
                    this.games.TryAdd(name, game);

                    return game;
                }
                else
                {
                    existingPlayer.GameText = gameText;
                    return existingPlayer;
                }
            }
        }

        public PlayerKeystroke AddKeystroke(PlayerKeystroke keystroke)
        {
            this.messages.Add(keystroke);

            this.messageObserver.Observe(keystroke);

            return keystroke;
        }
    }
}
