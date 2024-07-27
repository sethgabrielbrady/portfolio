import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

  const clock: THREE.Clock = new THREE.Clock();
  const scene: THREE.Scene = new THREE.Scene();
  const interval = 1/60;

  let camera: THREE.OrthographicCamera;
  let renderer: THREE.WebGLRenderer;
  let delta: number = 0;


  // 3D Objects
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

  function init() {
    scene.background = new THREE.Color( 0x222233 );

    const aspect: number = (window.innerWidth / window.innerHeight);
    const distance: number = 7;

    camera = new THREE.OrthographicCamera(- distance * aspect, distance * aspect, distance, - distance, 1, 1000);
    camera.position.set( 20, 20, 20 ); // all components equal
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
    orbitControls.enabled = true;
    orbitControls.enableRotate = true;
    orbitControls.keyPanSpeed = 60.0 // magic number
    orbitControls.enableZoom = true

    const container: HTMLElement = document.getElementById("breakout")!;
    container.appendChild(renderer.domElement);

    container.addEventListener( 'click', ( event ) => {
      console.log('click')
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
  }

  function shootfox() {
    init();
    animate();
  }


  export { shootfox };


