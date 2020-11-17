using System;
using System.Collections.Generic;

namespace Moonshot_Server
{
    public interface IChat : IObservable<string>
    {
        IEnumerable<string> AllMessages { get; }

        string AddMessage(string receivedMessage);
    }
}
