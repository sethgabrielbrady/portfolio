import * as THREE from 'three';
import { scene } from '@/assets/javascript/other/Shootfox/shootfox.ts';
import { ground } from '@js/other/Shootfox/models.ts';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';




// Ship
const radius = 4;
const height = 5;
const shipGeo = new THREE.CylinderGeometry(0, radius/4, height, 3, 1)
const shipMatr = new THREE.MeshLambertMaterial( { color: 0x04d9ff } );
const shipMeshFront = new THREE.Mesh( shipGeo, shipMatr );

shipMeshFront.name = "shipMeshFront";
shipMeshFront.scale.set(1, 1.25, 1);



const shipMeshRear = new THREE.Mesh( shipGeo, shipMatr );
shipMeshRear.rotateOnAxis( new THREE.Vector3( 0, 0, 1 ), Math.PI );
shipMeshRear.position.y = -5;
shipMeshRear.scale.set(1, 0.75, 1);

const wingGroupL = new THREE.Group();
const wingGroupR = new THREE.Group();
const wingMatr = new THREE.MeshLambertMaterial( { color: 0xf4d9ff } );


const wingXyScale = 0.6;
const shipWingLRear: THREE.Mesh = new THREE.Mesh( shipGeo, wingMatr );
shipWingLRear.position.x = 2.5;
shipWingLRear.scale.set(wingXyScale, 0.25, wingXyScale);

const shipWingRRear: THREE.Mesh = new THREE.Mesh( shipGeo, wingMatr );
shipWingRRear.position.x = -2.5;
shipWingRRear.scale.set(wingXyScale, 0.25, wingXyScale);


const shipWingLFront: THREE.Mesh = new THREE.Mesh( shipGeo, wingMatr );
shipWingLFront.rotateOnAxis( new THREE.Vector3( 0, 0, 1 ), Math.PI );
shipWingLFront.position.x = 2.5;
shipWingLFront.position.y = -2.5
shipWingLFront.scale.set(wingXyScale, 0.75, wingXyScale);

const shipWingRFront: THREE.Mesh = new THREE.Mesh( shipGeo, wingMatr );
shipWingRFront.rotateOnAxis( new THREE.Vector3( 0, 0, 1 ), Math.PI );
shipWingRFront.position.x = -2.5;
shipWingRFront.position.y = -2.5
shipWingRFront.scale.set(wingXyScale, 0.75, wingXyScale);

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

const reticleSprite = new THREE.TextureLoader().load( "reticle.png" );
const reticleMatrSprite = new THREE.SpriteMaterial( { map: reticleSprite } );
const reticleMain = new THREE.Sprite(reticleMatrSprite );
reticleMain.position.z = 0;
reticleMain.scale.set(4,4,4);
reticleMain.rotateX(Math.PI / 2);
reticleMain.position.y = 10

const ship = new THREE.Group();
ship.add( shipMeshFront, shipMeshRear, wingGroupL, wingGroupR, reticleMain);



// photon
const photonSpeed = 2;
const photonGeo = new THREE.ConeGeometry( 1, 1, 4 );
const photonMatr = new THREE.MeshBasicMaterial( { color: 0x4deeea} );
const photonCount: Number = 0;

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
  const sphereMaterial = new THREE.MeshBasicMaterial( {color: 0xffac00, transparent: true, opacity: 0.5} );
  const explosion = new THREE.Mesh(sphereGeo, sphereMaterial);
  explosion.scale.set(0,0,0);
  explosion.position.copy(photonPosition);
  scene.add(explosion);

  const tween = new TWEEN.Tween(explosion.scale);
  tween.to({x: 2, y: 2, z: 2}, 600).start()
  .onComplete(() => {
    tween.to({x: 0, y: 0, z: 0}, 600).start();
    scene.remove(explosion);
  });
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
      }

      scene.remove(photon);
      photonCount -= 1;
    }
  }
  updatePhotonPosition();
}


export { ship, shipMeshFront , firePhoton};