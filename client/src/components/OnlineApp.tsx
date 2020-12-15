import * as React from "react";
import { useState } from "react";
import { WebGlScene } from "./Scene";
import {
    useGameKeystrokesSubscription, useGamePlayersSubscription,

    useAddGameKeystrokeMutation,
    useGameStreamSubscription,
    EventType,
    useStartGameMutation,
    GameStream
} from "../generated/graphql";
import { TypistPlayer } from "../models/TypistPlayer";
import { Card } from "antd";
import { Game, GameState } from "../models/Game";


export function OnlineApp(props: { game: Game }) {

    const [game, setPlayers] = useState(props.game);

    const { error: gameStreamError } = useGameStreamSubscription({
        variables: {
            gameName: props.game.gameName
        },
        onSubscriptionData: data => {

            const evt = data.subscriptionData.data?.gameStream;

            if (!evt) {
                return;
            }

            switch(evt.type)
            {
                case EventType.GameStarted:
                    game.startGame();
                    break;
                case EventType.Keystroke:
                    RecievedKeystroke(game, evt);
                    break;
                case EventType.PlayerJoined:
                    PlayerJoined(evt, game);
                    break;
            }

            // advertise update to players
            setPlayers(game);
        }
    });

    const [keystrokeMutation, { error: keystrokeError }] = useAddGameKeystrokeMutation({});

    const [startGameMutation, { error: startGameError }] = useStartGameMutation({
        variables: {
            gameName: props.game.gameName
        }
    });

    
    props.game.player.typist.OnCharacter = (char: string) => {
        keystrokeMutation({
            variables: {
                keystroke: char,
                playerName: props.game.player.playerName,
                gameName: props.game.gameName,
            }
        });
    };

    if (keystrokeError) {
        return <Card title="Error">Keystroke Error! {keystrokeError.message}</Card>;
    }

    if (gameStreamError) {
        return <Card title="Error">Gamestream Error! {gameStreamError.message}</Card>;
    }

    if (startGameError) {
        return <Card title="Error">Startgame Error! {startGameError.message}</Card>;
    }

    return <div>
        <WebGlScene game={game} onComplete={() => { }} startGame={startGameMutation}></WebGlScene>
    </div>;
}

function RecievedKeystroke(
    game: Game,
    evt: { __typename?: "GameStream" | undefined; } & Pick<GameStream, "keystroke" | "playerName" | "type" | "keystrokeId" | "playerIndex">) {
    {
        if (evt.keystroke && evt.keystrokeId && evt.playerName) {
            game.addKeystroke(evt.playerName, evt.keystroke, evt.keystrokeId)
        }
    }
}

function PlayerJoined(
    evt: { __typename?: "GameStream" | undefined; } & Pick<GameStream, "keystroke" | "playerName" | "type" | "keystrokeId" | "playerIndex">,
    game: Game) {

    if (!evt.playerName) {
        throw new Error("Recieved playerjoined event without playerName");
    }

    if (!evt.playerIndex) {
        throw new Error("Recieved playerjoined event without playerIndex");
    }

    const p = new TypistPlayer(evt.playerName, evt.playerIndex, game.gameText);

    game.addPlayer(p);
}

