
import * as THREE from 'three'
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { camera, perspectiveCameraSetup } from './cameras.js'
import { lightsSetup, getAmbientLighting } from './lighting.js'
import { addTableGeometry, addMapTextures, updateMapImage, tableGeometry, rotateTableGeometry } from './tableGeometry.js'
import { addSceneObjects, playerControlledTokens, objectMarkerArray, showLightHelper } from './objectMarkers.js'
import { addOrbitControls, orbitControls, toggleOrbitControls, addDragControls, updatedPositionArray, changeUserRole } from './controls.js'
import { gridSetup, toggleGrid} from './gridHelper.js'
import Stats from 'three/examples/jsm/libs/stats.module'

// Variables
let floorPosition = 0;
let gridInput = 100;
let payload = null;
let sizes = {};
let renderer = null;
let scene = new THREE.Scene();
let imageDimensions = [];
let markerEditId = null;
let currentMap = { dimensions: [100, 100] };
let mapScene = scene
let gameId = null

const stats = Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
const TableBgColor = 0x000000;

// use this to emit the player movement and send to websocket
const EventEmitter = require('events');
const objectPositionEmitter = new EventEmitter();
objectPositionEmitter.on('updateObjectPosition', () => {
  ensurePlayerTokenZPos()
  sendPosition(updatedPositionArray)
});

function ensurePlayerTokenZPos () {
  updatedPositionArray.forEach((marker) => {
    if (marker.position.z !== floorPosition) {
      marker.position.z = floorPosition
    }
  })
}



//How do I check what the id is? Can I assign the id at creation of the websocket?
// Move all of this into it's own file
// ActionCable
let cable = "";
const origin = window.location.origin;
if (origin === "http://localhost:8081") {
  cable = new WebSocket("ws://localhost:3000/cable")
} else if (origin === "https://sandragon-front-ucexa.ondigitalocean.app" || origin === "https://www.sandragon.io") {
  cable = new WebSocket("wss://dolphin-app-hbomq.ondigitalocean.app/cable")
}

// Fix when this loads
// connect to the websocket on load
document.addEventListener("DOMContentLoaded", () => {
  const subscribe = {
    command:'subscribe',
    identifier: JSON.stringify({channel: 'GameMapChannel'}),
  }
  cable.send(JSON.stringify(subscribe))
  console.log("Connected to the map channel from map.js");
})

// stream to websocket
function sendPosition(marker) {
  const msg = {
    command: 'message',
    identifier: JSON.stringify({channel: 'GameMapChannel'}),
    data: JSON.stringify({action: 'send_position', content: marker, gameId: gameId})
  };
  cable.send(JSON.stringify(msg))
  console.log("sending position to GameMapChannel");
}

//listen for websocket events
 document.addEventListener("DOMContentLoaded", () => {
    cable.onmessage = function(event) {
    const response = event.data;
    const streamData = JSON.parse(response);
    // Ignores pings.
    if (streamData.type === "ping") { return }
    // I'm not sure what this is for - need to look into
    if (streamData.message) {
      console.log("Received data from GameMapChannel")
      let data = streamData.message;
      playerControlledTokens = data
    }
  };
  console.log("Receiving data on the map channel from map.js");
})

// gets GameTable data from Vue Component
function getTablePayload(data) {
  payload = data
  if (payload.gameId) {
    gameId = payload.gameId
  }

  let defaultSceneIndex = payload.defaultScene
  currentMap = payload.scenes[defaultSceneIndex] || { dimensions: [100, 100] }
}

// this should be moved to tableGeometry.js
// update table image
function updateWithSelectedImage(imgSrc) {
  let img = new Image();
  img.src = imgSrc;
  imageDimensions = [img.naturalWidth, img.naturalHeight]
  updateMapImage(imageDimensions, imgSrc)
  if (orbitControls) {
    orbitControls.maxDistance = imageDimensions[0] * 0.075
  }
  gridSetup(currentMap.dimensions, gridInput)
}


// need to create a global object containing mapImageWidth and mapImageHeight
function updateGrid(gridInputUpdate) {
  gridSetup(currentMap.dimensions, gridInputUpdate)
}

function windowResize() {
  window.addEventListener('resize', () => {
    sizes = { width:window.innerWidth, height:window.innerHeight }
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio))
  })
}

// Hightlights the marker that is being edited
function highlightMarker (id) {
  objectMarkerArray.forEach((marker) => {
    if (marker.marker_id === id && markerEditId !== id) {
      marker.material[2].transparent = false
      markerEditId = id
    } else if ( marker.marker_id === id && markerEditId === id ){
      marker.material[2].transparent = true
      markerEditId = null
    } else if (id === null) {
      markerEditId = null
      marker.material[2].transparent = true
    }
  })
}

function tick() {
  window.requestAnimationFrame(tick)
  windowResize()
  stats.update()
  renderer.render(mapScene, camera)
}

// render
function addRenderer() {
  renderer = new THREE.WebGLRenderer({antialias: false})
  renderer.setClearColor(0xffffff)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
}

// Initialization
mapScene.background = new THREE.Color( TableBgColor )
// Initialize gets triggered inside Map.vue
function init (id, currentPlayerId) {
  perspectiveCameraSetup()
  gridSetup(currentMap.dimensions, gridInput)
  toggleGrid(false)
  addRenderer()
  addMapTextures(currentMap.image_url)
  addTableGeometry( currentMap.dimensions)
  addSceneObjects(currentPlayerId, currentMap)
  lightsSetup(currentMap)

  if (currentMap.options.rotation) {  // not working - fix
    tableGeometry.rotation.z = currentMap.options.rotation
  }

  const map = document.getElementById(id)
  sizes = { width: window.innerWidth, height: window.innerHeight }
  map.appendChild(renderer.domElement)
  addOrbitControls(camera, renderer.domElement)  // Can I move this into 1 Controls function?
  addDragControls(playerControlledTokens, camera, renderer.domElement)
  tick()
}

function updateUserRole(bool) {
  if (bool === true || bool === false) {
    changeUserRole(bool)
  }
}

export  { init,
          getTablePayload,
          updateWithSelectedImage,
          rotateTableGeometry,
          toggleGrid,
          updateGrid,
          toggleOrbitControls,
          getAmbientLighting,
          imageDimensions,
          playerControlledTokens,
          objectMarkerArray,
          updateUserRole,
          highlightMarker,
          objectPositionEmitter,
          showLightHelper,
          mapScene,
          floorPosition,
          stats
        }
