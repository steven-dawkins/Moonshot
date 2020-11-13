import * as React from "react";
import { render } from "react-dom";
import { WebGlScene } from "./scene";
import { Typist } from "./src/typist";

const el = document.getElementById("body");

const typist = new Typist("Lorem ipsum");

render(<div>
        <h1>Moonshot</h1>
        <WebGlScene typist={typist}></WebGlScene>
       </div>,
    el);