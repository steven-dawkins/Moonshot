import * as React from "react";
import { useState } from "react";
import { WebGlScene } from "./Scene";
import {
    useGameKeystrokesSubscription, useGamePlayersSubscription,

    useAddGameKeystrokeMutation
} from "../generated/graphql";
import { TypistPlayer } from "../TypistPlayer";
import { Card } from "antd";


export function OnlineApp(props: { gameName: string; playerName: string; players: TypistPlayer[]; player: TypistPlayer; gameText: string; }) {

    const [players, setPlayers] = useState(props.players);

    const { error: keystrokesError } = useGameKeystrokesSubscription({
        variables: {
            gameName: props.gameName
        },
        onSubscriptionData: data => {
            const keystroke = data.subscriptionData.data?.gameKeystroke;

            const p = players.filter(p => p.player.name === keystroke?.playerName)[0];

            // ignore own player keystrokes (they are processed directly)
            if (keystroke && keystroke?.keystroke && p !== props.player) {
                p.typist.ProcessCharacter(keystroke.keystroke, keystroke.id);
            }

            // advertise update to players
            setPlayers(players);
        }
    });

    const { error: playersError } = useGamePlayersSubscription({
        variables: {
            gameName: props.gameName
        },
        onSubscriptionData: data => {
            const playerJoined = data.subscriptionData.data?.playerJoinedGame;

            if (!playerJoined) {
                return;
            }

            const p = new TypistPlayer({ name: playerJoined?.name, index: playerJoined?.index }, props.gameText);

            var existing = players.filter(t => t.player.index === p.player.index);

            if (existing.length === 0) {
                players.push(p);

                setPlayers(players);
            }
        }
    });

    const [keystrokeMutation, { loading: keystrokeLoading, error: keystrokeError }] = useAddGameKeystrokeMutation({});

    props.player.typist.OnCharacter = (char: string) => {
        keystrokeMutation({
            variables: {
                keystroke: char,
                playerName: props.playerName,
                gameName: props.gameName,
            }
        });
    };

    if (keystrokeError) {
        return <div>Keystroke Error! {playersError}</div>;
    }

    if (playersError) {
        return <div>Players Error! {playersError}</div>;
    }

    if (keystrokesError) {
        return <div>Keystrokes Error! {keystrokesError}</div>;
    }

    console.log("Online app: " + players.length);

    return <div>
        <WebGlScene player={props.player} players={players} onComplete={() => { }}></WebGlScene>
    </div>;
}
