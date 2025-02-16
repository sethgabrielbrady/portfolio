import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as TWEEN from '@tweenjs/tween.js';
import { createText } from 'three/examples/jsm/webxr/Text2D.js';



const showHelper = true;





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

const koiGroup = new THREE.Group();
const dragonflyGroup = new THREE.Group();
const dragonflyStart = true;


// function randomPositiveNegative(): number {
//   return Math.random() < 0.5 ? -1 : 1;
// }
function rngNum(min: number, max: number): number {
  return (Math.random() * (max - min) + min);
}

function randomBoolean(): boolean {
  return Math.random() < 0.5;
}




function loadModel(modelObj: { path: string; scale: number; animation: boolean; timeScale: number; position: { x: number; y: number; z: number; }; rotation: { x: number; y: number; z: number; };  }): Promise<THREE.Object3D | undefined> {
  return new Promise((resolve, reject) => {
    let model;
    let mixer: THREE.AnimationMixer;
    const timeScale = modelObj.timeScale;
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(modelObj.path,
      (gltf) => {
        model = gltf.scene;
        model.scale.x = modelObj.scale;
        model.scale.y = modelObj.scale;
        model.scale.z = modelObj.scale;
        model.rotateX(modelObj.rotation.x);
        model.rotateY(modelObj.rotation.y);
        model.rotateZ(modelObj.rotation.z);



        model.position.copy(modelObj.position);
        model.castShadow = true;
        //scene.add(model);
        if (modelObj.animation) {
          model.animations;
          mixer = new THREE.AnimationMixer(model);
          mixerAnimations.push(mixer);
          const clips = gltf.animations;
          if (clips.length > 0) {
            // Play first animation
            const action = mixer.clipAction(clips[0]);
            action.setEffectiveTimeScale(timeScale); // 2x speed
            action.play();

          }
        }
        resolve(model);
      },
      undefined,
      (error) => {
        console.error('An error happened while loading the model:', error);
        reject(error);
      }
    );
  });
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
    scene.add( new THREE.AmbientLight( 0xffffff, 0.5 ) );
    //scene.add( new THREE.HemisphereLight( 0xffffff, 0x999999, 1 ) );

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


  koiGroup.position.set(0.0, -0.07, 0.0);
  const koiCount = 10;
  const koiArray: THREE.Object3D<THREE.Object3DEventMap>[] = [];
  for (let i = 0; i < koiCount; i++) {
    const koi = {
      //scale: 1.0,
      scale: rngNum(0.5, 1.15),
      animation: true,
      timeScale: rngNum(0.09, 0.24),
      //timeScale: 0.2,
      path: 'models/koi.glb',
      position: { x:koiGroup.position.x, y: koiGroup.position.y, z: koiGroup.position.z },

      //position: { x: rngNum(-1.8,1.8), y: rngNum(-0.001,-0.07), z: rngNum(-1.8,1.8) },
      rotation: { x: 0, y: 0, z: 0 }
    }
    loadModel(koi).then(model => {
      if (model) {
        const koiThreeObj = new THREE.Object3D();
        koiThreeObj.add(model);
        koiGroup.add(koiThreeObj);
        koiArray.push(koiThreeObj);
      }
    });
  }


  scene.add(koiGroup);

  let koiMovingArray: Array<THREE.Object3D<THREE.Object3DEventMap>> = [];

  function randomizeKoiMovement(koi: THREE.Object3D<THREE.Object3DEventMap>) {
    const startX = koi.position.x;
    const startZ = koi.position.z;
    const targetX = rngNum(-1.8, 1.8);
    const targetZ = rngNum(-1.8, 1.8);

    // Calculate the direction angle
    const angle = Math.atan2(targetX - startX, targetZ - startZ);

    // Create position tween
    const koiTweenPos = new TWEEN.Tween(koi.position)
      .to({ x: targetX, z: targetZ }, 20000)
      .onComplete(() => {
        // Set new start position for the next movement cycle
        koi.position.set(targetX, koi.position.y, targetZ);
        // Remove the koi from the moving array
        koiMovingArray = koiMovingArray.filter((item) => item !== koi);
      })
      .start();

    // Create rotation tween (smoothly rotate towards the new direction)
    const koiTweenRot = new TWEEN.Tween(koi.rotation)
      .to({ y: angle }, 3000) // Rotate over 3 seconds for smooth transition
      .start();
  }



  // adjust the koi deployment interval after the initial deployment
  let upodateKoiDeplymentInterval = false;
  setTimeout(() => {
    upodateKoiDeplymentInterval = true;
  }, 10000);

  let koiDeploymentInterval = rngNum(500, 1000);
  setInterval(() => {
    if (upodateKoiDeplymentInterval) {
      koiDeploymentInterval = rngNum(10000, 20000);
    }


    const rngKoiIndex = Math.floor(rngNum(0, koiArray.length));
    const rngKoi = koiArray[rngKoiIndex];
    //if koiMovingArray does not contian the koi, add it to the array
    if (!koiMovingArray.includes(rngKoi)) {
      koiMovingArray.push(rngKoi);
      randomizeKoiMovement(rngKoi);
    }
  }, koiDeploymentInterval);


  dragonflyGroup.position.set(0, 0.25, 0);
  const dragonfly = {
      scale: 1.5,
      animation: true,
      timeScale: 1.0,
      path: 'models/dragonfly.glb',
      position: dragonflyGroup.position,
      rotation: { x: 0, y: 0, z: 0 }
    }
  loadModel(dragonfly).then(model => {
    if (model) {
      dragonflyGroup.add(model);
    }
  });
  scene.add(dragonflyGroup);

let rngTimer = rngNum(2000, 4000);
function randomizeDragonflyPosition() {
  const dragonflyTween = new TWEEN.Tween(dragonflyGroup.position);
  const startX = rngNum(-3,3);
  const startZ = rngNum(-3,3);
  const startY = rngNum(0.06,0.3);
  dragonflyTween.to({ x: startX, y:startY, z: startZ }, rngTimer)
    .yoyo(false)
    .start().onComplete(() => {
      rngTimer = rngNum(1000, 3000);
    });
  dragonflyGroup.position.set(startX, startY, startZ);
}
randomizeDragonflyPosition();

setInterval(() => {
  randomizeDragonflyPosition();
}, rngTimer + rngNum(200, 1000));



  const raccoon = {
    scale: .9,
    animation: true,
    timeScale: 1.0,
    path: 'models/raccoon.glb',
    position: { x: 2.2, y: 0.1, z: -2.6 },
    rotation: { x: 0, y: 1.5, z: 0 }
  }
  loadModel(raccoon).then(model => {
    if (model) {
      scene.add(model);
    }
  });


  const pond = {
    scale: 1.0,
    animation: false,
    timeScale: 1.0,
    path: 'models/pond.glb',
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 }
  }
  loadModel(pond).then(model => {
    if (model) {
      scene.add(model);
    }
  });

  const tree = {
    scale: 0.50,
    animation: false,
    timeScale: 1.0,
    path: 'models/tree.glb',
    position: { x: 0, y: 0, z: -2.0 },
    rotation: { x: 0, y: 0, z: 0 }

  }
  loadModel(tree).then(model => {
    if (model) {
      scene.add(model);
    }
  });





  const pads = {
    scale: 3,
    animation: false,
    timeScale: 1,
    path: 'models/pads.glb',
    position: { x: .5, y: 0, z: -1.45 },
    rotation: { x: 0, y: -.5, z: 0 }
  }
  loadModel(pads).then(model => {
    if (model) {
      scene.add(model);
    }
  });

  const cattail = {
    scale: .5,
    animation: false,
    timeScale: 1,
    path: 'models/cattail.glb',
    position: { x: .65, y: -.2, z: -1.1 },
    rotation: { x: 0, y: 0, z: 0 }
  }
  loadModel(cattail).then(model => {
    if (model) {
      scene.add(model);
    }
  });
  const cattail2 = {
    scale: .5,
    animation: false,
    timeScale: 1,
    path: 'models/cattail2.glb',
    position: { x: 0, y: -.2, z: -1.05 },
    rotation: { x: 0, y: 0, z: 0 }
  }
  loadModel(cattail2).then(model => {
    if (model) {
      scene.add(model);
    }
  });
  const log = {
    scale: .5,
    animation: false,
    timeScale: 1,
    path: 'models/log.glb',
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 }
  }
  loadModel(log).then(model => {
    if (model) {
      scene.add(model);
    }
  });

  const toad = {
    scale: .20,
    animation: true,
    timeScale: 1,
    path: 'models/toad.glb',
    position: { x: 0, y: .07, z: -.05 },
    rotation: { x: 0, y: 0, z: 0 }
  }
  loadModel(toad).then(model => {
    if (model) {
      scene.add(model);
    }
  });

  const toad2 = {
    scale: .30,
    animation: true,
    timeScale: 1,
    path: 'models/toad.glb',
    position: { x: .5, y: 0.03, z: -1.45 },
    rotation: { x: 0, y: .5, z: 0 }
  }
  loadModel(toad2).then(model => {
    if (model) {
      scene.add(model);
    }
  });


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

 //axes helper
    // axis helper
    const axesHelper = new THREE.AxesHelper( 5 );
    const xText = createText( 'x5', 0.5);
    const xText2 = createText( '-x5', 0.5 );
    const xText3 = createText( 'x2.5', 0.5 );
    const xText4 = createText( '-x2.5', 0.5 );
    const zText = createText( "z5", 0.5 );
    const zText2 = createText( "-z5", 0.5 );
    const zText3 = createText( "z2.5", 0.5 );
    const zText4 = createText( "-z2.5", 0.5 );
    const axisGroup = new THREE.Group();

    // update axis text position
    xText.position.set( 5, 1, 0 );
    xText2.position.set( -5, 1, 0 );
    xText3.position.set( 2.5, 1, 0 );
    xText4.position.set( -2.5, 1, 0 );
    zText.position.set( 0, 1, 5 );
    zText2.position.set( 0, 1, -5 );
    zText3.position.set( 0, 1, 2.5 );
    zText4.position.set( 0, 1, -2.5 )

    // update axis text rotation
    xText.rotation.x = Math.PI * 2;
    xText2.rotation.x = Math.PI * 2;
    xText3.rotation.x = Math.PI * 2;
    xText4.rotation.x = Math.PI * 2;
    zText.rotation.x = Math.PI * 2;
    zText2.rotation.x = Math.PI * 2;
    zText3.rotation.x = Math.PI * 2;
    zText4.rotation.x = Math.PI * 2;

    axisGroup.add(xText, zText, xText2, zText2, xText3, zText3, xText4, zText4);

    if (showHelper) {
      scene.add(axisGroup);
      scene.add(axesHelper);
    }else {
      scene.remove(axisGroup);
      scene.remove( axesHelper );
    }

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
  // updates model animations
  if (mixerAnimations.length > 0) {
    for (let i = 0; i < mixerAnimations.length; i++) {
      mixerAnimations[i].update(delta);
    }
    TWEEN.update();
    console.log('dragonflyStart', dragonflyStart);
  }
}

function koiPond() {
  init();
  animate();
}


export { koiPond };

function forEach(koiArray: THREE.Object3D<THREE.Object3DEventMap>[], arg1: (koi: any) => void) {
  throw new Error('Function not implemented.');
}
