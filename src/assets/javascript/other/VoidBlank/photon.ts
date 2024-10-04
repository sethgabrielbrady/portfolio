import * as THREE from 'three';
import { scene } from './voidBlank';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';
import { updateGameText } from './gameText';

const photonColor = 0xff3b94;

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
const photonSpeed = 0;
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
  const shipRotation = new THREE.Euler(controller.rotation.x, controller.rotation.y, controller.rotation.z);

  // Calculate the direction vector
  const direction = new THREE.Vector3(0, 0, -1); // Assuming photon fires forward along the y-axis

  direction.applyEuler(shipRotation);

  // Set the initial position of the photon to the nose of the ship
  photon.position.copy(controller.position);
  photon.rotation.copy(controller.rotation);


  // Store the photon and its direction
  photons.push({ photon, direction });

  // Schedule removal of the photon
  setTimeout(() => {
    scene.remove(photon);
    photonCount -= 1;
  }, 1500);
  // updateGameText(`photonCount ${photonCount}`, );
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
  });
}

export { firePhoton, animatePhotons };