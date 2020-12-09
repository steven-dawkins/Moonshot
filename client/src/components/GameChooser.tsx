import * as React from "react";
import { useState } from "react";
import { useGetGamesQuery } from "../generated/graphql";
import { getRandomText } from "../texts";
import { Button, Form, Input } from 'antd';

const { TextArea } = Input;

export function ChooseGame(props: { chooseGame: (gameName: string, gameText: string) => void }) {

    const { error: gameGetError, data, loading } = useGetGamesQuery({
        variables: {
            started: false // todo: subscribe to game updates? error if we join a game that is started?
        }
    });

    const [name, setName] = useState("Game 1");
    const [gameText, setGameText] = useState(getRandomText());

    if (loading) {
        return <div>Loading...</div>;
    }

    if (gameGetError) {
        return <div>Error loading games...</div>;
    }

    console.log(data?.games);

    return <div>
        <button onClick={(evt) => { evt.preventDefault(); props.chooseGame("Offline", gameText); }}>Offline</button>
        
        <fieldset>
            <legend>Create game</legend>

            <Form.Item
                label="Game name"
                name="game-name"
                rules={[{ required: true, message: 'Please input a game name!' }]}
            >
                <Input id="gameName" type="text" value={name} onChange={e => setName(e.target.value)} />
            </Form.Item>
            
            <Form.Item
                label="Game text"
                name="game-text"
                rules={[{ required: true, message: 'Please input your name!' }]}
            >
                
                <TextArea id="gametext"
                    rows={4}
                    value={gameText}
                    onChange={e => setGameText(e.target.value)} />
            </Form.Item>
            <Form.Item>
                <Button disabled={name.length === 0} onClick={(evt) => { evt.preventDefault(); props.chooseGame(name, gameText); }}>Create</Button>
            </Form.Item>
        </fieldset>
    
        <ul>
            {data?.games?.map(g =>
                <li key={g.name}>
                    {g.name} - {g.players.length} players <button onClick={() => props.chooseGame(g.name, "")}>Join</button>
                </li>
            )}
        </ul>
    </div>
}