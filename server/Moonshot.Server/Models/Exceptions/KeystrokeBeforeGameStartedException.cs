using System;
using System.Runtime.Serialization;

namespace Moonshot.Server.Models.Exceptions
{
    [Serializable]
    internal class KeystrokeBeforeGameStartedException : Exception
    {
        public KeystrokeBeforeGameStartedException()
        {
        }

        public KeystrokeBeforeGameStartedException(string message) : base(message)
        {
        }

        public KeystrokeBeforeGameStartedException(string message, Exception innerException) : base(message, innerException)
        {
        }

        protected KeystrokeBeforeGameStartedException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }
}