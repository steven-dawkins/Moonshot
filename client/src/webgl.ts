import {
    WebGLRenderer, Scene, TextureLoader, OrthographicCamera, PlaneGeometry, MeshBasicMaterial, Mesh, Object3D, Vector3, Vector2, ShaderMaterial, Material, IUniform, MirroredRepeatWrapping
} from "three";

import rocketImage from "../assets/sprites/cohete_off.png";
import starImage from "../assets/sprites/star.png";
import moonImage from "../assets/sprites/moon-dif-512.png";
import earthImage from "../assets/sprites/earth-0062.png";

import starShader from "../assets/shaders/star.vert";
import starFragShader from "../assets/shaders/star.frag";

import backgroundShader from "../assets/shaders/background.vert";
import backgroundFragShader from "../assets/shaders/background.frag";

import flameImage from "../assets/sprites/flame.png";
import flameShader from "../assets/shaders/flame.vert";
import flameFragShader from "../assets/shaders/flame.frag";

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

    const alpha = numRockets === 1
        ? 0.75
        : position / numRockets;

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

function calculateRocketVector(position: number, numRockets: number, progress: number) {
    const previous = calculateRocketPosition(position, numRockets, progress - 0.01);
    const current = calculateRocketPosition(position, numRockets, progress);

    const diff = current.sub(previous);

    return diff;
}

function calculateRocketAngle(position: number, numRockets: number, progress: number) {
    const diff = calculateRocketVector(position, numRockets, progress);

    return diff.angle();
}

export function InitWebgl(parent: HTMLDivElement, players: TypistPlayer[]) {

    const renderer = new WebGLRenderer({});
    renderer.autoClear = true;
    renderer.autoClearColor = true;

    var camera = new OrthographicCamera(0, WIDTH, HEIGHT, 0, NEAR, FAR);

    camera.setRotationFromAxisAngle(new Vector3(0, 0, 1), 0.0);
    const scene = new Scene();

    const loader: TextureLoader = new TextureLoader();

    const rocketMaterial = new MeshBasicMaterial({ map: loader.load("./" + rocketImage), transparent: true });

    const fi = loader.load("./" + flameImage);
    fi.wrapS = MirroredRepeatWrapping;
    fi.wrapT = MirroredRepeatWrapping;


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

    const background: Object3D = CreatePlane(backgroundMaterial, WIDTH, HEIGHT, WIDTH / 2, HEIGHT / 2, 0);

    scene.add(background);

    const moonMaterial = new MeshBasicMaterial({ map: loader.load("./" + moonImage), transparent: true });
    const moon = CreatePlane(moonMaterial, moonRadius * 2, moonRadius * 2, moonPosition.x, moonPosition.y, 40);
    scene.add(moon);

    const earthMaterial = new MeshBasicMaterial({ map: loader.load("./" + earthImage), transparent: true });
    const earth = CreatePlane(earthMaterial, earthRadius * 2, earthRadius * 2, earthPosition.x, earthPosition.y, 40);
    scene.add(earth);

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


        const size = Math.random() * 0.5 + 0.5;

        const geometry: PlaneGeometry = new PlaneGeometry(20 * size, 20 * size);

        const mesh2: Object3D = new Mesh(geometry, starMaterial)
            .translateX(Math.random() * WIDTH)
            .translateY(Math.random() * HEIGHT)
            .translateZ(1);

        mesh2.setRotationFromAxisAngle(new Vector3(0, 0, 1), 0);

        scene.add(mesh2);
    }

    // window.onresize = () => {

    //     console.log(parent.clientWidth);
    //     renderer.setSize(parent.clientWidth, HEIGHT);

    //     earth.position.x = earthPosition.x * parent.clientWidth / WIDTH;
    //     moon.position.x = moonPosition.x * parent.clientWidth / WIDTH;
    // };

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

    

    const rockets = new Array<{mesh: Object3D, flameUniforms: { [uniform: string]: IUniform }, flameMesh: Object3D}>();

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

            const rocketPosition = calculateRocketPosition(i, players.length, playerI.typist.Position);
            const rocketAngle = calculateRocketAngle(i, players.length, playerI.typist.Position);
            const vec = calculateRocketVector(i, players.length, playerI.typist.Position);

            if (!rockets[i])
            {
                const rocketMesh = CreatePlane(rocketMaterial, 50, 50, rocketPosition.x, rocketPosition.y, 50);
                scene.add(rocketMesh);

                const flameUniforms = {
                    time: { type: "f", value: 1.0 },
                    uDiffuseSampler: { type: "t", value: 0 },
                    magnitude: { type: "f", value: 0.0 }
                };
                const flameMaterial = new ShaderMaterial({
                    defines: { USE_MAP: '' },
                    uniforms: flameUniforms,
                    vertexShader: flameShader,
                    fragmentShader: flameFragShader,
                    transparent: true
                });
            
                flameMaterial.uniforms.uDiffuseSampler.value = fi;
                const flameI = CreatePlane(flameMaterial, 50, 50, rocketPosition.x, rocketPosition.y, 49);
                scene.add(flameI);
                rockets[i] = { mesh: rocketMesh, flameUniforms: flameUniforms, flameMesh: flameI };
            }

            var rocketI = rockets[i];

            rocketI.mesh.position.setX(rocketPosition.x);
            rocketI.mesh.position.setY(rocketPosition.y);
            rocketI.mesh.setRotationFromAxisAngle(new Vector3(0, 0, 1), rocketAngle - Math.PI / 2);

            const flamePosition = rocketPosition.sub(vec.normalize().multiplyScalar(45));

            rocketI.flameMesh.position.setX(flamePosition.x);
            rocketI.flameMesh.position.setY(flamePosition.y);
            rocketI.flameMesh.position.setZ(10);
            rocketI.flameMesh.setRotationFromAxisAngle(new Vector3(0, 0, 1), rocketAngle + Math.PI / 2);

            rocketI.flameUniforms.time.value = elapsedSeconds;
            rocketI.flameUniforms.magnitude.value = Math.min(playerI.typist.WordsPerMinute / 80, 1.0);
        });

        renderer.setViewport(0, 0, WIDTH, HEIGHT);
        renderer.render(scene, camera);
        window.requestAnimationFrame(webglRender);
    }

    webglRender();
}

function CreatePlane(material: Material, width: number, height: number, x: number, y: number, z: number) {
    const geometry: PlaneGeometry = new PlaneGeometry(width, height);
    const object: Object3D = new Mesh(geometry, material).translateX(x).translateY(y).translateZ(z);

    object.setRotationFromAxisAngle(new Vector3(0, 0, 1), 0);
    return object;
}
