import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';
import { landscapeGroup, cubeGroupContainer, animateModel, animateBuildingGroupY, largeSphere} from '@js/other/Shootfox/models.ts';
import { ship } from '@js/other/Shootfox/ship.ts';
import { EnemyCube, animateEnemyCube} from '@js/other/Shootfox/enemies.ts';
import { handleGamepad, handleKeyboardControls } from './controls';
import {stats} from './debug.ts'


let camera = new THREE.Camera();
let renderer: THREE.WebGLRenderer
let delta: number = 0;

const clock: THREE.Clock = new THREE.Clock();
const scene: THREE.Scene = new THREE.Scene();
const interval: number = 1/60;
const shipSpeed: Object = { x:.9};




let enemyCube = new EnemyCube();
function addEnemyCube() {
  enemyCube = new EnemyCube();
  scene.add(enemyCube);
}

const backgroundColor: number = 0x222222;
function init() {
  scene.background = new THREE.Color( backgroundColor );

  // scene additions
  scene.add(landscapeGroup);
  scene.add(ship);
  scene.add(cubeGroupContainer);
  scene.add(enemyCube);
  scene.add(largeSphere);

  const aspect: number = (window.innerWidth / window.innerHeight);
  camera = new THREE.PerspectiveCamera( 100, aspect, 1 );
  camera.position.set( 0, -12, 0 ); // all components equal
  camera.lookAt( scene.position ); // or the origin

  const ambientLight = new THREE.AmbientLight( 0xffffff, 0.025 );
  scene.add( ambientLight );

  const directionLight = new THREE.DirectionalLight( 0xffffff, 1 );
  directionLight.position.set( 0, 0, 3 );
  directionLight.rotateOnAxis( new THREE.Vector3( 0, 1, -1 ), Math.PI/2  );
  directionLight.castShadow = true;
  directionLight.shadow.mapSize.width = 1024;
  directionLight.shadow.mapSize.height = 1024;
  directionLight.shadow.camera.near = 0.5;
  directionLight.shadow.camera.far = 50;
  directionLight.shadow.camera.left = -20;
  directionLight.shadow.camera.right = 20;
  directionLight.shadow.camera.top = 20;
  directionLight.shadow.camera.bottom = -5;
  scene.add( directionLight );

  renderer = new THREE.WebGLRenderer( {
    antialias: false,
    alpha: true,
    precision: "lowp",
    powerPreference: "high-performance",
    logarithmicDepthBuffer: true
  });

  renderer.setPixelRatio( window.devicePixelRatio/2);
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const orbitControls = new OrbitControls(camera, renderer.domElement)
  orbitControls.enabled = false;
  orbitControls.enableRotate = true;
  orbitControls.keyPanSpeed = 60.0 // magic number
  orbitControls.enableZoom = true

  const container: HTMLElement = document.getElementById("shootfox")!;
  container.appendChild(renderer.domElement);

  // adds gamepad and keyboard controls
  requestAnimationFrame(handleGamepad);
  handleKeyboardControls();
}

function animate() {
  requestAnimationFrame(animate);
  delta += clock.getDelta();
  if (delta  > interval) {
    render();
    delta = delta % interval;
  }
}

function render() {
  renderer.render( scene, camera );
  animateModel(cubeGroupContainer, shipSpeed);
  animateEnemyCube(enemyCube);
  TWEEN.update();
  stats.update();
}

function shootfox() {
  init();
  animate();
}

export { shootfox, scene, enemyCube, addEnemyCube, camera , delta};


