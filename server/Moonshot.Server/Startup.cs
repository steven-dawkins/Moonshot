using GraphQL.Server;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using GraphQL.Server.Transports.AspNetCore;
using Moonshot.Server.MoonSchema;
using Moonshot.Server.Models;
using System.IO;
using Microsoft.Extensions.FileProviders;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using GraphQL.Types;

namespace Moonshot.Server
{

    public class Startup
    {
        public IWebHostEnvironment CurrentEnvironment { get; }

        private readonly IConfiguration configuration;

        public Startup(IWebHostEnvironment env, IConfiguration configuration)
        {
            this.CurrentEnvironment = env;
            this.configuration = configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            // Add GraphQL services and configure options
            services
                .AddCors(
                    options => options.AddDefaultPolicy(
                        policy => policy.AllowAnyOrigin()
                                        .AllowAnyMethod()
                                        .AllowAnyHeader()))
                .AddSingleton<IChat, Chat>()
                .AddSingleton<MoonshotSchema>()
                .AddTransient<EnumerationGraphType<GameStreamEvent.EventType>>()
                .AddTransient<EnumerationGraphType<Game.GameState>>()
                .AddGraphQL((options, provider) =>
                {
                    options.EnableMetrics = CurrentEnvironment.IsDevelopment();
                    var logger = provider.GetRequiredService<ILogger<Startup>>();
                    options.UnhandledExceptionDelegate = ctx => logger.LogError("{Error} occured", ctx.OriginalException.Message);
                })
                // Add required services for de/serialization
                .AddSystemTextJson(deserializerSettings => { }, serializerSettings => { }) // For .NET Core 3+

                .AddErrorInfoProvider(opt => opt.ExposeExceptionStackTrace = CurrentEnvironment.IsDevelopment())
                .AddWebSockets() // Add required services for web socket support
                .AddDataLoader() // Add required services for DataLoader support
                .AddGraphTypes(typeof(MoonshotSchema)) // Add all IGraphType implementors in assembly which ChatSchema exists 
                ;
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGet("/", context =>
                {
                    context.Response.Redirect("./index.html");

                    return Task.CompletedTask;
                });
            });

            var contentPath = this.configuration.GetValue<string>("clientContentPath");

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(env.ContentRootPath, contentPath)),
                RequestPath = ""
            });

            app.UseCors();

            // this is required for websockets support
            app.UseWebSockets();

            // use websocket middleware for ChatSchema at path /graphql
            app.UseGraphQLWebSockets<MoonshotSchema>("/graphql");

            // use HTTP middleware for ChatSchema at path /graphql
            app.UseGraphQL<MoonshotSchema>("/graphql");

            // use graphiQL middleware at default url /ui/graphiql
            app.UseGraphiQLServer();

            // use graphql-playground middleware at default url /ui/playground
            app.UseGraphQLPlayground();

            //// use altair middleware at default url /ui/altair
            //app.UseGraphQLAltair();

            //// use voyager middleware at default url /ui/voyager
            //app.UseGraphQLVoyager();
        }
    }
}
