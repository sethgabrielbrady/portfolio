import * as THREE from 'three';
// import { scene } from './shootfox';
import { getRandomNumber, getRandomPosOrNeg, getRandomColor } from '../generators';

const buildingGroupY = new THREE.Group();
const buildingGroup = new THREE.Group();
const buildingGeo = new THREE.BoxGeometry( 4, 4, 20 );
const buildingMatr = new THREE.MeshLambertMaterial( { color: 0x1F51FF } );
const building = new THREE.Mesh( buildingGeo, buildingMatr );
building.position.z = 0;

let buildingGroupYStartPos = 100;

// const buildings: any[] = [];
// const startPos = 400;
// function createNewBuildingsXset() {
//   const newBuildings = new BuildingGroup(20, startPos);
//   buildings.push(newBuildings);
//   scene.add(newBuildings);
// }

//createNewBuildingsXset

// function animateBuildingGroupY(shipSpeed) {
//   if (buildings.length > 0) {
//     buildings.forEach(building => {
//       building.position.y -= shipSpeed.x;
//       if (building.position.y === -200) {
//         scene.remove(buildings[0]);
//         buildings.shift();
//       }
//       if (building.length < 20) {
//         createNewBuildingsXset()
//       }
//     })
//   }
// }

// new building constructor
class Building extends THREE.Object3D {
  constructor(color, positionX, positionY) {
    super();
    const buildingGeo = new THREE.BoxGeometry(4, 4, 20);
    const buildingMatr = new THREE.MeshLambertMaterial({ color: color });
    const building = new THREE.Mesh(buildingGeo, buildingMatr);
    building.position.set(positionX, positionY, 0);
    building.scale.y = Math.random() * 2 + 1;
    building.scale.x = Math.random() * 2 + 1;
    building.scale.z = Math.random() * 2 + 1;
    this.add(building);
  }
}

// new buildingGroup constructor
class BuildingGroup {
  constructor(count, startY) {
    const start = startY || 100;
    const buildingGroup = new THREE.Group();
    for (let i = 0; i < count; i++) {
      const building = new Building (getRandomColor(), returnRandomXPos(), start);
      buildingGroup.add(building);
    }
    // console.log('buildingGroup');

    return buildingGroup;
  }
}

const buildingArray: THREE.Group<THREE.Object3DEventMap>[] = [];

function preCalcBuildX (count, index) {
  const randomArray = [];
  for (let i = 0; i < count; i++) {
    let randomX = (Math.random() * 400) * getRandomPosOrNeg();
    if (randomX < 18 && randomX > -18) {
      randomX = (Math.random() * 400) * getRandomPosOrNeg();
    } else {
      randomArray.push(randomX);
    }
  }
  return randomArray[index];
}


function returnRandomXPos() {
  let randomX = (Math.random() * 400) * getRandomPosOrNeg();
  if (randomX < 18 && randomX > -18) {
    randomX = (Math.random() * 400) * getRandomPosOrNeg();
  } else {
    return randomX;
  }
}


function addBuildingGroupX() {
  for (let j = 0; j < 15; j++) {
    for (let i = 0; i < 15; i++) {
      const clone = building.clone();

      clone.position.x = preCalcBuildX(20, i);
      clone.scale.y = Math.random() * 2 + 1;
      clone.scale.x = Math.random() * 2 + 1;
      clone.scale.z = Math.random() * 2 + 1;
      clone.position.y = buildingGroupYStartPos;
      buildingGroup.add(clone);
    }
    buildingGroupYStartPos += 50;
    buildingGroupY.add(buildingGroup);
    buildingArray.push(buildingGroup);
  }
}
addBuildingGroupX();



// landscape
const landscapeGroup = new THREE.Group();
const groundGeo = new THREE.PlaneGeometry( 60, 900 );
const groundMatr = new THREE.MeshLambertMaterial( { color: 0xa6fd29 } );
const ground = new THREE.Mesh( groundGeo, groundMatr );
ground.position.z = -15;
ground.rotation.z = ground.position.z * (Math.PI);
ground.position.y = 400;
ground.receiveShadow = true;
landscapeGroup.add(ground);

//background sphere
const sphereColor = 0xcccccc;
const largeSphereGeo = new THREE.SphereGeometry( 100, 320, 320 );
const largeSphereMatr = new THREE.MeshLambertMaterial( { color: sphereColor} );
const largeSphere = new THREE.Mesh( largeSphereGeo, largeSphereMatr );
largeSphere.position.z = -10;
largeSphere.position.y = 600;
largeSphere.receiveShadow = false;


// cubeGroupContainer
const segmentColor: number = 0xa6fd29;
const segmentColor2: number = 0x37013a;
const roadSegGeo = new THREE.PlaneGeometry(34, 4 );
const roadSegMatr = new THREE.MeshLambertMaterial( { color: segmentColor, emissive: segmentColor, transparent: false, opacity: 0.5, emissiveIntensity: 0.8 } );
const roadSegMatr2 = new THREE.MeshLambertMaterial( { color: segmentColor2, emissive: segmentColor2, emissiveIntensity: 0.8 } );

const roadSegment = new THREE.Mesh( roadSegGeo, roadSegMatr );
roadSegment.position.y = ground.position.y;
roadSegment.position.z = ground.position.z ;
roadSegment.receiveShadow = false;

const roadSegmentGroup = new THREE.Group();
for (let i = 0; i < 30; i++) {
  const roadSegClone = roadSegment.clone();
  roadSegClone.scale.y = Math.random() * 2 + 1;
  roadSegClone.position.y = i * 20;
  roadSegClone.position.z = getRandomNumber (0, 10) * getRandomPosOrNeg();
  roadSegmentGroup.add(roadSegClone);
}
const roadSegmentGroup2 = roadSegmentGroup.clone();

roadSegmentGroup.rotateOnAxis( new THREE.Vector3( 0, 1, 0 ), Math.PI / 2 );
roadSegmentGroup2.rotateOnAxis( new THREE.Vector3( 0, -1, 0 ), Math.PI / 2 );
roadSegmentGroup.position.x = -30.5;
roadSegmentGroup.position.y = -4;
roadSegmentGroup2.position.x = -1 * roadSegmentGroup.position.x

//////
const roadSegment2 = new THREE.Mesh( roadSegGeo, roadSegMatr2 );
roadSegment2.position.y = ground.position.y;
roadSegment2.position.z = ground.position.z ;
roadSegment2.receiveShadow = false;

const roadSegmentGroup3 = new THREE.Group();
for (let j = 0; j < 30; j++) {
  const roadSegClone2 = roadSegment2.clone();
  roadSegClone2.scale.y = Math.random() * 2 + 1;
  roadSegClone2.position.y = j * 20;
  roadSegClone2.position.z = getRandomNumber (0, 10) * getRandomPosOrNeg();
  roadSegmentGroup3.add(roadSegClone2);
}
const roadSegmentGroup4 = roadSegmentGroup3.clone();

roadSegmentGroup3.rotateOnAxis( new THREE.Vector3( 0, 1, 0 ), Math.PI / 2 );
roadSegmentGroup4.rotateOnAxis( new THREE.Vector3( 0, -1, 0 ), Math.PI / 2 );
roadSegmentGroup3.position.x = -30.5;
roadSegmentGroup3.position.y = -4;
roadSegmentGroup4.position.x = -1 * roadSegmentGroup3.position.x

const cubeGroupContainer = new THREE.Group();
// cubeGroupContainer.add(roadSegmentGroup, roadSegmentGroup2, roadSegmentGroup3, roadSegmentGroup4);
cubeGroupContainer.add(roadSegmentGroup3, roadSegmentGroup4);


// skyline
// const texture = new THREE.TextureLoader().load( "skyline2.png" );
// const skylineGeo = new THREE.PlaneGeometry( 300, 150 );
// // const skylineGeo = new THREE.BoxGeometry( 744, 342, 1 );
// const skylineMatr = new THREE.MeshBasicMaterial( { color: 0xffffff, map: texture, transparent: true } );
// const skylineLightMatr = new THREE.MeshLambertMaterial( { color: 0xffffff, transparent: true } );

// const skyline = new THREE.Mesh( skylineGeo, skylineMatr );
// const skylineLight = new THREE.Mesh( skylineGeo, skylineLightMatr );
// const skylineGroup = new THREE.Group();
// skylineLight.position.y = skyline.position.y -1;
// skylineGroup.add(skyline, skylineLight);
// skylineGroup.rotation.x = Math.PI / 2;
// skylineGroup.position.y = 350;
// skylineGroup.position.z = -10;


// methods
function animateModel(model, speed) {
  model.position.y -= speed.x;
  if (model.position.y < -180) {
    model.position.y = -30;
  }
}


export  { landscapeGroup, cubeGroupContainer, animateModel, largeSphere, ground }