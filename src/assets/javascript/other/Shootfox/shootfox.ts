import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';
import { landscapeGroup, cubeGroupContainer, animateModel, animateBuildingGroupY} from '@js/other/Shootfox/models.ts';
import { axisGroup } from '@js/other/Shootfox/axisHelper.ts';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { ship, shipMeshFront, firePhoton } from '@js/other/Shootfox/ship.ts';
import { enemyCube , animateEnemyCube} from '@js/other/Shootfox/enemies.ts';


let boostReady: Boolean = true;
let showHelper: Boolean = false;
let camera = new THREE.Camera();
let renderer: THREE.WebGLRenderer
let delta: Number = 0;
let cockpitCamera: Boolean = false;
let showEnemeies: Boolean = true;

const clock: THREE.Clock = new THREE.Clock();
const scene: THREE.Scene = new THREE.Scene();
const interval: number = 1/60;
const shipSpeed: Object = { x:.9};
const stats = new Stats();
document.body.appendChild(stats.dom);


// scene additions
// landscape
scene.add(landscapeGroup);
// ship
scene.add(ship);
// adds axis helper
axisGroup.visible = showHelper;
scene.add(axisGroup);
// cubeGroupContainer
scene.add( cubeGroupContainer );
//skylineGroup
// scene.add( skylineGroup );
// enemyCube
scene.add( enemyCube );

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



function init() {
  scene.background = new THREE.Color( 0x000000 );

  const aspect: number = (window.innerWidth / window.innerHeight);

  camera = new THREE.PerspectiveCamera( 100, aspect, 1 );
  camera.position.set( 0, -12, 0 ); // all components equal
  camera.lookAt( scene.position ); // or the origin

  // scene.add( new THREE.HemisphereLight( 0xffffff, 0x000000, 1 ) );
  const ambientLight = new THREE.AmbientLight( 0xffffff, 0.5 );
  scene.add( ambientLight );


  const directionLight = new THREE.DirectionalLight( 0xffffff, 1 );
  directionLight.position.set( 0, 0, 3 );
  directionLight.rotateOnAxis( new THREE.Vector3( 0, 0, 1 ), Math.PI / 2 );
  // directionLight.target.position.set( 0, 1, 0 );

  directionLight.castShadow = true;
  directionLight.shadow.mapSize.width = 1024;
  directionLight.shadow.mapSize.height = 1024;
  directionLight.shadow.camera.near = 0.5;
  directionLight.shadow.camera.far = 500;
  directionLight.shadow.camera.left = -20;
  directionLight.shadow.camera.right = 20;
  directionLight.shadow.camera.top = 20;
  directionLight.shadow.camera.bottom = -5;
  //const helper = new THREE.CameraHelper( directionLight.shadow.camera );
  //scene.add( helper );
  scene.add( directionLight );

  // const helper1 = new THREE.CameraHelper( segmentDirectionLight.shadow.camera );
  // scene.add( helper1 );
  // const helper2 = new THREE.CameraHelper( segmentDirectionLight2.shadow.camera );
  // scene.add( helper2 );
  // scene.add( segmentDirectionLight );
  // scene.add( segmentDirectionLight2 );


  renderer = new THREE.WebGLRenderer( {
    antialias: true,
    alpha: true,
    precision: "lowp",
    powerPreference: "low-power",
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

  window.addEventListener( 'keydown', ( event ) => {
    if (event.key === 'p') {
      firePhoton();
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
      tweenXRotation.to({z: 1}, rotationYSpeed).start();
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

      tweenXRotation.to({z: -1}, rotationYSpeed).start();
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
    if (event.key === 'r') {
      showHelper = !showHelper;
      axisGroup.visible = showHelper;
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
      } else {
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
  renderer.render( scene, camera );

  animateModel(cubeGroupContainer, shipSpeed);
  animateBuildingGroupY(shipSpeed);
  // animateEnemyCube();


  TWEEN.update();
  stats.update();
}

function shootfox() {
  init();
  animate();
}

export { shootfox, scene};


