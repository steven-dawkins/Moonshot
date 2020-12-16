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

    const existingPlayerName = localStorage.getItem("PlayerName") ?? "";

    const [playerName, setPlayerNameState] = useState(existingPlayerName);

    const setPlayerName = (name: string) =>
    {
        setPlayerNameState(name);
        localStorage.setItem("PlayerName", name);
    }

    const [gameName, setName] = useState(`Game - ${Math.ceil(Math.random() * 100)}`);
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
            <legend>Existing games</legend>

            <ul>
                {data?.games?.map(g =>
                    <li key={g.name}>
                        {g.name} - {g.players.length} players
                        <Button disabled={playerName.length <= 0} onClick={() => props.chooseGame(g.name, "", playerName)}>Join</Button>
                    </li>
                )}
            </ul>
            
            <Button
                onClick={(evt) => { evt.preventDefault(); props.chooseGame("Offline", gameText, playerName); }}>
                    Play Offline
            </Button>

            <legend>Create game</legend>

            <Form.Item
                label="Player name"
                name="player-name"
                rules={[{ required: true, message: 'Please input a player name!' }]}
                initialValue={playerName}
            >
                <Input id="playerName" type="text" onChange={e => setPlayerName(e.target.value)} />
            </Form.Item>

            <Form.Item
                label="Game name"
                name="game-name"
                rules={[{ required: true, message: 'Please input a game name!' }]}
                initialValue={gameName}
            >
                <Input id="gameName" type="text" onChange={e => setName(e.target.value)} />
            </Form.Item>
            
            <Form.Item
                label="Game text"
                name="game-text"
                rules={[{ required: true, message: 'Please input the game text!' }]}
                initialValue={gameText}
            >
                
                <TextArea id="gametext"
                    rows={4}
                    onChange={e => setGameText(e.target.value)} />
            </Form.Item>
            <Form.Item>
                <Button
                    disabled={gameName.length === 0 || playerName.length === 0 }
                    onClick={(evt) => { evt.preventDefault(); props.chooseGame(gameName, gameText, playerName); }}>Create</Button>
            </Form.Item>
        </Form>

    </Card>
    </Col>
  </Row>
}