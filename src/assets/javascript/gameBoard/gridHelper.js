import * as THREE from 'three'
import { adjustCameraHeight } from './cameras.js'
import { scaleMarkersToGrid } from './objectMarkers.js'
import { mapScene, floorPosition } from './map.js'


let gridHelper = {}
let panelSize = null
let scaleModifier = 1
let gridColor = 0xff0000;
let gridOpacity = 0.95;

function toggleGrid (gridVisible) {
  if ( gridVisible) {
    mapScene.add(gridHelper);
  } else {
    mapScene.remove(gridHelper);
  }
}

function gridSetup (dimensions, panelCount) {
  const width = dimensions[0]/10;
  const height = dimensions[1]/10;
  const newDimensions = [width, height]
  panelCount = panelCount || 100
  panelSize = (width / panelCount)

  if (gridHelper) {
    mapScene.remove(gridHelper)
  }

  gridHelper = createGrid(newDimensions, panelCount, floorPosition)
  scaleMarkersToGrid(panelSize * scaleModifier)
  adjustCameraHeight(panelCount)
}

function createGrid (dimensions, panelCount) {
  const width = dimensions[0];
  const height = dimensions[1];
  const group = new THREE.Group();
  const halfWidth = width / 2;
  const widthPanels = width / panelCount;
  const halfHeight = height / 2;
  const horizontalPoints = [];
  const verticalPoints = [];

  for (let i = -halfHeight; i <= halfHeight; i += widthPanels) {
    horizontalPoints.push(new THREE.Vector3(-halfWidth, 1, i));
    horizontalPoints.push(new THREE.Vector3(halfWidth, 1, i));
  }

  for (let i = -halfWidth; i <= halfWidth; i+= widthPanels) {
    verticalPoints.push(new THREE.Vector3( i, 1, - halfHeight));
    verticalPoints.push(new THREE.Vector3( i, 1, halfHeight));
  }

  const material = new THREE.LineBasicMaterial({ color: gridColor, opacity: gridOpacity, transparent: true});
  const horizontalGeometry = new THREE.BufferGeometry().setFromPoints(horizontalPoints);
  const horizontalLines = new THREE.LineSegments(horizontalGeometry, material);
  const verticalGeometry = new THREE.BufferGeometry().setFromPoints(verticalPoints);
  const verticalLines = new THREE.LineSegments(verticalGeometry, material);

  group.add(horizontalLines);
  group.add(verticalLines);
  group.rotateX(Math.PI / 2)
  group.position.z = 0.01
  return group
}

export { gridSetup, gridHelper, toggleGrid, panelSize }
