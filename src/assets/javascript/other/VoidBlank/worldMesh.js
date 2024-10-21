import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { scene } from './voidBlank';
// import { createText } from 'three/examples/jsm/webxr/Text2D.js';

//neon pallette
const red = 0xff3f3f;
// const orange = 0xff8500;
// #39ff14 green
// #dfff00 chartreuse

// instruction text
// const instructionText = createText( 'This is a WebXR Hands demo, please explore with hands.', 0.04 );
// instructionText.position.set( 0, 1.6, - 0.6 );

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


const humanModel = {
	scale: 0.0072,
	path: 'models/human.glb',
	position: { x: -3.75, y: 2, z: -1 },
	rotation: { x: 0, y:Math.PI/2, z: 0 }
}

function loadModel (modelObj) {
  const gltfLoader = new GLTFLoader();
  gltfLoader.load(modelObj.path,
    (gltf) => {
      const model = gltf.scene
      model.scale.set(modelObj.scale, modelObj.scale, modelObj.scale); // Assuming uniform scaling
      model.position.set(modelObj.position.x, modelObj.position.y, modelObj.position.z);
      model.rotation.set(modelObj.rotation.x, modelObj.rotation.y, modelObj.rotation.z);
      model.castShadow = false;
      scene.add(model);
    }
  )
}

  // setup objects in scene and entities
  const tableGeometry = new THREE.BoxGeometry( 1, 4, 12);
  const tableMaterial = new THREE.MeshPhongMaterial({ color: 0x00ffff, transparent: false});
  const tableMesh = new THREE.Mesh( tableGeometry, tableMaterial );
  tableMesh.position.set( -5 ,2, 1 );


  const ballGeo = new THREE.SphereGeometry( 0.25 );
  const ballMatr = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
  const ball = new THREE.Mesh( ballGeo, ballMatr );
  ball.position.x = -1;
  ball.position.y = 0 + 0.25;
  ball.position.z = 1;



export { heartMesh, humanModel, loadModel, tableMesh, ball };
