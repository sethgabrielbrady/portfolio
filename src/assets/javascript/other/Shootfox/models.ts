import * as THREE from 'three';

const buildingGroupY = new THREE.Group();
const buildingGroup = new THREE.Group();
const buildingGeo = new THREE.BoxGeometry( 4, 4, 20 );
const buildingMatr = new THREE.MeshLambertMaterial( { color: 0x1F51FF } );
const building = new THREE.Mesh( buildingGeo, buildingMatr );
building.position.z = 0;

let buildingGroupYStartPos = 100;


const counter =0;


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
    console.log('buildingGroup');

    return buildingGroup;
  }
}


function getRandomColor() {
  return Math.random() * 0xffffff;
}

const buildingArray: THREE.Group<THREE.Object3DEventMap>[] = [];

const buildingGroupY2 = [];
function createBuildingYSet () {
  for (let i = 0; i < 20; i++) {
      const clone = building.clone();
      clone.position.x = preCalcBuildX(20, i);
      clone.scale.y = Math.random() * 2 + 1;
      clone.scale.x = Math.random() * 2 + 1;
      clone.scale.z = Math.random() * 2 + 1;
      clone.position.y = buildingGroupYStartPos;
      buildingGroup.add(clone);

      buildingGroupY2.push(buildingGroup);
  }
  buildingGroupYStartPos += 50;

}

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

function getRandomPosOrNeg() {
  return Math.random() < 0.5 ? -1 : 1;
}


export  { buildingArray, buildingGroupY, building2, BuildingGroup}