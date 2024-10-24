import { createText } from 'three/examples/jsm/webxr/Text2D.js';
import { scene } from './voidBlank';

const currentText = [];
function updateGameText(newText) {
  if (currentText.length > 10) {
    const t = currentText.shift();
    scene.remove(t);

    // currentText.forEach( (t) => {
    //   scene.remove(t);
    // });
  }
  const text = createText( newText, 0.25 );
  currentText.push(text);
  const height = (currentText.length * 0.25) + 3;
  text.color = 'green';
  // rotate the text so that it is on the z axis
  text.rotation.y = -Math.PI * 2;
  text.rotation.x = -Math.PI / 2;


  // text.rotation.x = Math.PI*2;
  // text.rotation.z = -Math.PI*2;
  // text.rotation.x = 4;
  text.position.x = 0;
  text.position.y = -5;
  text.position.z = -40;
  // scene.add(text);
  currentText.forEach( (t, i) => {
    t.position.z= height - (i * 0.25);
    scene.add(t);
  })
}

export { updateGameText };