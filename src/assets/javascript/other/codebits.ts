// easy 50/50 generator
  // const test: number = Date.now();
  // console.log(test  % 2)




// html2canvas - load html as texture
  // import html2canvas from 'html2canvas';
  // const htmlElement = document.getElementById('capture');
  // loadFonts();

  // html2canvas(htmlElement).then(canvas => {
  //   // Now you have a canvas with your HTML content
  //   const texture = new THREE.Texture(canvas);
  //   texture.needsUpdate = true; // Ensure the texture is updated
  //   // dataScreenMesh.material.color = 0x000000;
  //   // Create a material with this texture
  //   dataScreenMesh.material.map = texture;

  //   // Add the mesh to your scene
  //   // scene.add(dataScreenMesh);
  //   // scene.background = texture;
  // });


      // function randomHexColor() {
    //   const newColor = Math.floor(Math.random()*16777215).toString(16);
    //   console.log(newColor);
    //   return parseInt(newColor, 16);
    // }



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

  //camera movement base on time

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



//model loader
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
    //model loader


//axes helper
    // // axis helper
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

  //a axes helper