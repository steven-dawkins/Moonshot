import * as React from "react";
import { useEffect } from "react";
import { useJoinGameMutation } from "../generated/graphql";
import { TypistPlayer } from "../models/TypistPlayer";
import { OnlineApp } from "./OnlineApp";


export function JoinGame(props: { gameName: string; playerName: string; gameText: string }) {
    const [joinMutation, { data, loading: joinLoading, error: joinError }] = useJoinGameMutation({
        variables: {
            gameText: props.gameText,
            playerName: props.playerName,
            gameName: props.gameName
        }
    });

    useEffect(() => {
        joinMutation();
    }, []);

    if (joinError) {
        return <div>Error! {joinError}</div>;
    }

    if (joinLoading || !data || !data.joinGame) {
        return <div>Loading...</div>;
    }

    const players = data.joinGame.players.map(p => {

        return new TypistPlayer(p.name, p.index, data.joinGame.gameText);
    });

    const player = players.filter(p => p.playerName === props.playerName)[0];

    return <OnlineApp gameName={props.gameName} players={players} player={player} gameText={data.joinGame.gameText}></OnlineApp>;
}
