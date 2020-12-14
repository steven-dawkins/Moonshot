using System;
using System.Runtime.Serialization;

namespace Moonshot.Server.Models.Exceptions
{
    [Serializable]
    internal class AddPlayerException : Exception
    {
        public AddPlayerException()
        {
        }

        public AddPlayerException(string message) : base(message)
        {
        }

        public AddPlayerException(string message, Exception innerException) : base(message, innerException)
        {
        }

        protected AddPlayerException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }
}