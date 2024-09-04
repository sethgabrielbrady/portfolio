import { createText } from 'three/examples/jsm/webxr/Text2D.js';
import { scene } from './shootfox';


let currentText = null;
function updateGameText(newText) {
  if (currentText) {
    scene.remove(currentText);
  }
  const text = createText( newText, 0.75 );
  text.color = 'green';
  text.rotation.x = Math.PI / 2;
  text.position.z = 11;
  text.position.x = 22;
  text.position.y = -1
  scene.add(text);
  currentText = text;
}

export { updateGameText };