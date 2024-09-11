import * as THREE from 'three';
import { scene, animate } from './voidBlank';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';
import { updateGameText } from './gameText';


const photonColor = 0xff3b94;
const groundPosition = 0;

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
const photonGeo = new THREE.ConeGeometry( 1, 1, 4 );
const photonMatr = new THREE.MeshPhongMaterial( { color: photonColor, emissive: photonColor, emissiveIntensity: 2, transparent: true, opacity: 0.75  } );
const photonParent = new THREE.Mesh(photonGeo, photonMatr); // Create a new photon
const lightParent = new THREE.PointLight( photonColor, 1, 100 );

lightParent.distance = 50;
lightParent.intensity = 1;
lightParent.decay = .5;
lightParent.castShadow = false;

let photonCount: number = 0;

function firePhoton(controller) {
  updateGameText(controller.position.x)
  if (photonCount >= 3) return;

  photonCount += 1;
  const photon = photonParent.clone();
  const light = lightParent.clone();
  photon.scale.set(0.15,0.15,0.15);
  scene.add(photon);
  scene.add(light);

  // Capture the ship's rotation
  // const shipRotation = new THREE.Euler(controller.rotation.x, controller.rotation.y, controller.rotation.z);

  // Calculate the direction vector
  const direction = new THREE.Vector3(0, 1, 0); // Assuming photon fires forward along the y-axis
  // direction.applyEuler(shipRotation);

  // Set the initial position of the photon to the nose of the ship
  // will need to set photon position to the current controller position
  photon.position.copy(controller.position);

  // Animate the photon
  animatePhoton(photon, direction, light);
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
    scene.remove(light);
  });

  explostionOpacityTween.to({opacity: 0}, 350).start();
  lightTween.to({intensity: 2, decay: .25}, 350).start();
}



// function photonOutofBounds(photon) {
//   const yBounds = photon.position.y >= 100 || photon.position.y <= -100;
//   const xBounds = photon.position.x >= 100 || photon.position.x <= -100;
//   const zBounds = photon.position.z >= 50;
//   return yBounds || xBounds || zBounds;
// }

function animatePhoton(photon, direction, light) {
  function updatePhotonPosition() {
    photon.position.addScaledVector(direction, photonSpeed);
    light.position.addScaledVector(direction, photonSpeed);

    // Continue the animation
    animate(updatePhotonPosition());
  //   if (!photonOutofBounds(photon) ) {
  //     // const photonBox = new THREE.Box3().setFromObject(photon);
  //     // const enemyCubeBox = new THREE.Box3().setFromObject(enemyCube);

  //     // if (photonBox.intersectsBox(enemyCubeBox) && !enemyCube.intersected) {
  //     //   scene.remove(photon);
  //     //   photonCount -= 1;
  //     //   tweenSunScale(enemyCube.position, light);
  //     //   enemyCube.intersected = true;
  //     //   enemyErrorAnimation(enemyCube);

  //     //   if (enemyCount === 1) {
  //     //     enemyCount -= 1;
  //     //     updateGameText(enemyCount);
  //     //   }

  //     //   if (enemyCount === 0) {
  //     //     setTimeout(() => {
  //     //       addEnemyCube();
  //     //       enemyCount += 1;
  //     //       updateGameText(enemyCount);
  //     //     }, 800);
  //     //   }
  //     // } else
  //     if (photon.position.z <= groundPosition) {
  //         // const photonPosition = photon.position;
  //         // tweenSunScale(photonPosition, light);
  //         scene.remove(photon);
  //         photonCount -= 1;
  //       } else {
  //       // how do I update the photon position without using requestAnimationFrame?
  //       animate(updatePhotonPosition());
  //     }
  //   } else {
  //     scene.remove(photon);
  //     scene.remove(light);
  //     photonCount -= 1;
  //   }

  // }
  }
  updatePhotonPosition();

}


export { firePhoton, animatePhoton };