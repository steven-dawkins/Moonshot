import * as React from "react";
import { render } from "react-dom";
import { WebGlScene } from "./scene";

const el = document.getElementById("body");

render(<div>
        <h1>Welcome</h1>
        <WebGlScene></WebGlScene>
       </div>,
    el);