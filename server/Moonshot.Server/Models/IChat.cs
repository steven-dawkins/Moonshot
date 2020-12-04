using System;
using System.Collections.Generic;

namespace Moonshot.Server.Models
{
    public interface IChat
    {
        IEnumerable<Game> Games { get; }

        IEnumerable<Player> Players { get; }

        IObservable<Player> PlayersStream { get; }

        IEnumerable<PlayerKeystroke> AllMessages { get; }

        IObservable<PlayerKeystroke> MessagesStream { get; }

        PlayerKeystroke AddKeystroke(PlayerKeystroke playerKeystroke);

        Player AddPlayer(string name);

        Game AddGame(string name, string gameText);

        Game AddGame(string name);
    }
}
