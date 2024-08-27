import * as THREE from 'three';
// import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';
import { enemyCube } from './shootfox';
import { getRandomColor, getRandomPosition, getRandomPosOrNeg, getRandomNumber } from './../generators';

class EnemyCube extends THREE.Mesh {
  constructor() {
    super();
    // this.geometry = new ConvexGeometry(randomPoints(points));
    this.geometry = new THREE.BoxGeometry( 3, 3, 3 );
    // const color = getRandomColor();
    const color = 0xfe0000;
    this.material = new THREE.MeshLambertMaterial( { color: color, flatShading: true, opacity: 0.9, transparent: true} );
    this.material.emissive = new THREE.Color( color );
    this.material.emissiveIntensity = 0.7;
    this.position.set( getRandomPosition(), 12, getRandomPosition() );
    this.receiveShadow = false;
    this.castShadow = true;
  }
}

function enemyErrorAnimation() {

  // requestAnimationFrame(animateEnemyCube);
  // const enemyXTween = new TWEEN.Tween(enemyCube.position)
  const enemyYTween = new TWEEN.Tween(enemyCube.position)
  // const enemyZTween = new TWEEN.Tween(enemyCube.position)
  const scaleTween = new TWEEN.Tween(enemyCube.scale);
  const opacityTween = new TWEEN.Tween(enemyCube.material);

  // const xDirection = getRandomNumber(0, 15) * getRandomPosOrNeg();
  // const zDirection = getRandomNumber(0, 15) * getRandomPosOrNeg();
  let yDirection = getRandomNumber(5, 20) * getRandomPosOrNeg();

  if ( yDirection <= 5) {
    yDirection = 10;
  }
  // enemyXTween.to({ x: xDirection}, 500).start();
  // enemyZTween.to({ z: zDirection}, 500).start();

  // enemyYTween.to({ y: yDirection}, 500).start();
  // scaleTween.to({ x:.25, y:.25, z:.25}, 500).start();
  opacityTween.to({ opacity: 1, emissiveIntensity: 0 }, 500).start();

}

function animateEnemyCube() {
  const speed = 0.05;
  enemyCube.rotation.y -= speed;
  enemyCube.rotation.x -= speed;
  enemyCube.rotation.z -= speed;
  if (enemyCube.rotation.y < -10) {
    enemyCube.rotation.y = 10;
    enemyCube.rotation.x = (Math.random() * 20) - 10;
    enemyCube.rotation.z = (Math.random() * 20) - 10;
  }
}

export { enemyCube , animateEnemyCube, enemyErrorAnimation, EnemyCube };



