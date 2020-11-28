using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Moonshot_Server.Services
{
    public class MessageObserver<T> : IObservable<T>
    {

        private readonly ConcurrentDictionary<IObserver<T>, IObserver<T>> observers = new ConcurrentDictionary<IObserver<T>, IObserver<T>>();

        public IDisposable Subscribe(IObserver<T> observer)
        {
            this.observers.TryAdd(observer, observer);

            return new ObserverDisposer<T>(observer, this);
        }

        public void RemoveObserver(IObserver<T> observer)
        {
            this.observers.TryRemove(observer, out _);
        }

        public void Observe(T receivedMessage)
        {
            foreach (var observer in this.observers.Values)
            {
                observer.OnNext(receivedMessage);
            }
        }

        private class ObserverDisposer<T> : IDisposable
        {
            private readonly IObserver<T> observer;
            private readonly MessageObserver<T> chat;

            public ObserverDisposer(IObserver<T> observer, MessageObserver<T> chat)
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
