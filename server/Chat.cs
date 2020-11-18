using System;
using System.Collections.Generic;
using System.Linq;

namespace Moonshot_Server
{
    public class Player
    {
        public Player(string name)
        {
            this.Name = name;
        }

        public string Name { get; }
    }

    public class Chat : IChat
    {
        private readonly List<Player> players = new List<Player>();
        private readonly List<string> messages = new List<string>();
        private readonly List<IObserver<string>> observers = new List<IObserver<string>>();

        public IEnumerable<string> AllMessages => this.messages;

        public IEnumerable<Player> Players => this.players;

        public string AddPlayer(Player player)
        {
            this.players.Add(player);

            return player.Name;
        }

        public string AddMessage(string receivedMessage)
        {
            this.messages.Add(receivedMessage);

            foreach (var observer in this.observers)
            {
                observer.OnNext(receivedMessage);
            }

            return receivedMessage;
        }

        public IDisposable Subscribe(IObserver<string> observer)
        {
            this.observers.Add(observer);

            return new ObserverDisposer(observer, this);
        }

        private void RemoveObserver(IObserver<string> observer)
        {
            this.observers.Remove(observer);
        }

        private class ObserverDisposer : IDisposable
        {
            private readonly IObserver<string> observer;
            private readonly Chat chat;

            public ObserverDisposer(IObserver<string> observer, Chat chat)
            {
                this.observer = observer;
                this.chat = chat;
            }

            public void Dispose()
            {
                this.chat.RemoveObserver(this.observer);
            }
        }
    }
}
