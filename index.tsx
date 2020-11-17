import * as React from "react";
import { render } from "react-dom";
import { WebGlScene } from "./scene";
import { Typist } from "./src/typist";

import khanText from "./assets/khan.txt";

const el = document.getElementById("body");

const texts = khanText.split("\n");

const typist = new Typist(texts[Math.floor(Math.random() * texts.length)]);

render(<div>
        <h1>Moonshot</h1>
        <WebGlScene typist={typist}></WebGlScene>
       </div>,
    el);