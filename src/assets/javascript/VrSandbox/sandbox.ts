import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { World } from 'three/examples/jsm/libs/ecsy.module.js';
import { createText } from 'three/examples/jsm/webxr/Text2D.js';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';



// Look at threejs ttf loader
//https://threejs.org/examples/#webgl_loader_ttf

// Look at threejs multiple elements with text
//https://threejs.org/examples/#webgl_multiple_elements_text

// post processing
//https://threejs.org/examples/#webgl_postprocessing
//https://threejs.org/examples/#webgl_postprocessing_unreal_bloom

const raycaster = new THREE.Raycaster();
const floorColor = 0x222222;
  // const backgroundColor: THREE.Color = new THREE.Color(0x222222);

function sandbox() {
  const world: THREE.World = new World();
  const clock: THREE.Clock = new THREE.Clock();
  let delta: number = 0;
  let camera: THREE.OrthographicCamera;
  let renderer: THREE.WebGLRenderer;
  let scene: THREE.Scene = new THREE.Scene();

  function randomizeDirection() {
    const random: number = Math.random();
    if(random < 0.5) {
      return -1;
    } else {
      return 1;
    }
  }

  init();
  animate();
  //units a second
  const speed: number = 3;

  function init() {
    scene = new THREE.Scene();

    scene.background = new THREE.Color( 0x222222 );

    const aspect: number = (window.innerWidth / window.innerHeight);
    const distance: number = 7;

    camera = new THREE.OrthographicCamera(- distance * aspect, distance * aspect, distance, - distance, 1, 1000);
    camera.position.set( 20, 20, 20 ); // all components equal
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
    } );



    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;

    const container: HTMLElement = document.getElementById("sandbox")!;
    container.appendChild(renderer.domElement);

    renderer.xr.enabled = true;
    renderer.xr.cameraAutoUpdate = false;

    //orbit controls
    let orbitEnabled = false;
    const orbitControls = new OrbitControls(camera, renderer.domElement)
    orbitControls.enabled = true;
    orbitControls.enableRotate = orbitEnabled
    orbitControls.keyPanSpeed = 60.0 // magic number
    orbitControls.enableZoom = true

    window.addEventListener( 'keydown', ( event ) => {
      if (event.key === 'o') {
        orbitEnabled = !orbitEnabled
        orbitControls.enableRotate = orbitEnabled;
      }
      if (event.key === 'b') {
        if (!ballInPlay) {
          addBall(paddle.position.x);
        }
      }
      if (event.key === 'c') {
        cameraSwitch = !cameraSwitch;
        translateCamera();
      }
     });

     window.addEventListener( 'click', ( event ) => {
      if (!ballInPlay) {
          addBall(paddle.position.x);
        }
      });


    let cameraSwitch = false;




     function translateCamera() {
      if (cameraSwitch) {
        camera.position.set( 0, 6, 0 );
        camera.lookAt( scene.position )
      } else {
          new TWEEN.Tween(camera.position)
          .to({ x: 6, y: 7, z: 6 })
          .easing(TWEEN.Easing.Quadratic.InOut)
          .onUpdate(() =>
            {
              camera.lookAt( scene.position )
            })
        .start();
        // camera.position.set( 20, 20, 20 );
      }

     }


    //floor
    const floorGeometry = new THREE.PlaneGeometry( 10, 10 );
    const floorMaterial = new THREE.MeshPhongMaterial( { color: floorColor, transparent: true, opacity:0 } );

    const floor = new THREE.Mesh( floorGeometry, floorMaterial );
    floor.rotation.x = - Math.PI / 2;
    floor.receiveShadow = false;

    const floorText = createText( 'Hello,', 1 );
    const floorText2 = createText( "I'm Seth Brady.", 1 );

    floorText.position.set( -3, 3, .1 );
    floorText2.position.set( -1.35, 2.15, .1 );
    floorText.scale.set( 0.75, 0.75, 0.75 );
    floorText2.scale.set( 0.75, 0.75, 0.75 );
    floor.add( floorText, floorText2 );
    scene.add(floor);

    container.addEventListener( 'resize', onWindowResize );
    container.addEventListener( 'pointermove', onIntersect );
  }

  //breakout
  const breakoutObject = new THREE.Group();
  const startingYPos = 0.25


  const ballGeo = new THREE.SphereGeometry( 0.15 );
  const ballMatr = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
  const ball = new THREE.Mesh( ballGeo, ballMatr );

  const wallAxis = 5.00;
  let xAxis = (speed * delta)
  let yAxis = -1 + (speed * delta)
  let ballInPlay = false;

  function addBall(x = null) {
    ballInPlay = !ballInPlay;
    ball.position.x = x !== null ? x : randomizeDirection();
    ball.position.y = startingYPos;
    ball.position.z = 4;
    breakoutObject.add(ball);
    xAxis = (speed * delta)
    yAxis = -1 + (speed * delta)
  }

  addBall();


  const paddleGeo = new THREE.BoxGeometry( 2.0, .25, .25 );
  const paddleMatr = new THREE.MeshPhongMaterial( { color: 0x04d9ff } );
  const paddle = new THREE.Mesh( paddleGeo, paddleMatr );

  paddle.position.y = startingYPos;
  paddle.position.x = 0
  paddle.position.z = 5;
  breakoutObject.add(paddle);


  const brickGeo = new THREE.BoxGeometry( 1.0, .25, .25 );
  const brickMatr = new THREE.MeshPhongMaterial( { color: 0xb116e8 } );
  brickMatr.transparent = true;
  brickMatr.opacity = 0.75;

  const orginalBrick = new THREE.Mesh( brickGeo, brickMatr );

  orginalBrick.position.y = startingYPos;

  const bricks = new THREE.Group();

  function addBricks (rows = 7, cols = 3) {
    for(let i = 0; i < rows; i++) {
      for(let j = 0; j < cols; j++) {
        const brick = orginalBrick.clone();
        brick.position.x = (i * 1.5) - 4.5;
        brick.position.z = (j * .5) - 5.0;
        bricks.add(brick);
      }
    }
   breakoutObject.add(bricks);
  }
  addBricks();

  scene.add(breakoutObject);

  //brick collisions
  function checkBrickCollision() {
    bricks.children.forEach((brick) => {
      if (ball.position.x >= brick.position.x - 0.5 && ball.position.x <= brick.position.x + 0.5) {
        if(ball.position.z >= brick.position.z - .25 && ball.position.z <= brick.position.z + .25) {
          bricks.remove(brick);
          yAxis = -yAxis + getRandomArbitrary();
          xAxis = -xAxis + getRandomArbitrary();
        }
      }
    });
  }


  function checkPaddeCollision() {
    if (ball.position.x >= paddle.position.x - 1 && ball.position.x <= paddle.position.x + 1 ){
      if (ball.position.z >= paddle.position.z - 0.35 && ball.position.z <= paddle.position.z + 0.35) {
        yAxis = -yAxis + getRandomArbitrary();
        xAxis = -xAxis + getRandomArbitrary();
      }
    }
  }

  function collisions(){
    if (xAxis >= 2) {
      xAxis = 2;
    }
    if (yAxis >= 2) {
      yAxis = 2;
    }
    // console.log("xAxis", xAxis, yAxis);
    const smoothness = .175;
    ball.translateX( xAxis * smoothness);
    ball.translateZ( yAxis * smoothness);

    if(ball.position.x <= -1 * wallAxis  ) {
      ball.position.x = (-1 * wallAxis)
      xAxis = (-1 * (xAxis + getRandomArbitrary()))* randomizeDirection();
    }

    if(ball.position.x >= wallAxis) {
      ball.position.x = wallAxis
      xAxis = (-1 * (xAxis + getRandomArbitrary()))* randomizeDirection();
    }

    if(ball.position.z <= -1 * wallAxis) {
      ball.position.z = (-1 * wallAxis)
      yAxis = -yAxis + getRandomArbitrary();
    }


    if(ball.position.z >= wallAxis + 2) {
     breakoutObject.remove(ball);
     ballInPlay = !ballInPlay;
    }

    checkPaddeCollision();
    checkBrickCollision();
  }

  function getRandomArbitrary() {
    const random = Math.random() * (0.5 - 0.1) + .01;
    return random;
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }

  function animate() {
    renderer.setAnimationLoop( render );
  }

  const pointer = new THREE.Vector2();

  function onIntersect( event: { clientX: number; } ) {
    pointer.x = event.clientX / 90 ;
    raycaster.setFromCamera( pointer, camera );
		// See if the ray from the camera into the world hits one of our meshes
		// const intersects = raycaster.intersectObject( paddle );
    // console.log("paddle", intersects.length);

    if (pointer.x > 5 && pointer.x < 15) {
      paddle.position.x = pointer.x - 10;
    }
  }

  function render() {
    delta = clock.getDelta();
    const elapsedTime = clock.elapsedTime;
    renderer.xr.updateCamera( camera );
    world.execute( delta, elapsedTime );
    renderer.render( scene, camera );
    // cubeBall.position.x = ball.position.x;
    // cubeBall.position.z= ball.position.z;
    collisions();
    TWEEN.update();
  }
}

export { sandbox };
