import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm//webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import  { updateGameText } from './gameText.js';
import { firePhoton, animatePhotons} from './photon.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { EnemyCube, animateEnemyCube} from './enemies.js';
import { humanModel, loadModel, ball, tableMesh } from './worldMesh.js';

// 1 unit = 1 real world meter
// average human height = 1.6m


let enemyCube = new EnemyCube();
function addEnemyCube() {
  enemyCube = new EnemyCube();
  const randomPosition = getRandomPosition();
  enemyCube.position.set(randomPosition.x, randomPosition.y, randomPosition.z);
  scene.add(enemyCube);
}


let camera, renderer, scene;
let vrEnabled = false;
let clock: THREE.Clock;

const backgroundColor = 0x222222;
const stats = new Stats();

document.body.appendChild(stats.dom);

async function init() {
  clock = new THREE.Clock();
  scene = new THREE.Scene();
  scene.background = new THREE.Color( backgroundColor );

  const cameraGroup = new THREE.Group();
  camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.2, 200 );
  cameraGroup.add(camera);
  cameraGroup.position.set( 0,2, 4 );
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
  renderer.shadowMap.enabled = true;
  updateGameText("Renderer is ready");

  // initializing webxr renderer and controllers. Adding the vr button to the users element
  const container = document.getElementById("voidblank");
  if (container !== null) {
    container.appendChild(renderer.domElement);
  }

  //  Grid
  const gridHelper = new THREE.GridHelper(100, 100, 0x18fbe3,0x18fbe3);
  gridHelper.visible = true;
  scene.add( gridHelper );

  window.addEventListener( 'keydown', ( event ) => {
    if (event.key === 'g') {
      gridHelper.visible = !gridHelper.visible;
    }
  });


  //add mesh objects from other files
  // should also move the controller to the other file
  loadModel(humanModel);
  scene.add(enemyCube);
  scene.add(tableMesh);
  scene.add( ball );


  // WebXr entry point
  container.appendChild(VRButton.createButton(renderer));
  vrEnabled = true;

  const vrButton = document.getElementById("VRButton");
  if (vrButton !== null) {
    vrButton.addEventListener('click', async () => {
      renderer.xr.enabled = true;
      await updateSession();
      // updateXRCameraHeight(3); // Update the height to 3 units after clicking the VR button
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
  orbitControls.enabled = true;
  orbitControls.enableRotate = orbitEnabled
  orbitControls.keyPanSpeed = 60.0 // magic number
  orbitControls.enableZoom = true

  window.addEventListener( 'keydown', ( event ) => {
    if (event.key === 'o') {
      orbitEnabled = !orbitEnabled
      orbitControls.enableRotate = orbitEnabled;
    }
  });


  // controllers
  const controller2 = renderer.xr.getController( 1 );
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

  cameraGroup.add(controller2 );
  // const controllerModelFactory = new XRControllerModelFactory();


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

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
  renderer.setAnimationLoop( render );
}

function render() {
  renderer.render(scene, camera);
  animatePhotons();
  animateEnemyCube(enemyCube);
  TWEEN.update();
  stats.update();
}

function voidblank() {
  init();
  animate();
}

export { voidblank, scene, renderer, render, enemyCube, addEnemyCube};
