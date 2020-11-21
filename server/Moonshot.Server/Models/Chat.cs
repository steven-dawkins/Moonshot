using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;

namespace Moonshot.Server.Models
{

    public class Chat : IChat
    {
        private readonly ConcurrentDictionary<string, Player> players = new ConcurrentDictionary<string, Player>();
        private readonly List<string> messages = new List<string>();
        private readonly MessageObserver<string> messageObserver;
        private readonly MessageObserver<Player> playerObserver;

        public IEnumerable<string> AllMessages => this.messages;

        public IObservable<string> MessagesStram => this.messageObserver;

        public IObservable<Player> PlayersStream => this.playerObserver;

        public IEnumerable<Player> Players => this.players.Values;

        public Chat()
        {
            this.messageObserver = new MessageObserver<string>();
            this.playerObserver = new MessageObserver<Player>();
        }

        public string AddPlayer(string name)
        {
            lock (this.players)
            {
                if (!this.players.ContainsKey(name))
                {
                    Player player = new Player(name, this.players.Count);
                    this.players.TryAdd(name, player);

                    this.playerObserver.Observe(player);
                }

                return name;
            }
        }

        public string AddMessage(string receivedMessage)
        {
            this.messages.Add(receivedMessage);

            this.messageObserver.Observe(receivedMessage);

            return receivedMessage;
        }

        interface IObserverRemover<T>
        {
            void RemoveObserver(IObserver<T> observer);
        }

        private class MessageObserver<T> : IObserverRemover<T>, IObservable<T>
        {

            private readonly HashSet<IObserver<T>> observers = new HashSet<IObserver<T>>();

            public IDisposable Subscribe(IObserver<T> observer)
            {
                this.observers.Add(observer);

                return new ObserverDisposer<T>(observer, this);
            }

            public void RemoveObserver(IObserver<T> observer)
            {
                this.observers.Remove(observer);
            }

            public void Observe(T receivedMessage)
            {
                foreach (var observer in this.observers)
                {
                    observer.OnNext(receivedMessage);
                }
            }
        }

        private class ObserverDisposer<T> : IDisposable
        {
            private readonly IObserver<T> observer;
            private readonly IObserverRemover<T> chat;

            public ObserverDisposer(IObserver<T> observer, IObserverRemover<T> chat)
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
