import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm//webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { World } from 'three/examples/jsm//libs/ecsy.module.js';
import { heartMesh } from './worldMesh.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import  { updateGameText } from './gameText.js';
import { firePhoton, animatePhotons} from './ship.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';


// 1 unit = 1 real world meter
// average human height = 1.6m

let camera, renderer, scene;
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
  camera.position.set( 0, 1.6, 3 );
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
  const human = {
    scale: 0.0072,
    path: 'models/human.glb',
    position: { x: -3.75, y: 1.6, z: -1 },
    rotation: { x: 0, y:Math.PI/2, z: 0 }
  }
  loadModel(human);
  // heart
  scene.add(heartMesh);




  // WebXr entry point
  container.appendChild(VRButton.createButton( renderer ));
  renderer.xr.enabled = true;

  // const sessionInit = { optionalFeatures: [ 'local-floor', 'bounded-floor', 'hand-tracking' ] };

  // if (navigator.xr) {
  //   navigator.xr.requestSession( 'immersive-vr', sessionInit ).then( onSessionStarted );
  //   const session = await navigator.xr.requestSession('immersive-vr', sessionInit);
  //   await renderer.xr.setSession(session);

  // } else {
  //   console.error("WebXR is not supported in this browser.");
  // }

  // async function onSessionStarted( session ) {
  //   renderer.setSize(window.innerWidth, window.innerHeight);
  //   await renderer.xr.setSession( session );
  //   scene.remove( camera );
  //   camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.2, 200 );
  //   camera.position.set( 0, 1.6, 3 );
  //   const xrCamera = renderer.xr.getCamera( camera );
  //   scene.add( xrCamera );
  // }


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
  const controller1 = renderer.xr.getController( 0 );
  const controller2 = renderer.xr.getController( 1 );

  //left
  controller1.addEventListener( 'connected',  ( event ) => {
    controller1.add( buildController( event.data ) );
  } );

  controller1.addEventListener( 'disconnected',  () => {
    controller1.remove( controller1.children[ 0 ] );
  } );


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

  scene.add( controller1, controller2 );
  updateGameText("Controllers are ready");

  const controllerModelFactory = new XRControllerModelFactory();
  const controllerGrip1 = renderer.xr.getControllerGrip( 0 );
  controllerGrip1.add( controllerModelFactory.createControllerModel( controllerGrip1 ) );
  scene.add( controllerGrip1 );

  const controllerGrip2 = renderer.xr.getControllerGrip( 1 );
  controllerGrip2.add( controllerModelFactory.createControllerModel( controllerGrip2 ) );
  scene.add( controllerGrip2 );


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
  // const controllerGeo= new THREE.BoxGeometry( 0.125,0.125,0.125);
  // const controllerMaterial = new THREE.MeshPhongMaterial({color: 0xff0000, transparent: false});
  // const controllerMesh = new THREE.Mesh( controllerGeo, controllerMaterial );
  const threeObject = new THREE.Object3D();
  // threeObject.add( controllerMesh );
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
  const delta = clock.getDelta();
  const elapsedTime = clock.elapsedTime;
  renderer.xr.updateCamera(camera);
  // world.execute(delta, elapsedTime);
  renderer.render(scene, camera);
  animatePhotons();
  TWEEN.update();
  stats.update();
}

function voidblank() {
  init();
  animate();
}

export { voidblank, scene, renderer, render };
