import {
    WebGLRenderer, Scene, TextureLoader, OrthographicCamera, PlaneGeometry, MeshBasicMaterial, Mesh, Object3D, Vector3, Vector2, ShaderMaterial, Material, IUniform
} from "three";

import rocketImage from "../assets/sprites/cohete_off.png";
import starImage from "../assets/sprites/star.png";
import moonImage from "../assets/sprites/moon-dif-512.png";
import earthImage from "../assets/sprites/earth-0062.png";

import starShader from "../assets/shaders/star.vert";
import starFragShader from "../assets/shaders/star.frag";

import backgroundShader from "../assets/shaders/background.vert";
import backgroundFragShader from "../assets/shaders/background.frag";

import { Typist } from "./typist";
import { TypistPlayer } from "./TypistPlayer";

const earthPosition = new Vector2(100, 100);
const earthRadius = 100;

const moonPosition = new Vector2(600, 500);
const moonRadius = 50;

const WIDTH = 700,
HEIGHT = 600,
NEAR = 0.1,
FAR = 10000;

export function calculateRocketPosition(position: number, numRockets: number, progress: number) {

    const alpha = position / numRockets;

    const startPositionX = Math.sin(alpha * Math.PI - Math.PI/4) * earthRadius + earthPosition.x;
    const startPositionY = Math.cos(alpha * Math.PI - Math.PI/4) * earthRadius + earthPosition.y;

    const endPositionX = moonPosition.x - moonRadius;
    const endPositionY = moonPosition.y - moonRadius;
    
    const startPosition = new Vector2(startPositionX, startPositionY);
    const endPosition = new Vector2(endPositionX, endPositionY);

    const midpoint = startPosition.clone().add(startPosition.clone().sub(earthPosition).multiplyScalar(2.0));

    return startPosition.multiplyScalar((1 - progress) * (1 - progress))
            .add(midpoint.multiplyScalar(2.0 * (1 - progress) * progress))
            .add(endPosition.multiplyScalar(progress * progress));
}

function calculateRocketAngle(position: number, numRockets: number, progress: number)
{
    const previous = calculateRocketPosition(position, numRockets, progress - 0.01);
    const current = calculateRocketPosition(position, numRockets, progress);

    const diff = current.sub(previous);

    return diff.angle();
}

export function InitWebgl(parent: HTMLDivElement, typist: Typist, position: number, numRockets: number, players: TypistPlayer[]) {

    const renderer = new WebGLRenderer({});
    renderer.autoClear = true;
    renderer.autoClearColor = true;

    var camera = new OrthographicCamera(0, WIDTH, HEIGHT, 0, NEAR, FAR);

    camera.setRotationFromAxisAngle(new Vector3(0, 0, 1), 0.0);
    const scene = new Scene();

    const loader: TextureLoader = new TextureLoader();

    const rocketMaterial = new MeshBasicMaterial({ map: loader.load("./" + rocketImage), transparent: true });

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

    const background: Object3D = CreatePlane(backgroundMaterial, WIDTH, HEIGHT, WIDTH / 2, HEIGHT / 2);

    scene.add(background);

    const rockets = players.map(player => {
        const rocketPosition = calculateRocketPosition(player.player.index, players.length, 0);
        const rocketAngle = calculateRocketAngle(player.player.index, players.length, 0);
        const newRocket: Object3D = CreatePlane(rocketMaterial, 50, 50, rocketPosition.x, rocketPosition.y);
        newRocket.setRotationFromAxisAngle(new Vector3(0, 0, 1), rocketAngle);

        scene.add(newRocket);
        return newRocket;
    });

    const moonMaterial = new MeshBasicMaterial({ map: loader.load("./" + moonImage), transparent: true });
    scene.add(CreatePlane(moonMaterial, moonRadius * 2, moonRadius * 2, moonPosition.x, moonPosition.y));

    const earthMaterial = new MeshBasicMaterial({ map: loader.load("./" + earthImage), transparent: true });
    scene.add(CreatePlane(earthMaterial, earthRadius * 2, earthRadius * 2, earthPosition.x, earthPosition.y));

    const starUniforms:{ [uniform: string]: IUniform }[] = [];

    for (var i = 0; i < 40; i++) {

        const uniforms = {
            time: { type: "f", value: 1.0 },
            offset: { type: "f", value: i },
            resolution: { type: "v2", value: new Vector2() },
            map: { type: "t", value: 0 }
        };

        starUniforms.push(uniforms);

        var starMaterial = new ShaderMaterial({
            defines: { USE_MAP: '' },
            uniforms: uniforms,
            vertexShader: starShader,
            fragmentShader: starFragShader,
            transparent: true
        });

        starMaterial.uniforms.map.value = loader.load("./" + starImage);

        const geometry: PlaneGeometry = new PlaneGeometry(20, 20);

        const mesh2: Object3D = new Mesh(geometry, starMaterial)
            .translateX(Math.random() * WIDTH)
            .translateY(Math.random() * HEIGHT)
            .translateZ(i);

        mesh2.setRotationFromAxisAngle(new Vector3(0, 0, 1), 0);

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

        for(var i = 0; i < starUniforms.length; i++)
        {
            starUniforms[i].time.value = 60. * elapsedSeconds;
        }
        
        backgroundUniforms.u_time.value = elapsedSeconds;

        players.map(playerI => {

            const i = playerI.player.index;
            var rocketI = rockets[i];

            const rocketPosition = calculateRocketPosition(i, players.length, playerI.typist.Position);
            
            const rocketAngle = calculateRocketAngle(i, players.length, playerI.typist.Position);

            if (!rocketI)
            {
                rocketI = CreatePlane(rocketMaterial, 50, 50, rocketPosition.x, rocketPosition.y);

                scene.add(rocketI);
                rockets[i] = rocketI;
            }

            rocketI.position.setX(rocketPosition.x);
            rocketI.position.setY(rocketPosition.y);
            rocketI.position.setZ(50);
            rocketI.setRotationFromAxisAngle(new Vector3(0, 0, 1), rocketAngle - Math.PI / 2);
        });

        renderer.setViewport(0, 0, WIDTH, HEIGHT);
        renderer.render(scene, camera);
        window.requestAnimationFrame(webglRender);
    }

    webglRender();
}

function CreatePlane(material: Material, width: number, height: number, x: number, y: number) {
    const geometry: PlaneGeometry = new PlaneGeometry(width, height);
    const object: Object3D = new Mesh(geometry, material).translateX(x).translateY(y);

    object.setRotationFromAxisAngle(new Vector3(0, 0, 1), 0);
    return object;
}
