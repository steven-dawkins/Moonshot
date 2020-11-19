using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Moonshot.Server;

namespace Moonshot_Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args, int? port = null) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                })
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    _ = webBuilder.ConfigureKestrel(serverOptions =>
                    {
                        if (port != null)
                        {
                            serverOptions.Listen(IPAddress.Loopback, port.Value);
                        }
                    });
                    _ = webBuilder.UseStartup<Startup>();
                });
    }
}
