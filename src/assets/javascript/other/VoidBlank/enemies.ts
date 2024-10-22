import * as THREE from 'three';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';
import {getRandomPosition, getRandomNumber } from './../generators';
import { scene } from './voidBlank';

class EnemyCube extends THREE.Mesh {
  intersected: boolean;
  constructor() {
    super();
    this.geometry = new THREE.BoxGeometry( 1, 1, 1 );
    // const color = getRandomColor();
    const color = 0xfe0000;
    this.material = new THREE.MeshLambertMaterial( { color: color, flatShading: false, opacity: .5, transparent: true} );
    (this.material as THREE.MeshLambertMaterial).emissive = new THREE.Color( color );
    (this.material as THREE.MeshLambertMaterial).emissiveIntensity = 0.7;
    this.position.set( 4, 3, 2 );
    this.receiveShadow = false;
    this.castShadow = true;
    this.intersected = false;
  }
}

function enemyErrorAnimation(enemyCube) {
  const epy = enemyCube.position.y;
  const enemyYTween = new TWEEN.Tween(enemyCube.position)
  const enemyZTween = new TWEEN.Tween(enemyCube.position)
  const enemyXTween = new TWEEN.Tween(enemyCube.position)
  const scaleTween = new TWEEN.Tween(enemyCube.scale);
  const opacityTween = new TWEEN.Tween(enemyCube.material);
  const zDirection = -15;
  const xDirection = getRandomNumber(-15, 15);
  const yDirection = epy + getRandomNumber(5, 10);

  enemyZTween.to({ z: zDirection}, 600).start();
  enemyYTween.to({ y: yDirection}, 600).start();
  enemyXTween.to({ x: xDirection}, 600).start();
  scaleTween.to({ x:.75, y:.75, z:.75}, 500).start();
  opacityTween.to({ opacity: 0, emissiveIntensity: 0 }, 500).start().onComplete(() => {
    scene.remove(enemyCube);
  });
}

function animateEnemyCube(enemyCube) {
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

const enemyTargetGroup = new THREE.Group();
function addEnemyCubes(count) {
  for (let i = 0; i < count; i++) {
    const enemyCube = new EnemyCube();
    enemyCube.position.set(getRandomPosition(-15, 15), getRandomPosition(0, 10), getRandomPosition(-15, 15));
    enemyTargetGroup.add(enemyCube);
  }
}


export { animateEnemyCube, enemyErrorAnimation, EnemyCube, addEnemyCubes, enemyTargetGroup  };
