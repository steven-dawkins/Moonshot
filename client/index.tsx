import * as React from "react";
import { render } from "react-dom";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { OnlineApp } from "./src/components/App";

const el = document.getElementById("body");

// const client = new ApolloClient({
//         uri: 'http://localhost:5000/graphql',
//         //headers: {"Authorization": "Bearer "},
//         cache: new InMemoryCache()
//       });

const httpLink = new HttpLink({
    uri: 'http://localhost:5000/graphql'
});

const wsLink = new WebSocketLink({
    uri: `ws://localhost:5000/graphql`,
    options: {
        reconnect: true,
        connectionParams: {
        },
    },
});

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink,
);

const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache()
});

render(<ApolloProvider client={client}>
            <OnlineApp gameName={"Game1"}></OnlineApp>
       </ApolloProvider>,
    el);