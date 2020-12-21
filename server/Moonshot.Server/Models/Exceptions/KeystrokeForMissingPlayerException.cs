using System;
using System.Runtime.Serialization;

namespace Moonshot.Server.Models.Exceptions
{
    [Serializable]
    internal class KeystrokeForMissingPlayerException : Exception
    {
        public KeystrokeForMissingPlayerException()
        {
        }

        public KeystrokeForMissingPlayerException(string message) : base(message)
        {
        }

        public KeystrokeForMissingPlayerException(string message, Exception innerException) : base(message, innerException)
        {
        }

        protected KeystrokeForMissingPlayerException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }
}