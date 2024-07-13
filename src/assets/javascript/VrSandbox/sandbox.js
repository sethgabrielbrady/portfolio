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

  init();
  animate();

  function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color( backgroundColor );

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
    ball.position.x = -1;
    ball.position.y = .25;
    ball.position.z = 1;
    scene.add( ball );

    const ballRadius = 0.125;

    let xAxis = .56;
    let yAxis = -.56;

    const wallAxis = 5.00;
    function wallCollision(){
      const smoothness = 0.55;
      ball.position.x += xAxis * smoothness;
      ball.position.z += yAxis * smoothness;

      if(ball.position.x <= ballRadius - wallAxis) {
        xAxis = -xAxis + getRandomArbitrary();
      }
      if(ball.position.x >= wallAxis - ballRadius) {
        xAxis = -xAxis + getRandomArbitrary();
      }
      if(ball.position.z <= ballRadius - wallAxis || ball.position.z >= wallAxis - ballRadius ) {
        yAxis = -yAxis + getRandomArbitrary();
      }
      // if(ball.position.z >= wallAxis - ballRadius) {
      //   yAxis = -yAxis + getRandomArbitrary();
      // }
      console.log(ball.position.x, ball.position.z, )
    }
    const brickGeo = new THREE.BoxGeometry( 1.0, .25, .25 );
    const brickMatr = new THREE.MeshPhongMaterial( { color: 0xb116e8 } );
    const orginalBrick = new THREE.Mesh( brickGeo, brickMatr );
    orginalBrick.position.y = ball.position.y;
    const bricks = new THREE.Group();


    // function randomHexColor() {
    //   const newColor = Math.floor(Math.random()*16777215).toString(16);
    //   console.log(newColor);
    //   return parseInt(newColor, 16);
    // }

    // console.log(randomRGBColor());
    function addBricks (rows = 7, cols = 3) {
      for(let i = 0; i < rows; i++) {
        for(let j = 0; j < cols; j++) {
          // orginalBrick.material.color.setHex( randomHexColor() );
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
        if (ball.position.x + xAxis >= brick.position.x - .50 && ball.position.x + xAxis <= brick.position.x + .50) {
          if(ball.position.z + yAxis >= brick.position.z - .25 && ball.position.z + yAxis <= brick.position.z + .25) {
            yAxis = -yAxis + getRandomArbitrary();
            xAxis = -xAxis + getRandomArbitrary();
            bricks.remove(brick);
          }
        }
      });
    }

    function getRandomArbitrary() {
      const random = Math.random() * (.5 - 0) + .01;
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

  function render() {
    const delta = clock.getDelta();
    const elapsedTime = clock.elapsedTime;
    renderer.xr.updateCamera( camera );
    world.execute( delta, elapsedTime );
    renderer.render( scene, camera );
    wallCollision();
    brickCollision();

  }
}

export { sandbox };
