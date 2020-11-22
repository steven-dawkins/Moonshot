import * as React from "react";
import { useEffect, useState } from "react";
import { WebGlScene } from "./scene";
import { Player, useJoinMutation, useKeystrokesSubscription, usePlayersSubscription } from "../generated/graphql";

import khanText from "../../assets/texts/khan.txt";
import { Typist } from "../typist";

const texts = khanText.split("\n");

const text = texts[Math.floor(Math.random() * texts.length)];

const typist = new Typist(text);

class TypistPlayer
{
    public readonly typist: Typist;

    constructor(public player: Player)
    {
        this.typist = new Typist(text);
    }
}

export function App() {

    const [players, setPlayers] = useState(Array<TypistPlayer>());

    const { error: playersError } = usePlayersSubscription({
        variables: {
        },
        onSubscriptionData: data => {
            const playerJoined = data.subscriptionData.data?.playerJoined;
            players.push(new TypistPlayer({ name: playerJoined?.name, index: playerJoined?.index }));
            
            setPlayers(players);
        }
    });

    const { error: keystrokesError } = useKeystrokesSubscription({
        variables: {
        },
        onSubscriptionData: data => {
            console.log("keystroke");
            console.log(data);
            const playerJoined = data.subscriptionData.data?.keystrokeAdded;

            const p = players.filter(p => p.player.name === playerJoined?.playerName)[0];

            if (playerJoined && playerJoined?.keystroke)
            {
                p.typist.ProcessCharacter(playerJoined.keystroke);
            }

            // advertise update to players
            setPlayers(players);
        }
    });

    const [joinMutation, { data, loading: joinLoading, error: joinError }] = useJoinMutation({
        variables: {
            name: "Moonshot player"
        },
        onCompleted: data => {
            players.push(new TypistPlayer({ name: data?.join?.name, index: data?.join?.index }));
            
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

    if (keystrokesError) {
        return <div>Keystrokes Error! {keystrokesError}</div>
    }

    if (!data.join.name)
    {
        return <div>Not joined...</div>;
    }

    return <div>
        <h1>Moonshot</h1>

        <ul>
            {players.map(player =>
                <li key={player.player.name}>{player.player.name} ({player.typist.Position}</li>)}
        </ul>

        <WebGlScene typist={typist} name={data.join.name} ></WebGlScene>
    </div>;
}