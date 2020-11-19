using Microsoft.Extensions.Hosting;
using Moonshot_Server;
using System;
using System.Threading.Tasks;

namespace Moonshot.Tests
{
    public class ApiFixture : IDisposable
    {
        public ApiFixture()
        {
            this.host = Program.CreateHostBuilder(new string[] { }).Build();

            this.ServerRunning = host.StartAsync();
        }

        public void Dispose()
        {
            host.StopAsync().Wait();
        }

        private readonly IHost host;

        public Task ServerRunning { get; }
    }
}
