
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
import { playerControlledTokens } from './objectMarkers.js'
import { objectPositionEmitter } from './map.js'
import { panelSize } from './gridHelper.js'

let orbitControls = null
let isEnabled = false

function toggleOrbitControls(bool) {
  orbitControls.enableRotate = bool
  dragControls.enabled = !bool
}

document.addEventListener('keydown', (event) => {
  if (event.shiftKey) {
    if (orbitControls && orbitControls.enableRotate === true) {
      orbitControls.enableRotate = isEnabled
      dragControls.enabled = false
    }
  }
});

document.addEventListener('keyup', (event) => {
  if (!event.shiftKey) {
    if (orbitControls && orbitControls.enableRotate === isEnabled) {
      orbitControls.enableRotate = false
    }

    // added this because the dragControls were being accessed before they were defined
    // might be a better way to do this
    if (dragControls && dragControls.enabled === false) {
      dragControls.enabled = true
    }
  }
});

function addOrbitControls(camera, renderer) {
  orbitControls = new OrbitControls(camera, renderer)
  orbitControls.enabled = true
  orbitControls.enableRotate = false
  orbitControls.keyPanSpeed = 60.0 // magic number
  orbitControls.enableZoom = true
}

 // there might be some weirdness doing it this way - think of something better.
let updatePositionToggle = false
let dragControls = null
let userIsGM = false
let updatedPositionArray = []

function changeUserRole(bool) {
  if (userIsGM === false) {
    userIsGM = bool
  }
}

let panelWidth = null;
function checkForIntesection(playerControlledTokens, tokenbeingMoved) {
  const staticTokens = playerControlledTokens.filter((objectToken) => objectToken.marker_id !== tokenbeingMoved );
  let eventToken = playerControlledTokens.filter((objectToken) => objectToken.marker_id === tokenbeingMoved );
  eventToken = eventToken[0]

  staticTokens.forEach((staticToken) => {
    //checks if touch action on object is true
    if (eventToken.isPlayer && staticToken.touchAction) {
      if ((eventToken.position.x >= staticToken.position.x - panelWidth && eventToken.position.x <= staticToken.position.x + panelWidth)
          && (eventToken.position.y >= staticToken.position.y - panelWidth && eventToken.position.y <=  staticToken.position.y + panelWidth)) {

        let x = eventToken.position.x
        let y = eventToken.position.y

        if(x < 0 && y > 0) {
          eventToken.position.y = staticToken.position.y + panelWidth;
        } else if(x < 0 && y < 0) {
          eventToken.position.y = staticToken.position.y - panelWidth;
        } else if(x > 0 && y > 0) {
          eventToken.position.x = staticToken.position.x - panelWidth;
        } else {
          eventToken.position.x = staticToken.position.x + panelWidth;
        }

        alert("That space is already occupied");
      }
    }
  })
}

function addDragControls(arrayGroup, camera, renderer) {
  dragControls = new DragControls( arrayGroup, camera, renderer );
  dragControls.addEventListener( 'dragstart', function (e) {
    // this keeps the from selecting the 3dmodel from being selected - just a temp hack
    // a solution might be to reassign the event object to the player marker
    if (e.object.name === "Object_2") {// this is a hack - please fix
      dragControls.enabled = false
    } else {
      this.tokenBeingMoved = e.object.marker_id
      dragControls.enabled = true
      orbitControls.enableRotate = false
    }
    updatedPositionArray = []
  })

  dragControls.addEventListener( 'dragend', function () {
    // playerToken needs to be renamed
    panelWidth = Math.ceil(panelSize/2);
    playerControlledTokens.forEach((playerToken) => {

      updatedPositionArray.push({
        isPlayer: playerToken.isPlayer || false,
        marker_id: playerToken.marker_id,
        position: playerToken.position
       })
    })

    checkForIntesection(playerControlledTokens, this.tokenBeingMoved)
    updatePositionToggle = true
    objectPositionEmitter.emit('updateObjectPosition')
    setTimeout(() => {
      updatePositionToggle = false
    }, "300")

  })
  dragControls.enabled = true
}

export {
    addOrbitControls,
    addDragControls,
    orbitControls,
    dragControls,
    updatedPositionArray,
    changeUserRole,
    updatePositionToggle,
    toggleOrbitControls
  }
