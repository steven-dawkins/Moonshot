using Microsoft.Extensions.Hosting;
using Moonshot_Server;
using System;
using System.Threading.Tasks;

namespace Moonshot.Tests
{
    public class ApiFixture : IDisposable
    {
        public ApiFixture(int port)
        {
            this.host = Program.CreateHostBuilder(new string[] { }, port).Build();

            this.ServerRunning = host.StartAsync();

            this.Url = $"http://localhost:{port}/graphql/";
        }

        public void Dispose()
        {
            host.StopAsync().Wait();
        }

        private readonly IHost host;

        public Task ServerRunning { get; }

        public string Url { get; }
    }
}
