import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm//webxr/VRButton.js';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import  { updateGameText } from './gameText.js';
import { firePhoton, animatePhotons} from './photon.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { addEnemyCubes, enemyTargetGroup, animateEnemyCubes} from './enemies.js';

// 1 unit = 1 real world meter
// average human height = 1.6m

let controller1 = null;

let camera, renderer, scene;
let vrEnabled = false;
let clock: THREE.Clock;
const controllerNumber = 1;

const targetCount = 1;
const backgroundColor = 0x000000;
const stats = new Stats();

document.body.appendChild(stats.dom);

async function init() {
  clock = new THREE.Clock();
  scene = new THREE.Scene();
  scene.background = new THREE.Color( backgroundColor );

  const cameraGroup = new THREE.Group();
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.2, 200 );
  cameraGroup.add(camera);
  cameraGroup.position.set(0, 2, 4);
  scene.add( cameraGroup );
  scene.add( new THREE.HemisphereLight( 0xffffff, 0x999999, 3 ) );
  renderer = new THREE.WebGLRenderer( {
    antialias: false,
    alpha: true,
    precision: "lowp",
    powerPreference: "high-performance" ,//"low-power",
    logarithmicDepthBuffer: true
  });

  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = false;
  updateGameText("Renderer is ready");

  // initializing webxr renderer and controllers. Adding the vr button to the users element
  const container = document.getElementById("voidblank");
  if (container !== null) {
    container.appendChild(renderer.domElement);
  }

  //  Grid
  const gridHelper = new THREE.GridHelper(100, 100, 0x18fbe3,0x18fbe3);
  // const gridHelper = new THREE.GridHelper(100, 100, 0x000000,0x000000);

  gridHelper.visible = true;
  scene.add( gridHelper );

  window.addEventListener( 'keydown', ( event ) => {
    if (event.key === 'g') {
      gridHelper.visible = !gridHelper.visible;
    }
  });


  //add mesh objects from other files
  // should also move the controller to the other file
  addEnemyCubes(targetCount);
  scene.add(enemyTargetGroup);

  // WebXr entry point
  container.appendChild(VRButton.createButton(renderer));
  vrEnabled = true;

  const vrButton = document.getElementById("VRButton");
  if (vrButton !== null) {
    vrButton.addEventListener('click', async () => {
      renderer.xr.enabled = true;
      await updateSession();
    });
  }

  async function updateSession() {
    if (navigator.xr && vrEnabled) {
      updateGameText("WebXR is supported in this browser");
      const sessionInit = { optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking'] };
      const session = await navigator.xr.requestSession('immersive-vr', sessionInit);
      updateGameText("Getting sessioninit...");
      await renderer.xr.setSession(session);
      onSessionStarted(session);
    } else {
      updateGameText("WebXR is not supported in this browser.");
    }
  }

  async function onSessionStarted(session: XRSession) {
    updateGameText("Getting session...");
    renderer.setSize(window.innerWidth, window.innerHeight);
    await renderer.xr.setSession(session);
    if (session) {
      updateGameText(`Session started: ${session}`);
    }
  }


  //orbit controls
  let orbitEnabled = false;
  const orbitControls = new OrbitControls(camera, renderer.domElement)
  orbitControls.enabled = orbitEnabled;
  orbitControls.enableRotate = orbitEnabled
  orbitControls.keyPanSpeed = 60.0 // magic number
  orbitControls.enableZoom = true

  window.addEventListener('keydown', ( event ) => {
    const key = event.key;
    if (key === 'o') {
      orbitEnabled = !orbitEnabled;
      orbitControls.enableRotate = orbitEnabled;
      alert(`Orbit controls are ${orbitEnabled ? 'enabled' : 'disabled'}`);
    }
  });


  // controllers
  const controller2 = renderer.xr.getController(controllerNumber);
  //This needs to be done with some sort of in game menu
  //right
  controller2.addEventListener( 'connected',  ( event ) => {
    controller2.add( buildController( event.data ) );
  } );


  controller2.addEventListener( 'disconnected', function () {
    controller2.remove( controller2.children[ 0 ] );
  } );

  controller2.addEventListener('squeezestart', () => {
    // get the current position and rotation of the controller
    const position = new THREE.Vector3();
    const rotation = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    controller2.matrixWorld.decompose(position, rotation, scale);
    controller2.position.copy(position);
    // Add any additional logic for when the grip is squeezed
  });

  controller2.addEventListener('squeezeend', () => {
    // Add any additional logic for when the grip is released
  });

  cameraGroup.add(controller2);
  // const controllerModelFactory = new XRControllerModelFactory();

  controller1 = renderer.xr.getController(0);
  controller1.addEventListener( 'connected',  ( event ) => {
    controller1.add( buildController( event.data ) );
  } );
  // move player using the controller joystick
  controller1.addEventListener('selectstart', ( ) => {
    updateGameText(`Controller  postion: ${controller1.position.x}`);
    // cameraGroup.position.x += 0.1;
  });


  const loader = new GLTFLoader();
  let gunModel;
  loader.load('/models/gun.glb', (gltf) => {
    gunModel = gltf.scene;
    gunModel.scale.set(.65, .65, .65); // Adjust the scale if necessary
    gunModel.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI);
    gunModel.position.y = -0.09;
    gunModel.position.z = 0.02;
    controller2.add(gunModel);
  }, undefined, (error) => {
    console.error('An error happened while loading the gun model:', error);
  });


  controller2.addEventListener('selectstart', ( ) => {
    const position = new THREE.Vector3();
    const rotation = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    controller2.matrixWorld.decompose(position, rotation, scale);
    controller2.position.copy(position);
    updateGameText(`Controllerm 2  postion: ${controller2.position.x}`);
    firePhoton(controller2);
  });

  window.addEventListener( 'resize', onWindowResize );
}

function buildController( data ) {
  let geometry, material;
  const controllerGeo = new THREE.BoxGeometry( 0.065,0.2,0.065);
  const controllerMaterial = new THREE.MeshPhongMaterial({color: 0xff0000, transparent: false});
  const threeObject = new THREE.Object3D();
  threeObject.add( new THREE.Mesh( controllerGeo, controllerMaterial ) );
  switch ( data.targetRayMode ) {
    case 'tracked-pointer':
      geometry = new THREE.BufferGeometry();
      geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [ 0, 0, 0, 0, 0, - 1 ], 3 ) );
      geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( [ 0.5, 0.5, 0.5, 0, 0, 0 ], 3 ) );
      material = new THREE.LineBasicMaterial( { vertexColors: true, blending: THREE.AdditiveBlending } );
      return new THREE.Line( geometry, material );

    case 'gaze':
      geometry = new THREE.RingGeometry( 0.02, 0.04, 32 ).translate( 0, 0, - 1 );
      material = new THREE.MeshBasicMaterial( { opacity: 0.5, transparent: true } );
      return new THREE.Mesh( geometry, material );
  }

  // Add a default return statement
  return threeObject;
}

function handleJoystickMovement(controller, cameraGroup) {
  const gamepad = controller.gamepad;
  if (gamepad) {
    updateGameText(`Gamepad connected: ${gamepad.id}`);
    const xAxis = gamepad.axes[2]; // Horizontal movement
    const yAxis = gamepad.axes[3]; // Vertical movement

    // Adjust the movement speed as needed
    const movementSpeed = 0.1;
    // Update the cameraGroup position based on joystick input
    cameraGroup.position.x += xAxis * movementSpeed;
    cameraGroup.position.y += yAxis * movementSpeed;
  }
}


function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
  renderer.setAnimationLoop( render );
}

function render() {
  const enemyCubes = enemyTargetGroup.children;
  renderer.render(scene, camera);
  animatePhotons();
  animateEnemyCubes(enemyCubes);
  TWEEN.update();
  stats.update();
}

function voidblank() {
  init();
  animate();
}

export { voidblank, scene, renderer, render, enemyTargetGroup};
