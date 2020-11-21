using System;
using System.Collections.Generic;

namespace Moonshot.Server.Models
{
    public interface IChat
    {
        IEnumerable<string> AllMessages { get; }

        IEnumerable<Player> Players { get; }

        IObservable<Player> PlayersStream { get; }

        IObservable<string> MessagesStram { get; }

        string AddMessage(string receivedMessage);

        string AddPlayer(string name);
    }
}
