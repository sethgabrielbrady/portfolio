import * as THREE from 'three';
import { createText } from 'three/examples/jsm/webxr/Text2D.js';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const floorColor = 0x222222;

function sandbox() {
  const clock: THREE.Clock = new THREE.Clock();
  const aspect: number = (window.innerWidth / window.innerHeight);
  const distance: number = 7;

  let elapsedTime: number = 0;
  let delta: number = 0;
  const interval = 1/60;
  let camera: THREE.OrthographicCamera;
  let renderer: THREE.WebGLRenderer;
  let scene: THREE.Scene = new THREE.Scene();
  let cameraSwitch = false;


  init();
  animate();

  function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x222222 );

    camera = new THREE.OrthographicCamera(- distance * aspect, distance * aspect, distance, - distance, 1, 1000);
    camera.position.set( 20, 20, 20 );
    camera.rotateOnAxis( new THREE.Vector3( 1, 0, 0 ), - Math.PI / 2 );
    camera.lookAt( scene.position ); // or the origin

    // const light: THREE.DirectionalLight = new THREE.DirectionalLight( 0xffffff, 3 );
    // light.position.set( 20, 20, 20);
    // light.castShadow = false;
    // scene.add( light );
    scene.add( new THREE.HemisphereLight( 0xffffff, 0x999999, 3 ) );
    // scene.add( new THREE.AmbientLight( 0xffffff, 0x999999, 3 ) );

    renderer = new THREE.WebGLRenderer( {
      antialias: false,
      alpha: true,
      precision: "lowp",
      powerPreference: "low-power"
    });

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = false;

    const container: HTMLElement = document.getElementById("sandbox")!;
    container.appendChild(renderer.domElement);

    window.addEventListener( 'keydown', ( event ) => {
      if (event.key === 'c') {
        cameraSwitch = !cameraSwitch;
        translateCamera();
      }
    });

    window.addEventListener( 'scroll', ( event ) => {
      cameraSwitch = true
      scrollCamera(window.scrollY);
    });

    // const orbitEnabled = true;
    // const orbitControls = new OrbitControls(camera, renderer.domElement)
    // orbitControls.enabled = true;
    // orbitControls.enableRotate = orbitEnabled
    // orbitControls.keyPanSpeed = 60.0 // magic number
    // orbitControls.enableZoom = true

    function scrollCamera(scrollPosition: number) {
      console.log(scrollPosition/20);
      console.log(camera.position);
      new TWEEN.Tween(camera.position)
        .to({ x: scrollPosition/20, y: 7, z: scrollPosition/20 })
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
          camera.lookAt( scene.position )
        })
        .start()
    }

    function translateCamera() {
      if (cameraSwitch) {
        camera.position.set( 0, 6, 0 );
        camera.lookAt( scene.position )
      } else {
          new TWEEN.Tween(camera.position)
          .to({ x: 6, y: 7, z: 6 })
          .easing(TWEEN.Easing.Quadratic.InOut)
          .onUpdate(() => {
            camera.lookAt( scene.position )
          })
        .start();
      }
    }

    //floor
    const floorGeometry: THREE.PlaneGeometry = new THREE.PlaneGeometry( 10, 10 );
    const floorMaterial: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({ color: floorColor, transparent: true, opacity: 0.0 });
    const floorText = createText( 'Hello,', 1 );
    const floorText2 = createText( "I'm Seth Brady.", 1 );
    const floor: THREE.Mesh = new THREE.Mesh( floorGeometry, floorMaterial );
    floor.position.set( 0, -1, 0 );

    floor.rotation.x = - Math.PI / 2;
    floor.receiveShadow = false;
    floorText.position.set( -3, 3, .1 );
    floorText2.position.set( -1.35, 2.15, .1 );
    floorText.scale.set( 0.75, 0.75, 0.75 );
    floorText2.scale.set( 0.75, 0.75, 0.75 );
    floor.add( floorText, floorText2 );
    scene.add(floor);
    container.addEventListener( 'resize', onWindowResize );
  }


  //floor cubes
  // const oldCubeColor: number = 0x00ff00;
  const newCubeColor: number = 0x111111;
  const cubeCount: number = 100;
  const cubeSize: number = .125;
  // const cubeSize: number = .125;
  const cubeGeometry: THREE.BoxGeometry = new THREE.BoxGeometry( cubeSize, cubeSize, cubeSize );
  const cubeMaterial: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({ color: newCubeColor, transparent: true, opacity: 0.15, emissive: 0x00ffff });
  const cube: THREE.Mesh = new THREE.Mesh( cubeGeometry, cubeMaterial );

  const cubeFloor = 0 + cubeSize;
  let xPos: number = 5;
  const yPos: number = cubeFloor;
  let zPos: number = 5;
  const cubeGroup: THREE.Group = new THREE.Group();

  for (let i = 0; i < cubeCount; i++) {
    for (let j = 0; j < cubeCount; j++) {
      const cubeClone = cube.clone()
      zPos -= cubeSize;
      cubeClone.position.set(xPos, yPos, zPos);
      cubeGroup.add(cubeClone);
    }
    zPos = 5;
    xPos -= cubeSize;
  }
  scene.add(cubeGroup);

  function getMouseCubeIntersection() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const mouseCubePosition = new THREE.Vector3();

    window.addEventListener( 'mousemove', ( event ) => {
      mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
      raycaster.setFromCamera( mouse, camera );
      const cubes = cubeGroup.children;
      const intersects = raycaster.intersectObjects( cubeGroup.children );
      mouseCubePosition.copy( intersects[0].object.position );
      cubes.forEach((cube) => {
        if (mouseCubePosition.x >= cube.position.x - cubeSize/2 && mouseCubePosition.x <= cube.position.x + cubeSize/2) {
          if (mouseCubePosition.z >= cube.position.z - cubeSize/2 && mouseCubePosition.z <= cube.position.z + cubeSize/2) {
            new TWEEN.Tween(cube.position)
              .to({ x: cube.position.x, y: cube.position.y + 1, z: cube.position.z}, 400)
              .easing(TWEEN.Easing.Quadratic.InOut)
              .start()
          } else {
            new TWEEN.Tween(cube.position)
              .to({ x: cube.position.x, y: cubeFloor, z: cube.position.z }, 400)
              .easing(TWEEN.Easing.Quadratic.InOut)
              .start()
          }
        } else {
          new TWEEN.Tween(cube.position)
          .to({ x: cube.position.x, y: cubeFloor , z: cube.position.z }, 400)
          .easing(TWEEN.Easing.Quadratic.InOut)
          .start()
        }
      });
    });
  }

  function floorCubeAnimator() {
    cubeGroup.children.forEach((cube: THREE.Mesh) => {
      cube.position.y = Math.sin(elapsedTime + (cube.position.x/2 + cube.position.z)/2);
    });
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }

  function animate() {
    // renderer.setAnimationLoop( render );
    requestAnimationFrame(animate);
    delta += clock.getDelta();
    elapsedTime = clock.elapsedTime;
     if (delta  > interval) {
      // The draw or time dependent code are here
      render();
      delta = delta % interval;
     }
  }

  function render() {
    // delta = clock.getDelta();
    renderer.render( scene, camera );
    TWEEN.update();
    floorCubeAnimator();
    // getMouseCubeIntersection();
  }
}

export { sandbox };
