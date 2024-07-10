import * as THREE from 'three';
import { createText } from 'three/examples/jsm/webxr/Text2D.js';

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


export { floor}
