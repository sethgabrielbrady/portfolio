import * as THREE from 'three';
import { scene } from './shootfox';

const buildingGroupY = new THREE.Group();
const buildingGroup = new THREE.Group();
const buildingGeo = new THREE.BoxGeometry( 4, 4, 20 );
const buildingMatr = new THREE.MeshLambertMaterial( { color: 0x1F51FF } );
const building = new THREE.Mesh( buildingGeo, buildingMatr );
building.position.z = 0;

let buildingGroupYStartPos = 100;

const buildings: any[] = [];
const startPos = 400;
function createNewBuildingsXset() {
  const newBuildings = new BuildingGroup(20, startPos);
  buildings.push(newBuildings);
  scene.add(newBuildings);
}

//createNewBuildingsXset

function animateBuildingGroupY(shipSpeed) {
  if (buildings.length > 0) {
    buildings.forEach(building => {
      building.position.y -= shipSpeed.x;
      if (building.position.y === -200) {
        scene.remove(buildings[0]);
        buildings.shift();
      }
      if (building.length < 20) {
        createNewBuildingsXset()
      }
    })
  }
}


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



// landscape
const landscapeGroup = new THREE.Group();
const groundGeo = new THREE.PlaneGeometry( 4000, 800 );
const groundMatr = new THREE.MeshLambertMaterial( { color: 0x00ff99 } );
const ground = new THREE.Mesh( groundGeo, groundMatr );
ground.position.z = -15;
ground.rotation.z = ground.position.z * (Math.PI);

landscapeGroup.add(ground);

const roadGeo = new THREE.PlaneGeometry( 17.5, 800 );
const roadMatr = new THREE.MeshLambertMaterial( { color: 0xcccccc } );
const road = new THREE.Mesh( roadGeo, roadMatr );
road.position.z = ground.position.z + 0.1;
landscapeGroup.add(road);



// cubeGroupContainer
const roadSegGeo = new THREE.BoxGeometry(17, 2, .5 );
const roadSegMatr = new THREE.MeshLambertMaterial( { color: 0xaaaaaa } );
const roadSement = new THREE.Mesh( roadSegGeo, roadSegMatr );

roadSement.position.z = ground.position.z - 0.1;

const roadSegmentGroup = new THREE.Group();
for (let i = 0; i < 100; i++) {
  const roadSegClone = roadSement.clone();
  roadSegClone.position.y = i * 8;
  roadSegmentGroup.add(roadSegClone);
}

const cubeGroupContainer = new THREE.Group();
cubeGroupContainer.add(roadSegmentGroup);


// skyline
const texture = new THREE.TextureLoader().load( "skyline2.png" );
const skylineGeo = new THREE.PlaneGeometry( 300, 150 );
// const skylineGeo = new THREE.BoxGeometry( 744, 342, 1 );
const skylineMatr = new THREE.MeshBasicMaterial( { color: 0xffffff, map: texture, transparent: true } );
const skylineLightMatr = new THREE.MeshLambertMaterial( { color: 0xffffff, transparent: true } );

const skyline = new THREE.Mesh( skylineGeo, skylineMatr );
const skylineLight = new THREE.Mesh( skylineGeo, skylineLightMatr );
const skylineGroup = new THREE.Group();
skylineLight.position.y = skyline.position.y -1;
skylineGroup.add(skyline, skylineLight);
skylineGroup.rotation.x = Math.PI / 2;
skylineGroup.position.y = 350;
skylineGroup.position.z = -10;


// methods
function animateModel(model, speed) {
  model.position.y -= speed.x;
  if (model.position.y < -180) {
    model.position.y = -30;
  }
}


export  { BuildingGroup, landscapeGroup, ground, cubeGroupContainer, skylineGroup, animateModel, animateBuildingGroupY, createNewBuildingsXset }