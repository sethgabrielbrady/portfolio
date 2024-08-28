import * as THREE from 'three';
import { scene, enemyCube, addEnemyCube } from '@/assets/javascript/other/Shootfox/shootfox.ts';
import { ground } from '@js/other/Shootfox/models.ts';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';
import { enemyErrorAnimation } from '@js/other/Shootfox/enemies.ts';

// const shipColor = 0xf000ff;
// const photonColor = 0xff3b94;
// const wingColor = 0x99007d;
const shipColor = 0x00ffbc;
const photonColor = 0xff3b94;
const wingColor = 0x00ffbc;



// Ship
const radius = 4;
const height = 5;
const shipGeo = new THREE.CylinderGeometry(0, radius/4, height, 3, 1)
const shipMatr = new THREE.MeshPhongMaterial( { color: shipColor, flatShading: true, emissive: shipColor, emissiveIntensity: .6, transparent: true, opacity: 0.8 } );
const shipMatr2 = new THREE.MeshPhongMaterial( { color: photonColor, flatShading: true, emissive: shipColor, emissiveIntensity: .6, transparent: true, opacity: 0.8 } );



const cockpitWindowMatr = new THREE.MeshPhongMaterial( { color: 0x999999, flatShading: true, opacity: 0.5 } );
const cockpitWindow = new THREE.Mesh( shipGeo, cockpitWindowMatr );
cockpitWindow.scale.set(0.5, 0.5, 0.5);
cockpitWindow.position.z = 0.25;
cockpitWindow.position.y = 0.1;


const shipMeshFront = new THREE.Mesh( shipGeo, shipMatr2 );
shipMeshFront.name = "shipMeshFront";
shipMeshFront.scale.set(1, 1.25, 1);


shipMeshFront.receiveShadow = false;
shipMeshFront.castShadow = true;
const shipMeshRear = new THREE.Mesh( shipGeo, shipMatr );
shipMeshRear.rotateOnAxis( new THREE.Vector3( 0, 0, 1 ), Math.PI );
shipMeshRear.position.y = -5;
shipMeshRear.scale.set(1, 0.75, 1);
shipMeshRear.receiveShadow = false;
shipMeshRear.castShadow = true;

const wingGroupL = new THREE.Group();
const wingGroupR = new THREE.Group();
const wingMatr = new THREE.MeshPhongMaterial( { color: wingColor, flatShading: true, emissive: shipColor, emissiveIntensity: .6, transparent: true, opacity: 0.9} );


const wingXyScale = 0.6;
const shipWingLRear: THREE.Mesh = new THREE.Mesh( shipGeo, wingMatr );
shipWingLRear.position.x = 2.5;
shipWingLRear.scale.set(wingXyScale, 0.25, wingXyScale);
shipWingLRear.receiveShadow = false;
shipWingLRear.castShadow = true;

const shipWingRRear: THREE.Mesh = new THREE.Mesh( shipGeo, wingMatr );
shipWingRRear.position.x = -2.5;
shipWingRRear.scale.set(wingXyScale, 0.25, wingXyScale);
shipWingRRear.receiveShadow = false;
shipWingRRear.castShadow = true;

const shipWingLFront: THREE.Mesh = new THREE.Mesh( shipGeo, wingMatr );
shipWingLFront.rotateOnAxis( new THREE.Vector3( 0, 0, 1 ), Math.PI );
shipWingLFront.position.x = 2.5;
shipWingLFront.position.y = -2.5
shipWingLFront.scale.set(wingXyScale, 0.75, wingXyScale);
shipWingLFront.receiveShadow = false;
shipWingLFront.castShadow = true;

const shipWingRFront: THREE.Mesh = new THREE.Mesh( shipGeo, wingMatr );
shipWingRFront.rotateOnAxis( new THREE.Vector3( 0, 0, 1 ), Math.PI );
shipWingRFront.position.x = -2.5;
shipWingRFront.position.y = -2.5
shipWingRFront.scale.set(wingXyScale, 0.75, wingXyScale);
shipWingRFront.receiveShadow = false;
shipWingRFront.castShadow = true;

wingGroupL.add(shipWingLRear);
wingGroupL.add(shipWingLFront);
wingGroupR.add(shipWingRRear);
wingGroupR.add(shipWingRFront);

wingGroupL.position.x = -1.1;
wingGroupL.position.y = -4
wingGroupL.rotation.z = Math.PI / 5;

wingGroupR.position.x = 1.1;
wingGroupR.position.y = -4
wingGroupR.rotation.z = Math.PI / -5;
const wingGroupCombined = new THREE.Group();
wingGroupCombined.add(wingGroupL, wingGroupR);



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

const ship = new THREE.Group();


// const shipPartTestGeo = new THREE.BoxGeometry( 0.5, 3, 0.5 );
// const shipPartTestGeo = new THREE.CylinderGeometry( 0.5, 0.5, 3, 3 );
const shipPartTestMatr = new THREE.MeshPhongMaterial( { color: 0xff00aa, emissive: 0xff00aa, emissiveIntensity: 10, transparent: true, opacity: 0.5} );
const shipPartTest = new THREE.Mesh( shipGeo, shipPartTestMatr );
shipPartTest.scale.set(0.5, 0.5, 0.5);
const shipPartTestFront = shipPartTest.clone();
shipPartTestFront.position.y = 0;
shipPartTestFront.position.z = -0.35;
shipPartTestFront.rotateOnAxis( new THREE.Vector3( 1, 0, 0 ), Math.PI*2 );
shipPartTestFront.scale.set(0.5, 0.5, 0.5);
shipPartTest.rotateOnAxis( new THREE.Vector3( 1, 0, 0 ), Math.PI );
shipPartTest.position.y = -3;
shipPartTest.position.z = -0.35;
const shipPartTestGroup = new THREE.Group();
shipPartTestGroup.add(shipPartTest, shipPartTestFront);

ship.add( shipMeshFront, shipMeshRear, wingGroupCombined, reticle, shipPartTestGroup, cockpitWindow );


// photon
const photonSpeed = 2;
const photonGeo = new THREE.ConeGeometry( 1, 1, 4 );
const photonMatr = new THREE.MeshPhongMaterial( { color: photonColor, emissive: photonColor, emissiveIntensity: 2, transparent: true, opacity: 0.75  } );
const photonParent = new THREE.Mesh(photonGeo, photonMatr); // Create a new photon

const lightParent = new THREE.PointLight( photonColor, 1, 100 );
lightParent.distance = 50;
lightParent.intensity = 1;
lightParent.decay = .5;
// lightParent.castShadow = true;
// lightParent.position.copy(photonParent.position);


let photonCount: number = 0;

function firePhoton() {

  photonCount += 1;
  const photon = photonParent.clone();
  const light = lightParent.clone();
  photon.scale.set(0.5,0.5,0.5);
  scene.add(photon);
  scene.add(light);

  // Capture the ship's rotation
  const shipRotation = new THREE.Euler(ship.rotation.x, ship.rotation.y, ship.rotation.z);

  // Calculate the direction vector
  const direction = new THREE.Vector3(0, 1, 0); // Assuming photon fires forward along the y-axis
  direction.applyEuler(shipRotation);

  // Set the initial position of the photon to the nose of the ship
  photon.position.copy(ship.position);

  // Animate the photon
  animatePhoton(photon, direction, light);
  // animatePhoton(light, direction);
}

const sphereGeo = new THREE.SphereGeometry( 2, 32, 32 );
const sphereMaterial = new THREE.MeshBasicMaterial( {color: photonColor, transparent: true, opacity: 0.5} );
const explosionParent = new THREE.Mesh(sphereGeo, sphereMaterial);
explosionParent.scale.set(0,0,0);


function tweenSunScale(photonPosition, light) {
  // this.light = light;
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



function photonOutofBounds(photon) {
  const yBounds = photon.position.y >= 100 || photon.position.y <= -100;
  const xBounds = photon.position.x >= 100 || photon.position.x <= -100;
  const zBounds = photon.position.z >= 50;
  return yBounds || xBounds || zBounds;
}

function animatePhoton(photon, direction, light) {
  function updatePhotonPosition() {
    photon.position.addScaledVector(direction, photonSpeed);
    light.position.addScaledVector(direction, photonSpeed);

    // Continue the animation
    if (!photonOutofBounds(photon, light) ) {
      const photonBox = new THREE.Box3().setFromObject(photon);
      const enemyCubeBox = new THREE.Box3().setFromObject(enemyCube);

      if (photonBox.intersectsBox(enemyCubeBox)) {
        scene.remove(photon);
        photonCount -= 1;
        tweenSunScale(enemyCube.position, light);
        enemyErrorAnimation();

        setTimeout(() => {
          scene.remove(enemyCube);
          addEnemyCube();
        }, 800);
      } else if (photon.position.z <= ground.position.z) {
          const photonPosition = photon.position;
          tweenSunScale(photonPosition, light);
          scene.remove(photon);
        } else {
        requestAnimationFrame(updatePhotonPosition);
      }
    } else {
      scene.remove(photon);
      scene.remove(light);
      photonCount -= 1;
    }

  }
  updatePhotonPosition();
}


export { ship, shipMeshFront , firePhoton};