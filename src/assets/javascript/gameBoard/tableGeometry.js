import * as THREE from 'three'
import { mapScene } from './map.js'

let tableGeometry = null
let floorTexture = null

function rotateTableGeometry() {
  if ( tableGeometry.rotation.z  ===  - Math.PI / 2) {
    tableGeometry.rotation.z = Math.PI * 2
  } else if (tableGeometry.rotation.z  === Math.PI * 2) {
    tableGeometry.rotation.z = - Math.PI / 2
  }
  return tableGeometry.rotation.z
}

function updateMapImage(dim, imgSrc) {
  if (tableGeometry) {
    mapScene.remove(tableGeometry)
  }
  addMapTextures(imgSrc) // need to pass an image here
  addTableGeometry(dim)  // pass (global) scene to module rather than through method calls
}

function addTableGeometry(dim) {
  let geometry = null
  if (dim) {
    geometry = new THREE.BoxGeometry((dim[0]/10), (dim[1]/10), 0)
  }else {
    geometry = new THREE.BoxGeometry(100, 100, 0) // magic number
  }
  let mapMaterials = [
    new THREE.MeshPhongMaterial( { color: 0x00cc00 } ),
    new THREE.MeshPhongMaterial( { color: 0x00cc00 } ),
    new THREE.MeshPhongMaterial( { color: 0x00cc00 } ),
    new THREE.MeshPhongMaterial( { color: 0x00cc00 } ),
    new THREE.MeshPhongMaterial( { normalMap: floorTexture, map:floorTexture, transparent:true } ),
    new THREE.MeshPhongMaterial( { color: 0x00cc00 } )
  ]

  tableGeometry = new THREE.Mesh(geometry, mapMaterials)
  mapScene.add(tableGeometry)
}

// This can probably be handled better
function addMapTextures(image) {
  const loader = new THREE.TextureLoader();
  if (image) {
    floorTexture = image;
  }
  floorTexture = loader.load(floorTexture);
}

export { addMapTextures, addTableGeometry, updateMapImage, tableGeometry, rotateTableGeometry }
