import * as THREE from 'three';
import { createText } from 'three/examples/jsm/webxr/Text2D.js';

 // // axis helper
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
 xText.position.set( 5, 1, 0 );
 xText2.position.set( -5, 1, 0 );
 xText3.position.set( 5, 1, 0 );
 xText4.position.set( -5, 1, 0 );

 zText.position.set( 0, 1, 5 );
 zText2.position.set( 0, 1, -5 );
 zText3.position.set( 0, 1, 5 );
 zText4.position.set( 0, 1, -5 );

 yText.position.set( 1, 5, 0 );
 yText2.position.set( 1, -5, 0 );
 yText3.position.set( 1, 5, 0 );
 yText4.position.set( 1, -5, 0 );


 // update axis text rotation
 xText.rotation.x = Math.PI / 2;
 xText2.rotation.x = Math.PI / 2;
 zText.rotation.x = Math.PI / 2;
 zText2.rotation.x = Math.PI / 2;
 yText.rotation.x = Math.PI / 2;
 yText2.rotation.x = Math.PI / 2;

 axisGroup.add(xGroup, zGroup, yGroup, axesHelper);


 export { axisGroup };