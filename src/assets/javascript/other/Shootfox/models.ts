import * as THREE from 'three';

const buildingGroupY = new THREE.Group();
const buildingGroup = new THREE.Group();
const buildingGeo = new THREE.BoxGeometry( 4, 4, 20 );
const buildingMatr = new THREE.MeshLambertMaterial( { color: 0x1F51FF } );
const building = new THREE.Mesh( buildingGeo, buildingMatr );
// building.position.z = ground.position.z + 1;
building.position.z = 0;

// const buildingYCounter = 0;
let buildingGroupYStartPos = 400;
const buildingArray: THREE.Group<THREE.Object3DEventMap>[] = [];


const buildingTable: number[][] = [];
function createBuildingTable() {
  const buildingArray = [];
  for (let j = 0; j < 20; j++) {
    for (let i = 0; i < 20; i++) {
      buildingArray.push((Math.random() * 400) * getRandomPosOrNeg());
    }
    buildingTable.push(buildingArray)
  }
}

createBuildingTable();
console.log("table", buildingTable);


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

console.log("buildingArray", buildingArray);

export  { buildingArray, buildingGroupY }