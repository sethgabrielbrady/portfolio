import * as THREE from 'three';

interface IntersectableObject extends THREE.Object3D {
  intersected?: boolean;
}
import { scene, enemyTargetGroup } from './voidBlank';
import type { Scene } from 'three';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';
import { updateGameText } from './gameText';
import { addEnemyCubes, enemyErrorAnimation } from './enemies';

const photonColor = 0xff3b94;

const newLocal = 10;
let currentTargetCount = newLocal;
// reticle
const reticlePoints = [];
reticlePoints.push( new THREE.Vector3( -1, 0, 0 ) );
reticlePoints.push( new THREE.Vector3( 0, 0, 1 ) );
reticlePoints.push( new THREE.Vector3( 1, 0, 0 ) );
reticlePoints.push( new THREE.Vector3( 0, 0, -1 ) );
reticlePoints.push( new THREE.Vector3( -1, 0, 0 ) );

const reticleMat = new THREE.LineBasicMaterial({ color: 0xff0000 });
const reticleGeometry = new THREE.BufferGeometry().setFromPoints( reticlePoints );

const reticle = new THREE.Line( reticleGeometry, reticleMat );
reticle.position.y = 8;


// photon
const photonSpeed = -5;
const photonGeo = new THREE.BoxGeometry( 0.25, 0.25, 0.25 );
const photonMatr = new THREE.MeshPhongMaterial( { color: photonColor, emissive: photonColor, emissiveIntensity: 2, transparent: true, opacity: 0.75  } );
const photonParent = new THREE.Mesh(photonGeo, photonMatr); // Create a new photon
const lightParent = new THREE.PointLight( photonColor, 1, 100 );

lightParent.distance = 50;
lightParent.intensity = 1;
lightParent.decay = .5;
lightParent.castShadow = false;

let photonCount: number = 0;
const photons = [];

function firePhoton(controller) {
  if (photonCount >= 6) return;

  photonCount += 1;

  const photon = photonParent.clone();
  photon.scale.set(0.15, 0.15, 0.15);
  scene.add(photon);

  // Capture the ship's rotation
  const controllerRotation = new THREE.Euler(controller.rotation.x, controller.rotation.y, controller.rotation.z);

  // Calculate the direction vector
  const direction = new THREE.Vector3(0, 0, photonSpeed);
  direction.applyEuler(controllerRotation);


  // Set the initial position of the photon based on the controller
  photon.position.copy(controller.position);
  photon.rotation.copy(controller.rotation);

  // Store the photon and its direction
  photons.push({ photon, direction });

  // Schedule removal of the photon past a certain distance
  setTimeout(() => {
    scene.remove(photon);
    photonCount -= 1;
  }, 1500);
}

const sphereGeo = new THREE.SphereGeometry( 2, 32, 32 );
const sphereMaterial = new THREE.MeshBasicMaterial( {color: photonColor, transparent: true, opacity: 0.5} );
const explosionParent = new THREE.Mesh(sphereGeo, sphereMaterial);
explosionParent.scale.set(0,0,0);


function tweenSunScale(photonPosition, light) {
  explosionParent.material.opacity = 0.5;
  const explosion = explosionParent.clone();

  explosion.position.copy(photonPosition);
  scene.add(explosion);
  light.position.x = photonPosition.x;

  const explosionTween = new TWEEN.Tween(explosion.scale);
  const explostionOpacityTween = new TWEEN.Tween(explosion.material);
  const lightTween = new TWEEN.Tween(light);

  explosionTween.to({x: 3, y: 3, z: 3}, 350).start().onComplete(() => {
    scene.remove(explosion);
  });

  explostionOpacityTween.to({opacity: 0}, 350).start();
  lightTween.to({intensity: 2, decay: .25}, 350).start();

}

function animatePhotons() {
  const speed = 0.4; // Adjust the speed as needed

  photons.forEach(({ photon, direction }) => {
    photon.position.add(direction.clone().multiplyScalar(speed));
    checkPhotonBounds(photon);
    // updateGameText(`Photon Y Position: ${photon.position.y}`);
  })
}

function checkPhotonBounds(photon) {
  if (Math.abs(photon.position.y) <= 0) {
    // Call tweenSunScale function
    updateGameText('hit');
    // const photonPosition = photon.position;
    // explosion animation
    // tweenSunScale(photonPosition, lightParent);
    scene.remove(photon);
  } else if (Math.abs(photon.position.x) >= 100 || Math.abs(photon.position.z) >= 100) {
    //  updateGameText(`Checking photon position: ${photon.position.x}, ${photon.position.y}, ${photon.position.z}`);
    scene.remove(photon);
  } else {
    checkPhotonIntersection(photon);
  }
}

function checkPhotonIntersection(photon) {
  const photonBox = new THREE.Box3().setFromObject(photon);
  // this is fine for testing but will need to be updated with an array of intersectable objects

  const enemyCubes = enemyTargetGroup.children;
  enemyCubes.forEach((enemyCube) => {
    const enemyCubeBox = new THREE.Box3().setFromObject(enemyCube);

    if (photonBox.intersectsBox(enemyCubeBox) && !(enemyCube as IntersectableObject).intersected) {
      scene.remove(photon);
      currentTargetCount -= 1;
      photonCount -= 1;
      updateGameText(`Target count =  ${currentTargetCount}`);
      // tweenSunScale(enemyCube.position, lightParent);
      enemyErrorAnimation(enemyCubes, enemyCube);
      (enemyCube as IntersectableObject).intersected = true;
      checkTargetCount(currentTargetCount);
    }
  });
}

function checkTargetCount(count) {
  if (count === 0) {
    updateGameText('You win!');
    currentTargetCount = newLocal;
    addEnemyCubes(newLocal);
  }
}

export { firePhoton, animatePhotons };