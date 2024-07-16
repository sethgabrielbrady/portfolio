import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { World } from 'three/examples/jsm//libs/ecsy.module.js';
import { createText } from 'three/examples/jsm/webxr/Text2D.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'


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
  let speed = 0.5;
  let delta = 1/60;

  function init() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color( backgroundColor );

    const axesHelper = new THREE.AxesHelper( 5 );
    scene.add( axesHelper );

    const aspect = (window.innerWidth / window.innerHeight);
    const distance = 7;
    // const d = 100;
    camera = new THREE.OrthographicCamera(- distance * aspect, distance * aspect, distance, - distance, 1, 1000);
    camera.position.set( 20, 20, 20 ); // all components equal
    camera.lookAt( scene.position ); // or the origin

    const light = new THREE.DirectionalLight( 0xffffff, 3 );
    light.position.set( 0, 6, 0 );
    light.castShadow = true;
    scene.add( light );
    scene.add( new THREE.HemisphereLight( 0xffffff, 0x999999, 3 ) );
    // scene.add( new THREE.AmbientLight(0xffffff, 0.5));

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



    // models
    function loadModel (modelObj) {
      let gltfLoader = new GLTFLoader();
      gltfLoader.load(modelObj.path,
        (gltf) => {
         let model = gltf.scene
          model.scale.x = modelObj.scale;
          model.scale.y = modelObj.scale;
          model.scale.z = modelObj.scale;
          model.position.x = modelObj.position.x;
          model.position.y = modelObj.position.y;
          model.position.z = modelObj.position.z;
          model.castShadow = true;
          scene.add(model);
        }
      )
    }



    const palm = {
      scale: 0.045,
      path: 'models/palmshiny.glb',
      position: { x: -4, y: 0, z: 0 }
    }
    loadModel(palm);

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
    const floorGeometry = new THREE.PlaneGeometry( 10, 10);
    const floorMaterial = new THREE.MeshPhongMaterial({
                                                        color: floorColor,
                                                        transparent: false
                                                      });

    const floor = new THREE.Mesh( floorGeometry, floorMaterial );
    floor.rotation.x = - Math.PI / 2;
    floor.receiveShadow = false;


    // const xText = createText( 'x', 1 );
    // xText.position.set( 5, 1, 0 );
    // xText.rotation.x = Math.PI / 2;
    // const xText2 = createText( '-x', 1 );
    // xText2.position.set( -5, 1, 0 );
    // xText2.rotation.x = Math.PI / 2;
    // const zText = createText( "z", 1 );
    // zText.position.set( 0, 1, 5 );
    // zText.rotation.x = Math.PI / 2;
    // const zText2 = createText( "-z", 1 );
    // zText2.position.set( 0, 1, -5 );
    // zText2.rotation.x = Math.PI / 2;
    // const axisGroup = new THREE.Group();
    // axisGroup.add(xText, zText, xText2, zText2);
    // // axisGroup.scale.set( 0.25, 0.25, 0.25 );


    // scene.add(axisGroup);


    const floorText = createText( 'Hello,', 1 );
    const floorText2 = createText( "I'm Seth Brady.", 1 );

    floorText.position.set( -3, 3, .1 );
    floorText2.position.set( -1.35, 2.15, .1 );
    floorText.scale.set( 0.75, 0.75, 0.75 );
    floorText2.scale.set( 0.75, 0.75, 0.75 );
    floor.add( floorText, floorText2 );
    scene.add(floor);

    // const sideGeometry = new THREE.BoxGeometry( 1, 2, 6);
    // const sideMaterial = new THREE.MeshPhongMaterial({
    //                                                 color: 0x00ffff,
    //                                                 transparent: false,
    //                                               });

    // const sideMesh = new THREE.Mesh( sideGeometry, sideMaterial );
    // sideMesh.position.set( -5 ,1, 1 );
    // scene.add(sideMesh);
    window.addEventListener( 'resize', onWindowResize() );
  }

    //breakout
    const ballGeo = new THREE.SphereGeometry( 0.15 );
    const ballMatr = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    const ball = new THREE.Mesh( ballGeo, ballMatr );
    ball.position.x = randomizeDirection();
    ball.position.y = .25;
    ball.position.z = -1;


    scene.add( ball );


    let xAxis = (speed * delta)
    let yAxis = -1 + (speed * delta)
    const wallAxis = 5.00;

    function wallCollision(){
      let smoothness = .5;
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
    }

    const paddleGeo = new THREE.BoxGeometry( 2.0, .25, .25 );
    const paddleMatr = new THREE.MeshPhongMaterial( { color: 0x04d9ff } );
    const paddle = new THREE.Mesh( paddleGeo, paddleMatr );
    paddle.position.y = ball.position.y;
    paddle.position.x = 0
    paddle.position.z = 4.5;

    scene.add(paddle);

    const brickGeo = new THREE.BoxGeometry( 1.0, .25, .25 );
    const brickMatr = new THREE.MeshPhongMaterial( { color: 0xb116e8 } );
    const orginalBrick = new THREE.Mesh( brickGeo, brickMatr );
    orginalBrick.position.y = ball.position.y;
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
      scene.add(bricks);
    }
    addBricks();

  //brick collisions
  function brickCollision() {
    bricks.children.forEach((brick) => {
      if (ball.position.x >= brick.position.x - 1 && ball.position.x  <= brick.position.x + 1) {
        if(ball.position.z >= brick.position.z - .25 && ball.position.z <= brick.position.z + .25) {
          bricks.remove(brick);
          yAxis = -yAxis + getRandomArbitrary();
          xAxis = -xAxis + getRandomArbitrary();
        }
      }
    });
  }

  //paddle collisions
  function paddleCollision() {
    if (ball.position.x >= paddle.position.x - 1 && ball.position.x  <= paddle.position.x + 1) {
      if(ball.position.z >= paddle.position.z - .25 && ball.position.z <= paddle.position.z + .25) {
        yAxis = -yAxis + getRandomArbitrary();
        xAxis = -xAxis + getRandomArbitrary();
      }
    }
  }

  function getRandomArbitrary() {
    const random = Math.random() * (0.5 - 0.1) + .01;
    return random;
  }


  function addBigCube() {
    const cubeGeo = new THREE.BoxGeometry( 10.0, 10.0, 10.0 );
    const cubeMatr = new THREE.MeshPhongMaterial( { color: 0x00ff00, transparent:true, opacity: 0.5} );
    const cube = new THREE.Mesh( cubeGeo, cubeMatr );
    cube.position.x = 0;
    cube.position.y = -5.01
    // cube.position.y = 0

    cube.position.z = 0;
    scene.add( cube );
  }
  addBigCube();

  // const ballGeo = new THREE.SphereGeometry( 0.15 );
  // const ballMatr = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
  // const ball = new THREE.Mesh( ballGeo, ballMatr );
  // ball.position.x = 0;
  // ball.position.y = randomizeDirection();
  // ball.position.z = 0;


  // scene.add( ball );
  // const cubeAxes = 5.00;
  //   let xAxis = (speed * delta)
  //   let zAxis = -1 + (speed * delta)
  //   let yAxis = -1 + (speed * delta)

  //   function cubeCollision(){
  //     let smoothness = .5;
  //     ball.translateX( xAxis * smoothness);
  //     ball.translateZ( zAxis * smoothness);
  //     ball.translateY( yAxis * smoothness);

  //     if(ball.position.x <= -1 * cubeAxes  ) {
  //       ball.position.x = (-1 * cubeAxes)
  //       xAxis = -xAxis + getRandomArbitrary();
  //     }

  //     if(ball.position.x >= cubeAxes) {
  //       ball.position.x = cubeAxes
  //       xAxis = -xAxis + getRandomArbitrary();
  //     }

  //     if(ball.position.z <= -1 * cubeAxes) {
  //       ball.position.z = (-1 * cubeAxes)
  //       zAxis = -zAxis + getRandomArbitrary();
  //     }

  //     if(ball.position.z >= cubeAxes) {
  //       ball.position.z = cubeAxes
  //       zAxis = -zAxis + getRandomArbitrary();
  //     }
  //     if(ball.position.y <= -1 * cubeAxes  ) {
  //       ball.position.y = (-1 * cubeAxes)
  //       yAxis = -yAxis + getRandomArbitrary();
  //     }

  //     if(ball.position.y >= cubeAxes) {
  //       ball.position.y = cubeAxes
  //       yAxis = -yAxis + getRandomArbitrary();
  //     }
  //   }


  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }

  // function onWindowScroll() {
  //   camera.position.x = window.scrollY * 0.01;
  //   console.log("cz", camera.position.x)
  // }

  function animate() {
    renderer.setAnimationLoop( render );
  }

  function render() {
    let delta = clock.getDelta();
    const elapsedTime = clock.elapsedTime;
    renderer.xr.updateCamera( camera );
    world.execute( delta, elapsedTime );
    renderer.render( scene, camera );
    // cubeCollision();
    wallCollision();
    brickCollision();
    paddleCollision();
    // onWindowScroll()

  }
}

export { sandbox };
