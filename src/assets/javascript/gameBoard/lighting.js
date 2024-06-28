import * as THREE from 'three'
import { mapScene } from './map.js'

let ambientLightIntensity = .75
let ambientLightColor = 0xffffff
let ambientLight = null

function getAmbientLighting(color, intensity ) {
  updateAmbientLighting(color, intensity, mapScene)
}

function updateAmbientLighting(color, intensity) {
  // change to upudateAmbient
  ambientLightColor = parseInt(color),
  ambientLightIntensity = intensity
  if (ambientLight) {
    mapScene.remove(ambientLight)
  }
  ambientLight = new THREE.AmbientLight( ambientLightColor, ambientLightIntensity )
  mapScene.add(ambientLight)
}

function lightsSetup(currentScene) {
  ambientLightColor = parseInt(currentScene.ambientLightOptions.color)|| ambientLightColor
  ambientLightIntensity = currentScene.ambientLightOptions.intensity || ambientLightIntensity
  ambientLight = new THREE.AmbientLight( ambientLightColor, ambientLightIntensity )
  mapScene.add( ambientLight)
}

export { lightsSetup , updateAmbientLighting, getAmbientLighting  }