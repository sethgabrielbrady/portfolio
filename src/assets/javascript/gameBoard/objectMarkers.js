
import * as THREE from 'three'
import { mapScene } from './map.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

let currentScene = null
let currentPayload = null
let playerControlledTokens = []
let objectMarkerArray = []
let colorObject = { id:null, color:null }
let defaultImage = "../assets/sandragon_orange.png"
const lightMarkers = []
const lightHelpers = []
const opacity = 0.25
const magenta = 0xFF00FF
const teal = 0x00FFFF

function showLightHelper(showLightHelper) {
  lightHelpers.forEach(lightHelper => {
    if (showLightHelper) {
      lightHelper.visible = true
    }else {
      lightHelper.visible = false
    }
  })
}

function addSceneObjects (playerId, currentScene) {
  // This doesnt seem right - need to look into this
  if (currentScene.playerObjects) {
    currentScene.playerObjects.forEach(object => {
      setupSceneObject(object, playerId, currentScene)
    })
  }
  if (currentScene.sceneObjects) {
    currentScene.sceneObjects.forEach(object => {
      setupSceneObject(object, playerId, currentScene)
    })
  }
}

function createMeshObject(object) {
  let markerGeometry = new THREE.BoxGeometry(1, .01, 1)
  let markerTexture = null
  let markerMaterials = null
  let image = object.image
  let meshObject = null
  const loader = new THREE.TextureLoader();

  markerTexture = loader.load(image || defaultImage )

  // This is the bounding box for the 3d model or the box holding the sprite texture
  // if (object.objType === "mapNote") {
  //   markerMaterials = [
  //     new THREE.MeshBasicMaterial( { color: magenta, opacity: opacity } ),
  //     new THREE.MeshBasicMaterial( { color: magenta, opacity: opacity } ),
  //     new THREE.MeshBasicMaterial( { map: defaultImage, transparent:true } ),
  //     new THREE.MeshBasicMaterial( { color: magenta, opacity: opacity } ),
  //     new THREE.MeshBasicMaterial( { color: magenta, opacity: opacity } ),
  //     new THREE.MeshBasicMaterial( { color: magenta, opacity: opacity } )
  //   ]
  // } else {
    markerMaterials = [
      new THREE.MeshBasicMaterial( { color: magenta, transparent:true, opacity: opacity } ),
      new THREE.MeshBasicMaterial( { color: magenta, transparent:true, opacity: opacity } ),
      new THREE.MeshBasicMaterial( { map: markerTexture, transparent:true } ),
      new THREE.MeshBasicMaterial( { color: magenta, transparent:true, opacity: opacity } ),
      new THREE.MeshBasicMaterial( { color: magenta, transparent:true , opacity: opacity } ),
      new THREE.MeshBasicMaterial( { color: magenta,  transparent:true, opacity: opacity } )
    ]
  //}

  meshObject = new THREE.Mesh(markerGeometry, markerMaterials);
  // Why colorObject ???
  if (object.lightcolor) {
    colorObject.color = object.lightcolor,
    colorObject.id = object.marker_id,
    colorObject.decay = object.decay,
    colorObject.intensity = object.intensity,
    colorObject.distance = object.distance,
    colorObject.power = object.power
  }
  return meshObject
}

// This should run on load only
function positionObject (object, currentPlayerId, payload, sceneObject) {

  let objectMarker = sceneObject
  let objectPosition = {x: 0, y: 0, z: 1}
  if (!object.email) {
    objectMarker.marker_id = object.marker_id
    objectPosition = object.position || objectPosition
  } else {
    objectMarker.isPlayer = true
    objectMarker.marker_id = object.marker_id
    objectPosition = object.position || objectPosition
  }

  // Push the marker with the id === to the currentPlayerId or all markers if the currentPlayerId is -321
  // gmPlayerId is set as -321 - this is a hack and need to be fixed
  // Probably should set the gmPlayerId to the player id with GM role
  if (currentPlayerId === -321 || objectMarker.marker_id === currentPlayerId ) {
    playerControlledTokens.push(objectMarker)
  }

  // set null position data to 0
  // This needs revisiting. There should always be an object maker, no?
  if (!objectPosition || (objectPosition.x === undefined || objectPosition.y === undefined)) {
    objectPosition.x = 0
    objectPosition.y = 0
    objectPosition.z = 1
  }

  if (objectMarker) {
    objectMarker.position.set(objectPosition.x, objectPosition.y, objectPosition.z)
    objectMarker.rotation.x = Math.PI / 2
    objectMarkerArray.push(objectMarker)
  }
}

// Adjusts the marker size based on the gridUnit and the scaleModifier
// This is also where I'm setting up the attributes for tokens so it it might need to be renamed/refactores
function scaleMarkersToGrid (gridUnit) {
  let adjustedMarkerSize = gridUnit
  if (objectMarkerArray) {
    let players = objectMarkerArray.filter(obj => obj.isPlayer === true);
    let sceneObjects = objectMarkerArray.filter(obj => !obj.isPlayer);
    if (players) {
      players.forEach((marker, index) => {
        let playerObj = currentPayload.playerObjects[index]
        if (playerObj && playerObj.scaleModifier ) {
          adjustedMarkerSize = (gridUnit * playerObj.scaleModifier)
          marker.scale.set(adjustedMarkerSize, adjustedMarkerSize, adjustedMarkerSize)
          marker.position.z = 0
        }
      });
    }
    if (sceneObjects) {
      sceneObjects.forEach((marker, index) => {
        let sceneObj = currentPayload.sceneObjects[index]
        marker.touchAction = sceneObj.touchAction || false;
        if (sceneObj && sceneObj.scaleModifier ) {
          adjustedMarkerSize = (gridUnit * sceneObj.scaleModifier)
          marker.scale.set(adjustedMarkerSize, adjustedMarkerSize, adjustedMarkerSize)
          if (sceneObj.objType !== "light") {
            marker.position.z = 0
          }
        }
      });
    }
  }
}

function addPointLight (sceneObject) {
  let color = "0xffffff"
  let decay = 2
  let power = 100
  let intensity = 100
  let distance = 10
  if (sceneObject.marker_id === colorObject.id) {
    color = parseInt(colorObject.color)
    power = colorObject.power
    intensity = colorObject.intensity
    distance = colorObject.distance
    decay = colorObject.decay
  } else {
    color = 0xcccc00
    decay = 2
    distance = 10
    intensity = 100
    power = 100
  }

  let objectLight = new THREE.PointLight(color, 100, 10)
  // this will hide the 3d marker. Need to change the default image
  objectLight.decay = decay
  objectLight.distance = distance
  objectLight.intensity = intensity
  objectLight.power = power
  sceneObject.isLight = true

  sceneObject.add(objectLight)

  //used for flicket animation in map.js
  lightMarkers.push(objectLight)

  const sphereSize = 0.5;
  const pointLightHelper = new THREE.PointLightHelper( objectLight, sphereSize, teal );
  pointLightHelper.visible = false
  lightHelpers.push(pointLightHelper)
  currentScene.add( pointLightHelper );
}

function loadModel (obj, sceneObject) {
    let currentObj = sceneObject
    let scaleModifier = parseInt(obj.scaleModifier)
    let gltfLoader = new GLTFLoader()
    let playerModel = new THREE.Group();
    gltfLoader.load(obj.url,
    (gltf) => {
      let model = gltf.scene
      model.rotation.order = 'YXZ';
      model.rotation.x = Math.PI / 2;
      model.rotation.y = Math.PI * 2
      model.scale.x = scaleModifier
      model.scale.y = scaleModifier
      model.scale.z = scaleModifier
      model.position.x = currentObj.position.x
      model.position.y = currentObj.position.y
      model.position.z = 0
      mapScene.add(model)
    })

    //this adds a base to the player model
    // const orange = 0xFFA500
    // const baseGeometry = new THREE.CylinderGeometry( .5, .5, 0.05, 32 );
    // const baseMaterial = new THREE.MeshBasicMaterial({color: orange });
    // let plane = new THREE.Mesh(baseGeometry, baseMaterial);
    // plane.scale.set(scaleMultiplier, scaleMultiplier, scaleMultiplier)
    // plane.position.z = 0
    // plane.rotation.order = 'YXZ';
    // plane.rotation.x = (Math.PI / 4) * -1;
    // playerModel.add(plane)

    return playerModel
  }

function setupSceneObject (object, currentPlayerId, payload) {
  // Right now this is only getting data from the allPlayers array and should default to the sandragon image
  let sceneObject = createMeshObject(object)

  currentScene = mapScene
  currentPayload = payload

  positionObject(object, currentPlayerId, currentPayload, sceneObject)

  if (object.objType === "light") {
    addPointLight(sceneObject)
  }

  if (object.objType === "3dmodel") {
    loadModel(object, sceneObject)
  }

  mapScene.add(sceneObject);
}

export { addSceneObjects, scaleMarkersToGrid, playerControlledTokens, objectMarkerArray, lightMarkers, showLightHelper }
