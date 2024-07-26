import * as THREE from 'three';

  const speed: number = 3;
  const clock: THREE.Clock = new THREE.Clock();
  const wallAxis = 5.00;
  const breakoutObject = new THREE.Group();
  const startingYPos = 0.25
  const raycaster = new THREE.Raycaster();
  const scene: THREE.Scene = new THREE.Scene();
  const smoothness = .175;

  let camera: THREE.OrthographicCamera;
  let renderer: THREE.WebGLRenderer;
  let delta: number = 0;
  let xAxis = (speed * delta)
  let yAxis = -1 + (speed * delta)
  let ballInPlay = false;
  let paddleInPlay = false;

  // 3D Objects
  // ball
  const ballGeo = new THREE.SphereGeometry( 0.15 );
  const ballMatr = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
  const ball = new THREE.Mesh( ballGeo, ballMatr );
  breakoutObject.add(ball);

  //paddle
  const paddleGeo = new THREE.BoxGeometry( 2.0, .25, .25 );
  const paddleMatr = new THREE.MeshPhongMaterial( { color: 0x04d9ff } );
  const paddle = new THREE.Mesh( paddleGeo, paddleMatr );
  paddle.position.y = startingYPos;
  paddle.position.x = 0
  paddle.position.z = 5;
  breakoutObject.add(paddle);

  //bricks
  const bricks = new THREE.Group();
  const brickGeo = new THREE.BoxGeometry( 1.0, .25, .25 );
  const brickMatr = new THREE.MeshPhongMaterial( { color: 0xb116e8 } );
  brickMatr.transparent = true;
  brickMatr.opacity = 0.75;

  const orginalBrick = new THREE.Mesh( brickGeo, brickMatr );
  orginalBrick.position.y = startingYPos;


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

  function collisions(){
    if (xAxis > 5) {
      xAxis = 5;
    }
    if (yAxis > 5) {
      yAxis = 5;
    }
    ball.translateX( xAxis * smoothness);
    ball.translateZ( yAxis * smoothness);

    if(ball.position.x <= -1 * wallAxis  ) {
      ball.position.x = (-1 * wallAxis)
      xAxis = -xAxis;
      // xAxis = (-1 * (xAxis + getRandomArbitrary()));
    }

    if(ball.position.x >= wallAxis) {
      ball.position.x = wallAxis
      xAxis = -xAxis;

      // xAxis = (-1 * (xAxis + getRandomArbitrary()));
    }

    if(ball.position.z <= -1 * wallAxis) {
      ball.position.z = (-1 * wallAxis)
      yAxis = -yAxis;
    }


    if(ball.position.z >= wallAxis + 2) {
     breakoutObject.remove(ball);
     ballInPlay = !ballInPlay;
    }

    checkPaddeCollision();
    checkBrickCollision();
  }

  //brick collisions
  function checkBrickCollision() {
    bricks.children.forEach((brick) => {
      if (ball.position.x >= brick.position.x - 0.5 && ball.position.x <= brick.position.x + 0.5) {
        if(ball.position.z >= brick.position.z - .25 && ball.position.z <= brick.position.z + .25) {
          bricks.remove(brick);
          yAxis = -yAxis;
          xAxis = -xAxis + getRandomArbitrary();
        }
      }
    });
  }


  function checkPaddeCollision() {
    if (ball.position.x >= paddle.position.x - 1 && ball.position.x <= paddle.position.x + 1 ){
      if (ball.position.z >= paddle.position.z - 0.35 && ball.position.z <= paddle.position.z + 0.35) {
        yAxis = -yAxis;
        xAxis = -xAxis + getRandomArbitrary();
      }
    }
  }


  const pointer = new THREE.Vector2();

  function onPaddleIntersect( event: { clientX: number; }) {
    pointer.x = event.clientX / 90 ;
    raycaster.setFromCamera( pointer, camera );

    if (pointer.x > 5 && pointer.x < 15) {
      paddle.position.x = pointer.x - 10;
    }
  }

  function addBall(x = null) {
    ballInPlay = !ballInPlay;
    ball.position.x = x !== null ? x : randomizeDirection();
    ball.position.y = startingYPos;
    ball.position.z = 4;
    breakoutObject.add(ball);
    xAxis = (speed * delta)
    yAxis = -1 + (speed * delta)
  }


  function randomizeDirection() {
    const random: number = Math.random();
    if(random < 0.5) {
      return -1;
    } else {
      return 1;
    }
  }

  function getRandomArbitrary() {
    const random = Math.random() * (0.5 - 0.1) + .01;
    return random;
  }

  function render() {
    delta = clock.getDelta();
    renderer.render( scene, camera );

    if (paddleInPlay) {
      window.addEventListener( 'pointermove', onPaddleIntersect );
    }

    collisions();
  }


  function init() {
    scene.background = new THREE.Color( 0x222233 );

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
      powerPreference: "low-power",
    });

    renderer.setClearColor

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;

    const container: HTMLElement = document.getElementById("breakout")!;
    container.appendChild(renderer.domElement);

    container.addEventListener( 'click', ( event ) => {
      if (!ballInPlay) {
        addBall(paddle.position.x);
      }

      if (!paddleInPlay) {
        paddleInPlay = !paddleInPlay;
      }
    });
  }

  function animate() {
    renderer.setAnimationLoop( render );
  }


  function breakout() {
    init();
    animate();
  }


  export { breakout };


