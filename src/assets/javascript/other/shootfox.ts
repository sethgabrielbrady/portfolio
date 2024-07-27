import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createText } from 'three/examples/jsm/webxr/Text2D.js';


  const clock: THREE.Clock = new THREE.Clock();
  const scene: THREE.Scene = new THREE.Scene();
  const interval = 1/60;
  const raycaster = new THREE.Raycaster();

  let camera = new THREE.Camera();
  let renderer: THREE.WebGLRenderer
  let delta: number = 0;
  let photonCount = 0;


  const pointer = new THREE.Vector2();
  const groundGeo = new THREE.PlaneGeometry( 4000, 1000 );
  const groundMatr = new THREE.MeshPhongMaterial( { color: 0x00ff99 } );
  const ground = new THREE.Mesh( groundGeo, groundMatr );
  ground.position.z = -10;
  ground.rotation.z = ground.position.z * (Math.PI );
  scene.add( ground );


  // Ship
  const radius = 4;
  const height = 5;
  const shipGeo = new THREE.CylinderGeometry(0, radius/4, height, 3, 1)
  const shipMatr = new THREE.MeshPhongMaterial( { color: 0x04d9ff } );
  const shipMeshFront = new THREE.Mesh( shipGeo, shipMatr );
  shipMeshFront.scale.set(1, 1.25, 1);


  const shipMeshRear = new THREE.Mesh( shipGeo, shipMatr );
  shipMeshRear.rotateOnAxis( new THREE.Vector3( 0, 0, 1 ), Math.PI );
  shipMeshRear.position.y = -5;
  shipMeshRear.scale.set(1, 0.75, 1);

  const wingGroupL = new THREE.Group();
  const wingGroupR = new THREE.Group();
  const wingMatr = new THREE.MeshPhongMaterial( { color: 0xf4d9ff } );


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


  const cubeGeo = new THREE.BoxGeometry( 2, 2, 2 );
  const cubeMatr = new THREE.MeshPhongMaterial( { color: 0xffff99 } );
  const cube = new THREE.Mesh( cubeGeo, cubeMatr );
  cube.position.z = ground.position.z;
  cube.position.x = 0;
  cube.position.y = 0;
  const cubeGroup = new THREE.Group();
  const cubeGroup2 = new THREE.Group();


  for (let i = 0; i < 400; i++) {
    const cubeClone = cube.clone();
    cubeClone.position.y = i * 8;
    cubeGroup.add(cubeClone);
  }

  cubeGroup2.add(cubeGroup.clone());

  cubeGroup2.position.x = 8;
  cubeGroup.position.x = -8;

  const cubeGroupContainer = new THREE.Group();
  cubeGroupContainer.add(cubeGroup, cubeGroup2);
  scene.add( cubeGroupContainer );


  function animateModel(model) {
    model.position.y -=  .75;
    if (model.position.y < -200) {
      model.position.y = 50;
    }
  }

  function animatePhoton() {
   photon.position.y += .75;
   if (pointer.y < 5.95){
    photon.position.z -=  .75
   } else if (pointer.y >= 5.97){
    photon.position.z += .75
   } else {
    photon.position.z = 0
   }
   console.log("photon.position.y", pointer);
    if (photon.position.y > 30 || photon.position.z > 30) {
      photon.position.y = ship.position.y ;
      photon.position.z = ship.rotation.z ;
      photonCount = 0;
      photonInPlay = false;
    }
  }

  const texture = new THREE.TextureLoader().load( "skyline2.png" );
  const skylineGeo = new THREE.PlaneGeometry( 300, 150 );
  // const skylineGeo = new THREE.BoxGeometry( 744, 342, 1 );
  const skylineMatr = new THREE.MeshBasicMaterial( { color: 0xffffff, map: texture, transparent: true } );
  const skyline = new THREE.Mesh( skylineGeo, skylineMatr );
  skyline.position.y = 300;
  skyline.position.z = 0;
  skyline.rotation.x = Math.PI/2;
  scene.add( skyline );



   // photon
   const photonGeo = new THREE.SphereGeometry( 0.25 );
   const photonMatr = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
   const photon = new THREE.Mesh( photonGeo, photonMatr );
   scene.add(photon);

  let photonInPlay = false;

  function firePhoton() {
    photonInPlay = true;
    photon.position.y = ship.position.y;
    animatePhoton();
  }




  function onPointerMove( event: { clientY: number; clientX: number; } ) {

    pointer.y = event.clientY / 90 ;
    pointer.x = event.clientX / 90 ;

    raycaster.setFromCamera( pointer, camera );

    if (pointer.y > 5 && pointer.y < 15) {
      const shipRotationX = ((pointer.y - 10) * Math.PI/2);
      if (shipRotationX > -6.78 && shipRotationX < -5.3) {
        ship.rotation.x = shipRotationX;
      }
    }
    if (pointer.x > 5 && pointer.x < 15) {
      const shipRotationY = ((pointer.x - 10) * Math.PI/2);
      if (shipRotationY > -0.9 && shipRotationY < 0.9) {
        ship.rotation.y = shipRotationY ;
      }
    }
  }

  function translateCamera() {
    camera.position.set( 10, 0, 0 );
    camera.rotation.x = Math.PI;
    camera.rotation.z = Math.PI;
    camera.lookAt( scene.position );
  }

  function init() {
    scene.background = new THREE.Color( 0xddddff );

    const aspect: number = (window.innerWidth / window.innerHeight);
    //const distance: number = 7;
    // camera = new THREE.OrthographicCamera(- distance * aspect, distance * aspect, distance, - distance, 1, 1000);

    camera = new THREE.PerspectiveCamera( 100, aspect, 1 );

    camera.position.set( 0, -10, 0 ); // all components equal
    camera.lookAt( scene.position ); // or the origin


    scene.add( new THREE.HemisphereLight( 0xffffff, 0x999999, 3 ) );

    renderer = new THREE.WebGLRenderer( {
      antialias: false,
      alpha: true,
      precision: "lowp",
      powerPreference: "low-power",
    });

    renderer.setPixelRatio( window.devicePixelRatio );
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
    scene.add( axesHelper );
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


    axisGroup.add(xGroup, zGroup, yGroup);
    scene.add(axisGroup);


    window.addEventListener( 'keydown', ( event ) => {
      if (event.key === 'c') {
        translateCamera();
      }
      if (event.key === 'o') {
        orbitControls.enabled = !orbitControls.enabled;
      }


      if (event.key === 'm' && photonCount < 1) {
        firePhoton();
        photonCount++;
      }
    });

  }

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
    window.addEventListener( 'pointermove', onPointerMove );

    animateModel(cubeGroupContainer);
    if (photonInPlay) {
      animatePhoton();
    }

  }

  function shootfox() {
    init();
    animate();
  }


  export { shootfox };


