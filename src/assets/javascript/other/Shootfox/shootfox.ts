import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createText } from 'three/examples/jsm/webxr/Text2D.js';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';
import { BuildingGroup} from '@js/other/Shootfox/models.ts';
import Stats from 'three/examples/jsm/libs/stats.module.js';


const stats = new Stats();
document.body.appendChild( stats.dom );

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
const photonDirections = {x: 0, y: 0, z: 0};
let cockpitCamera: Boolean = false;


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


const roadSegmentGroup = new THREE.Group();
for (let i = 0; i < 100; i++) {
  const roadSegClone = roadSement.clone();
  roadSegClone.position.y = i * 8;
  roadSegmentGroup.add(roadSegClone);
}
const cubeGroupContainer = new THREE.Group();

cubeGroupContainer.add(roadSegmentGroup);
scene.add( cubeGroupContainer );



// add buildings and animate from models.ts
// scene.add(buildingGroupY, building2);

// const newG = new BuildingGroup(20);
// scene.add( newG );

const buildings = [];
const startPos = 400;
let counter = 0;

function createNewBuildingsXset() {
  const newBuildings = new BuildingGroup(20, startPos);
    buildings.push(newBuildings);
    // startPos += 50;
    scene.add(newBuildings);
    counter += 1;
    console.log('createNewBuildingsXset', counter, buildings.length);
}

createNewBuildingsXset();

function animateBuildingGroupY() {
  buildings.forEach(building => {
    building.position.y -= shipSpeed.x;
    if (building.position.y === -200) {
      scene.remove(buildings[0]);
      buildings.shift();

    }
    if (building.length < 20) {
      createNewBuildingsXset()
    }
  })

  // newG.position.y -= shipSpeed.x;
  // if (newG.position.y <= -1000) {
  //   // newG.position.y = 400;
  //   scene.remove(newG);
  // }

  // buildings.forEach(building => {
  //   building.position.y -= shipSpeed.x;
  //   if (building.position.y <= -1200) {
  //     const returnBuild
  //     // building.position.y = 400;
  //   }
  // });
}



// const triangleShape = new THREE.Shape();
// triangleShape.moveTo( 80, 20 );
// triangleShape.lineTo( 40, 80 );
// triangleShape.lineTo( 120, 80 );
// triangleShape.lineTo( 80, 20 ); // close path

// const triangleGeometry = new THREE.ShapeGeometry(triangleShape);
// const triangleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
// const triangleMesh = new THREE.Mesh(triangleGeometry, triangleMaterial);
// triangleMesh.position.set(0, 0, 0);
// scene.add(triangleMesh);


// const pyramidGeo = new THREE.ConeGeometry( 5, 20, 4 );
// const pyramidMatr = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
// const pyramid = new THREE.Mesh( pyramidGeo, pyramidMatr );
// pyramid.position.set(0, 0, 0);
// scene.add(pyramid);






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


  // const cockpitGeo = new THREE.CylinderGeometry(0, radius/4, height, 3, 1)
  // const cockpitMatr = new THREE.MeshLambertMaterial( { color: 0xffffff } );
  // const cockpitMesh = new THREE.Mesh( cockpitGeo, cockpitMatr );
  // cockpitMesh.scale.set(1.5, 1.75, 1.5);
  // cockpitMesh.position.z = -0.9;
  // cockpitMesh.position.y = 4;
  // cockpitMesh.rotateOnAxis( new THREE.Vector3( 1, 0, 0 ), .2);
  // scene.add(cockpitMesh);

  const ship = new THREE.Group();
  ship.add(shipMeshFront, shipMeshRear, wingGroupL, wingGroupR);
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
  // let photonInPlay = false;
  const photonSpeed = 2;
  const startingPhotonPosition = ship.position.y + 3;
  const photonGeo = new THREE.ConeGeometry( 1, 1, 4 );
  const photonMatr = new THREE.MeshBasicMaterial( { color: 0x4deeea} );


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


  const sphere = new THREE.SphereGeometry( 2, 32, 32 );
  const sphereMaterial = new THREE.MeshBasicMaterial( {color: 0xffac00, transparent: true, opacity: 0.5} );

  function tweenSunScale(photonPosition) {
    const explosion = new THREE.Mesh( sphere, sphereMaterial );
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
          tweenSunScale(photonPosition)
        }

        scene.remove(photon);
        photonCount = photonCount - 1;
      }
    }
    updatePhotonPosition();
  }


  // Assuming ship is an instance of THREE.Object3D or similar
// and velocity is a THREE.Vector3 representing the ship's velocity

function tiltShipTowardsDirectionOfTravel(ship: THREE.Object3D, velocity: THREE.Vector3) {
  // Normalize the velocity vector to get the direction of travel
  const direction = velocity.clone().normalize();

  // Calculate the desired rotation
  const desiredRotation = new THREE.Quaternion();
  desiredRotation.setFromUnitVectors(new THREE.Vector3(-1, 0, 0), direction);

  // Apply the desired rotation to the ship
  ship.quaternion.slerp(desiredRotation, 0.1); // Adjust the interpolation factor as needed
}

// Example usage
// const ship = new THREE.Object3D();
// const velocity = new THREE.Vector3(1, 0, 0); // Example velocity vector

// // Call this function in your animation loop or update function
// tiltShipTowardsDirectionOfTravel(ship, velocity);

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
    const tweenCameraRotation = new TWEEN.Tween(camera.rotation);
    const tweenCameraPositionX = new TWEEN.Tween(camera.position);
    const tweenCameraPositionZ = new TWEEN.Tween(camera.position);
    const tweenXRotation = new TWEEN.Tween(ship.rotation);
    const tweenYRotation = new TWEEN.Tween(ship.rotation);
    const tweenZRotation = new TWEEN.Tween(ship.rotation);
    const tweenXposition = new TWEEN.Tween(ship.position);
    const tweenYposition = new TWEEN.Tween(ship.position);
    const tweenBoostPosition = new TWEEN.Tween(ship.position);
    const tweenBoostSpeed = new TWEEN.Tween(shipSpeed);
    const rotationYSpeed = 500;
    const rotationXSpeed = 300;
    const positionSpeed = 1200;

    const cockpitZ = 1.25;
    const cockpitY = -1.25;
    const z = shipMeshFront.position.z;
    const y = shipMeshFront.position.y;
    window.addEventListener( 'keydown', ( event ) => {

      if (event.key === 'l') {
        cockpitCamera = !cockpitCamera;

        if (cockpitCamera) {
          camera.position.set( 0, cockpitY, cockpitZ );
          shipMeshFront.scale.set(1.75, 2.25, 1.75);
          shipMeshFront.position.z = z - 0.9;
          shipMeshFront.position.y = 4;
        } else {
          camera.position.set( 0, -12, 0 );
          shipMeshFront.scale.set(1, 1, 1);
          shipMeshFront.position.z = 0;
          shipMeshFront.position.y = -.65;
        }
      }

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

      if (event.key === 'p' && photonCount < 10) {
        firePhoton();
        photonCount++;
      }


      if (event.key === 'm' && boostReady) {
        tweenBoostPosition.to({y: 15}, positionSpeed).start();
        tweenBoostSpeed.to({x: 6.0}, 3000).start();
        updateBoostTime();
        boostReady = false;
      }

      if (event.key === 'ArrowLeft') {
        const velocity = new THREE.Vector3(-1, 0, 0); // Example velocity vector
        tiltShipTowardsDirectionOfTravel(ship, velocity);
      }

      if (event.key === 'a') {
        tweenXRotation.stop();
        tweenXposition.stop();
        tweenXRotation.to({y: -1.5}, rotationYSpeed).start();
        tweenXposition.to({x: -20}, positionSpeed).start();
        // const velocity = new THREE.Vector3(-1, -1, 1); // Example velocity vector
        // tiltShipTowardsDirectionOfTravel(ship, velocity);




        if (cockpitCamera) {
        tweenCameraPositionX.stop();
        tweenCameraRotation.stop();
        tweenCameraPositionX.to({x: -9.7}, positionSpeed).start();
        tweenCameraRotation.to({z: -1.5}, rotationYSpeed*10).start();
        }
      }

      if (event.key === 'd') {
        tweenXRotation.stop();
        tweenXposition.stop();

        tweenXRotation.to({ y: 1.5}, rotationYSpeed).start();
        tweenXposition.to({x: 20}, positionSpeed).start();

        if (cockpitCamera) {
        tweenCameraPositionX.stop();
        tweenCameraRotation.stop();
        tweenCameraPositionX.to({x: 9.7}, positionSpeed).start();
        tweenCameraRotation.to({z: 1.5}, rotationYSpeed*10).start();
        }
      }

      if (event.key === 'w') {
        tweenYRotation.stop();
        tweenYposition.stop();
        tweenYRotation.to({x: -0.4}, rotationXSpeed).start();
        tweenYposition.to({z: -15}, positionSpeed).start();

        if (cockpitCamera) {
        tweenCameraPositionZ.stop();
        // tweenCameraRotation.stop();
        tweenCameraPositionZ.to({z: -9.7}, positionSpeed).start();
        // tweenCameraRotation.to({x: 0.3}, rotationYSpeed*2).start();
        }
      }

      if (event.key === 's') {
        tweenYRotation.stop();
        tweenYposition.stop();
        tweenYRotation.to({x: 0.7}, rotationXSpeed).start();
        tweenYposition.to({z: 5}, positionSpeed).start();

        if (cockpitCamera) {
        tweenCameraPositionZ.stop();
        tweenCameraPositionZ.to({z: 5.7}, positionSpeed).start();

        // tweenCameraRotation.stop();
        // tweenCameraRotation.to({x: 0.5}, rotationYSpeed*2).start();
        }
      }

    });

    window.addEventListener( 'keyup', ( event ) => {
      if (event.key === 'a' || event.key === 'd') {
        tweenXRotation.stop();
        tweenXRotation.to({y: 0}, rotationYSpeed).start();
        tweenXposition.stop();
        tweenXposition.to({x: 0}, positionSpeed).start();


        if (cockpitCamera) {
        tweenCameraPositionX.stop();
        tweenCameraRotation.stop();
        tweenCameraPositionX.to({x: 0}, positionSpeed).start();
        tweenCameraRotation.to({z: 0}, rotationYSpeed).start();
        }
      }
      if (event.key === 'w' || event.key === 's') {
        tweenYRotation.stop();
        tweenYRotation.to({x: 0}, rotationXSpeed).start();
        tweenYposition.stop();
        tweenYposition.to({z: 0}, positionSpeed).start();

        if (cockpitCamera) {
        tweenCameraPositionZ.stop();
        // tweenCameraRotation.stop();
        tweenCameraPositionZ.to({z: cockpitZ}, positionSpeed).start();
        // tweenCameraRotation.to({x: 0}, rotationYSpeed).start();
        }
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
    animateBuildingGroupY();
    // if (photonInPlay) {
    //   animatePhoton(photonDirections);
    // }


    TWEEN.update();
    stats.update();
  }

  function shootfox() {
    init();
    animate();
  }


  export { shootfox };


