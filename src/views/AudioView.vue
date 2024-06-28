<script>
  import { analyzer } from '@/assets/javascript/other/analyzer.js'

  export default {
    setup() {
      return {
        currentId: '',
        appLaunched: true,
        show: true
      }
    },
    mounted() {
      analyzer();
    },
  }
</script>

<template>
  <div class="body">
    <div>
      <audio id="myAudio" src="/sound/smallPaint.mp3" type="audio/mpeg"></audio>
      <div id="audio" class="grid_wrapper">
        <div class="node"></div>
      </div>
    </div>

  </div>
</template>

<style scoped>

.body {
  width: 100vw;
  height: 100vh;
}

.node{
  border-bottom:4px solid black;
}

.grid_wrapper {
  display: grid;
  position: relative;
  top: 25vh;
  transform: rotate(180deg);
  width:100vw;
}

</style>