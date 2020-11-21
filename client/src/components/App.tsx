import * as React from "react";
import { useEffect, useState } from "react";
import { WebGlScene } from "./scene";
import { Player, useJoinMutation, usePlayersSubscription } from "../generated/graphql";

import khanText from "../../assets/texts/khan.txt";
import { Typist } from "../typist";

const texts = khanText.split("\n");

const typist = new Typist(texts[Math.floor(Math.random() * texts.length)]);


export function App() {

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