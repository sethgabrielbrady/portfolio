import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createText } from 'three/examples/jsm/webxr/Text2D.js';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';
import { buildingArray , buildingGroupY} from '@js/other/Shootfox/models.ts';

// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const clock: THREE.Clock = new THREE.Clock();
const scene: THREE.Scene = new THREE.Scene();
const interval: number = 1/60;
const shipSpeed: Object = { x:.9};

let boostReady: Boolean = true;
let showHelper: Boolean = false;
let camera = new THREE.Camera();
let renderer: THREE.WebGLRenderer
let delta: Number = 0;
let photonCount: Number = 0;
let photonDirections = {x: 0, y: 0, z: 0};


const landscapeGroup = new THREE.Group();
const groundGeo = new THREE.PlaneGeometry( 4000, 800 );
const groundMatr = new THREE.MeshLambertMaterial( { color: 0x00ff99 } );
const ground = new THREE.Mesh( groundGeo, groundMatr );
ground.position.z = -15;
ground.rotation.z = ground.position.z * (Math.PI );

landscapeGroup.add(ground);

const roadGeo = new THREE.PlaneGeometry( 17.5, 800 );
const roadMatr = new THREE.MeshLambertMaterial( { color: 0xcccccc } );
const road = new THREE.Mesh( roadGeo, roadMatr );
road.position.z = ground.position.z + 0.1;
landscapeGroup.add(road);

scene.add( landscapeGroup );

const roadSegGeo = new THREE.BoxGeometry(17, 2, .5 );
const roadSegMatr = new THREE.MeshLambertMaterial( { color: 0xaaaaaa } );
const roadSement = new THREE.Mesh( roadSegGeo, roadSegMatr );
roadSement.position.z = ground.position.z - 0.1;

// const cubeGeo = new THREE.BoxGeometry( 2, 2, 2 );
// const cubeMatr = new THREE.MeshPhongMaterial( { color: 0xffff99 } );
// const cube = new THREE.Mesh( cubeGeo, cubeMatr );
// cube.position.z = ground.position.z + 1;
// cube.position.x = 0;
// cube.position.y = 0;
// const cubeGroup = new THREE.Group();
// const cubeGroup2 = new THREE.Group();

const roadSegmentGroup = new THREE.Group();
for (let i = 0; i < 100; i++) {
  // const cubeClone = cube.clone();
  const roadSegClone = roadSement.clone();
  roadSegClone.position.y = i * 8;
  // cubeClone.position.y = i * 8;
  // cubeGroup.add(cubeClone);
  roadSegmentGroup.add(roadSegClone);
}

// cubeGroup2.add(cubeGroup.clone());
// cubeGroup2.position.x = 8;
// cubeGroup.position.x = -8;
const cubeGroupContainer = new THREE.Group();

// cubeGroupContainer.add(cubeGroup, cubeGroup2, roadSegmentGroup);
cubeGroupContainer.add(roadSegmentGroup);
scene.add( cubeGroupContainer );



// add buildings and animate from models.ts
scene.add(buildingGroupY);
function animateBuildingGroupY() {
    buildingArray.forEach((group) => {
      group.position.y -= shipSpeed.x * 0.1;
      if (group.position.y <= -1200) {
        group.position.y = -200;
      }
    });
  // buildingGroupY.position.y -= shipSpeed.x;
  // if (buildingGroupY.position.y <= -1600) {
  //   buildingGroupY.position.y = 400;
  //   // addBuildingGroupX();
  // }
}

  // Ship
  const radius = 4;
  const height = 5;
  const shipGeo = new THREE.CylinderGeometry(0, radius/4, height, 3, 1)
  const shipMatr = new THREE.MeshLambertMaterial( { color: 0x04d9ff } );
  const shipMeshFront = new THREE.Mesh( shipGeo, shipMatr );
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

  const ship = new THREE.Group();
  ship.add(shipMeshFront,shipMeshRear, wingGroupL, wingGroupR);
  scene.add(ship);





  function animateModel(model) {
    model.position.y -= shipSpeed.x;
    if (model.position.y < -180) {
      model.position.y = -30;
    }
  }


  const texture = new THREE.TextureLoader().load( "skyline2.png" );
  const skylineGeo = new THREE.PlaneGeometry( 300, 150 );
  // const skylineGeo = new THREE.BoxGeometry( 744, 342, 1 );
  const skylineMatr = new THREE.MeshBasicMaterial( { color: 0xffffff, map: texture, transparent: true } );
  const skylineLightMatr = new THREE.MeshLambertMaterial( { color: 0xffffff, transparent: true } );

  const skyline = new THREE.Mesh( skylineGeo, skylineMatr );
  const skylineLight = new THREE.Mesh( skylineGeo, skylineLightMatr );
  const skylineGroup = new THREE.Group();
  skylineLight.position.y = skyline.position.y -1;
  skylineGroup.add(skyline, skylineLight);
  skylineGroup.rotation.x = Math.PI / 2;
  skylineGroup.position.y = 350;
  skylineGroup.position.z = -10;
  scene.add( skylineGroup );


   // photon
   let photonInPlay = false;
   const photonSpeed = 2;
   const startingPhotonPosition = ship.position.y + 3;

  //  const photonGeo = new THREE.PlaneGeometry( .5, 3, 1 );
  //  const photonGeo = new THREE.SphereGeometry( .5, .5, .5 );
   const photonGeo = new THREE.BoxGeometry( .5, .5, .5 );

   const photonMatr = new THREE.MeshBasicMaterial( { color: 0x00ffff } );
   const photon = new THREE.Mesh( photonGeo, photonMatr );
   photon.position.y = startingPhotonPosition;
    photon.scale.set(0,0,0);
   scene.add(photon);


  function animatePhoton(directions) {
    // console.log(photon.position);
    // console.log(directions);
    photon.position.y += photonSpeed;


    if (directions.x === 1) {
      photon.position.z += .3;
    } else if (directions.x === -1) {
      photon.position.z -= .3;
    }

    if (directions.y === 1) {
      photon.position.x += .3;
    } else if (directions.y === -1) {
      photon.position.x -= .3;
    }
    if (photon.position.y > 30 || photon.position.z > 30 || photon.position.z < -30 || photon.position.x > 30 || photon.position.x < -30) {
      photon.position.y = startingPhotonPosition;
      photon.position.z = ship.position.z ;
      photon.position.x = ship.position.x ;
      photon.scale.set(0,0,0);
      photonCount = 0;
      photonInPlay = false;
    }
  }

  // const counter = 0;
  function firePhoton() {
    // console.log(counter += 1)
    // Maybe I should be firing on clones of the photon and removing them from the scene?
    photonInPlay = true;
    const currentShipPosition = ship.position;
    const currentShipRotation = ship.rotation;
    photon.position.y = currentShipPosition.y + 3;
    photon.position.x = currentShipPosition.x;
    photon.position.z = currentShipPosition.z;
    photon.rotation.x = currentShipRotation.y;
    photon.rotation.z = currentShipRotation.z;
    photon.scale.set(1,1,1);
    photonDirections = {
                                x: Math.sign(currentShipRotation.x),
                                y: Math.sign(currentShipRotation.y),
                                z: Math.sign(currentShipRotation.z)
                              };
    animatePhoton(photonDirections);
  }



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

  function updateBoostTime() {
    if (!boostReady) {
      setTimeout(() => {
        boostReady = true;
      }, 2000);
   }
  }
  function init() {
    scene.background = new THREE.Color( 0x000000 );

    const aspect: number = (window.innerWidth / window.innerHeight);
    //const distance: number = 7;
    // camera = new THREE.OrthographicCamera(- distance * aspect, distance * aspect, distance, - distance, 1, `800`);

    camera = new THREE.PerspectiveCamera( 100, aspect, 1 );

    camera.position.set( 0, -12, 0 ); // all components equal
    camera.lookAt( scene.position ); // or the origin

    scene.add( new THREE.HemisphereLight( 0xffffff, 0x000000, 2 ) );

    renderer = new THREE.WebGLRenderer( {
      antialias: true,
      alpha: true,
      precision: "lowp",
      powerPreference: "low-power",
    });


    renderer.setPixelRatio( window.devicePixelRatio/2);
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = false;

    const orbitControls = new OrbitControls(camera, renderer.domElement)
    orbitControls.enabled = false;
    orbitControls.enableRotate = true;
    orbitControls.keyPanSpeed = 60.0 // magic number
    orbitControls.enableZoom = true

    const container: HTMLElement = document.getElementById("breakout")!;
    container.appendChild(renderer.domElement);

    // // axis helper
    const axesHelper = new THREE.AxesHelper( 5 );
    const xText = createText( 'x', 1 );
    const xText2 = createText( '-x', 1 );
    const xText3 = createText( 'x', 1 );
    const xText4 = createText( '-x', 1 );
    const xGroup = new THREE.Group();
    xGroup.add(xText, xText2, xText3, xText4);

    const zText = createText( "z", 1 );
    const zText2 = createText( "-z", 1 );
    const zText3 = createText( "z", 1 );
    const zText4 = createText( "-z", 1 );
    const zGroup = new THREE.Group();
    zGroup.add(zText, zText2, zText3, zText4);

    const yText = createText( "y", 1 );
    const yText2 = createText( "-y", 1 );
    const yText3 = createText( "y", 1 );
    const yText4 = createText( "-y", 1 );
    const yGroup = new THREE.Group();
    yGroup.add(yText, yText2, yText3, yText4);

    const axisGroup = new THREE.Group();



    // update axis text position
    xText.position.set( 5, 1, 0 );
    xText2.position.set( -5, 1, 0 );
    xText3.position.set( 5, 1, 0 );
    xText4.position.set( -5, 1, 0 );

    zText.position.set( 0, 1, 5 );
    zText2.position.set( 0, 1, -5 );
    zText3.position.set( 0, 1, 5 );
    zText4.position.set( 0, 1, -5 );

    yText.position.set( 1, 5, 0 );
    yText2.position.set( 1, -5, 0 );
    yText3.position.set( 1, 5, 0 );
    yText4.position.set( 1, -5, 0 );


    // update axis text rotation
    xText.rotation.x = Math.PI / 2;
    xText2.rotation.x = Math.PI / 2;
    zText.rotation.x = Math.PI / 2;
    zText2.rotation.x = Math.PI / 2;
    yText.rotation.x = Math.PI / 2;
    yText2.rotation.x = Math.PI / 2;

    axisGroup.add(xGroup, zGroup, yGroup, axesHelper);
    axisGroup.visible = showHelper;
    scene.add(axisGroup);


    //ship tween and controls
    const tweenXRotation = new TWEEN.Tween(ship.rotation);
    const tweenYRotation = new TWEEN.Tween(ship.rotation);
    const tweenXposition = new TWEEN.Tween(ship.position);
    const tweenYposition = new TWEEN.Tween(ship.position);
    const tweenBoostPosition = new TWEEN.Tween(ship.position);
    const tweenBoostSpeed = new TWEEN.Tween(shipSpeed);
    const rotationYSpeed = 500;
    const rotationXSpeed = 300;
    const positionSpeed = 1200;



    window.addEventListener( 'keydown', ( event ) => {

      if (event.key === 'r') {
        showHelper = !showHelper;
        axisGroup.visible = showHelper;
      }

      if (event.key === 'c') {
        translateCamera();
      }

      if (event.key === 'o') {
        orbitControls.enabled = !orbitControls.enabled;
      }



      if (event.key === 'p' && photonCount < 1) {
        firePhoton();
        photonCount++;
      }


      if (event.key === 'm' && boostReady) {
        tweenBoostPosition.to({y: 15}, positionSpeed).start();
        tweenBoostSpeed.to({x: 6.0}, 3000).start();
        updateBoostTime();
        boostReady = false;
      }

      if (event.key === 'a') {
        tweenXRotation.stop();
        tweenXposition.stop();
        tweenXRotation.to({y: -1.5}, rotationYSpeed).start();
        tweenXposition.to({x: -10}, positionSpeed).start();
      }

      if (event.key === 'd') {
        tweenXRotation.stop();
        tweenXposition.stop();
        tweenXRotation.to({y: 1.5}, rotationYSpeed).start();
        tweenXposition.to({x: 10}, positionSpeed).start();
      }

      if (event.key === 'w') {
        tweenYRotation.stop();
        tweenYposition.stop();
        tweenYRotation.to({x: -0.4}, rotationXSpeed).start();
        tweenYposition.to({z: -10}, positionSpeed).start();
      }

      if (event.key === 's') {
        tweenYRotation.stop();
        tweenYposition.stop();
        tweenYRotation.to({x: 0.7}, rotationXSpeed).start();
        tweenYposition.to({z: 6}, positionSpeed).start();
      }

    });

    window.addEventListener( 'keyup', ( event ) => {
      if (event.key === 'a' || event.key === 'd') {
        tweenXRotation.stop();
        tweenXRotation.to({y: 0}, rotationYSpeed).start();
        tweenXposition.stop();
        tweenXposition.to({x: 0}, positionSpeed).start();
      }
      if (event.key === 'w' || event.key === 's') {
        tweenYRotation.stop();
        tweenYRotation.to({x: 0}, rotationXSpeed).start();
        tweenYposition.stop();
        tweenYposition.to({z: 0}, positionSpeed).start();
      }

      if (event.key === 'm') {
        tweenBoostPosition.stop();
        tweenBoostPosition.to({y: 0}, positionSpeed).start();
        tweenBoostSpeed.stop();
        tweenBoostSpeed.to({x: .75}, 1000).start();
      }
    });

  }

  window.addEventListener( 'click', ( event ) => {
    if (photonCount < 1) {
      firePhoton();
      photonCount++;
    }
  });

  function animate() {
    requestAnimationFrame(animate);
    delta += clock.getDelta();
     if (delta  > interval) {
      render();
      delta = delta % interval;
     }
  }

  function render() {
    renderer.render( scene, camera );

    animateModel(cubeGroupContainer);
    animateBuildingGroupY(buildingArray);
    if (photonInPlay) {
      animatePhoton(photonDirections);
    }

    TWEEN.update();
  }

  function shootfox() {
    init();
    animate();
  }


  export { shootfox };


