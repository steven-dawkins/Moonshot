import * as React from "react";
import { useEffect, useState } from "react";
import { WebGlScene } from "./scene";
import { useCreateGameMutation, useGameKeystrokesSubscription, useGamePlayersSubscription,
     useGetPlayersQuery, useJoinGameMutation, useKeystrokesSubscription, usePlayersSubscription, useGetGamesQuery,
    useAddGameKeystrokeMutation } from "../generated/graphql";

import { TypistPlayer } from "../TypistPlayer";
import { getRandomText } from "../texts";

const text = getRandomText();

export function OnlineApp(props: { gameName: string, playerName: string }) {

    const [players, setPlayers] = useState(Array<TypistPlayer>());
    const [player, setPlayer] = useState<TypistPlayer | null>(null);

    const { error: keystrokesError } = useGameKeystrokesSubscription({
        variables: {
            gameName: props.gameName
        },
        onSubscriptionData: data => {
            console.log("keystroke");
            console.log(data);
            const keystroke = data.subscriptionData.data?.gameKeystroke;

            const p = players.filter(p => p.player.name === keystroke?.playerName)[0];

            if (keystroke && keystroke?.keystroke && p !== player)
            {
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

            const p = new TypistPlayer({ name: playerJoined?.name, index: playerJoined?.index }, text);

            console.log("player joined: " + p.player.name);

            var existing = players.filter(t => t.player.index === p.player.index);
            
            if (!existing)
            {
                players.push(p);
                
                setPlayers(players);
            }
        }
    });

    const [keystrokeMutation, { loading: keystrokeLoading, error: keystrokeError }] = useAddGameKeystrokeMutation({
    
    });

const [joinMutation, { data, loading: joinLoading, error: joinError }] = useJoinGameMutation({
        variables: {
            gameText: text,
            playerName: props.playerName,
            gameName: props.gameName
        },
        onCompleted: data => {

            console.log(data);
            console.log(props.playerName);

            if (!data.joinGame) {
                return;
            }

            data.joinGame.players.forEach(p => {

                var existing = players.filter(t => t.player.index === p.index);
        
                if (existing.length === 0)
                {
                    const player = new TypistPlayer({ name: p.name, index: p.index }, text);
                    players.push(player);

                    if (player.player.name === props.playerName) {
                        setPlayer(player);
                        player.typist.OnCharacter = (char: string) => {
                            keystrokeMutation({
                                variables: {
                                    keystroke: char,
                                    playerName: props.playerName,
                                    gameName: props.gameName,
                                }
                            });
                        
                        };
                    }
                }

                
                setPlayers(players);
            }); 
        }
    });

    useEffect(() => {
        joinMutation();
    }, []);

    // if (keystrokeLoading) {
    //     return <div>Keystrokes Loading...</div>;
    // }

    if (keystrokeError) {
        return <div>Keystroke Error! {playersError}</div>
    }

    if (joinError) {
        return <div>Error! {joinError}</div>
    }

    if (joinLoading || !data || !data.joinGame) {
        return <div>Loading...</div>;
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

    if (!data.joinGame.name)
    {
        return <div>Not joined...</div>;
    }

    return <div>
        <h1>Moonshot - {data.joinGame.name}</h1>

        <ul>
            {players.map(player =>
                <li key={player.player.index}>{player.player.name} ({player.typist.Position})</li>)}
        </ul>

        <WebGlScene player={player} players={players} onComplete={() => {}} ></WebGlScene>
    </div>;
}