
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';
import { firePhoton } from './ship';
import { ship } from './ship';
import { enemyCube } from './shootfox';
import { translateCamera } from './debug';


let boostReady: Boolean = true;
let continuingFire: Boolean = false;

const shipSpeed: Object = { x:.9};
const brakeSpeed = Number(shipSpeed)/3;
const tweenBrakePosition = new TWEEN.Tween(ship.position);
const tweenBarrelRoll = new TWEEN.Tween(ship.rotation);

const tweenXRotation = new TWEEN.Tween(ship.rotation);
const tweenYRotation = new TWEEN.Tween(ship.rotation);
const tweenXposition = new TWEEN.Tween(ship.position);
const tweenYposition = new TWEEN.Tween(ship.position);
const tweenBoostPosition = new TWEEN.Tween(ship.position);
const tweenBoostSpeed = new TWEEN.Tween(shipSpeed);
const tweenBrakeSpeed = new TWEEN.Tween(brakeSpeed);

const rotationYSpeed = 500;
const rotationXSpeed = 300;
const positionSpeed = 1200;
const barrelRollSpeed = 400


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


function updateBoostTime() {
  if (!boostReady) {
    setTimeout(() => {
      boostReady = true;
    }, 2000);
  }
}


// gamepad controls
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



//keyboard controls
function handleKeyboardControls() {


window.addEventListener( 'keydown', ( event ) => {
  if (event.key === 'p') {
    firePhoton();
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
  }

  if (event.key === 'd') {
    tweenXRotation.stop();
    tweenXposition.stop();

    tweenXRotation.to({z:-0.25}, rotationYSpeed).start();
    tweenXposition.to({x: 20}, positionSpeed).start();
  }

  if (event.key === 'w') {
    tweenYRotation.stop();
    tweenYposition.stop();
    tweenYRotation.to({x: -0.4}, rotationXSpeed).start();
    tweenYposition.to({z: -15}, positionSpeed).start();
  }

  if (event.key === 's') {
    tweenYRotation.stop();
    tweenYposition.stop();
    tweenYRotation.to({x: 0.7}, rotationXSpeed).start();
    tweenYposition.to({z: 15}, positionSpeed).start();
  }
});

window.addEventListener( 'keyup', ( event ) => {
  if (event.key === 'p') {
    continuingFire = false;
  }

  if (event.key === 'r') {
    showHelper = !showHelper;
    // shipHelper.visible = showHelper;
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
  }

  if (event.key === 'w' || event.key === 's') {
    tweenYRotation.stop();
    tweenYRotation.to({x: 0}, rotationXSpeed).start();
    tweenYposition.stop();
    tweenYposition.to({z: 0}, positionSpeed).start();
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

export { handleGamepad, handleKeyboardControls}
