import { createText } from 'three/examples/jsm/webxr/Text2D.js';
import { scene } from './voidBlank';


const currentText = [];
function updateGameText(newText) {
  // if (currentText.length > 0) {
  //   scene.remove(currentText);
  // }
  scene.remove(currentText);
  const text = createText( newText, 0.25 );
  currentText.push(text);
  const height = (currentText.length * 0.25) + 3;
  text.color = 'green';
  text.rotation.x = Math.PI*2;
  text.position.z = -4;
  text.position.x = 0;
  // text.position.y = height;
  // scene.add(text);
  currentText.forEach( (t, i) => {
    t.position.y = height - (i * 0.25);
    scene.add(t);
  })
  // currentText = text;
}

// function updateGameText(newText) {
//   if (currentText) {
//     scene.remove(currentText);
//   }
//   const text = createText( newText, 0.25 );
//   text.color = 'green';
//   text.rotation.x = Math.PI*2;
//   text.position.z = -4;
//   text.position.x = 0;
//   text.position.y = 3;
//   scene.add(text);
//   currentText = text;
// }

export { updateGameText };