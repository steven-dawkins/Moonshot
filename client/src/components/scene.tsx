import * as React from 'react';

import { Typist } from '../typist';
import { TypistPlayer } from '../TypistPlayer';
import { InitWebgl } from '../webgl';

function isAlphaNumeric(str: string) {
  var code, i, len;

  for (i = 0, len = str.length; i < len; i++) {
    code = str.charCodeAt(i);
    if (!(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123) &&
        !(str === " ") &&
        !(str === "/") &&
        !(str === ",") &&
        !(str === ".") &&
        !(str === "?") &&
        !(str === "!") &&
        !(str === "'")) { // lower alpha (a-z)
      return false;
    }
  }
  return true;
};

interface IWebGlSceneProps
{
    player: TypistPlayer;
    players: TypistPlayer[];
}

export class WebGlScene extends React.Component<IWebGlSceneProps, {typist: Typist}> {
    private el: HTMLDivElement | null = null;

    constructor(props: IWebGlSceneProps)
    {
      super(props);
      
      this.state = { typist: props.player.typist };

      this.onKeyDown = this.onKeyDown.bind(this);
    }

    onKeyDown(evt: KeyboardEvent) {
      if (evt.key.length <= 1 && isAlphaNumeric(evt.key))
      {
        this.state.typist.ProcessCharacter(evt.key, null);
        this.setState({ typist: this.state.typist });

        // todo: publish to server
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
      return <div className="row">
          <div className="column"><span style={{color: "red"}}>{this.state.typist.TypedText}</span>|<span>{this.state.typist.UnTypedText}</span></div>
          <div className="column" ref={el => this.el = el} />
        </div>;
    }
  }