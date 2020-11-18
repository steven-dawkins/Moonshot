using System;
using System.Collections.Generic;

namespace Moonshot_Server
{
    public interface IChat : IObservable<string>
    {
        IEnumerable<string> AllMessages { get; }

        IEnumerable<Player> Players { get; }

        string AddMessage(string receivedMessage);

        string AddPlayer(Player name);
    }
}
