import * as THREE from 'three';
import { createText } from 'three/examples/jsm/webxr/Text2D.js';


//neon pallette
// const orange = 0xff8500;
const red = 0xff3f3f;
// #39ff14 green
// #dfff00 chartreuse

const cube_loader = new THREE.CubeTextureLoader();

const textureCube = cube_loader.load( [
  'ocean_sand.png', 'ocean_sand.png',
  'ocean_sand.png', 'ocean_sand.png',
  'ocean_sand.png', 'ocean_sand.png'
] );

let floorTexture = {map: null, normalMap: null, height: null};
let floorTextures = ["sand.png", "sand_normal.png", "sand_bump.png"];

function addFloorTextures(textures) {
  const loader = new THREE.TextureLoader();
  //clean this up
  if (textures && textures.length > 0) {
    floorTexture.map = loader.load(textures[0]);
    floorTexture.normal = loader.load(textures[1]);
    floorTexture.height = loader.load(textures[2]);

    floorTexture.map.wrapS = THREE.RepeatWrapping;
    floorTexture.map.wrapT = THREE.RepeatWrapping;
    floorTexture.map.repeat.set( 1.4,1.4);
    floorTexture.map.offset.set( 0.5, 0.5 );

    floorTexture.normal.wrapS = THREE.RepeatWrapping;
    floorTexture.normal.wrapT = THREE.RepeatWrapping;
    floorTexture.normal.repeat.set( 1.4,1.4 );
    floorTexture.normal.offset.set( 0.5, 0.5 );

    floorTexture.height.wrapS = THREE.RepeatWrapping;
    floorTexture.height.wrapT = THREE.RepeatWrapping;
    floorTexture.height.repeat.set( 1.4,1.4 );
    floorTexture.height.offset.set( 0.5, 0.5 );
  } else {
    console.error("No image provided for floor texture");
  }
}

// addFloorTextures(floorTextures);


//floor
const floorColor = 0x111111;
const floorGeometry = new THREE.PlaneGeometry( 10, 10);
const floorMaterial = new THREE.MeshPhongMaterial({
                                                    color: floorColor,
                                                    normalMap: floorTexture.normal,
                                                    map:floorTexture.map,
                                                    transparent: false,
                                                    bumpMap:floorTexture.height,
                                                  });

const floor = new THREE.Mesh( floorGeometry, floorMaterial );
floor.rotation.x = - Math.PI / 2;
floor.receiveShadow = false;


const floorText = createText( 'Hello,', 1 );
const floorText2 = createText( "I'm Seth Brady.", 1 );

floorText.position.set( -3, 3, .1 );
floorText2.position.set( -1.35, 2.15, .1 );
floorText.scale.set( 0.75, 0.75, 0.75 );
floorText2.scale.set( 0.75, 0.75, 0.75 );

floor.add( floorText, floorText2 );

//walls
const wall_loader = new THREE.TextureLoader();
const wall_texture = wall_loader.load("opticalText2.jpg");
// const wallColor = 0xffff22;
const wallGeometry = new THREE.BoxGeometry( 10, 10, 15);
const wallMaterial = new THREE.MeshPhongMaterial( {
                                                    transparent: true,
                                                    opacity:1,
                                                    map: wall_texture,
                                                    side: THREE.BackSide,
                                                    emissive: 0xffffff,
                                                    emissiveMap: wall_texture,
                                                    emissiveIntensity: 1,
                                                    lightMap: wall_texture,
                                                    bumpMap: wall_texture,
                                                  } );
const wall = new THREE.Mesh( wallGeometry, wallMaterial );
wall.rotation.x = - Math.PI / 2;
wall.position.set(0, 0, 0);
wall.receiveShadow = true;


// menuMesh
const menuGeometry = new THREE.PlaneGeometry( 0.24, 0.24 );
const menuMaterial = new THREE.MeshPhongMaterial( {
  opacity: 0,
  transparent: true,
});

const menuMesh = new THREE.Mesh( menuGeometry, menuMaterial );
menuMesh.position.set(1.5, 0.25, -0.125);
menuMesh.rotation.y = - Math.PI / 12;

// exit button
const exitButton = makeButtonMesh( 0.2, 0.1, 0.01, 0xff0000 );
const exitButtonText = createText( 'exit', 0.06 );
exitButton.add( exitButtonText );
exitButtonText.position.set( 0, 0, 0.0051 );
exitButton.position.set( 0, 0, 0);

// instruction text
const instructionText = createText( 'This is a WebXR Hands demo, please explore with hands.', 0.04 );
instructionText.position.set( 0, 1.6, - 0.6 );

// exit text
const exitText = createText( "exiting...", 0.04 );
exitText.position.set( 0, 1.5, - 0.6 );
exitText.visible = false;

// data screen
// const screen_loader = new THREE.TextureLoader();
// const screen_texture = screen_loader.load("generatedIcon.jpg");

// const dataScreenColor = 0x000cccc;
const dataScreenGeomtery = new THREE.PlaneGeometry( 2, 1 );
const dataScreenMaterial = new THREE.MeshPhongMaterial({
  opacity: 0,
  color: 0xfffc02,
  emissive: 0xfffc02,
  shininess: 100,
  clearcoat: 1,
  // transparent: false,
  // bumpMap: screen_texture,
  // map: screen_texture,
});

const dataScreenMesh = new THREE.Mesh( dataScreenGeomtery, dataScreenMaterial );
dataScreenMesh.position.set( 0, 1.5, -1);

function makeButtonMesh( x, y, z, color ) {
  const geometry = new THREE.BoxGeometry( x, y, z );
  const material = new THREE.MeshPhongMaterial( { color: color } );
  const buttonMesh = new THREE.Mesh( geometry, material );
  return buttonMesh;
}

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

const heartScale = 0.005;
const geometry = new THREE.ExtrudeGeometry( heartShape, extrudeSettings );
const heartMaterial = new THREE.MeshPhongMaterial( { color: red } );
const heartMesh = new THREE.Mesh( geometry, heartMaterial );
heartMesh.position.set( 0, 2, -.5);
heartMesh.rotation.z = Math.PI / 1
heartMesh.scale.set( heartScale, heartScale, heartScale);

export { floor, menuMesh, exitButton, exitText, dataScreenMesh, wall, textureCube , instructionText, heartMesh}
