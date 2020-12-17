import * as React from "react";
import { useState } from "react";
import { WebGlScene } from "./Scene";
import {
    useGameKeystrokesSubscription, useGamePlayersSubscription,

    useAddGameKeystrokeMutation,
    useGameStreamSubscription,
    EventType,
    useStartGameMutation,
    GameStream,
    GameState
} from "../generated/graphql";
import { TypistPlayer } from "../models/TypistPlayer";
import { Card } from "antd";
import { Game, LocalGameState } from "../models/Game";


export function OnlineApp(props: { game: Game }) {

    const [game, setPlayers] = useState(props.game);
    const [countDown, setCountdown] = useState("");

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
                case EventType.GameStateChanged:
                    switch(evt.gameState)
                    {
                        case GameState.Countdown:
                            game.startCountdown(evt.countdown);
                            break;
                        case GameState.Started:
                            game.startGame();
                            break;
                    }
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

    const [startGameMutation, { error: startGameError }] = useStartGameMutation();

    
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

    const startGame = (countdown: number) => {

        if (countdown > 0)
        {
            startGameMutation({variables: {
                gameName: props.game.gameName,
                gameState: GameState.Countdown,
                countdown: countdown.toString() }});

            setTimeout(startGame, 1000, countdown - 1);
        }
        else
        {
            startGameMutation({variables: {
                gameName: props.game.gameName,
                gameState: GameState.Started,
                countdown: "0" }})
        }
    };

    return <div>
        <WebGlScene
            game={game}
            onComplete={() => { }}
            startGame={() => startGame(5)}></WebGlScene>
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

