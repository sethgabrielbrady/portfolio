import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm//webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { World } from 'three/examples/jsm//libs/ecsy.module.js';
import { floor, menuMesh, exitText, textureCube, heartMesh } from './worldMesh.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import  { updateGameText } from './gameText.js';
import { firePhoton, animatePhotons} from './ship.js';

let camera, renderer, scene, xrCamera;
let clock: THREE.Clock;
let world: World;
let xrSession = false;


  const backgroundColor = 0x222222;

  function init() {
      // Initialize clock and world
    clock = new THREE.Clock();
    world = new World();
    scene = new THREE.Scene();
    scene.background = textureCube;
    scene.background = new THREE.Color( backgroundColor );

    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 10 );
    camera.position.set( 0, 1, 3 );
    camera.lookAt( scene.position ); // or the origin


    const light = new THREE.DirectionalLight( 0xffffff, 3 );
    light.position.set( 0, 6, 0 );
    light.castShadow = true;
    scene.add( light );
    // scene.add( new THREE.HemisphereLight( 0xffffff, 0x999999, 3 ) );
    scene.add( new THREE.AmbientLight(0xffffff, 0.5));

    renderer = new THREE.WebGLRenderer( {
      antialias: false,
      alpha: true,
      precision: "lowp",
      powerPreference: "low-power"
    } );


    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;

    // initializing webxr renderer and controllers. Adding the vr button to the users element
    const container = document.getElementById("voidblank");
    container.appendChild(renderer.domElement);


    // document.body.appendChild( renderer.domElement );

    renderer.xr.enabled = true;


    //  Grid
     const gridHelper = new THREE.GridHelper(100, 100, 0x18fbe3,0x18fbe3);
     scene.add( gridHelper );
     gridHelper.visible = false;

     window.addEventListener( 'keydown', ( event ) => {
      if (event.key === 'g') {
        gridHelper.visible = !gridHelper.visible;
      }
     });


    // models
    function loadModel (modelObj) {
      const gltfLoader = new GLTFLoader();

      gltfLoader.load(modelObj.path,
        (gltf) => {
         const model = gltf.scene
          model.scale.x = modelObj.scale;
          model.scale.y = modelObj.scale;
          model.scale.z = modelObj.scale;
          model.position.x = modelObj.position.x;
          model.position.y = modelObj.position.y;
          model.position.z = modelObj.position.z;
          model.castShadow = true;
          scene.add(model);
        }
      )
    }

    const ballGeo = new THREE.SphereGeometry( 0.25 );
    const ballMatr = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    const ball = new THREE.Mesh( ballGeo, ballMatr );
    ball.position.x = -1;
    ball.position.y = .25;
    ball.position.z = 1;
    scene.add( ball );

    const palm = {
      scale: 0.045,
      path: 'models/palmshiny.glb',
      position: { x: -4, y: 0, z: 0 }
    }
    loadModel(palm);



    const human = {
      scale: 0.0035,
      path: 'models/human.glb',
      position: { x: 3.75, y: .98, z: -3 }
    }
    loadModel(human);

    // heart
    // scene.add(heartMesh);


    const sessionInit = {
      // requiredFeatures: [ 'hand-tracking' ]
    };

    // WebXr entry point
    container.appendChild(VRButton.createButton(renderer, sessionInit ));

    //orbit controls
    let orbitEnabled = false;
    const orbitControls = new OrbitControls(camera, renderer.domElement)
    orbitControls.enabled = true;
    orbitControls.enableRotate = orbitEnabled
    orbitControls.keyPanSpeed = 60.0 // magic number
    orbitControls.enableZoom = true

    console.log("orbit1", orbitControls)
    window.addEventListener( 'keydown', ( event ) => {
      if (event.key === 'o') {
        orbitEnabled = !orbitEnabled
        orbitControls.enableRotate = orbitEnabled;
      }
     });

    // controllers
    const controller1 = renderer.xr.getController( 0 );
    const controller2 = renderer.xr.getController( 1 );

    //left
    controller1.addEventListener( 'connected',  ( event ) => {
      controller1.add( buildController( event.data ) );
    } );

    controller1.addEventListener( 'disconnected',  () => {
      controller1.remove( controller1.children[ 0 ] );
    } );


    //right
    controller2.addEventListener( 'connected',  ( event ) => {
      controller2.add( buildController( event.data ) );
    } );

    controller2.addEventListener('selectstart', ( ) => {

      firePhoton(controller2);
    });
    controller2.addEventListener('selectend', () => {
      // Optionally handle trigger release
      // updateGameText("Trigger released");
    });

    controller2.addEventListener( 'disconnected', function () {
      controller2.remove( controller2.children[ 0 ] );
    } );

    // Squeeze action button (grip)
  controller2.addEventListener('squeezestart', () => {
    // updateGameText("Grip squeezed");
    xrSession = true;
    // Add any additional logic for when the grip is squeezed
  });

  controller2.addEventListener('squeezeend', () => {
    // updateGameText("Grip released");
    // Add any additional logic for when the grip is released
  });

    scene.add( controller1, controller2 );
    updateGameText("Controllers are ready");

    const controllerModelFactory = new XRControllerModelFactory();
    const controllerGrip1 = renderer.xr.getControllerGrip( 0 );
    controllerGrip1.add( controllerModelFactory.createControllerModel( controllerGrip1 ) );
    scene.add( controllerGrip1 );

    const controllerGrip2 = renderer.xr.getControllerGrip( 1 );
    controllerGrip2.add( controllerModelFactory.createControllerModel( controllerGrip2 ) );
    scene.add( controllerGrip2 );


    // setup objects in scene and entities
    // floor
    scene.add(floor);
    // wall

    // menu
    scene.add(menuMesh);

    // exit text
    scene.add(exitText);

    const sideGeometry = new THREE.BoxGeometry( 1, 2, 6);
    const sideMaterial = new THREE.MeshPhongMaterial({
                                                    color: 0x00ffff,
                                                    transparent: false,
                                                  });
    const sideMesh = new THREE.Mesh( sideGeometry, sideMaterial );
    sideMesh.position.set( -5 ,1, 1 );
    scene.add(sideMesh);

    window.addEventListener( 'resize', onWindowResize );
  }

  // function getIntersections(object, x, y, z) {
  //   const origin = new THREE.Vector3;
  //   origin.copy(object.position);
  //   const direction = new THREE.Vector3(x, y, z);
  //   direction.normalize();

  //   const raycaster = new THREE.Raycaster(); // Declare raycaster variable
  //   raycaster.set(origin, direction);
  //   return raycaster.intersectObjects( objectsArray );
  // }

  function buildController( data ) {
    let geometry, material;
    // const controllerGeo= new THREE.BoxGeometry( 0.125,0.125,0.125);
    // const controllerMaterial = new THREE.MeshPhongMaterial({color: 0xff0000, transparent: false});
    // const controllerMesh = new THREE.Mesh( controllerGeo, controllerMaterial );
    const threeObject = new THREE.Object3D();
    // threeObject.add( controllerMesh );
    switch ( data.targetRayMode ) {
      case 'tracked-pointer':
        geometry = new THREE.BufferGeometry();
        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [ 0, 0, 0, 0, 0, - 1 ], 3 ) );
        geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( [ 0.5, 0.5, 0.5, 0, 0, 0 ], 3 ) );
        material = new THREE.LineBasicMaterial( { vertexColors: true, blending: THREE.AdditiveBlending } );
        return new THREE.Line( geometry, material );

      case 'gaze':
        geometry = new THREE.RingGeometry( 0.02, 0.04, 32 ).translate( 0, 0, - 1 );
        material = new THREE.MeshBasicMaterial( { opacity: 0.5, transparent: true } );
        return new THREE.Mesh( geometry, material );
    }
    // Add a default return statement

    return threeObject;
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }


const delta: number = 0;
const interval: number = 1/60;
// function animate() {
//   requestAnimationFrame(animate);
//   delta += clock.getDelta();
//   if (delta > interval) {
//     render();
//     delta = delta % interval;
//   }
//   render();
// }

// function render() {
//   const delta = clock.getDelta();
//   const elapsedTime = clock.elapsedTime;
//   renderer.xr.updateCamera( camera );
//   world.execute( delta, elapsedTime );
//   renderer.render( scene, camera );
//   // heartMesh.rotation.y += 0.1;
//   // stats.update();
//   TWEEN.update();
// }


  function animate() {
    renderer.setAnimationLoop( render );
    // requestAnimationFrame(animate);
    // render();
  }


  function render() {
    const delta = clock.getDelta();
    const elapsedTime = clock.elapsedTime;
    renderer.xr.updateCamera(camera);
    world.execute(delta, elapsedTime);
    renderer.render(scene, camera);
    animatePhotons();

    TWEEN.update();
  }

  // async function animate() {
  //   if (xrSession) {
  //     try {
  //       const session = await navigator.xr.requestSession('immersive-vr');
  //       renderer.xr.setSession(session);
  //       // eslint-disable-next-line no-inner-declarations
  //       function onXRFrame(time: DOMHighResTimeStamp, frame: XRFrame) {
  //         session.requestAnimationFrame(onXRFrame);
  //         render();
  //       }
  //       session.requestAnimationFrame(onXRFrame);
  //     } catch (e) {
  //       console.error('Failed to start WebXR session:', e);
  //     }
  //   } else {
  //     renderer.setAnimationLoop( render );
  //     console.error('WebXR not supported');
  //   }
  // }

  function voidblank() {
    init();
    animate();
    // if (xrSession) {
    //   animateVr();
    // } else {
    //   animate();
    // }
  }

export { voidblank, scene, renderer, render };
