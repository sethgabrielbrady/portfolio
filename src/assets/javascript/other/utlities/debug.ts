import {camera, scene} from './shootfox';
import Stats from 'three/examples/jsm/libs/stats.module.js';


// import { createAxisHelper } from '@js/other/Shootfox/axisHelper.ts';


// let showHelper: Boolean = false;


const stats = new Stats();
document.body.appendChild(stats.dom);

let translateCount = 0;
function translateCamera() {
  if (translateCount === 3) {
    translateCount = 0;
  }
  if (translateCount === 0) {
    camera.position.set( 0, -12, 0 )
  } else if (translateCount === 1) {
    camera.position.set( 20, 0, 0 );
  } else if (translateCount === 2) {
    camera.position.set( 0, 0, 20 );
  }

  translateCount +=1;
  camera.rotation.x = Math.PI;
  camera.rotation.z = Math.PI;
  camera.lookAt( scene.position );
}

export {translateCamera, stats}



