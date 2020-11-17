import {
    WebGLRenderer, Scene, TextureLoader, OrthographicCamera, PlaneGeometry, Texture,
    MeshBasicMaterial, Mesh, Object3D, Vector3, Vector2, ShaderMaterial, FontLoader, TextGeometry, Material} from "three";

import rocketImage from "../assets/onlyrocket.png";
import starImage from "../assets/star.png";
import moonImage from "../assets/moon-0000010.png";
import earthImage from "../assets/sprites/earth-0062.png";

import starShader from "../assets/shaders/star.vert";
import starFragShader from "../assets/shaders/star.frag";

import backgroundShader from "../assets/shaders/background.vert";
import backgroundFragShader from "../assets/shaders/background.frag";

import { Typist } from "./typist";

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
    
    const rocketMaterial = new MeshBasicMaterial({ map: rocketTexture, transparent: true });
    const moonMaterial = new MeshBasicMaterial({ map: moonTexture, transparent: true });

    const uniforms = {
      time: { type: "f", value: 1.0 },
      offset: { type: "f", value: 0.0 },
      resolution: { type: "v2", value: new Vector2() },
      map: { type:"t", value: 0, texture: starTexture } 
    };

    var material1 = new ShaderMaterial({
      defines: { USE_MAP: '' },
      uniforms: uniforms,
      vertexShader: starShader,
      fragmentShader: starFragShader,
      transparent: true
    });

    material1.uniforms.map.value = starTexture;

    const material2 = new MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.5 });

    const material = material1;

    camera.position.z = 200;

    renderer.setSize(WIDTH, HEIGHT);

    parent.appendChild(renderer.domElement);

    const backgroundUniforms = {
      u_time: { type: "f", value: 1.0 },
      u_resolution: { type: "v2", value: new Vector2(WIDTH, HEIGHT) },
      u_mouse: { type: "v2", value: new Vector2() }
    };

    var backgroundMaterial = new ShaderMaterial({
      defines: { USE_MAP: '' },
      uniforms: backgroundUniforms,
      vertexShader: backgroundShader,
      fragmentShader: backgroundFragShader,
      transparent: true
    });

    const background: Object3D = CreatePlane(backgroundMaterial, WIDTH, HEIGHT, WIDTH/2, HEIGHT/2);

    scene.add(background);

   
    const mesh: Object3D = CreatePlane(rocketMaterial, 50, 50, 0, 0);

    scene.add(mesh);

    const moon: Object3D = CreatePlane(moonMaterial, 100, 100, 600, 500);

    scene.add(moon);

    const earthMaterial = new MeshBasicMaterial({ map: loader.load("./" + earthImage), transparent: true });
    const earth: Object3D = CreatePlane(earthMaterial, 200, 200, 100, 100);

    scene.add(earth);

    for(var i = 0; i < 40; i++)
    {
      const geometry: PlaneGeometry = new PlaneGeometry(40, 40);

      const mesh2: Object3D = new Mesh(geometry, material1)
                                .translateX(Math.random() * WIDTH)
                                .translateY(Math.random() * HEIGHT);

      mesh2.setRotationFromAxisAngle(new Vector3(0, 0, 1), 0);

      mesh2.position.setZ(0);

      scene.add(mesh2);
    }


    // const fontLoader = new FontLoader();

    // fontLoader.load( 'assets/helvetiker_regular.typeface.json', function ( font ) {

    //   const geometry = new TextGeometry( 'Hello three.js!', {
    //     font: font,
    //     size: 60,
    //     height: 5,
    //     curveSegments: 12,
    //     bevelEnabled: true,
    //     bevelThickness: 10,
    //     bevelSize: 8,
    //     bevelOffset: 0,
    //     bevelSegments: 5
    //   } );
    
    //   var textMesh = new Mesh( geometry, material2 );
    //   textMesh.translateY(100);

    //   scene.add(textMesh);
    // } );

    var i = 0.0;

    var startTime = Date.now();

    function webglRender(): void {
      var elapsedMilliseconds = Date.now() - startTime;
      var elapsedSeconds = elapsedMilliseconds / 1000.;
      uniforms.time.value = 60. * elapsedSeconds;
      backgroundUniforms.u_time.value = elapsedSeconds;

      mesh.position.setX(typist.Position * (WIDTH - 300) + 170);
      mesh.position.setY(typist.Position * (HEIGHT - 300) + 170);
      mesh.position.setZ(50);
      mesh.setRotationFromAxisAngle(new Vector3(0, 0, 1), -Math.PI/4);
      
      renderer.setViewport( 0, 0, WIDTH, HEIGHT );
      renderer.render(scene, camera);
      window.requestAnimationFrame(webglRender);
    }
  
    webglRender();
}

function CreatePlane(moonMaterial: Material, width: number, height: number, x: number, y: number) {
  const moonGeometry: PlaneGeometry = new PlaneGeometry(width, height);
  const moon: Object3D = new Mesh(moonGeometry, moonMaterial).translateX(x).translateY(y);

  moon.setRotationFromAxisAngle(new Vector3(0, 0, 1), 0);
  return moon;
}
