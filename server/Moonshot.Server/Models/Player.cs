using System;
using System.Collections.Generic;

namespace Moonshot.Server.Models
{
    public class Player
    {
        public Player(string name, int index)
        {
            this.Name = name ?? throw new ArgumentNullException(nameof(name));
            this.Index = index;
            this.Keystrokes = new Stack<char>();
        }

        public string Name { get; }

        public int Index { get; }

        public Stack<char> Keystrokes { get; }

        public void AddKeystroke(char keystroke)
        {
            this.Keystrokes.Push(keystroke);
        }
    }
}
