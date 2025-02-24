import * as THREE from 'three';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';
import {getRandomNumber } from './../generators';
import { scene } from './voidBlank';
import { updateGameText } from './gameText';

class EnemyCube extends THREE.Mesh {
  intersected: boolean;
  constructor() {
    super();
    this.geometry = new THREE.BoxGeometry( 1,1,1 );
    // const color = getRandomColor();
    const color = 0xfe0000;
    this.material = new THREE.MeshLambertMaterial( { color: color, flatShading: false, opacity: 1, transparent: true} );
    (this.material as THREE.MeshLambertMaterial).emissive = new THREE.Color( color );
    (this.material as THREE.MeshLambertMaterial).emissiveIntensity = .7;
    this.position.set( 4, 3, 2 );
    this.receiveShadow = true;
    this.castShadow = true;
    this.intersected = false;
  }
}

function enemyErrorAnimation(targets, target) {
  const epy = target.position.y;
  updateGameText(`Enemy error animation ${epy}`);

  const enemyYTween = new TWEEN.Tween(target.position)
  const enemyZTween = new TWEEN.Tween(target.position)
  const enemyXTween = new TWEEN.Tween(target.position)
  const scaleTween = new TWEEN.Tween(target.scale);
  const opacityTween = new TWEEN.Tween(target.material);
  const zDirection = -15;
  const xDirection = getRandomNumber(-15, 15);
  const yDirection = epy + getRandomNumber(5, 10);

  enemyZTween.to({ z: zDirection}, 600).start();
  enemyYTween.to({ y: yDirection}, 600).start();
  enemyXTween.to({ x: xDirection}, 600).start();
  scaleTween.to({ x:.75, y:.75, z:.75}, 500).start();
  opacityTween.to({ opacity: 0, emissiveIntensity: 0 }, 500).start().onComplete(() => {
    targets.splice(targets.indexOf(target), 1);
    scene.remove(target);
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

function animateEnemyCubes(children) {
  children.forEach((targetChild) => {
  const speed = 0.05;
  targetChild.rotation.y -= speed;
  targetChild.rotation.x -= speed;
  targetChild.rotation.z -= speed;
  if (targetChild.rotation.y < -10) {
    targetChild.rotation.y = 10;
    targetChild.rotation.x = (Math.random() * 20) - 10;
    targetChild.rotation.z = (Math.random() * 20) - 10;
  }
})
}

const enemyTargetGroup = new THREE.Group();
function addEnemyCubes(count) {
  for (let i = 0; i < count; i++) {
    const enemyCube = new EnemyCube();
    enemyCube.position.set(randomizeTargetPosition(-15, 15), randomizeTargetPosition(5, 10), -10);
    enemyTargetGroup.add(enemyCube);
  }
}

function randomizeTargetPosition(min, max) {
  return getRandomNumber(min, max);
}


export { animateEnemyCubes, enemyErrorAnimation, EnemyCube, addEnemyCubes, enemyTargetGroup  };
