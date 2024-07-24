import * as THREE from 'three';
import { createText } from 'three/examples/jsm/webxr/Text2D.js';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';

const floorColor = 0x222222;

function sandbox() {
  const clock: THREE.Clock = new THREE.Clock();
  const aspect: number = (window.innerWidth / window.innerHeight);
  const distance: number = 7;

  let delta: number = 0;
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
    camera.lookAt( scene.position ); // or the origin

    const light: THREE.DirectionalLight = new THREE.DirectionalLight( 0xffffff, 3 );
    light.position.set( 0, 6, 0 );
    light.castShadow = true;
    scene.add( light );
    scene.add( new THREE.HemisphereLight( 0xffffff, 0x999999, 3 ) );

    renderer = new THREE.WebGLRenderer( {
      antialias: false,
      alpha: true,
      precision: "lowp",
      powerPreference: "low-power"
    });

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;

    const container: HTMLElement = document.getElementById("sandbox")!;
    container.appendChild(renderer.domElement);

    window.addEventListener( 'keydown', ( event ) => {
      if (event.key === 'c') {
        cameraSwitch = !cameraSwitch;
        translateCamera();
      }
    });

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
    const floorMaterial: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial( { color: floorColor, transparent: true, opacity:0 } );
    const floorText = createText( 'Hello,', 1 );
    const floorText2 = createText( "I'm Seth Brady.", 1 );
    const floor: THREE.Mesh = new THREE.Mesh( floorGeometry, floorMaterial );

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

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }

  function animate() {
    renderer.setAnimationLoop( render );
  }

  function render() {
    delta = clock.getDelta();
    renderer.render( scene, camera );
    TWEEN.update();
  }
}

export { sandbox };
