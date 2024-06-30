import * as THREE from 'three';

function breakout() {
  const frustumSize: number = 1000;
  // adding the canvas

  const canvas: HTMLCanvasElement = document.getElementById("3dBreakout") as  HTMLCanvasElement;
  let aspect: number = 0;

  if (canvas) {
    console.log("can", canvas.width);
    aspect = canvas.width / canvas.height;
    console.log("aspect", aspect);
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

  // renderer
  const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ antialias: false, alpha: true});
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  window.addEventListener( 'resize', onWindowResize, false );
  canvas.appendChild(renderer.domElement);

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


  function render() {
    renderer.render( scene, camera );
    camera.lookAt( scene.position );
  }

  (function animate() {
    requestAnimationFrame( animate );
    renderer.setAnimationLoop( render );
    render();
  })();

}

export { breakout };