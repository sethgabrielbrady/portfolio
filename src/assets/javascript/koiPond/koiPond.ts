import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
//import { createText } from 'three/examples/jsm/webxr/Text2D.js';

const clock: THREE.Clock = new THREE.Clock();
const scene: THREE.Scene = new THREE.Scene();
const interval = 1/60;
const mixerAnimations: Array<THREE.AnimationMixer> = []; // animation mixer array
// const raycaster = new THREE.Raycaster();

let camera: THREE.OrthographicCamera;
let renderer: THREE.WebGLRenderer;
let delta: number = 0;
// let xAxis = speed * delta;
// let yAxis = -1 + (speed * delta);


function loadModel (modelObj: { path: string; scale: number; animation: boolean; timeScale: number; position: { x: number; y: number; z: number; }; }) {
  let model;
  let mixer: THREE.AnimationMixer;
  const timeScale = modelObj.timeScale;
  const gltfLoader = new GLTFLoader();
  gltfLoader.load(modelObj.path,
    (gltf) => {
      model = gltf.scene
      model.scale.x = modelObj.scale;
      model.scale.y = modelObj.scale;
      model.scale.z = modelObj.scale;

      model.position.copy(modelObj.position);
      model.castShadow = true;
      scene.add(model);
      if (modelObj.animation) {
        model.animations;
        mixer = new THREE.AnimationMixer( model );
        mixerAnimations.push(mixer);
        const clips = gltf.animations;
        if (clips.length > 0) {
            // Play first animation
            const action = mixer.clipAction(clips[0]);
            action.setEffectiveTimeScale(timeScale); // 2x speed
            action.play();
        }
      }
    }
  );
  return model;
}


function init() {
  scene.background = new THREE.Color( 0x222233 );

  const aspect: number = (window.innerWidth / window.innerHeight);
  const distance: number = 4;

  camera = new THREE.OrthographicCamera(- distance * aspect, distance * aspect, distance, - distance, 1, 1000);
  camera.position.set( 5, 5, 5 ); // all components equal
  camera.lookAt( scene.position ); // or the origin

  const lightCube = new THREE.Mesh( new THREE.BoxGeometry( 0.5, 0.5, 0.5 ), new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
  const light: THREE.DirectionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
  light.position.set( 0, 5, 0 );
  lightCube.position.copy(light.position);
  light.castShadow = true;
  scene.add( light );
  // scene.add( lightCube );

  const directionLight = new THREE.DirectionalLight( 0xffffff, 1 );
    directionLight.position.set( 0, 5, 0 );
    // directionLight.rotateOnAxis( new THREE.Vector3( 0, 1, 0 ), Math.PI/2  );
    directionLight.castShadow = true;
    directionLight.shadow.mapSize.width = 16;
    directionLight.shadow.mapSize.height = 8;
    // directionLight.shadow.camera.near = 0.5;
    // directionLight.shadow.camera.far = 10;
    // directionLight.shadow.camera.left = -20;
    // directionLight.shadow.camera.right = 20;
    // directionLight.shadow.camera.top = 20;
    // directionLight.shadow.camera.bottom = -5;
    scene.add( directionLight );
    // scene.add( new THREE.AmbientLight( 0xffffff, 1 ) );
    // scene.add( new THREE.HemisphereLight( 0xffffff, 0x999999, 3 ) );

  renderer = new THREE.WebGLRenderer( {
    antialias: false,
    alpha: true,
    precision: "lowp",
    powerPreference: "high-performance",
  });

  renderer.setClearColor

  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = false;

  const container: HTMLElement = document.getElementById("koiPond")!;
  container.appendChild(renderer.domElement);

  // Models
  // create super
  // update scaling to vector3
  const pond = {
    scale: 1.0,
    animation: false,
    timeScale: 1.0,
    path: 'models/pond.glb',
    position: { x: 0, y: 0, z: 0 }
  }

  const koi = {
    scale: 1.0,
    animation: true,
    timeScale: 1.0,
    path: 'models/koi.glb',
    position: { x: 1, y: -0.06, z: 1 }
  }

  const fox = {
    scale: 0.0065,
    animation: true,
    timeScale: 1.0,
    path: 'models/fox.glb',
    position: { x: -1, y: 0.1, z: 2 }
  }

  // need to create animation path for koi
  // will probaly do something like the ball physics in breakout - when the koi hits the edge of the pond, it will change direction
  // randomly add stops for the koi to stay still


  loadModel(pond);
  loadModel(koi);
  loadModel(fox);

  const waterColor = 0x00FFFF;
  const waterGeometry = new THREE.PlaneGeometry( 4.75, 4.85);
  const waterMaterial = new THREE.MeshPhongMaterial({
                                                  color: waterColor,
                                                  transparent: true,
                                                  opacity: 0.5,
                                                });
  const water = new THREE.Mesh( waterGeometry, waterMaterial );
  water.rotation.x = - Math.PI / 2;
  water.position.y = -0.0009;
  scene.add( water );

  const bottomColor = 0x4C4E27;
  const bottomGeometry = new THREE.PlaneGeometry( 4, 4);
  const bottomMaterial = new THREE.MeshPhongMaterial({
                                                  color: bottomColor,
                                                  transparent: false,
                                                });
  const bottom = new THREE.Mesh( bottomGeometry, bottomMaterial );
  bottom.rotation.x = - Math.PI / 2;
  bottom.position.y = -0.509;
  scene.add( bottom );



  // controls for the camera
  const orbitEnabled = true;
  const orbitControls = new OrbitControls(camera, renderer.domElement)
  orbitControls.enabled = true;
  orbitControls.enableRotate = orbitEnabled
  orbitControls.keyPanSpeed = 60.0 // magic number
  orbitControls.enableZoom = true

  // container.addEventListener( 'click', ( event ) => {

  // });
}

function animate() {
  requestAnimationFrame(animate);
  delta += clock.getDelta();

  if (delta  > interval) {
    render();
    delta = delta % interval;
  }

  // updates model animations
  if (mixerAnimations.length > 0) {
    for (let i = 0; i < mixerAnimations.length; i++) {
      console.log("mixwe", mixerAnimations[i]);
      mixerAnimations[i].update(delta);
    }
  }

}

function render() {
  renderer.render( scene, camera );
  // window.addEventListener( 'pointermove', onPaddleIntersect );
}

function koiPond() {
  init();
  animate();
}


export { koiPond };