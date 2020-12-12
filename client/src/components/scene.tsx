import { Button, Card, Col, Row, Statistic } from 'antd';
import * as React from 'react';

import { Typist } from '../models/Typist';
import { TypistPlayer } from '../models/TypistPlayer';
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
    player: TypistPlayer;
    players: TypistPlayer[];
    onComplete: () => void;
}

export class WebGlScene extends React.Component<IWebGlSceneProps, {typist: Typist}> {
    private el: HTMLDivElement | null = null;

    constructor(props: IWebGlSceneProps)
    {
      super(props);
      
      this.state = { typist: props.player.typist };

      this.onKeyDown = this.onKeyDown.bind(this);
      this.onRestart = this.onRestart.bind(this);
    }

    onRestart(evt: any) {
        this.props.onComplete();
    }

    onKeyDown(evt: KeyboardEvent) {
      if (evt.key.length <= 1 && isAlphaNumeric(evt.key))
      {
        this.state.typist.ProcessCharacter(evt.key, null);
        this.setState({ typist: this.state.typist });
      }

      return true;
    }
  
    componentDidMount() {
      if (this.el !== null && this.state.typist != null)
      {
        window.addEventListener("keydown", this.onKeyDown);

        InitWebgl(this.el, this.props.players);
      }
    }
  
    componentWillUnmount() {
      // this.engine.destroy();
      window.removeEventListener("keydown", this.onKeyDown);
    }
  
    render() {
      return <Row align="middle">
          <Col span={8}>
            <Card title="Moonshot" /*style={{ width: 300 }}*/>
                <h1>Start typing...</h1>
                <span style={{color: "red"}}>{this.state.typist.TypedText}</span>
                |
                <span>{this.state.typist.UnTypedText}</span>

                <Statistic title="Average words per minute" value={Math.round(this.state.typist.WordsPerMinute * 10)/10} />

                {this.state.typist.Finished
                    ? <Button onClick={this.onRestart}>Play again</Button>
                    : <Button onClick={this.onRestart}>Restart</Button> }
            </Card>

            
            <Card title="Players">
                <ul>
                    {this.props.players.map(player => <li key={player.playerIndex}>{player.playerName} ({Math.round(player.typist.Position * 100 )/100})</li>)}
                </ul>
            </Card>
          </Col>
          <Col span={8}>
            <div ref={el => this.el = el} />
          </Col>
        </Row>;
    }
  }