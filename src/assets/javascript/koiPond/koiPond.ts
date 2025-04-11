import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as TWEEN from '@tweenjs/tween.js';
import { createText } from 'three/examples/jsm/webxr/Text2D.js';



let showHelper = false;
let camera: THREE.OrthographicCamera;
let renderer: THREE.WebGLRenderer;
let delta: number = 0;
// let xAxis = speed * delta;
// let yAxis = -1 + (speed * delta);


const clock: THREE.Clock = new THREE.Clock();
const scene: THREE.Scene = new THREE.Scene();
const interval = 1/60;
const mixerAnimations: Array<THREE.AnimationMixer> = []; // animation mixer array
const koiGroup = new THREE.Group();
const dragonflyGroup = new THREE.Group();
// const raycaster = new THREE.Raycaster();


function rngNum(min: number, max: number): number {
  return (Math.random() * (max - min) + min);
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



  koiGroup.position.set(0.0, -0.1, 0.0);
  const koiCount = 10;
  const koiArray: THREE.Object3D<THREE.Object3DEventMap>[] = [];
  for (let i = 0; i < koiCount; i++) {
    const koi = {
      //scale: 1.0,
      scale: rngNum(0.4, 1),
      animation: true,
      timeScale: rngNum(0.09, 0.24),
      path: 'models/koi.glb',
      position: { x:koiGroup.position.x, y: koiGroup.position.y, z: koiGroup.position.z },
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
    const targetY = rngNum(-0.1, -0.07 );
    const targetZ = rngNum(-1.8, 1.8);

    // Calculate the direction angle
    const angle = Math.atan2(targetX - startX, targetZ - startZ);

    // Create position tween
    const koiTweenPos = new TWEEN.Tween(koi.position);
      koiTweenPos.to({ x: targetX, y: targetY, z: targetZ }, 20000)
      .onComplete(() => {
        // Set new start position for the next movement cycle
        koi.position.set(targetX, targetY, targetZ);
        // Remove the koi from the moving array
        koiMovingArray = koiMovingArray.filter((item) => item !== koi);
      })
      .start();


    const koiTweenRot = new TWEEN.Tween(koi.rotation); // Create rotation tween (smoothly rotate towards the new direction)
    koiTweenRot.to({ y: angle }, 3000) // Rotate over 3 seconds for smooth transition
      .start();
  }

  let upodateKoiDeplymentInterval = false; // adjust the koi deployment interval after the initial deployment
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
    if (!koiMovingArray.includes(rngKoi)) {  //if koiMovingArray does not contian the koi, add it to the array
      koiMovingArray.push(rngKoi);
      randomizeKoiMovement(rngKoi);
    }
  }, koiDeploymentInterval);


  dragonflyGroup.position.set(0, 0.25, 0);
  const dragonfly = {
      scale: 2.5,
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

  const dragonflyInterval = rngNum(2000, 4000);

  // combine this and koi into single function
  function randomizeDragonflyMovement(dragonfly: THREE.Object3D<THREE.Object3DEventMap>) {
    const startX = dragonfly.position.x;
    const startZ = dragonfly.position.z;
    const targetX = rngNum(-2.5,2.5);
    const targetZ = rngNum(-2.5,2.5);

    // Calculate the direction angle
    const angle = Math.atan2(targetX - startX, targetZ - startZ);

    // Create position tween
    const dragonflyTweenPos = new TWEEN.Tween(dragonfly.position);
    dragonflyTweenPos.to({ x: targetX, y: dragonflyGroup.position.y, z: targetZ }, 1500)
      .onComplete(() => {
        // Set new start position for the next movement cycle
        dragonfly.position.set(targetX, dragonflyGroup.position.y, targetZ);
      })
      .start();


    const dragonflyTweenRot = new TWEEN.Tween(dragonfly.rotation); // Create rotation tween (smoothly rotate towards the new direction)
    dragonflyTweenRot.to({ y: angle }, 200) // Rotate over 3 seconds for smooth transition
      .start();
  }
  randomizeDragonflyMovement(dragonflyGroup);

  setInterval(() => {
    randomizeDragonflyMovement(dragonflyGroup);
  }, dragonflyInterval + rngNum(200, 10000));


  const grassGroup = new THREE.Group();
  grassGroup.position.set(0.0, -0.260, 0.0);
  const grassCount = 80;
  for (let i = 0; i < grassCount; i++) {
    const grass = {
      scale: rngNum(.09, .4),
      animation: false,
      timeScale: 1.0,
      path: 'models/greengrass.glb',
      position: { x:rngNum(-2,2), y: grassGroup.position.y, z: rngNum(-2,2) },
      rotation: { x: 0, y: 0, z: 0 }
    }
    loadModel(grass).then(model => {
      if (model) {
        grassGroup.add(model);
      }
    });
  }
  scene.add(grassGroup);

  const weedsGroup = new THREE.Group();
  weedsGroup.position.set(0.0, -0.270, 0.0);
  const weedsCount = 10;
  for (let i = 0; i <= weedsCount; i++) {
    const weeds = {
      scale: rngNum(.09, 0.46),
      animation: false,
      timeScale: 1.0,
      path: 'models/cattail2.glb',
      position: { x:rngNum(-1.25,1.25), y: grassGroup.position.y, z: rngNum(-1.25,1.25) },

      rotation: { x: 0, y: 0, z: 0 }
    }
    loadModel(weeds).then(model => {
      if (model) {
        // const weedsThreeObj = new THREE.Object3D();
        weedsGroup.add(model);
      }
    });
  }
  scene.add(weedsGroup);

  const lilipadsGroup = new THREE.Group();
  lilipadsGroup.position.set(0.0, -0.002, 0.0);
  const lilipadsCount = 6;
  for (let i = 0; i <= lilipadsCount; i++) {
    const lilipads = {
      scale: rngNum(.09, 0.36),
      animation: false,
      timeScale: 1.0,
      path: 'models/lilypad.glb',
      position: { x:rngNum(-1.25,1.25), y: lilipadsGroup.position.y, z: rngNum(-1.25,1.25) },
      rotation: { x: 0, y: rngNum(-1,1), z: 0 }
    }
    loadModel(lilipads).then(model => {
      if (model) {
        // const lilipadsThreeObj = new THREE.Object3D();
        lilipadsGroup.add(model);
      }
    });
  }
  scene.add(lilipadsGroup);

  const lilipadsGroup2 = new THREE.Group();
  lilipadsGroup2.position.set(0.0, -0.002, 0.0);
  const lilipadsCount2 = 4;
  for (let i = 0; i <= lilipadsCount2; i++) {
    const lilipads = {
      scale: rngNum(.09, 0.36),
      animation: false,
      timeScale: 1.0,
      path: 'models/lilypad2.glb',
      position: { x:rngNum(-1.25,1.25), y: lilipadsGroup2.position.y, z: rngNum(-1.25,1.25) },
      rotation: { x: 0, y: rngNum(-1,1), z: 0 }
    }
    loadModel(lilipads).then(model => {
      if (model) {
        // const lilipadsThreeObj = new THREE.Object3D();
        lilipadsGroup2.add(model);
      }
    });
  }
  scene.add(lilipadsGroup2);

  const raccoon = {
    scale: .5,
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
    path: 'models/pond3.glb',
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 }
  }
  loadModel(pond).then(model => {
    if (model) {
      scene.add(model);
    }
  });

  const tree = {
    scale: 0.60,
    animation: false,
    timeScale: 1.0,
    path: 'models/tree.glb',
    position: { x: -0.7, y: 0, z: -2.0 },
    rotation: { x: 0, y: 0, z: 0 }
  }
  loadModel(tree).then(model => {
    if (model) {
      scene.add(model);
    }
  });

  const frogPad = {
    scale: 0.5,
    animation: false,
    timeScale: 1,
    path: 'models/lilypad.glb',
    position: { x: 0, y: -0.01, z: 0 },
    rotation: { x: 0, y: -0.7, z: 0 }
  }
  loadModel(frogPad).then(model => {
    if (model) {
      scene.add(model);
    }
  });

  const cattail = {
    scale: .4,
    animation: false,
    timeScale: 1,
    path: 'models/cattail.glb',
    position: { x: .65, y: -.1, z: -1.2 },
    rotation: { x: 0, y: 0, z: 0 }
  }
  loadModel(cattail).then(model => {
    if (model) {
      scene.add(model);
    }
  });

  const cattail2 = {
    scale: .4,
    animation: false,
    timeScale: 1,
    path: 'models/cattail2.glb',
    position: { x: 0, y: -.1, z: -1.15 },
    rotation: { x: 0, y: 0, z: 0 }
  }
  loadModel(cattail2).then(model => {
    if (model) {
      scene.add(model);
    }
  });

  const rockCattail = {
    scale: .4,
    animation: false,
    timeScale: 1,
    path: 'models/cattail.glb',
    position: { x: -1.25, y: -.1, z: -0.10 },
    rotation: { x: 0, y: .2, z: 0 }
  }
  loadModel(rockCattail).then(model => {
    if (model) {
      scene.add(model);
    }
  });

  const log = {
    scale: .5,
    animation: false,
    timeScale: 1,
    path: 'models/log.glb',
    position: { x: .5, y: 0, z: -1.45 },
    rotation: { x: 0, y: 0.5, z: 0 }
  }
  loadModel(log).then(model => {
    if (model) {
      scene.add(model);
    }
  });

  const logToad = {
    scale: .20,
    animation: true,
    timeScale: 0.5,
    path: 'models/toad.glb',
    position: { x: .5, y: .07, z: -1.5 },
    rotation: { x: 0, y: .5, z: 0 }
  }
  loadModel(logToad).then(model => {
    if (model) {
      scene.add(model);
    }
  });

  const lilyToad = {
    scale: .30,
    animation: true,
    timeScale: 0.5,
    path: 'models/toad.glb',

    position: { x: 0, y: -0.00001, z: -.02},
    rotation: { x: 0, y: 0, z: 0 }
  }
  loadModel(lilyToad).then(model => {
    if (model) {
      scene.add(model);
    }
  });

  const bench = {
    scale: .125,
    animation: true,
    timeScale: 0.5,
    path: 'models/bench2.glb',
    position: { x:-1.2, y: .07, z: 2.2 },
    rotation: { x: 0, y: 2.5, z: 0 }
  }
  loadModel(bench).then(model => {
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
  window.addEventListener('keydown', (e) => {
    if (e.key === 'h') {
      if (showHelper) {
        scene.remove(axisGroup);
        scene.remove( axesHelper );
        showHelper = false;
      } else {
        scene.add(axisGroup);
        scene.add(axesHelper);
        showHelper = true;
      }
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
  // updates model animations
  if (mixerAnimations.length > 0) {
    for (let i = 0; i < mixerAnimations.length; i++) {
      mixerAnimations[i].update(delta);
    }
    TWEEN.update();
  }
}

function koiPond() {
  init();
  animate();
}


export { koiPond };

