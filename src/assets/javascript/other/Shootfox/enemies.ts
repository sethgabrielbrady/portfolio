import * as THREE from 'three';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';

const enemyCubeGeo = new THREE.BoxGeometry( 4, 4, 4 );
const enemyCubeMatr = new THREE.MeshPhongMaterial( { color: 0xfb5607, shininess: 1.0, flatShading: true } );
const enemyCube = new THREE.Mesh( enemyCubeGeo, enemyCubeMatr );

enemyCube.position.set( 0, 20, 0 );


const getRandomPosOrNeg = () => {
  return Math.random() < 0.5 ? -1 : 1;
}

const getRandomNumber = (min, max) => {
  return Math.random() * (max - min) + min;
}

function enemyErrorAnimation() {
  const enemyXTween = new TWEEN.Tween(enemyCube.position)
  const enemyYTween = new TWEEN.Tween(enemyCube.position)
  const enemyZTween = new TWEEN.Tween(enemyCube.position)
  const xDirection = getRandomNumber(0, 20) * getRandomPosOrNeg();
  const zDirection = getRandomNumber(0, 15) * getRandomPosOrNeg();
  let yDirection = getRandomNumber(5, 20) * getRandomPosOrNeg();

  if ( yDirection <= 5) {
    yDirection = 10;
  }

  enemyXTween.to({ x: xDirection}, 500).start();
  enemyYTween.to({ y: yDirection}, 500).start();
  enemyZTween.to({ z: zDirection}, 500).start();

}

function animateEnemyCube() {
  enemyCube.rotation.y -= 0.1;
  enemyCube.rotation.x -= 0.1;
  enemyCube.rotation.z -= 0.1;
  if (enemyCube.rotation.y < -20) {
    enemyCube.rotation.y = 20;
    enemyCube.rotation.x = (Math.random() * 40) - 20;
    enemyCube.rotation.z = (Math.random() * 40) - 20;
  }
}

export { enemyCube , animateEnemyCube, enemyErrorAnimation };



