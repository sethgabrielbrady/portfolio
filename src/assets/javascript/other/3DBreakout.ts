import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let orbitControls = null;

function breakout() {
  const frustumSize: number = 1000;
  // adding the canvas

  const canvas: HTMLElement = document.getElementById("3dBreakout")!;
  let aspect: number = 0;

  if (canvas) {
    aspect = canvas.width / canvas.height;
  }

  //scene
  const scene: THREE.Scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xf0f0f0 );

  // Grid
  const tiles: number = 12;
  const gridHelper: THREE.GridHelper = new THREE.GridHelper(frustumSize, tiles);
  scene.add(gridHelper);

  // Lighting
  const ambientLightColor: number = 0xf03ff0;
  const ambientLight: THREE.AmbientLight = new THREE.AmbientLight( ambientLightColor );
  const pointLightColor: number = 0xffffff;
  const pointLight: THREE.PointLight = new THREE.PointLight( pointLightColor );
  scene.add(pointLight, ambientLight);

  //camera
  const camera: THREE.OrthographicCamera = new THREE.OrthographicCamera(
    frustumSize * aspect / - 2, // left
    frustumSize * aspect / 2, // right
    frustumSize / 2, // top
    frustumSize / - 2, // bottom
    1, // near
    frustumSize * 2 // far
  );
  camera.position.y = 400;
  scene.add(camera);

  //ball
  const zRND: number = Math.random() * 500;
  const ballGeo: THREE.SphereGeometry = new THREE.SphereGeometry( 25, 25, 50 );
  const ballMatr: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial( { color: 0x000000 } );
  const ball: THREE.Mesh = new THREE.Mesh( ballGeo, ballMatr );

  ball.position.x = -500;
  ball.position.y = 50;
  ball.position.z = zRND;
  scene.add(ball);

  // renderer
  const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ antialias: false, alpha: true});
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  window.addEventListener( 'resize', onWindowResize, false );
  canvas.appendChild(renderer.domElement);

  // orbit controls
  orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.enabled = true;
  orbitControls.enableRotate = true;
  orbitControls.keyPanSpeed = 60.0; // magic number
  orbitControls.enableZoom = true;

  function onWindowResize() {
    const aspect = window.innerWidth / window.innerHeight;
    camera.left   = - frustumSize * aspect / 2;
    camera.right  =   frustumSize * aspect / 2;
    camera.top    =   frustumSize / 2;
    camera.bottom = - frustumSize / 2;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }
  onWindowResize();


  let xAxis: number = 10;
  let yAxis: number = -10;
  const ballRadius: number = 12.5;

  const wallAxis: number = 500;
  function wallCollision(){
    ball.position.x += xAxis;
    ball.position.z += yAxis;

    if(ball.position.x + xAxis <= ballRadius - wallAxis) {
      xAxis = -xAxis + getRandomArbitrary();
    }

    if(ball.position.x + xAxis >= wallAxis - ballRadius) {
      xAxis = -xAxis + getRandomArbitrary();
    }

    if(ball.position.z + yAxis <= ballRadius - wallAxis) {
      yAxis = -yAxis + getRandomArbitrary();
    }

    if(ball.position.z + yAxis >= wallAxis - ballRadius) {
      yAxis = -yAxis + getRandomArbitrary();
    }
  }

  function getRandomArbitrary() {
    const random = Math.random() * (6 - 0) + 1;
    return random;
  }

  (function animate() {
    requestAnimationFrame( animate );
    renderer.setAnimationLoop( render );
    render();
  })();

  function render() {
    renderer.render( scene, camera );
    camera.lookAt( scene.position );
    wallCollision();
  }
}

export { breakout };