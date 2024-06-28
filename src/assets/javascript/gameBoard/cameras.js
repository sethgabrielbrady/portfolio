import * as THREE from 'three'
import { mapScene } from './map.js'

//Camera
let camera = {}
let cameraHeightFromPlayers = 40.5
function perspectiveCameraSetup() {
  camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight,0.1,1000)// magic number
  // must be called after any manual changes to the camera's transform
  camera.position.z = cameraHeightFromPlayers
  camera.position.x = 0
  camera.position.y = 0
  camera.lookAt( mapScene.position )
}

function adjustCameraHeight(gridInput) {
  let baseCameraHeight = 4500;
  cameraHeightFromPlayers = baseCameraHeight / gridInput
  if (camera) {
    camera.position.z =  cameraHeightFromPlayers
  }
}

export { camera, perspectiveCameraSetup, adjustCameraHeight  }