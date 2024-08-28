import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';
import { landscapeGroup, cubeGroupContainer, animateModel, animateBuildingGroupY, largeSphere} from '@js/other/Shootfox/models.ts';
import { createAxisHelper } from '@js/other/Shootfox/axisHelper.ts';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { ship, shipMeshFront, firePhoton } from '@js/other/Shootfox/ship.ts';
import { EnemyCube, animateEnemyCube, addCubes, animateEnemyCubes} from '@js/other/Shootfox/enemies.ts';
import { VRButton } from 'three/examples/jsm//webxr/VRButton.js';



let boostReady: Boolean = true;
let showHelper: Boolean = false;
let camera = new THREE.Camera();
let renderer: THREE.WebGLRenderer

let delta: Number = 0;
let cockpitCamera: Boolean = false;
let showEnemeies: Boolean = true;
let enemyCubeCount = 0;
let continuingFire: Boolean = false;
let cubes = {};

const clock: THREE.Clock = new THREE.Clock();
const scene: THREE.Scene = new THREE.Scene();
const interval: number = 1/60;
const shipSpeed: Object = { x:.9};

const stats = new Stats();
document.body.appendChild(stats.dom);


let translateCount = 0;
function translateCamera() {
  if (translateCount === 3) {
    translateCount = 0;
  }
  if (translateCount === 0) {
    camera.position.set( 0, -12, 0 )
  } else if (translateCount === 1) {
    camera.position.set( 20, 0, 0 );
  } else if (translateCount === 2) {
    camera.position.set( 0, 0, 20 );
  }

  translateCount +=1;
  camera.rotation.x = Math.PI;
  camera.rotation.z = Math.PI;
  camera.lookAt( scene.position );
}

function updateBoostTime() {
  if (!boostReady) {
    setTimeout(() => {
      boostReady = true;
    }, 2000);
  }
}

let enemyCube = new EnemyCube();
function addEnemyCube() {
  enemyCube = new EnemyCube();
  scene.add(enemyCube);
  enemyCubeCount += 1;
}


// const backgroundColor: number = 0x555555;
// const backgroundColor: number = 0xdddddd;
const backgroundColor: number = 0x222222;
let xrCamera = null;
function init() {
  scene.background = new THREE.Color( backgroundColor );

  // scene additions
  // landscape
  scene.add(landscapeGroup);
  // // ship
  scene.add(ship);
  // const shipHelper = createAxisHelper(ship);
  // scene.add(shipHelper);
  // adds axis helper
//  shipHelper.visible = showHelper;

  // // cubeGroupContainer
  scene.add(cubeGroupContainer);
  scene.add(enemyCube);
  cubes = addCubes(5);
  console.log('enemyCube', enemyCube);
  // const enemyHelper = createAxisHelper(enemyCube);
  // scene.add(enemyHelper);
  scene.add(largeSphere);



  enemyCubeCount += 1;

  const aspect: number = (window.innerWidth / window.innerHeight);

  camera = new THREE.PerspectiveCamera( 100, aspect, 1 );
  camera.position.set( 0, -12, 0 ); // all components equal
  camera.lookAt( scene.position ); // or the origin


  // renderer.xr.updateCamera( camera );
  //  xrCamera.position.x = camera.position.x ;
  //  xrCamera.position.y = camera.position.y ;
  //  xrCamera.position.z = camera.position.z;

  // scene.add( new THREE.HemisphereLight( 0xffffff, 0x000000, 1 ) );
  const ambientLight = new THREE.AmbientLight( 0xffffff, 0.025 );
  scene.add( ambientLight );

  const directionLight = new THREE.DirectionalLight( 0xffffff, 1 );
  directionLight.position.set( 0, 0, 3 );
  directionLight.rotateOnAxis( new THREE.Vector3( 0, 1, -1 ), Math.PI/2  );
  // directionLight.target.position.set( 0, 0, -1 );

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

  renderer.xr.enabled = true;
  renderer.xr.cameraAutoUpdate = true;

  xrCamera = renderer.xr.getCamera();
  xrCamera.position.copy( camera.position );
  xrCamera.rotation.copy( camera.rotation );
  xrCamera.rotateOnAxis( new THREE.Vector3( 0, 1, 0 ), Math.PI );
  scene.add(xrCamera);
  // xrCamera = new THREE.PerspectiveCamera( 100, aspect, 1 );
  // xrCamera.position.set( -12, -12, 0 );
  // xrCamera.lookAt( scene.position );



  // xrCamera.position.x = camera.position.x ;
  // xrCamera.position.y = camera.position.y ;
  // xrCamera.position.z = camera.position.z;




  const orbitControls = new OrbitControls(camera, renderer.domElement)
  orbitControls.enabled = false;
  orbitControls.enableRotate = true;
  orbitControls.keyPanSpeed = 60.0 // magic number
  orbitControls.enableZoom = true

  const container: HTMLElement = document.getElementById("shootfox")!;
  container.appendChild(renderer.domElement);
  const sessionInit = {
    // requiredFeatures: [ 'hand-tracking' ]
  };

  // WebXr entry point
  container.appendChild(VRButton.createButton(renderer, sessionInit ));


  //ship tween and controls
  const tweenCameraRotation = new TWEEN.Tween(camera.rotation);
  const tweenCameraPositionX = new TWEEN.Tween(camera.position);
  const tweenCameraPositionZ = new TWEEN.Tween(camera.position);
  const tweenXRotation = new TWEEN.Tween(ship.rotation);
  const tweenYRotation = new TWEEN.Tween(ship.rotation);
  const tweenXposition = new TWEEN.Tween(ship.position);
  const tweenYposition = new TWEEN.Tween(ship.position);
  const tweenBoostPosition = new TWEEN.Tween(ship.position);
  const tweenBoostSpeed = new TWEEN.Tween(shipSpeed);
  const rotationYSpeed = 500;
  const rotationXSpeed = 300;
  const positionSpeed = 1200;

  const cockpitZ = 1.25;
  const cockpitY = -1.25;


  function continueFire() {
    if(continuingFire) {
      firePhoton();
      setTimeout(() => {
        continueFire();
      }, 400);
    }
  }

  window.addEventListener( 'keydown', ( event ) => {
    if (event.key === 'p') {
      firePhoton();
      // continuingFire = true;
      // firePhoton();
      // continueFire();
    }

    if (event.key === 'l') {
      cockpitCamera = !cockpitCamera;
      if (cockpitCamera) {
        camera.position.set( 0, cockpitY, cockpitZ );
        shipMeshFront.scale.set(1.75, 2.25, 1.75);
        shipMeshFront.position.z = 0 - 0.9;
        shipMeshFront.position.y = 4;
      } else {
        camera.position.set( 0, -12, 0 );
        shipMeshFront.scale.set(1, 1, 1);
        shipMeshFront.position.z = 0;
        shipMeshFront.position.y = -.65;
      }
    }


    if (event.key === 'm' && boostReady) {
      boostReady = false;
      tweenBoostPosition.to({y: 15}, positionSpeed).start();
      tweenBoostSpeed.to({x: 6.0}, 3000).start();
      updateBoostTime();
    }

    if (event.key === 'a') {
      tweenXRotation.stop();
      tweenXposition.stop();
      tweenXRotation.to({z: 0.25}, rotationYSpeed).start();
      tweenXposition.to({x: -20}, positionSpeed).start();

      if (cockpitCamera) {
        tweenCameraPositionX.stop();
        tweenCameraRotation.stop();
        tweenCameraPositionX.to({x: -9.7}, positionSpeed).start();
        tweenCameraRotation.to({z: -1.5}, rotationYSpeed*10).start();
      }
    }

    if (event.key === 'd') {
      tweenXRotation.stop();
      tweenXposition.stop();

      tweenXRotation.to({z:-0.25}, rotationYSpeed).start();
      tweenXposition.to({x: 20}, positionSpeed).start();

      if (cockpitCamera) {
        tweenCameraPositionX.stop();
        tweenCameraRotation.stop();
        tweenCameraPositionX.to({x: 9.7}, positionSpeed).start();
        tweenCameraRotation.to({z: 1.5}, rotationYSpeed*10).start();
      }
    }

    if (event.key === 'w') {
      tweenYRotation.stop();
      tweenYposition.stop();
      tweenYRotation.to({x: -0.4}, rotationXSpeed).start();
      tweenYposition.to({z: -15}, positionSpeed).start();


      if (cockpitCamera) {
        tweenCameraPositionZ.stop();
        tweenCameraPositionZ.to({z: -9.7}, positionSpeed).start();
      }
    }

    if (event.key === 's') {
      tweenYRotation.stop();
      tweenYposition.stop();
      tweenYRotation.to({x: 0.7}, rotationXSpeed).start();
      tweenYposition.to({z: 15}, positionSpeed).start();

      if (cockpitCamera) {
        tweenCameraPositionZ.stop();
        tweenCameraPositionZ.to({z: 5.7}, positionSpeed).start();
      }
    }
  });

  window.addEventListener( 'keyup', ( event ) => {

    if (event.key === 'p') {
      continuingFire = false;
    }

    if (event.key === 'r') {
      showHelper = !showHelper;
      shipHelper.visible = showHelper;
    }

    if (event.key === 'c') {
      translateCamera();
    }

    if (event.key === 'o') {
      orbitControls.enabled = !orbitControls.enabled;
    }

    if (event.key === 'a' || event.key === 'd') {
      tweenXRotation.stop();
      tweenXRotation.to({z: 0}, rotationYSpeed).start();
      tweenXposition.stop();
      tweenXposition.to({x: 0}, positionSpeed).start();


      if (cockpitCamera) {
        tweenCameraPositionX.stop();
        tweenCameraRotation.stop();
        tweenCameraPositionX.to({x: 0}, positionSpeed).start();
        tweenCameraRotation.to({z: 0}, rotationYSpeed).start();
      }
    }

    if (event.key === 'w' || event.key === 's') {
      tweenYRotation.stop();
      tweenYRotation.to({x: 0}, rotationXSpeed).start();
      tweenYposition.stop();
      tweenYposition.to({z: 0}, positionSpeed).start();

      if (cockpitCamera) {
      tweenCameraPositionZ.stop();
      tweenCameraPositionZ.to({z: cockpitZ}, positionSpeed).start();
      }
    }

    if (event.key === 'm') {
      tweenBoostPosition.stop();
      tweenBoostPosition.to({y: 0}, positionSpeed).start();
      tweenBoostSpeed.stop();
      tweenBoostSpeed.to({x: .75}, 1000).start();
    }

    if (event.key === 'k') {
      showEnemeies = !showEnemeies;
      if (!showEnemeies) {
       scene.remove(enemyCube);
       enemyCubeCount = 0;
      } else {
        enemyCubeCount += 1;
        enemyCube = new EnemyCube();
        scene.add(enemyCube);
      }
    }
  });
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
  // renderer.render( scene, camera );


  // setAnimationLoop is required for VR
  renderer.setAnimationLoop( function () {
    renderer.render( scene, camera, xrCamera );
    animateModel(cubeGroupContainer, shipSpeed);
    animateBuildingGroupY(shipSpeed);
    animateEnemyCube();
    animateEnemyCubes(cubes);


    TWEEN.update();
    stats.update();
  } );

  // animateModel(cubeGroupContainer, shipSpeed);
  // animateBuildingGroupY(shipSpeed);
  // animateEnemyCube();
  // animateEnemyCubes(cubes);


  // TWEEN.update();
  // stats.update();



}

function shootfox() {
  init();
  animate();
}

export { shootfox, scene, enemyCube, addEnemyCube };


