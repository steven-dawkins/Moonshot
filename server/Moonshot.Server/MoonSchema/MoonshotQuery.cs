﻿using System.Linq;
using GraphQL;
using GraphQL.Types;
using Moonshot.Server.Models;
using Moonshot.Server.MoonSchema.GraphQLTypes;

namespace Moonshot.Server.MoonSchema
{
    public class MoonshotQuery : ObjectGraphType
    {
        public MoonshotQuery(IChat chat)
        {

            Field<ListGraphType<NonNullGraphType<GameGraphType>>>("games",
                arguments: new QueryArguments(
                    new QueryArgument<StringGraphType> { Name = "gameName" },
                    new QueryArgument<BooleanGraphType> { Name = "started" }
                ),
                resolve: context => {
                    var gameName = context.GetArgument<string>("gameName");
                    var started = context.GetArgument<bool?>("started");

                    var games = chat.Games;

                    if (started != null)
                    {
                        games = games.Where(g => g.Started == started);
                    }

                    if (!string.IsNullOrWhiteSpace(gameName))
                    {
                        return games.Where(g => g.Name.Equals(gameName));
                    }

                    return games.Take(100);
                    });
        }
    }
}
