import * as React from "react";
import { useState } from "react";
import { getRandomText } from "../texts";
import { TypistPlayer } from "../models/TypistPlayer";
import { WebGlScene } from "./Scene";
import { Game } from "../models/Game";

var gameIndex = 0;

function getOfflinePlayers(playerName: string)
{
    const text = getRandomText();
    const player = new TypistPlayer(playerName, 0, text);
    const players = [player];

    return { player: player, players: players, gameIndex: gameIndex++, gameText: text };
}

export function OfflineGame(props: {playerName: string}) {
    const [sceneProps, setSceneProps] = useState(getOfflinePlayers(props.playerName));
    
    const game = new Game("Offline", sceneProps.players, sceneProps.player, sceneProps.gameText);

    // start offline game immediately
    game.startGame();

    return <div>
        <WebGlScene
            key={sceneProps.gameIndex}
            game={game}
            onComplete={() => {
                setSceneProps(getOfflinePlayers(props.playerName));
            }}
            startGame={() => {}}
            >
        </WebGlScene>
    </div> 
}