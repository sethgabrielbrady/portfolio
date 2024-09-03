import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';
import { landscapeGroup, cubeGroupContainer, animateModel, animateBuildingGroupY, largeSphere} from '@js/other/Shootfox/models.ts';
// import { createAxisHelper } from '@js/other/Shootfox/axisHelper.ts';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { ship, shipMeshFront, firePhoton } from '@js/other/Shootfox/ship.ts';
import { EnemyCube, animateEnemyCube} from '@js/other/Shootfox/enemies.ts';


let boostReady: Boolean = true;
let showHelper: Boolean = false;
let camera = new THREE.Camera();
let renderer: THREE.WebGLRenderer
let delta: Number = 0;
let cockpitCamera: Boolean = false;
let showEnemeies: Boolean = true;
let continuingFire: Boolean = false;

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
  const brakeSpeed = shipSpeed/3;
  const tweenBrakePosition = new TWEEN.Tween(ship.position);
  const tweenBarrelRoll = new TWEEN.Tween(ship.rotation);

  const tweenBrakeSpeed = new TWEEN.Tween(brakeSpeed);
  const rotationYSpeed = 500;
  const rotationXSpeed = 300;
  const positionSpeed = 1200;
  const barrelRollSpeed = 400
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

  let gp: Gamepad | null = null;
  window.addEventListener("gamepadconnected", (event) => {
    gp = navigator.getGamepads()[event.gamepad.index];
  });

  let previousFireButtonState = false;
  let previousBoostButtonState = false;
  let previousBrakeButtonState = false;
  let previousBarrelRollButtonStateL = false;
  let previousBarrelRollButtonStateR = false;
  let bRollCount = 0;
  const holdingLButtonState = false;

  function handleGamepad() {
    if (gp) {
      // Update the gamepad state
      gp = navigator.getGamepads()[gp.index];

      // Read axes for ship controls
      const leftStickX = gp.axes[0]; // Horizontal movement
      const leftStickY = gp.axes[1]; // Vertical movement

      // Apply ship controls
      const stickPosSpeed = positionSpeed/12;
      const stickRotYSpeed = rotationYSpeed/12;
      const stickRotSpeed = rotationXSpeed/12;
      if (leftStickX < -0.5) {
        tweenXRotation.stop();
        tweenXposition.stop();
        tweenXRotation.to({z: 0.25}, stickRotYSpeed).start();
        tweenXposition.to({x: -20}, stickPosSpeed).start();
      } else if (leftStickX > 0.5) {
        tweenXRotation.stop();
        tweenXposition.stop();
        tweenXRotation.to({z: -0.25}, stickRotYSpeed).start();
        tweenXposition.to({x: 20}, stickPosSpeed).start();
      } else {
        tweenXRotation.stop();
        tweenXRotation.to({z: 0}, stickRotYSpeed).start();
        tweenXposition.stop();
        tweenXposition.to({x: 0}, stickPosSpeed).start();
      }

      if (leftStickY < -0.5) {
        tweenYRotation.stop();
        tweenYposition.stop();
        tweenYRotation.to({x: -0.4}, stickRotSpeed).start();
        tweenYposition.to({z: -15}, stickPosSpeed).start();
      } else if (leftStickY > 0.5) {
        tweenYRotation.stop();
        tweenYposition.stop();
        tweenYRotation.to({x: 0.7}, stickRotSpeed).start();
        tweenYposition.to({z: 15}, stickPosSpeed).start();
      } else {
        tweenYRotation.stop();
        tweenYRotation.to({x: 0}, stickRotSpeed).start();
        tweenYposition.stop();
        tweenYposition.to({z: 0}, stickPosSpeed).start();
      }

      const barrelRollButtonStateL = gp.buttons[4].pressed;

      if (barrelRollButtonStateL && !previousBarrelRollButtonStateL) {
        bRollCount +=1;
        if (bRollCount === 2)  {
          tweenBarrelRoll.to({y: -6.3}, barrelRollSpeed).start();
          setTimeout(() => {
            tweenBarrelRoll.stop();
            ship.rotation.y = 0;
            bRollCount = 0;
          }, barrelRollSpeed);
        } else {
          setTimeout(() => {
            bRollCount = 0;
          }, 300);
          tweenBarrelRoll.to({y: -1.2}, barrelRollSpeed).start();
        }
      } else if (!barrelRollButtonStateL && previousBarrelRollButtonStateL) {
        tweenBarrelRoll.stop();
        tweenBarrelRoll.to({y: 0}, barrelRollSpeed).start()
      }
      previousBarrelRollButtonStateL = barrelRollButtonStateL;

      const barrelRollButtonStateR = gp.buttons[5].pressed;
      if (barrelRollButtonStateR && !previousBarrelRollButtonStateR) {
        bRollCount +=1;
        if (bRollCount === 2 ) {
          tweenBarrelRoll.to({y: 6.3}, barrelRollSpeed).start();
          setTimeout(() => {
            tweenBarrelRoll.stop();
            ship.rotation.y = 0;
            bRollCount = 0;
          }, barrelRollSpeed);
        } else {
          setTimeout(() => {
            bRollCount = 0;
          }, 300);
          tweenBarrelRoll.to({y: 1.2}, barrelRollSpeed).start();
        }
      } else if (!barrelRollButtonStateR && previousBarrelRollButtonStateR) {
        tweenBarrelRoll.stop();
        tweenBarrelRoll.to({y: 0}, barrelRollSpeed).start();
      }
      previousBarrelRollButtonStateR = barrelRollButtonStateR;


      const brakeButtonState = gp.buttons[0].pressed;
      if (brakeButtonState && !previousBrakeButtonState) {
        tweenBoostPosition.to({y: -4}, positionSpeed).start();
        tweenBrakeSpeed.to({x: 6.0}, 3000).start();
      } else if (!brakeButtonState && previousBrakeButtonState) {
        tweenBrakePosition.stop();
        tweenBrakePosition.to({y: 0}, positionSpeed).start();
        tweenBrakeSpeed.stop();
        tweenBrakeSpeed.to({x: .75}, 1000).start();
      }
      previousBrakeButtonState = brakeButtonState;

      const boostButtonState = gp.buttons[1].pressed;
      if (boostButtonState && !previousBoostButtonState && boostReady) {
        boostReady = false;
        tweenBoostPosition.to({y: 15}, positionSpeed).start();
        tweenBoostSpeed.to({x: 6.0}, 3000).start();
        updateBoostTime();
      } else if (!boostButtonState && previousBoostButtonState) {
        tweenBoostPosition.stop();
        tweenBoostPosition.to({y: 0}, positionSpeed).start();
        tweenBoostSpeed.stop();
        tweenBoostSpeed.to({x: .75}, 1000).start();
      }
      previousBoostButtonState = boostButtonState;


      const currentFireButtonState = gp.buttons[2].pressed;
      if (currentFireButtonState && !previousFireButtonState) {
        firePhoton();
      } else if (!currentFireButtonState && previousFireButtonState) {
        continuingFire = false
        console.log('Button released');
      }
      previousFireButtonState = currentFireButtonState;
    } else {
      // console.log('No gamepad detected');
    }
    requestAnimationFrame(handleGamepad);
  }
  requestAnimationFrame(handleGamepad);


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
      } else {
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

export { shootfox, scene, enemyCube, addEnemyCube };


