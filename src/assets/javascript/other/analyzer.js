function analyzer() {
let playing = false;
let audio = document.getElementById('myAudio');
let parent = document.getElementById('audio');
// let test_node = document.getElementById('test_node');
let node;
let color;
let nodeCount = 128;

console.log(parent);

parent.setAttribute("style","grid-template-columns:repeat(" + nodeCount + ", 1fr);");

for (let i=1; i <= nodeCount*4; i++){
  let divNode = "node".concat(i);
  parent.innerHTML += "<div class='node' id="+divNode+"></div>";
}


function play() {
  let ctx = new AudioContext();
  let audioSrc = ctx.createMediaElementSource(audio);
  let analyser = ctx.createAnalyser();
  // we have to connect the MediaElementSource with the analyser
  audioSrc.connect(analyser);
  audioSrc.connect(ctx.destination);
  // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)

  // frequencyBinCount tells you how many values you'll receive from the analyser
  let frequencyData = new Uint8Array(analyser.frequencyBinCount);

  function renderFrame() {
     requestAnimationFrame(renderFrame);
     // update data in frequencyData
     analyser.getByteFrequencyData(frequencyData);
     // render frame based on values in frequencyData

    for (let i=1; i <= (nodeCount*4); i++){
      color = frequencyData[i]/(i*0.5);
      console.log(color);
      node = document.getElementById("node".concat(i));
      node.setAttribute("style","height:" + frequencyData[i] + "px;background-color:rgba(5, 145, 253,"+color+");");
    }
  }

  audio.play();
  playing = true;
  renderFrame();
}


function stopping(){
  if (playing === true){
    audio.pause();
    playing = false;
  }
}

play()

}


export { analyzer}
