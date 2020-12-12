import * as React from "react";
import { useState } from "react";
import { WebGlScene } from "./Scene";
import {
    useGameKeystrokesSubscription, useGamePlayersSubscription,

    useAddGameKeystrokeMutation,
    useGameStreamSubscription,
    EventType,
    useStartGameMutation
} from "../generated/graphql";
import { TypistPlayer } from "../TypistPlayer";
import { Button, Card } from "antd";


export function OnlineApp(props: { gameName: string; playerName: string; players: TypistPlayer[]; player: TypistPlayer; gameText: string; }) {

    const [players, setPlayers] = useState(props.players);

    const { error: gameStreamError } = useGameStreamSubscription({
        variables: {
            gameName: props.gameName
        },
        onSubscriptionData: data => {

            const evt = data.subscriptionData.data?.gameStream;

            if (!evt) {
                return;
            }

            switch(evt.type)
            {
                case EventType.GameStarted:
                    {
                        alert("Game started");
                    }
                    break;
                case EventType.Keystroke:
                    RecievedKeystroke(players, evt, props, setPlayers);
                    break;
                case EventType.PlayerJoined:
                    PlayerJoined(evt, props, players, setPlayers);
                    break;
            }
        }
    });

    const [keystrokeMutation, { error: keystrokeError }] = useAddGameKeystrokeMutation({});

    const [startGameMutation, { error: startGameError }] = useStartGameMutation({
        variables: {
            gameName: props.gameName
        }
    });

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
        return <Card title="Error">Keystroke Error! {keystrokeError.message}</Card>;
    }

    if (gameStreamError) {
        return <Card title="Error">Keystrokes Error! {gameStreamError.message}</Card>;
    }

    if (startGameError) {
        return <Card title="Error">Keystrokes Error! {startGameError.message}</Card>;
    }

    return <div>
        <Button onClick={() => startGameMutation()}>Start Game</Button>
        <WebGlScene player={props.player} players={players} onComplete={() => { }}></WebGlScene>
    </div>;
}

function RecievedKeystroke(players: TypistPlayer[], evt: { __typename?: "GameStream" | undefined; } & Pick<import("d:/dev/personal/moonshot/client/src/generated/graphql").GameStream, "keystroke" | "playerName" | "type" | "keystrokeId" | "playerIndex">, props: { gameName: string; playerName: string; players: TypistPlayer[]; player: TypistPlayer; gameText: string; }, setPlayers: React.Dispatch<React.SetStateAction<TypistPlayer[]>>) {
    {
        const p = players.filter(p => p.player.name === evt.playerName)[0];

        // ignore own player keystrokes (they are processed directly)
        if (evt.keystroke && evt.keystrokeId && p !== props.player) {
            p.typist.ProcessCharacter(evt.keystroke, evt.keystrokeId);
        }

        // advertise update to players
        setPlayers(players);
    }
}

function PlayerJoined(evt: { __typename?: "GameStream" | undefined; } & Pick<import("d:/dev/personal/moonshot/client/src/generated/graphql").GameStream, "keystroke" | "playerName" | "type" | "keystrokeId" | "playerIndex">, props: { gameName: string; playerName: string; players: TypistPlayer[]; player: TypistPlayer; gameText: string; }, players: TypistPlayer[], setPlayers: React.Dispatch<React.SetStateAction<TypistPlayer[]>>) {
    if (!evt.playerName) {
        throw new Error("Recieved playerjoined event without playerName");
    }

    if (!evt.playerIndex) {
        throw new Error("Recieved playerjoined event without playerIndex");
    }

    const p = new TypistPlayer({ name: evt.playerName, index: evt.playerIndex }, props.gameText);

    var existing = players.filter(t => t.player.index === p.player.index);

    if (existing.length === 0) {
        players.push(p);

        setPlayers(players);
    }
}

