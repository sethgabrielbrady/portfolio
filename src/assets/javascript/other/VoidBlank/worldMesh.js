import * as THREE from 'three';
import { createText } from 'three/examples/jsm/webxr/Text2D.js';


//neon pallette
// const orange = 0xff8500;
const red = 0xff3f3f;
// #39ff14 green
// #dfff00 chartreuse








// instruction text
const instructionText = createText( 'This is a WebXR Hands demo, please explore with hands.', 0.04 );
instructionText.position.set( 0, 1.6, - 0.6 );

// function makeButtonMesh( x, y, z, color ) {
//   const geometry = new THREE.BoxGeometry( x, y, z );
//   const material = new THREE.MeshPhongMaterial( { color: color } );
//   const buttonMesh = new THREE.Mesh( geometry, material );
//   return buttonMesh;
// }

//heart
const heartShape = new THREE.Shape();
heartShape.moveTo( 25, 25 );
heartShape.bezierCurveTo( 25, 25, 20, 0, 0, 0 );
heartShape.bezierCurveTo( - 30, 0, - 30, 35, - 30, 35 );
heartShape.bezierCurveTo( - 30, 55, - 10, 77, 25, 95 );
heartShape.bezierCurveTo( 60, 77, 80, 55, 80, 35 );
heartShape.bezierCurveTo( 80, 35, 80, 0, 50, 0 );
heartShape.bezierCurveTo( 35, 0, 25, 25, 25, 25 );

const extrudeSettings = {
	depth: 8,
	bevelEnabled: true,
	bevelSegments: 2,
	steps: 2,
	bevelSize: 1,
	bevelThickness: 1
};

const heartScale = .01;
const geometry = new THREE.ExtrudeGeometry( heartShape, extrudeSettings );
const heartMaterial = new THREE.MeshPhongMaterial( { color: red } );
const heartMesh = new THREE.Mesh( geometry, heartMaterial );
heartMesh.position.set( 0, 3, -.5);
heartMesh.rotation.z = Math.PI / 1
heartMesh.scale.set( heartScale, heartScale, heartScale);

export { heartMesh}
