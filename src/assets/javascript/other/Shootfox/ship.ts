import * as THREE from 'three';
import { scene } from '@/assets/javascript/other/Shootfox/shootfox.ts';
import { ground } from '@js/other/Shootfox/models.ts';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';
import { enemyCube, enemyErrorAnimation } from '@js/other/Shootfox/enemies.ts';


const shipColor = 0xf000ff;
const photonColor = 0xff3b94;

// Ship
const radius = 4;
const height = 5;
const shipGeo = new THREE.CylinderGeometry(0, radius/4, height, 3, 1)
const shipMatr = new THREE.MeshLambertMaterial( { color: shipColor } );
const shipMeshFront = new THREE.Mesh( shipGeo, shipMatr );

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
const wingMatr = new THREE.MeshPhongMaterial( { color: shipColor } );


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

ship.add( shipMeshFront, shipMeshRear, wingGroupL, wingGroupR, reticle);


// photon
const photonSpeed = 2;
const photonGeo = new THREE.ConeGeometry( 1, 1, 4 );
const photonMatr = new THREE.MeshBasicMaterial( { color: photonColor} );
let photonCount: Number = 0;

function firePhoton() {
  const photon = new THREE.Mesh(photonGeo, photonMatr); // Create a new photon
  photon.scale.set(.5,.5,.5);
  scene.add(photon);

  // Capture the ship's rotation
  const shipRotation = new THREE.Euler(ship.rotation.x, ship.rotation.y, ship.rotation.z);

  // Calculate the direction vector
  const direction = new THREE.Vector3(0, 1, 0); // Assuming photon fires forward along the y-axis
  direction.applyEuler(shipRotation);

  // Set the initial position of the photon to the nose of the ship
  photon.position.copy(ship.position);

  // Animate the photon
  animatePhoton(photon, direction);
}

function tweenSunScale(photonPosition) {
  const sphereGeo = new THREE.SphereGeometry( 2, 32, 32 );
  const sphereMaterial = new THREE.MeshBasicMaterial( {color: photonColor, transparent: true, opacity: 0.5} );
  const explosion = new THREE.Mesh(sphereGeo, sphereMaterial);
  explosion.position.copy(photonPosition);

  explosion.scale.set(0,0,0);
  scene.add(explosion);


  const explosionTween = new TWEEN.Tween(explosion.scale);
  explosionTween.to({x: 2, y: 2, z: 2}, 600).start()
    .onComplete(() => {
      explosionTween.to({x: 0, y: 0, z: 0}, 600).start();
      scene.remove(explosion);
    });
}

function photonOutofBounds(photon) {
  const yBounds = photon.position.y >= 100 || photon.position.y <= -100;
  const xBounds = photon.position.x >= 100 || photon.position.x <= -100;
  const zBounds = photon.position.z >= 50 || photon.position.z <= -50;
  return yBounds || xBounds || zBounds;
}

function animatePhoton(photon, direction) {
  function updatePhotonPosition() {
    photon.position.addScaledVector(direction, photonSpeed);

    // Continue the animation
    if (photon.position.z >= ground.position.z && photon.position.y < 100
      && photon.position.x < 100 && photon.position.x > -100) {
      requestAnimationFrame(updatePhotonPosition);
    } else {
      // need to add check for building postions
      if (photon.position.z <= ground.position.z) {
        const photonPosition = photon.position;
        tweenSunScale(photonPosition);
        scene.remove(photon);
      }


      //check for enemyCube intersection
      const enemyCubePosition = enemyCube.position;
      const yIntersect = photon.position.y >= enemyCubePosition.y - 2.5;
      const xIntersect = enemyCubePosition.x - 2.5 <= photon.position.x && enemyCubePosition.x + 2.5 >= photon.position.x;
      const zIntersect = enemyCubePosition.z - 2.5 <= photon.position.z && enemyCubePosition.z + 2.5 >= photon.position.z;
      if (yIntersect && xIntersect && zIntersect) {
        scene.remove(photon);
        tweenSunScale(enemyCubePosition);
        enemyErrorAnimation();
        photonCount -= 1;
      } else if (photonOutofBounds(photon)) {

        scene.remove(photon);
        photonCount -= 1;
      }
    }
  }
  updatePhotonPosition();
}


export { ship, shipMeshFront , firePhoton};