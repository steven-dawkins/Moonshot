import * as React from 'react';

import {
    WebGLRenderer, Scene, TextureLoader, OrthographicCamera, PlaneGeometry, Texture,
    MeshBasicMaterial, Mesh, Object3D, Vector3, Vector2, ShaderMaterial, FontLoader, TextGeometry} from "three";

import rocketImage from "./assets/onlyrocket.png";
import starImage from "./assets/star.png";
import moonImage from "./assets/moon-0000010.png";

import { Typist } from './src/typist';

export function InitWebgl(parent: HTMLDivElement, typist: Typist)
{
    console.log("init webgl");
    const WIDTH = 700,
        HEIGHT = 600,
        NEAR = 0.1,
        FAR = 10000;

    const renderer = new WebGLRenderer({  });
    renderer.autoClear = true;
    renderer.autoClearColor = true;

    var camera = new OrthographicCamera(0, WIDTH, HEIGHT, 0, NEAR, FAR);

    camera.setRotationFromAxisAngle(new Vector3(0, 0, 1), 0.0);
    const scene = new Scene();

    const loader: TextureLoader = new TextureLoader();
    const starTexture: Texture = loader.load("./" + starImage);
    const rocketTexture: Texture = loader.load("./" + rocketImage);
    const moonTexture: Texture = loader.load("./" + moonImage);
    const starMaterial = new MeshBasicMaterial({ map: starTexture, transparent: true });
    const rocketMaterial = new MeshBasicMaterial({ map: rocketTexture, transparent: true });
    const moonMaterial = new MeshBasicMaterial({ map: moonTexture, transparent: true });

    // const material = new MeshBasicMaterial({ map: texture });

    const uniforms = {
      time: { type: "f", value: 1.0 },
      resolution: { type: "v2", value: new Vector2() },
      //texture: starTexture
    };

    var material1 = new ShaderMaterial({
      uniforms: uniforms,
      vertexShader: 
      `uniform float time;
      uniform vec2 resolution;
      void main()	{
          gl_Position = vec4( position, 1.0 );
          gl_Position = projectionMatrix *
          modelViewMatrix *
          vec4(position,1.0);
      }`,
      fragmentShader:
      `uniform float time;
      uniform vec2 resolution;
      void main()	{
          float x = mod(time + gl_FragCoord.x, 30.) - 15.;
          float y = mod(time + gl_FragCoord.y, 30.) - 15.;
          //float r = distance(vec2(x,y), vec2(0.,0.)) / 20.;
          float r = (abs(x * x * x) + abs(y * y * y)) / 1000.;
          gl_FragColor = vec4(1. - r, 0., 0., 1.);
      }
      `
    });

    const material2 = new MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.5 });

    const material = material1;

    camera.position.z = 200;

    renderer.setSize(WIDTH, HEIGHT);

    parent.appendChild(renderer.domElement);

    const geometry: PlaneGeometry = new PlaneGeometry(100, 100);
    // geometry.translate(50, 50, 0);

    const mesh: Object3D = new Mesh(geometry, rocketMaterial).translateX(0).translateY(0);

    mesh.setRotationFromAxisAngle(new Vector3(0, 0, 1), 0);

    scene.add(mesh);

    const moonGeometry: PlaneGeometry = new PlaneGeometry(100, 100);
    const moon: Object3D = new Mesh(moonGeometry, moonMaterial).translateX(600).translateY(500);

    moon.setRotationFromAxisAngle(new Vector3(0, 0, 1), 0);

    scene.add(moon);

    for(var i = 0; i < 40; i++)
    {
      const geometry: PlaneGeometry = new PlaneGeometry(40, 40);

      const mesh2: Object3D = new Mesh(geometry, starMaterial)
                                .translateX(Math.random() * WIDTH)
                                .translateY(Math.random() * HEIGHT);

      mesh2.setRotationFromAxisAngle(new Vector3(0, 0, 1), 0);

      scene.add(mesh2);
    }


    const fontLoader = new FontLoader();

    fontLoader.load( 'assets/helvetiker_regular.typeface.json', function ( font ) {

      const geometry = new TextGeometry( 'Hello three.js!', {
        font: font,
        size: 60,
        height: 5,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 10,
        bevelSize: 8,
        bevelOffset: 0,
        bevelSegments: 5
      } );
    
      var textMesh = new Mesh( geometry, material2 );
      textMesh.translateY(100);

      scene.add(textMesh);
    } );

    var i = 0.0;

    var startTime = Date.now();
    function webglRender(): void {
      var elapsedMilliseconds = Date.now() - startTime;
      var elapsedSeconds = elapsedMilliseconds / 1000.;
      //uniforms.time.value = 60. * elapsedSeconds;

      mesh.position.setX(typist.Position * (WIDTH - 200) + 50);
      mesh.position.setY(typist.Position * (HEIGHT - 200) + 50);
      mesh.position.setZ(50);
      mesh.setRotationFromAxisAngle(new Vector3(0, 0, 1), -Math.PI/4);
      
      renderer.setViewport( 0, 0, WIDTH, HEIGHT );
      renderer.render(scene, camera);
      window.requestAnimationFrame(webglRender);
    }
  
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

export class WebGlScene extends React.Component<{typist: Typist}, {typist: Typist}> {
    private el: HTMLDivElement | null = null;

    constructor(props: {typist: Typist})
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
          <div><span style={{color: "red"}}>{this.state.typist.TypedText}</span>|<span>{this.state.typist.UnTypedText}</span></div>
          <div ref={el => this.el = el} />
        </div>;
    }
  }