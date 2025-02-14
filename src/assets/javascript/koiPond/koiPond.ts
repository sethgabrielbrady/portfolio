import * as THREE from 'three';
//import { createText } from 'three/examples/jsm/webxr/Text2D.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


  // const speed: number = 2;
  const clock: THREE.Clock = new THREE.Clock();
  // const raycaster = new THREE.Raycaster();
  const scene: THREE.Scene = new THREE.Scene();


  const interval = 1/60;

  let camera: THREE.OrthographicCamera;
  let renderer: THREE.WebGLRenderer;
  let delta: number = 0;
  // let xAxis = speed * delta;
  // let yAxis = -1 + (speed * delta);

  //animation
  let mixer: THREE.AnimationMixer;



   // models
  function loadModel (modelObj: { path: string; scale: number; animation: boolean; timeScale: number; position: { x: number; y: number; z: number; }; }) {
    const gltfLoader = new GLTFLoader();
    let model;
    const timeScale = modelObj.timeScale;
    gltfLoader.load(modelObj.path,
      (gltf) => {
        model = gltf.scene
        model.scale.x = modelObj.scale;
        model.scale.y = modelObj.scale;
        model.scale.z = modelObj.scale;
        // model.position.x = modelObj.position.x;
        // model.position.y = modelObj.position.y;
        // model.position.z = modelObj.position.z;
        model.position.copy(modelObj.position);
        model.castShadow = true;
        scene.add(model);
        if (modelObj.animation) {
          model.animations;
          mixer = new THREE.AnimationMixer( model );
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
    scene.add( lightCube );
    //scene.add( new THREE.HemisphereLight( 0xffffff, 0x999999, 3 ) );


    const ambientLight = new THREE.AmbientLight( 0xffffff, 0.25 );
    scene.add( ambientLight );

    renderer = new THREE.WebGLRenderer( {
      antialias: false,
      alpha: true,
      precision: "lowp",
      powerPreference: "low-power",
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
      timeScale: 20.0,
      path: 'models/koi.glb',
      position: { x: 1, y: -0.06, z: 1 }
    }

    // need to create animation path for koi
    // will probaly do something like the ball physics in breakout - when the koi hits the edge of the pond, it will change direction
    // randomly add stops for the koi to stay still


    loadModel(pond);
    loadModel(koi);


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
    if (mixer) {
      mixer.update(clock.getDelta());
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