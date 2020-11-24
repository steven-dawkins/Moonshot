import * as React from "react";
import { useEffect, useState } from "react";
import { WebGlScene } from "./scene";
import { useGetPlayersQuery, useJoinMutation, useKeystrokesSubscription, usePlayersSubscription } from "../generated/graphql";

import khanText from "../../assets/texts/khan.txt";
import { TypistPlayer } from "../TypistPlayer";

const texts = khanText.split("\n");

const text = texts[Math.floor(Math.random() * texts.length)];

export function App() {

    const [players, setPlayers] = useState(Array<TypistPlayer>());
    const [player, setPlayer] = useState<TypistPlayer | null>(null);

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
                p.typist.ProcessCharacter(playerJoined.keystroke, playerJoined.id);
            }

            // advertise update to players
            setPlayers(players);
        }
    });

    const { error: playersGetError } = useGetPlayersQuery({
        variables: {
        },
        onCompleted: data => {
            if (data.players)
            {
                for (var i = 0; i < data.players.length; i++)
                {
                    const p = data.players[i];

                    if (p)
                    {
                        players.push(new TypistPlayer({ name: p.name, index: p.index }, text));
                    }
                }
            }
        }
    });

    const { error: playersError } = usePlayersSubscription({
        variables: {
        },
        onSubscriptionData: data => {
            const playerJoined = data.subscriptionData.data?.playerJoined;

            if (!playerJoined) {
                return;
            }

            const p = new TypistPlayer({ name: playerJoined?.name, index: playerJoined?.index }, text);

            var existing = players.filter(t => t.player.index === p.player.index);
            
            if (!existing)
            {
                players.push(p);
                
                setPlayers(players);
            }
        }
    });


    const name = "Moonshot player " + Math.ceil(Math.random() * 100);

    const [joinMutation, { data, loading: joinLoading, error: joinError }] = useJoinMutation({
        variables: {
            name: name
        },
        onCompleted: data => {
            if (!data.join) {
                return;
            }

            const p = new TypistPlayer({ name: data.join.name, index: data?.join.index }, text);

            var existing = players.filter(t => t.player.index === p.player.index);

            if (existing && existing.length > 0) {
                setPlayer(existing[0]);
            }
            else {
                setPlayer(p);
                players.push(p);
                setPlayers(players);
            }
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

    if (playersGetError) {
        return <div>Players Get Error! {playersError}</div>
    }

    if (playersError) {
        return <div>Players Error! {playersError}</div>
    }

    if (keystrokesError) {
        return <div>Keystrokes Error! {keystrokesError}</div>
    }

    if (!player) {
        return <div>Player not loaded!</div>;
    }

    if (!data.join.name)
    {
        return <div>Not joined...</div>;
    }

    return <div>
        <h1>Moonshot</h1>

        <ul>
            {players.map(player =>
                <li key={player.player.name}>{player.player.name} ({player.typist.Position})</li>)}
        </ul>

        <WebGlScene player={player} players={players} ></WebGlScene>
    </div>;
}