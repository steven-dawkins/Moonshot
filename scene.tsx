import * as React from 'react';

import {
    WebGLRenderer, Scene, TextureLoader, OrthographicCamera, PlaneGeometry, Texture,
    MeshBasicMaterial, Mesh, Object3D, Vector3} from "three";

import myImage from "./assets/image1.png";
import { Typist } from './src/typist';

export function InitWebgl(parent: HTMLDivElement)
{
    console.log("init webgl");
    const WIDTH = 700,
        HEIGHT = 600,
        NEAR = 0.1,
        FAR = 10000;

    const renderer = new WebGLRenderer();
    var camera = new OrthographicCamera(0, WIDTH, HEIGHT, 0, NEAR, FAR);
    camera =  new OrthographicCamera( WIDTH / - 2, WIDTH / 2, HEIGHT / 2, HEIGHT / - 2, 1, 1000 );
    camera.zoom = 0.2;

    camera.setRotationFromAxisAngle(new Vector3(0, 0, 1), 0.0);
    const scene = new Scene();

    const loader: TextureLoader = new TextureLoader();
    const texture: Texture = loader.load("./" + myImage);

    const material = new MeshBasicMaterial({ map: texture });

    camera.position.z = 200;

    renderer.setSize(WIDTH, HEIGHT);

    parent.appendChild(renderer.domElement);

    const geometry: PlaneGeometry = new PlaneGeometry(100, 100);
    // geometry.translate(50, 50, 0);

    const mesh: Object3D = new Mesh(geometry, material).translateX(0).translateY(0);

    mesh.setRotationFromAxisAngle(new Vector3(0, 0, 1), 0);

    scene.add(mesh);

    var i = 0.0;

    function webglRender(): void {
      //mesh.position.setX(i += 0.1);
      mesh.position.setX(typist.Position * 10);
      mesh.position.setY(0);
      mesh.setRotationFromAxisAngle(new Vector3(0, 0, 1), 0);
      
      renderer.setViewport( 0, 0, WIDTH / 2, HEIGHT );
      renderer.render(scene, camera);
      window.requestAnimationFrame(webglRender);
    }

    var typist = new Typist("Lorem ipsum");
    window.addEventListener("keydown", (evt : KeyboardEvent) => {
      
      if (evt.key.length <= 1 && isAlphaNumeric(evt.key))
      {
        typist.ProcessCharacter(evt.key);
      }

      return true;
    });
  
    webglRender();
}

function isAlphaNumeric(str: string) {
  var code, i, len;

  for (i = 0, len = str.length; i < len; i++) {
    code = str.charCodeAt(i);
    if (!(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123) &&
        !(str === " ")) { // lower alpha (a-z)
      return false;
    }
  }
  return true;
};

export class WebGlScene extends React.Component {
    private el: HTMLDivElement | null = null;
  
    componentDidMount() {
      if (this.el !== null)
      {
        InitWebgl(this.el, );
      }
    }
  
    componentWillUnmount() {
      // this.engine.destroy();
    }
  
    render() {
      return <div ref={el => this.el = el} />;
    }
  }