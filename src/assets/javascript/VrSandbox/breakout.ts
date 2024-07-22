import * as THREE from 'three';


function breakout(clock: THREE.Clock, scene: THREE.Scene, camera: THREE.Camera, raycaster: THREE.Raycaster) {

  const speed: number = 3;
  const delta: number = 0;


  function randomizeDirection() {
    const random: number = Math.random();
    if(random < 0.5) {
      return -1;
    } else {
      return 1;
    }
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

  function collisions(){
    if (xAxis > 5) {
      xAxis = 5;
    }
    if (yAxis > 5) {
      yAxis = 5;
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


}

export default breakout;