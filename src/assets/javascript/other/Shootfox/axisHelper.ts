import * as THREE from 'three';
import { createText } from 'three/examples/jsm/webxr/Text2D.js';



// // make this a class that takes an object with position and rotation
// // and creates the axis helper
// interface AxisObjHelperOptions {
//   position?: THREE.Vector3 | { x?: number, y?: number, z?: number } | { position: { x: number, y: number, z: number } };
// }
// class AxisObjHelper extends THREE.AxesHelper {
//   /**
//    * Helper class for handling axis objects.
//    */
//   AxisObjHelper: any;
//   axisGroup: THREE.Group;
//   xGroup: THREE.Group;
//   zGroup: THREE.Group;
//   yGroup: THREE.Group;
//   axesHelper: THREE.AxesHelper;
//   xText: THREE.Mesh;
//   xText2: THREE.Mesh;
//   xText3: THREE.Mesh;
//   xText4: THREE.Mesh;
//   zText: THREE.Mesh;
//   zText2: THREE.Mesh;
//   zText3: THREE.Mesh;
//   zText4: THREE.Mesh;
//   yText: THREE.Mesh;
//   yText2: THREE.Mesh;
//   yText3: THREE.Mesh;
//   yText4: THREE.Mesh;


//   constructor(options: AxisObjHelperOptions) {
//     super()
//     const axesHelper = new THREE.AxesHelper( 5 );
//     const position = options.position || { position: { x: 0, y: 0, z: 0 } } || { x: 0, y: 0, z: 0 };
//     const posTextX = position.x + 5;
//     const negTextX = position.x - 5;
//     const posTextZ = position.z + 5;
//     const negTextZ = position.z - 5;
//     const posTextY = position.y + 5;
//     const negTextY = position.y - 5;
//     this.axisGroup = new THREE.Group();
//     this.xGroup = new THREE.Group();
//     this.zGroup = new THREE.Group();
//     this.yGroup = new THREE.Group();

//     this.axesHelper = axesHelper;
//     this.xText = createText( 'x', 1 );
//     this.xText2 = createText( '-x', 1 );
//     this.xText3 = createText( 'x', 1 );
//     this.xText4 = createText( '-x', 1 );
//     this.xGroup = new THREE.Group();
//     this.xGroup.add(this.xText, this.xText2, this.xText3, this.xText4);
//     this.zText = createText( "z", 1 );
//     this.zText2 = createText( "-z", 1 );
//     this.zText3 = createText( "z", 1 );
//     this.zText4 = createText( "-z", 1 );
//     this.zGroup = new THREE.Group();
//     this.zGroup.add(this.zText, this.zText2, this.zText3, this.zText4);
//     this.yText = createText( "y", 1 );
//     this.yText2 = createText( "-y", 1 );
//     this.yText3 = createText( "y", 1 );
//     this.yText4 = createText( "-y", 1 );
//     this.yGroup = new THREE.Group();
//     this.yGroup.add(this.yText, this.yText2, this.yText3, this.yText4);
//     this.xText.position.set( posTextX, 1, 0 );
//     this.xText2.position.set( negTextX, 1, 0 );
//     this.xText3.position.set( posTextX, 1, 0 );
//     this.xText4.position.set( negTextX, 1, 0 );
//     this.zText.position.set( 0, 1, posTextZ );
//     this.zText2.position.set( 0, 1, negTextZ );
//     this.zText3.position.set( 0, 1, posTextZ );
//     this.zText4.position.set( 0, 1, negTextX );
//     this.yText.position.set( 1, posTextY, 0 );
//     this.yText2.position.set( 1, negTextY, 0 );
//     this.yText3.position.set( 1, posTextY, 0 );
//     this.yText4.position.set( 1, negTextY, 0 );
//     this.xText.rotation.x = Math.PI / 2;
//     this.xText2.rotation.x = Math.PI / 2;
//     this.zText.rotation.x = Math.PI / 2;
//     this.zText2.rotation.x = Math.PI / 2;
//     this.yText.rotation.x = Math.PI / 2;
//     this.yText2.rotation.x = Math.PI / 2;
//     this.axisGroup.add(this.xGroup, this.zGroup, this.yGroup, this.axesHelper);
//   }
// }


 // // axis helper

//  const axesHelper = new THREE.AxesHelper( 5 );
//   const xText = createText( 'x', 1 );
//   const xText2 = createText( '-x', 1 );
//   const xText3 = createText( 'x', 1 );
//   const xText4 = createText( '-x', 1 );
//   const xGroup = new THREE.Group();
//   xGroup.add(xText, xText2, xText3, xText4);

//   const zText = createText( "z", 1 );
//   const zText2 = createText( "-z", 1 );
//   const zText3 = createText( "z", 1 );
//   const zText4 = createText( "-z", 1 );
//   const zGroup = new THREE.Group();
//   zGroup.add(zText, zText2, zText3, zText4);

//   const yText = createText( "y", 1 );
//   const yText2 = createText( "-y", 1 );
//   const yText3 = createText( "y", 1 );
//   const yText4 = createText( "-y", 1 );
//   const yGroup = new THREE.Group();
//   yGroup.add(yText, yText2, yText3, yText4);

//   const axisGroup = new THREE.Group();

//   // update axis text position
//   xText.position.set( 5, 1, 0 );
//   xText2.position.set( -5, 1, 0 );
//   xText3.position.set( 5, 1, 0 );
//   xText4.position.set( -5, 1, 0 );

//   zText.position.set( 0, 1, 5 );
//   zText2.position.set( 0, 1, -5 );
//   zText3.position.set( 0, 1, 5 );
//   zText4.position.set( 0, 1, -5 );

//   yText.position.set( 1, 5, 0 );
//   yText2.position.set( 1, -5, 0 );
//   yText3.position.set( 1, 5, 0 );
//   yText4.position.set( 1, -5, 0 );


//   // update axis text rotation
//   xText.rotation.x = Math.PI / 2;
//   xText2.rotation.x = Math.PI / 2;
//   zText.rotation.x = Math.PI / 2;
//   zText2.rotation.x = Math.PI / 2;
//   yText.rotation.x = Math.PI / 2;
//   yText2.rotation.x = Math.PI / 2;

//   axisGroup.add(xGroup, zGroup, yGroup, axesHelper);

 function createAxisHelper(obj) {
  console.log('createAxisHelper', obj);
  const position = obj.position || { position: { x: 0, y: 0, z: 0 } } || { x: 0, y: 0, z: 0 };
  const posX = position.x;
  const posY = position.y;
  const posZ = position.z;
  const posTextX = posX + 5;
  const negTextX = posX - 5;
  const posTextZ = posZ + 5;
  const negTextZ = posZ - 5;
  const posTextY = posY + 5;
  const negTextY = posY - 5;
  const axesHelper = new THREE.AxesHelper( 5 );
  const xText = createText( 'x', 1 );
  const xText2 = createText( '-x', 1 );
  const xText3 = createText( 'x', 1 );
  const xText4 = createText( '-x', 1 );
  const xGroup = new THREE.Group();
  xGroup.add(xText, xText2, xText3, xText4);

  const zText = createText( "z", 1 );
  const zText2 = createText( "-z", 1 );
  const zText3 = createText( "z", 1 );
  const zText4 = createText( "-z", 1 );
  const zGroup = new THREE.Group();
  zGroup.add(zText, zText2, zText3, zText4);

  const yText = createText( "y", 1 );
  const yText2 = createText( "-y", 1 );
  const yText3 = createText( "y", 1 );
  const yText4 = createText( "-y", 1 );
  const yGroup = new THREE.Group();
  yGroup.add(yText, yText2, yText3, yText4);

  const axisGroup = new THREE.Group();

  // update axis text position
  xText.position.set( posTextX, 1, 0 );
  xText2.position.set( negTextX, 1, 0 );
  xText3.position.set( posTextX, 1, 0 );
  xText4.position.set( negTextX, 1, 0 );
  zText.position.set( 0, 1, posTextZ );
  zText2.position.set( 0, 1, negTextZ );
  zText3.position.set( 0, 1, posTextZ );
  zText4.position.set( 0, 1, negTextX );
  yText.position.set( 1, posTextY, 0 );
  yText2.position.set( 1, negTextY, 0 );
  yText3.position.set( 1, posTextY, 0 );
  yText4.position.set( 1, negTextY, 0 );

  //   xText.position.set( 5, 1, 0 );
//   xText2.position.set( -5, 1, 0 );
//   xText3.position.set( 5, 1, 0 );
//   xText4.position.set( -5, 1, 0 );

//   zText.position.set( 0, 1, 5 );
//   zText2.position.set( 0, 1, -5 );
//   zText3.position.set( 0, 1, 5 );
//   zText4.position.set( 0, 1, -5 );

//   yText.position.set( 1, 5, 0 );
//   yText2.position.set( 1, -5, 0 );
//   yText3.position.set( 1, 5, 0 );
//   yText4.position.set( 1, -5, 0 );



  // update axis text rotation
  xText.rotation.x = Math.PI / 2;
  xText2.rotation.x = Math.PI / 2;
  zText.rotation.x = Math.PI / 2;
  zText2.rotation.x = Math.PI / 2;
  yText.rotation.x = Math.PI / 2;
  yText2.rotation.x = Math.PI / 2;

  axisGroup.add(xGroup, zGroup, yGroup, axesHelper);
  return axisGroup;
 }


 export { createAxisHelper };