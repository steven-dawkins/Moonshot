import * as React from "react";
import { useState } from "react";
import { getRandomText } from "../texts";
import { TypistPlayer } from "../models/TypistPlayer";
import { WebGlScene } from "./Scene";

var gameIndex = 0;

function getOfflinePlayers(playerName: string)
{
    const text = getRandomText();
    const player = new TypistPlayer(playerName, 0, text);
    const players = [player];

    return { player: player, players: players, gameIndex: gameIndex++ };
}

export function OfflineGame(props: {playerName: string}) {
    const [sceneProps, setSceneProps] = useState(getOfflinePlayers(props.playerName));
    
    return <div>
        <WebGlScene
            key={sceneProps.gameIndex}
            {...sceneProps}
            onComplete={() => {
                setSceneProps(getOfflinePlayers(props.playerName));
            }}>
        </WebGlScene>
    </div> 
}