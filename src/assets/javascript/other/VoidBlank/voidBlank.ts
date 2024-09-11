import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm//webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { World, System, Component, TagComponent, Types } from 'three/examples/jsm//libs/ecsy.module.js';
import { floor, menuMesh, exitButton, instructionText, exitText, dataScreenMesh, textureCube, heartMesh } from './worldMesh.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import  { updateGameText } from './gameText.js';
import { update } from 'three/examples/jsm/libs/tween.module.js';

let camera, renderer, scene;

function voidblank() {

  class Object3D extends Component {}
  Object3D.schema = {
    object: { type: Types.Ref }
  };

  class Button extends Component {}

  Button.schema = {
    currState: { type: Types.String, default: 'none' },
    prevState: { type: Types.String, default: 'none' },
    action: { type: Types.Ref, default: () => { } }
  };

  class ButtonSystem extends System {
    execute( /*delta, time*/ ) {
      this.queries.buttons.results.forEach( entity => {
        const button = entity.getMutableComponent( Button );
        const buttonMesh = entity.getComponent( Object3D ).object;

        if ( button.currState == 'none' ) {
          buttonMesh.scale.set( 1, 1, 1 );
        } else {
          buttonMesh.scale.set( 1.1, 1.1, 1.1 );
        }

        if ( button.currState == 'pressed' && button.prevState != 'pressed' ) {
          button.action();
        }

        // preserve prevState, clear currState
        // HandRaySystem will update currState
        button.prevState = button.currState;
        button.currState = 'none';
      } );
    }
  }

  ButtonSystem.queries = {
    buttons: {
      components: [ Button ]
    }
  };

  class Draggable extends Component { }

  Draggable.schema = {
    // draggable states: [detached, hovered, to-be-attached, attached, to-be-detached]
    state: { type: Types.String, default: 'none' },
    originalParent: { type: Types.Ref, default: null },
    attachedPointer: { type: Types.Ref, default: null }
  };

  class DraggableSystem extends System {
    execute( /*delta, time*/ ) {
      this.queries.draggable.results.forEach( entity => {
        const draggable = entity.getMutableComponent( Draggable );
        const object = entity.getComponent( Object3D ).object;
        if ( draggable.originalParent == null ) {
          draggable.originalParent = object.parent;
        }

        switch ( draggable.state ) {
          case 'to-be-attached':
            // this attaches the object to the hand pointer for dragging
            draggable.attachedPointer.children[0].attach( object );
            draggable.state = 'attached';
            break;
          case 'to-be-detached':
            draggable.originalParent.attach( object );
            draggable.state = 'detached';

            //check if the object is in the scanner
            // eslint-disable-next-line no-case-declarations
            // let userDataGrouping = userDataGroupings[object.index];
            //These values need
            if (
              // these values should be stated not magic and  checked and this should be put into a function
              (object.position.x > - 0.125 && object.position.x < 0.125) &&
              (object.position.z > -0.7 && object.position.z < - 0.5) &&
              (object.position.y > 1.1 && object.position.y < 1.6) )
              {
              //   userDataGroupings.forEach((grouping) => {
              //   grouping.visible = false;
              // });
              // userDataGrouping.visible = true;
            } else {
              // userDataGrouping.visible = false;
            }
            break;
          default:
            object.scale.set( 1, 1, 1 );
        }
      } );
    }
  }

  DraggableSystem.queries = {
    draggable: {
      components: [ Draggable ]
    }
  };

  class Intersectable extends TagComponent { }



  class HandsInstructionText extends TagComponent { }

  class InstructionSystem extends System {
    init( attributes ) {
      this.controllers = attributes.controllers;
    }

    execute( /*delta, time*/ ) {
      let visible = false;
      this.controllers.forEach( controller => {
        if ( controller.visible ) {
          visible = true;
        }
      } );

      this.queries.instructionTexts.results.forEach( entity => {
        const object = entity.getComponent( Object3D ).object;
        object.visible = visible;
      } );
    }
  }

  InstructionSystem.queries = {
    instructionTexts: {
      components: [ HandsInstructionText ]
    }
  };

  class OffsetFromCamera extends Component { }

  OffsetFromCamera.schema = {
    x: { type: Types.Number, default: 0 },
    y: { type: Types.Number, default: 0 },
    z: { type: Types.Number, default: 0 },
  };

  class NeedCalibration extends TagComponent { }

  class CalibrationSystem extends System {
    init( attributes ) {
      this.camera = attributes.camera;
      this.renderer = attributes.renderer;
    }

    execute( /*delta, time*/ ) {
      this.queries.needCalibration.results.forEach( entity => {
        if ( this.renderer.xr.getSession() ) {
          const offset = entity.getComponent( OffsetFromCamera );
          const object = entity.getComponent( Object3D ).object;
          const xrCamera = this.renderer.xr.getCamera();
          object.position.x = xrCamera.position.x + offset.x;
          object.position.y = xrCamera.position.y + offset.y;
          object.position.z = xrCamera.position.z + offset.z;
          entity.removeComponent( NeedCalibration );
        }
      });
    }
  }

  CalibrationSystem.queries = {
    needCalibration: {
      components: [ NeedCalibration ]
    }
  };


  const world = new World();
  const clock = new THREE.Clock();
  const backgroundColor = 0x222222;

  init();
  animate();

  function init() {
    scene = new THREE.Scene();
    scene.background = textureCube;
    scene.background = new THREE.Color( backgroundColor );

    // const distance = 100;
    // camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, distance );
    // camera.position.set( 0, 1.2, 0.3 );


    const aspect = (window.innerWidth / window.innerHeight);
    const d = 7;
    camera = new THREE.OrthographicCamera(- d * aspect, d * aspect, d, - d, 1, 1000);
    camera.position.set( 20, 20, 20 ); // all components equal
    camera.lookAt( scene.position ); // or the origin


    const light = new THREE.DirectionalLight( 0xffffff, 3 );
    light.position.set( 0, 6, 0 );
    light.castShadow = true;
    scene.add( light );
    // scene.add( new THREE.HemisphereLight( 0xffffff, 0x999999, 3 ) );
    scene.add( new THREE.AmbientLight(0xffffff, 0.5));

    renderer = new THREE.WebGLRenderer( {
      antialias: false,
      alpha: true,
      precision: "lowp",
      powerPreference: "low-power"
    } );


    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;

    // initializing webxr renderer and controllers. Adding the vr button to the users element
    const container = document.getElementById("voidblank");
    container.appendChild(renderer.domElement);


    // document.body.appendChild( renderer.domElement );

    renderer.xr.enabled = true;
    renderer.xr.cameraAutoUpdate = false;

    //  Grid
     const gridHelper = new THREE.GridHelper(100, 100, 0x18fbe3,0x18fbe3);
     scene.add( gridHelper );
     gridHelper.visible = false;

     window.addEventListener( 'keydown', ( event ) => {
      if (event.key === 'g') {
        gridHelper.visible = !gridHelper.visible;
      }
     });




    // models
    function loadModel (modelObj) {
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
      )
    }

    const ballGeo = new THREE.SphereGeometry( 0.25 );
    const ballMatr = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    const ball = new THREE.Mesh( ballGeo, ballMatr );
    ball.position.x = -1;
    ball.position.y = .25;
    ball.position.z = 1;
    scene.add( ball );

    const palm = {
      scale: 0.045,
      path: 'models/palmshiny.glb',
      position: { x: -4, y: 0, z: 0 }
    }
    loadModel(palm);



    const human = {
      scale: 0.0035,
      path: 'models/human.glb',
      position: { x: 3.75, y: .98, z: -3 }
    }
    loadModel(human);

    // heart
    // scene.add(heartMesh);


    const sessionInit = {
      // requiredFeatures: [ 'hand-tracking' ]
    };

    // WebXr entry point
    container.appendChild(VRButton.createButton(renderer, sessionInit ));

    //orbit controls
    let orbitEnabled = false;
    const orbitControls = new OrbitControls(camera, renderer.domElement)
    orbitControls.enabled = true;
    orbitControls.enableRotate = orbitEnabled
    orbitControls.keyPanSpeed = 60.0 // magic number
    orbitControls.enableZoom = true

    console.log("orbit1", orbitControls)
    window.addEventListener( 'keydown', ( event ) => {
      if (event.key === 'o') {
        orbitEnabled = !orbitEnabled
        orbitControls.enableRotate = orbitEnabled;
        console.log("orbit2", orbitControls)
        console.log("camera", camera)
      }
     });

    // controllers
    const controller1 = renderer.xr.getController( 0 );
    const controller2 = renderer.xr.getController( 1 );
    controller1.addEventListener( 'connected',  ( event ) => {
      this.add( buildController( event.data ) );
    } );
    controller1.addEventListener( 'disconnected',  () => {
      this.remove( this.children[ 0 ] );
    } );
    controller2.addEventListener( 'connected',  ( event ) => {
      this.add( buildController( event.data ) );
    } );
    controller2.addEventListener( 'disconnected', function () {
      this.remove( this.children[ 0 ] );
    } );
    scene.add( controller1, controller2 );
    updateGameText("Controllers are ready");

    const controllerModelFactory = new XRControllerModelFactory();
    const controllerGrip1 = renderer.xr.getControllerGrip( 0 );
    controllerGrip1.add( controllerModelFactory.createControllerModel( controllerGrip1 ) );
    scene.add( controllerGrip1 );

    const controllerGrip2 = renderer.xr.getControllerGrip( 1 );
    controllerGrip2.add( controllerModelFactory.createControllerModel( controllerGrip2 ) );
    scene.add( controllerGrip2 );







    // setup objects in scene and entities
    // floor
    scene.add(floor);
    // wall
    // scene.add(wall);

    // menu
    scene.add(menuMesh);
    // menuMesh.add(exitButton);

    // exit text
    scene.add(exitText);

    // data screen
    // dataScreenMesh.position.set( 0, 1.5, - 0.6 );
    // scene.add(dataScreenMesh);


    const sideGeometry = new THREE.BoxGeometry( 1, 2, 6);
    const sideMaterial = new THREE.MeshPhongMaterial({
                                                    color: 0x00ffff,
                                                    transparent: false,
                                                  });
    const sideMesh = new THREE.Mesh( sideGeometry, sideMaterial );
    sideMesh.position.set( -5 ,1, 1 );
    scene.add(sideMesh);
    // world components and systems
    world
      .registerComponent( Object3D )
      .registerComponent( Button )
      .registerComponent( Intersectable )
      .registerComponent( HandsInstructionText )
      .registerComponent( OffsetFromCamera )
      .registerComponent( NeedCalibration )
      .registerComponent( Draggable )

    world
      .registerSystem( InstructionSystem, { controllers: [ controllerGrip1, controllerGrip2 ] } )
      .registerSystem( CalibrationSystem, { renderer: renderer, camera: camera } )
      .registerSystem( ButtonSystem )
      .registerSystem( DraggableSystem )


    // world functions
    // menu
    const menuEntity = world.createEntity();
    menuEntity.addComponent( Intersectable );
    menuEntity.addComponent( OffsetFromCamera, { x: 1, y: 0, z: - 1 } );
    menuEntity.addComponent( NeedCalibration );
    menuEntity.addComponent( Object3D, { object: menuMesh } );

    // exit button
    const exitButtonEntity = world.createEntity();
    exitButtonEntity.addComponent( Intersectable );
    exitButtonEntity.addComponent( Object3D, { object: exitButton } );

    const exitButtonAction = function () {
      exitText.visible = true;
      setTimeout( function () {
        exitText.visible = false; renderer.xr.getSession().end();
      }, 2000 );
    };
    exitButtonEntity.addComponent( Button, { action: exitButtonAction } );

    // instruction text
    const itEntity = world.createEntity();
    itEntity.addComponent( HandsInstructionText );
    itEntity.addComponent( Object3D, { object: instructionText } );

    window.addEventListener( 'resize', onWindowResize );
  }

  // function buildController( data: XRInputSource ): THREE.Object3D {
  //   let geometry, material;

  //   switch ( data.targetRayMode ) {

  //     case 'tracked-pointer':
  //       geometry = new THREE.BufferGeometry();
  //       geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [ 0, 0, 0, 0, 0, - 1 ], 3 ) );
  //       geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( [ 0.5, 0.5, 0.5, 0, 0, 0 ], 3 ) );
  //       material = new THREE.LineBasicMaterial( { vertexColors: true, blending: THREE.AdditiveBlending } );

  //       return new THREE.Line( geometry, material );

  //     case 'gaze':
  //       geometry = new THREE.RingGeometry( 0.02, 0.04, 32 ).translate( 0, 0, - 1 );
  //       material = new THREE.MeshBasicMaterial( { opacity: 0.5, transparent: true } );
  //       return new THREE.Mesh( geometry, material );
  //   }

  //   // Add a default return statement
  //   return new THREE.Object3D();
  // }

  function buildController( data ) {
    let geometry, material;
    switch ( data.targetRayMode ) {
      case 'tracked-pointer':
        geometry = new THREE.BufferGeometry();
        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [ 0, 0, 0, 0, 0, - 1 ], 3 ) );
        geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( [ 0.5, 0.5, 0.5, 0, 0, 0 ], 3 ) );
        material = new THREE.LineBasicMaterial( { vertexColors: true, blending: THREE.AdditiveBlending } );
        return new THREE.Line( geometry, material );

      case 'gaze':
        geometry = new THREE.RingGeometry( 0.02, 0.04, 32 ).translate( 0, 0, - 1 );
        material = new THREE.MeshBasicMaterial( { opacity: 0.5, transparent: true } );
        return new THREE.Mesh( geometry, material );
    }
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
    // heartMesh.rotation.y += 0.1;
  }
}

export { voidblank, scene };
