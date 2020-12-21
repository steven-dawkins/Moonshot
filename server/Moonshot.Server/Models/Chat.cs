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

        public IEnumerable<Game> Games => this.games.Values;

        public Chat()
        {
            this.games = new ConcurrentDictionary<string, Game>();
        }

        public Game AddGame(string name)
        {
            // todo: throw exception if game exists
            return AddGame(name, "");
        }

        public Game AddGame(string name, string gameText)
        {
            lock (this.games)
            {
                if (!this.games.TryGetValue(name, out Game existingGame))
                {
                    Game game = new Game(name, gameText);
                    this.games.TryAdd(name, game);

                    return game;
                }
                else
                {
                    if (!string.IsNullOrWhiteSpace(gameText) && string.IsNullOrWhiteSpace(existingGame.GameText))
                    {
                        existingGame.GameText = gameText;
                    }

                    return existingGame;
                }
            }
        }
    }
}
