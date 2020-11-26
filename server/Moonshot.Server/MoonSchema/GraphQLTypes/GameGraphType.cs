﻿using GraphQL.Types;
using Moonshot.Server.Models;

namespace Moonshot.Server.MoonSchema.GraphQLTypes
{
    public class GameGraphType : ObjectGraphType<Game>
    {
        public GameGraphType()
        {
            _ = Field(x => x.Name, type: typeof(NonNullGraphType<StringGraphType>));
        }
    }
}