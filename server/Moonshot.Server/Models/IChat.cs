using System;
using System.Collections.Generic;

namespace Moonshot.Server.Models
{
    public interface IChat
    {
        IEnumerable<Game> Games { get; }

        Game AddGame(string name, string gameText);

        Game AddGame(string name);
    }
}
