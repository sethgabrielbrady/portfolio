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


   // models
   function loadModel (modelObj: { path: string; scale: number; position: { x: number; y: number; z: number; }; }) {
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
      );
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
    const pond = {
      scale: 1.0,
      path: 'models/jpond.glb',
      position: { x: 0, y: 0, z: 0 }
    }

    loadModel(pond);


    const floorColor = 0x00FFFF;
    const floorGeometry = new THREE.PlaneGeometry( 4.75, 4.85);
    const floorMaterial = new THREE.MeshPhongMaterial({
                                                    color: floorColor,
                                                    transparent: true,
                                                    opacity: 0.5,
                                                  });
    const floor = new THREE.Mesh( floorGeometry, floorMaterial );
    floor.rotation.x = - Math.PI / 2;
    floor.position.y = -0.009;
    scene.add( floor );



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