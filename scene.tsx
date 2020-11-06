import React = require("react");

import {
    WebGLRenderer, Camera, Scene, TextureLoader, OrthographicCamera, PlaneGeometry, Texture,
    MeshBasicMaterial, Mesh, Object3D, Vector3, MeshPhongMaterial, PointLight
} from "three";

import myImage from "./assets/image1.png";

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
    //const gui = new GUI();
    //gui.add(camera, 'zoom', 0.01, 1, 0.01).listen();

    camera.setRotationFromAxisAngle(new Vector3(0, 0, 1), 0.0);
    const scene = new Scene();

    const loader: TextureLoader = new TextureLoader();
    const texture: Texture = loader.load("./" + myImage);

    const material = new MeshBasicMaterial({ map: texture });
    //const material = new MeshPhongMaterial({color: 0xCC0000});

    camera.position.z = 200;

    renderer.setSize(WIDTH, HEIGHT);

    parent.appendChild(renderer.domElement);

    const geometry: PlaneGeometry = new PlaneGeometry(100, 100);
    // geometry.translate(50, 50, 0);

    const mesh: Object3D = new Mesh(geometry, material).translateX(0).translateY(0);

    mesh.setRotationFromAxisAngle(new Vector3(0, 0, 1), 0);

    scene.add(mesh);

    // const pointLight: PointLight = new PointLight(0xFFFFFF);
    // pointLight.position.x = 50;
    // pointLight.position.y = 50;
    // pointLight.position.z = 130;
    // scene.add(pointLight);

    var i = 0.0;

    function webglRender(): void {
      console.log("webglrender");
      mesh.position.setX(i += 0.1);
      mesh.position.setY(0);
      mesh.setRotationFromAxisAngle(new Vector3(0, 0, 1), 0);
      
      renderer.setViewport( 0, 0, WIDTH / 2, HEIGHT );
      renderer.render(scene, camera);
      window.requestAnimationFrame(webglRender);
    }
  
    webglRender();
}

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