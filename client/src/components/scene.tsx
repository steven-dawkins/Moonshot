import { Button, Card, Col, List, Progress, Row, Statistic } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';
import * as React from 'react';
import { Game, GameState } from '../models/Game';

import { Typist } from '../models/Typist';
import { InitWebgl } from '../webgl';

function isAlphaNumeric(str: string) {
  var code, i, len;

  for (i = 0, len = str.length; i < len; i++) {
    code = str.charCodeAt(i);
    if (!(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123) && // lower alpha (a-z)
        !(str === " ") &&
        !(str === "/") &&
        !(str === ",") &&
        !(str === ".") &&
        !(str === "?") &&
        !(str === "!") &&
        !(str === "'")) {
      return false;
    }
  }
  return true;
};

interface IWebGlSceneProps
{
    game: Game;
    onComplete: () => void;
    startGame: () => void;
}

export class WebGlScene extends React.Component<IWebGlSceneProps, {typist: Typist}> {
    private el: HTMLDivElement | null = null;

    constructor(props: IWebGlSceneProps)
    {
      super(props);
      
      this.state = { typist: props.game.player.typist };

      this.onKeyDown = this.onKeyDown.bind(this);
      this.onRestart = this.onRestart.bind(this);
    }

    onRestart(evt: any) {
        this.props.onComplete();
    }

    onKeyDown(evt: KeyboardEvent) {
      if (evt.key.length <= 1 && isAlphaNumeric(evt.key))
      {
          if (this.props.game.state === GameState.Started) {
            this.state.typist.ProcessCharacter(evt.key, null);
            this.setState({ typist: this.state.typist });
          }
      }

      return true;
    }
  
    componentDidMount() {
      if (this.el !== null && this.state.typist != null)
      {
        window.addEventListener("keydown", this.onKeyDown);

        InitWebgl(this.el, this.props.game.players);
      }
    }
  
    componentWillUnmount() {
      // this.engine.destroy();
      window.removeEventListener("keydown", this.onKeyDown);
    }

    render() {

    // sort players by score
    const players = this.props.game.players.sort((a, b) => {
        if (a.typist.Finished && !b.typist.Finished) {
            return -1;
        }
        else if (!a.typist.Finished && b.typist.Finished) {
            return 1;
        }
        else if (a.typist.Finished && b.typist.Finished) {
            return a.typist.ElapsedTime < b.typist.ElapsedTime ? 1 :-1;
        }
        else {
            return a.typist.Position < b.typist.Position ? 1 : -1;
        }
    })

    const winner = players.filter(p => p.typist.Finished)[0];

    const gameStatus = this.props.game.state === GameState.Lobby
        ? <div><Button onClick={() => this.props.startGame()}>Start Game</Button></div>
        : <h1>Start typing...</h1>;
        
      return <Row align="middle">
          <Col span={8}>
            <Card title={`Moonshot-${this.props.game.state}`} /*style={{ width: 300 }}*/>
                <span style={{color: "red"}}>{this.state.typist.TypedText}</span>
                |
                <span>{this.state.typist.UnTypedText}</span>

                <Statistic title="Average words per minute" value={Math.round(this.state.typist.WordsPerMinute * 10)/10} />

                {gameStatus}

                {this.state.typist.Finished
                    ? <Button onClick={this.onRestart}>Play again</Button>
                    : <Button onClick={this.onRestart}>Restart</Button> }
            </Card>
            
            <Card title="Players">

                <List
                    dataSource = {players}
                    renderItem={player => (
                        <List.Item>
                            {player === winner ? <TrophyOutlined /> : <div /> }
                            {player.playerName} - {Math.round(player.typist.ElapsedTime/100)/10}s
                            <Progress percent={player.typist.Position * 100} size="small" status="active" />
                        </List.Item>
                      )} />
            </Card>
          </Col>
          <Col span={8}>
            <div ref={el => this.el = el} />
          </Col>
        </Row>;
    }
  }