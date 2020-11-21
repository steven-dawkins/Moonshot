import * as React from "react";
import { useEffect, useState } from "react";
import { render } from "react-dom";
import { WebGlScene } from "./scene";
import { Typist } from "./src/typist";

import khanText from "./assets/khan.txt";
import { Player, useJoinMutation, usePlayersSubscription } from "./src/generated/graphql";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

const el = document.getElementById("body");

const texts = khanText.split("\n");

const typist = new Typist(texts[Math.floor(Math.random() * texts.length)]);

function App() {

    const [players, setPlayers] = useState(Array<Player>());

    const { error: playersError } = usePlayersSubscription({
        variables: {
        },
        onSubscriptionData: data => {
            const playerJoined = data.subscriptionData.data?.playerJoined;
            players.push({ name: playerJoined?.name, index: playerJoined?.index });
            
            setPlayers(players);
        }
    });

    const [joinMutation, { data, loading: joinLoading, error: joinError }] = useJoinMutation({
        variables: {
            name: "Moonshot player"
        },
        onCompleted: data => {
            players.push({ name: data?.join?.name, index: data?.join?.index });
            
            setPlayers(players);
        }
    });

    useEffect(() => {
        joinMutation();
    }, []);

    if (joinError) {
        return <div>Error! {joinError}</div>
    }

    if (joinLoading || !data || !data.join) {
        return <div>Loading...</div>;
    }

    if (playersError) {
        return <div>Players Error! {playersError}</div>
    }

    if (!data.join.name)
    {
        return <div>Not joined...</div>;
    }

    return <div>
        <h1>Moonshot</h1>

        <ul>
            {players.map(player => <li key={player.name}>{player.name}</li>)}
        </ul>

        <WebGlScene typist={typist} name={data.join.name} ></WebGlScene>
    </div>;
}

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

render(<ApolloProvider client={client}><App></App>
</ApolloProvider>,
    el);