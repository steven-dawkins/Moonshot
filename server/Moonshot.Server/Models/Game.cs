using Moonshot.Server.Models.Exceptions;
using Moonshot_Server.Services;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;

namespace Moonshot.Server.Models
{
    public class Game
    {
        public enum GameState { Lobby, Countdown, Started };

        private ConcurrentDictionary<string, Player> players { get; }

        private readonly MessageObserver<Player> playerObserver;
        private readonly MessageObserver<PlayerKeystroke> playerKeystrokeObserver;
        private readonly MessageObserver<GameStreamEvent> gameStreamObserver;
        private readonly ConcurrentQueue<PlayerKeystroke> playerKeystrokes;

        public string Name { get; }

        public string GameText { get; set; }

        public bool Started => this.State == GameState.Started;

        public GameState State { get; set; }

        public IEnumerable<Player> Players => this.players.Values;

        public IEnumerable<PlayerKeystroke> Keystrokes => this.playerKeystrokes;

        public IObservable<Player> PlayersStream => this.playerObserver;

        public IObservable<PlayerKeystroke> PlayersKeystrokeStream => this.playerKeystrokeObserver;

        public IObservable<GameStreamEvent> EventStream => this.gameStreamObserver;

        public Game(string name, string gameText)
        {
            this.Name = name ?? throw new ArgumentNullException(nameof(name));
            this.GameText = gameText ?? throw new ArgumentNullException(nameof(gameText));
            this.State = GameState.Lobby;
            this.players = new ConcurrentDictionary<string, Player>();
            this.playerObserver = new MessageObserver<Player>();
            this.playerKeystrokes = new ConcurrentQueue<PlayerKeystroke>();
            this.playerKeystrokeObserver = new MessageObserver<PlayerKeystroke>();
            this.gameStreamObserver = new MessageObserver<GameStreamEvent>();
        }

        public Player AddPlayer(string name)
        {
            if (this.Started)
            {
                throw new AddPlayerException("Cannot join started game");
            }

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
            this.gameStreamObserver.Observe(new GameStreamEvent(
                                                    GameStreamEvent.EventType.PlayerJoined,
                                                    p.Name,
                                                    null,
                                                    null,
                                                    p.Index,
                                                    null,
                                                    null));

            return p;
        }

        public PlayerKeystroke AddKeystroke(PlayerKeystroke playerKeystroke)
        {
            if (this.Started)
            {
                this.playerKeystrokes.Enqueue(playerKeystroke);
                this.playerKeystrokeObserver.Observe(playerKeystroke);

                this.gameStreamObserver.Observe(new GameStreamEvent(
                    GameStreamEvent.EventType.Keystroke,
                    playerKeystroke.PlayerName,
                    playerKeystroke.Keystroke,
                    playerKeystroke.Id,
                    null,
                    null,
                    null));

                return playerKeystroke;
            }
            else
            {
                throw new KeystrokeBeforeGameStartedException();
            }
        }

        public void SetGameState(GameState newGameState, string countdown)
        {
            this.State = newGameState;

            var evt = new GameStreamEvent(
                            GameStreamEvent.EventType.GameStateChanged,
                            null,
                            null,
                            null,
                            null,
                            newGameState,
                            countdown);

            this.gameStreamObserver.Observe(evt);
        }
    }
}
