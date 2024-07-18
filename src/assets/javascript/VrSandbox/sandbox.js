import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { World } from 'three/examples/jsm//libs/ecsy.module.js';
import { createText } from 'three/examples/jsm/webxr/Text2D.js';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

function sandbox() {
  const world = new World();
  const clock = new THREE.Clock();
  let camera, renderer, scene;
  let backgroundColor = 0x222222;

  function randomizeDirection() {
    let random = Math.random();
    if(random < 0.5) {
      return -1;
    } else {
      return 1;
    }
  }

  init();
  animate();
  //units a second
  let speed = 0.2;
  let delta = 1/60;

  function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color( backgroundColor );

    const aspect = (window.innerWidth / window.innerHeight);
    const distance = 7;
    camera = new THREE.OrthographicCamera(- distance * aspect, distance * aspect, distance, - distance, 1, 1000);
    camera.position.set( 20, 20, 20 ); // all components equal
    // camera.position.set( 1.4788384930664669e-8, 34.641016151360226, 0.00003464255276393731 );
    camera.lookAt( scene.position ); // or the origin

    const light = new THREE.DirectionalLight( 0xffffff, 3 );
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

    let container = document.getElementById("sandbox");
    container.appendChild(renderer.domElement);

    renderer.xr.enabled = true;
    renderer.xr.cameraAutoUpdate = false;

    //  Grid
    //  const gridHelper = new THREE.GridHelper(100, 100, 0x18fbe3,0x18fbe3);
    //  scene.add( gridHelper );
    //  gridHelper.visible = false;

    //  window.addEventListener( 'keydown', ( event ) => {
    //   if (event.key === 'g') {
    //     gridHelper.visible = !gridHelper.visible;
    //   }
    //  });


     // axis helper
    // const axesHelper = new THREE.AxesHelper( 5 );
    // scene.add( axesHelper );
    // const xText = createText( 'x', 1 );
    // const xText2 = createText( '-x', 1 );
    // const zText = createText( "z", 1 );
    // const zText2 = createText( "-z", 1 );
    // const axisGroup = new THREE.Group();

    // // update axis text position
    // xText.position.set( 5, 1, 0 );
    // xText2.position.set( -5, 1, 0 );
    // zText.position.set( 0, 1, 5 );
    // zText2.position.set( 0, 1, -5 );

    // // update axis text rotation
    // xText.rotation.x = Math.PI / 2;
    // xText2.rotation.x = Math.PI / 2;
    // zText.rotation.x = Math.PI / 2;
    // zText2.rotation.x = Math.PI / 2;

    // axisGroup.add(xText, zText, xText2, zText2);

    // scene.add(axisGroup);


    // models
    // function loadModel (modelObj) {
    //   let gltfLoader = new GLTFLoader();
    //   gltfLoader.load(modelObj.path,
    //     (gltf) => {
    //      let model = gltf.scene
    //       model.scale.x = modelObj.scale;
    //       model.scale.y = modelObj.scale;
    //       model.scale.z = modelObj.scale;
    //       model.position.x = modelObj.position.x;
    //       model.position.y = modelObj.position.y;
    //       model.position.z = modelObj.position.z;
    //       model.castShadow = true;
    //       scene.add(model);
    //     }
    //   )
    // }

    // const palm = {
    //   scale: 0.045,
    //   path: 'models/palmshiny.glb',
    //   position: { x: -4, y: 0, z: 0 }
    // }
    // loadModel(palm);

    //orbit controls
    let orbitEnabled = false;
    let orbitControls = new OrbitControls(camera, renderer.domElement)
    orbitControls.enabled = true;
    orbitControls.enableRotate = orbitEnabled
    orbitControls.keyPanSpeed = 60.0 // magic number
    orbitControls.enableZoom = true

    window.addEventListener( 'keydown', ( event ) => {
      if (event.key === 'o') {
        orbitEnabled = !orbitEnabled
        orbitControls.enableRotate = orbitEnabled;
      }
     });


    //floor
    const floorColor = 0x111111;
    const floorGeometry = new THREE.PlaneGeometry( 10, 10 );
    const floorMaterial = new THREE.MeshPhongMaterial( { color: floorColor, transparent: false } );

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

    window.addEventListener( 'resize', onWindowResize() );
  }

  //Update all the collision to use intersecting bounding boxes instead of the position of the objects
  //breakout
  const breakoutObject = new THREE.Group();
  // const startingYPos = 18.84;
  const startingYPos = 0.25


  const ballGeo = new THREE.SphereGeometry( 0.15 );
  const ballMatr = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
  const ball = new THREE.Mesh( ballGeo, ballMatr );
  const wallAxis = 5.00;
  let xAxis = (speed * delta)
  let yAxis = -1 + (speed * delta)

  ball.position.x = randomizeDirection();
  ball.position.y = startingYPos;
  ball.position.z = -1;
  breakoutObject.add(ball);


  const paddleGeo = new THREE.BoxGeometry( 2.0, .25, .25 );
  const paddleMatr = new THREE.MeshPhongMaterial( { color: 0x04d9ff } );
  const paddle = new THREE.Mesh( paddleGeo, paddleMatr );

  paddle.position.y = startingYPos;
  paddle.position.x = 0
  paddle.position.z = 4.5;
  breakoutObject.add(paddle);


  const brickGeo = new THREE.BoxGeometry( 1.0, .25, .25 );
  const brickMatr = new THREE.MeshPhongMaterial( { color: 0xb116e8 } );
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
      if (ball.position.x >= brick.position.x - 1 && ball.position.x <= brick.position.x + 1) {
        if(ball.position.z >= brick.position.z - .25 && ball.position.z <= brick.position.z + .25) {
          bricks.remove(brick);
          yAxis = -yAxis + getRandomArbitrary();
          xAxis = -xAxis + getRandomArbitrary();
        }
      }
    });
  }

  function collisions(){
    let smoothness = .175;
    ball.translateX( xAxis * smoothness);
    ball.translateZ( yAxis * smoothness);

    if(ball.position.x <= -1 * wallAxis  ) {
      ball.position.x = (-1 * wallAxis)
      xAxis = -xAxis + getRandomArbitrary();
    }

    if(ball.position.x >= wallAxis) {
      ball.position.x = wallAxis
      xAxis = -xAxis + getRandomArbitrary();
    }

    if(ball.position.z <= -1 * wallAxis) {
      ball.position.z = (-1 * wallAxis)
      yAxis = -yAxis + getRandomArbitrary();
    }

    if(ball.position.z >= wallAxis) {
      ball.position.z = wallAxis
      yAxis = -yAxis + getRandomArbitrary();
    }

    if (ball.position.x >= paddle.position.x - 2 && ball.position.x <= paddle.position.x + 2) {
      if(ball.position.z >= paddle.position.z - .25 && ball.position.z <= paddle.position.z + .25) {
        yAxis = -yAxis + getRandomArbitrary();
        xAxis = -xAxis + getRandomArbitrary();
      }
    }
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

  // function updateBreakoutYPosition() {
  //   breakoutObject.translateY(-0.1);
  //   console.log(breakoutObject.position.y);
  // }

  // function updateCameraPosition() {
  //   let cx = camera.position.x;
  //   let cy = camera.position.y;
  //   let cz = camera.position.z;
  //   if (camera.position.y > 20 ) {
  //     cy -= 0.1;
  //   }
  //   if (camera.position.x < 20 ) {
  //     cx  += 0.1;
  //   }
  //   if (camera.position.z < 20 ) {
  //     cz  += 0.1;
  //   }
  //   camera.position.set(cx, cy, cz);
  // }

  function render() {
    let delta = clock.getDelta();
    const elapsedTime = clock.elapsedTime;
    renderer.xr.updateCamera( camera );
    world.execute( delta, elapsedTime );
    renderer.render( scene, camera );
    collisions();

    // if (elapsedTime > 3.0 && elapsedTime < 6.1) {
    //   updateBreakoutYPosition();
    // }
    // if (elapsedTime > 1.0){
    //   updateCameraPosition();
    //   }
    // }
    // if (camera.position.y == 20 && camera.position.x == 20 && camera.position.z == 20) {
    //   camera.update
    // }

  }
}

//{x: 1.4788384930664669e-8, y: 34.641016151360226, z: 0.00003464255276393731}
// position{x: 20, y: 20, z: 20.000000000000004}
export { sandbox };
