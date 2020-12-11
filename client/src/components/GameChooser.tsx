import * as React from "react";
import { useState } from "react";
import { useGetGamesQuery } from "../generated/graphql";
import { getRandomText } from "../texts";
import { Button, Card, Col, Form, Input, Row } from 'antd';

const { TextArea } = Input;

export function ChooseGame(props: { chooseGame: (gameName: string, gameText: string, playerName: string) => void }) {

    const { error: gameGetError, data, loading } = useGetGamesQuery({
        variables: {
            started: false // todo: subscribe to game updates? error if we join a game that is started?
        }
    });

    const [playerName, setPlayerName] = useState("Moonshot player " + Math.ceil(Math.random() * 100));
    const [name, setName] = useState("Game 1");
    const [gameText, setGameText] = useState(getRandomText());

    if (loading) {
        return <div>Loading...</div>;
    }

    if (gameGetError) {
        return <div>Error loading games...</div>;
    }

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
      };

    return <Row justify="space-around" align="middle">
    <Col span={16}>
    <Card title="Moonshot" style={{ width: "700" }}>
        <Form {...layout}>
            <legend>Create game</legend>

            <Form.Item
                label="Player name"
                name="player-name"
                rules={[{ required: true, message: 'Please input a player name!' }]}
            >
                <Input id="playerName" type="text" defaultValue={playerName} onChange={e => setPlayerName(e.target.value)} />
            </Form.Item>

            <Form.Item
                label="Game name"
                name="game-name"
                rules={[{ required: true, message: 'Please input a game name!' }]}
            >
                <Input id="gameName" type="text" defaultValue={name} onChange={e => setName(e.target.value)} />
            </Form.Item>
            
            <Form.Item
                label="Game text"
                name="game-text"
                rules={[{ required: true, message: 'Please input the game text!' }]}
            >
                
                <TextArea id="gametext"
                    rows={4}
                    defaultValue={gameText}
                    onChange={e => setGameText(e.target.value)} />
            </Form.Item>
            <Form.Item>
                <Button disabled={name.length === 0} onClick={(evt) => { evt.preventDefault(); props.chooseGame(name, gameText, playerName); }}>Create</Button>
            </Form.Item>

            <Button onClick={(evt) => { evt.preventDefault(); props.chooseGame("Offline", gameText, playerName); }}>Play Offline</Button>

            <ul>
                {data?.games?.map(g =>
                    <li key={g.name}>
                        {g.name} - {g.players.length} players <Button onClick={() => props.chooseGame(g.name, "", playerName)}>Join</Button>
                    </li>
                )}
            </ul>
        </Form>

    </Card>
    </Col>
  </Row>
}