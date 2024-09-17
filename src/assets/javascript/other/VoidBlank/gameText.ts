import { createText } from 'three/examples/jsm/webxr/Text2D.js';
import { scene } from './voidBlank';


let currentText = null;
function updateGameText(newText) {
  if (currentText) {
    scene.remove(currentText);
  }
  const text = createText( newText, 0.25 );
  text.color = 'green';
  text.rotation.x = Math.PI*2;
  text.position.z = -4;
  text.position.x = 0;
  text.position.y = 3;
  scene.add(text);
  currentText = text;
}

export { updateGameText };