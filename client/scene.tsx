import * as React from 'react';

import { Typist } from './src/typist';
import { InitWebgl } from './src/webgl';

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

export class WebGlScene extends React.Component<{typist: Typist, name: string}, {typist: Typist}> {
    private el: HTMLDivElement | null = null;

    constructor(props: {typist: Typist, name: string})
    {
      super(props);
      
      this.state = { typist: props.typist };

      this.onKeyDown = this.onKeyDown.bind(this);
    }

    onKeyDown(evt: KeyboardEvent) {
      
      if (evt.key.length <= 1 && isAlphaNumeric(evt.key))
      {
        this.state.typist.ProcessCharacter(evt.key);
        this.setState({ typist: this.state.typist });
      }

      return true;
    }
  
    componentDidMount() {
      if (this.el !== null && this.state.typist != null)
      {
        window.addEventListener("keydown", this.onKeyDown);

        InitWebgl(this.el, this.state.typist);
      }
    }
  
    componentWillUnmount() {
      // this.engine.destroy();
      window.removeEventListener("keydown", this.onKeyDown);
    }
  
    render() {
      return <div>
          <div>Hi: {this.props.name}</div>
          <div><span style={{color: "red"}}>{this.state.typist.TypedText}</span>|<span>{this.state.typist.UnTypedText}</span></div>
          <div ref={el => this.el = el} />
        </div>;
    }
  }