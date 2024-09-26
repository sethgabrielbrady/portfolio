import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm//webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { World } from 'three/examples/jsm//libs/ecsy.module.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import  { updateGameText } from './gameText.js';
import { firePhoton, animatePhotons} from './photon.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { EnemyCube, animateEnemyCube} from './enemies.js';


let enemyCube = new EnemyCube();
function addEnemyCube() {
  enemyCube = new EnemyCube();
  scene.add(enemyCube);
}







// 1 unit = 1 real world meter
// average human height = 1.6m

let camera, renderer, scene;
let vrEnabled = false;

let clock: THREE.Clock;
// let world: World;
const floorLevel = 0;
const stats = new Stats();
document.body.appendChild(stats.dom);

const backgroundColor = 0x222222;

async function init() {
  clock = new THREE.Clock();
  // world = new World();
  scene = new THREE.Scene();
  // scene.background = textureCube;
  scene.background = new THREE.Color( backgroundColor );

  camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.2, 200 );
  camera.position.set( 0, 2, 4 );
  scene.add( camera );
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

  const ballGeo = new THREE.SphereGeometry( 0.25 );
  const ballMatr = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
  const ball = new THREE.Mesh( ballGeo, ballMatr );
  ball.position.x = -1;
  ball.position.y = floorLevel + 0.25;
  ball.position.z = 1;
  scene.add( ball );
  updateGameText("Ball added");


  const human = {
    scale: 0.0072,
    path: 'models/human.glb',
    position: { x: -3.75, y: 2, z: -1 },
    rotation: { x: 0, y:Math.PI/2, z: 0 }
  }
  loadModel(human);
  scene.add(enemyCube);


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
      updateXRCamera();
    }
  }

  function updateXRCamera() {
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.2, 200);
    camera.position.set(4, 2.6, 6);

    const xrCamera = renderer.xr.getCamera();
    xrCamera.position.copy(camera.position);

    scene.add(xrCamera);
    updateXRCameraHeight(3);
    updateGameText(`Camera added @ ${xrCamera.position.x}, ${xrCamera.position.y}, ${xrCamera.position.z}`);
  }

  function updateXRCameraHeight(newHeight: number) {
    const xrCamera = renderer.xr.getCamera();
    if (xrCamera) {
      xrCamera.position.y = newHeight;
      updateGameText(`Camera height updated to ${newHeight}`);
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

  controller2.addEventListener('selectstart', ( ) => {

    firePhoton(controller2);
  });
  controller2.addEventListener('selectend', () => {
    // Optionally handle trigger release
    // updateGameText("Trigger released");
  });

  controller2.addEventListener( 'disconnected', function () {
    controller2.remove( controller2.children[ 0 ] );
  } );

  // Squeeze action button (grip)
controller2.addEventListener('squeezestart', () => {
  // updateGameText("Grip squeezed");
  // Add any additional logic for when the grip is squeezed
});

controller2.addEventListener('squeezeend', () => {
  // updateGameText("Grip released");
  // Add any additional logic for when the grip is released
});

  scene.add( controller2 );
  updateGameText("Controllers are ready");

  // const controllerModelFactory = new XRControllerModelFactory();

  scene.add(controller2);

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

  const controllerGrip2 = renderer.xr.getControllerGrip( 1 );
  // const controllerModel = controllerModelFactory.createControllerModel( controllerGrip2 );
  let controllerModel;
  if (gunModel) {
    controllerModel = gunModel.clone;
    controllerGrip2.add( controllerModel );
    scene.add( controllerGrip2 );
  }

  // setup objects in scene and entities

  const sideGeometry = new THREE.BoxGeometry( 1, 4, 12);
  const sideMaterial = new THREE.MeshPhongMaterial({
                                                  color: 0x00ffff,
                                                  transparent: false,
                                                });
  const sideMesh = new THREE.Mesh( sideGeometry, sideMaterial );
  sideMesh.position.set( -5 ,2, 1 );
  scene.add(sideMesh);

  window.addEventListener( 'resize', onWindowResize );
}



function buildController( data ) {
  let geometry, material;
  const controllerGeo= new THREE.BoxGeometry( 0.065,0.2,0.065);
  const controllerMaterial = new THREE.MeshPhongMaterial({color: 0xff0000, transparent: false});
  const threeObject = new THREE.Object3D();
  threeObject.add( new THREE.Mesh( controllerGeo, controllerMaterial ) );
  switch ( data.targetRayMode ) {
    case 'tracked-pointer':
      geometry = new THREE.BufferGeometry();
      geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [ 0, 0, 0, 0, 0, - 1 ], 3 ) );
      geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( [ 0.5, 0.5, 0.5, 0, 0, 0 ], 3 ) );
      material = new THREE.LineBasicMaterial( { vertexColors: true, blending: THREE.AdditiveBlending } );
      // threeObject.add(new THREE.Line( geometry, material ));
      // return threeObject;
      return new THREE.Line( geometry, material );

    case 'gaze':
      geometry = new THREE.RingGeometry( 0.02, 0.04, 32 ).translate( 0, 0, - 1 );
      material = new THREE.MeshBasicMaterial( { opacity: 0.5, transparent: true } );
      return new THREE.Mesh( geometry, material );
  }
  // Add a default return statement

  return threeObject;
}

//model loader
function loadModel (modelObj) {
  const gltfLoader = new GLTFLoader();
  gltfLoader.load(modelObj.path,
    (gltf) => {
      const model = gltf.scene
      model.scale.set(modelObj.scale, modelObj.scale, modelObj.scale); // Assuming uniform scaling
      model.position.set(modelObj.position.x, modelObj.position.y, modelObj.position.z);
      model.rotation.set(modelObj.rotation.x, modelObj.rotation.y, modelObj.rotation.z);
      model.castShadow = false;
      scene.add(model);
    }
  )
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
  updateXRCameraHeight(3);
}


function animate() {
  renderer.setAnimationLoop( render );
}


function render() {
  renderer.render(scene, camera);
  // renderer.render(scene, camera, xrCamera);
  animatePhotons();
  animateEnemyCube(enemyCube);

  TWEEN.update();
  stats.update();
}

function voidblank() {
  init();
  animate();
}

export { voidblank, scene, renderer, render };
