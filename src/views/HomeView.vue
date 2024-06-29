<script>
  import { ref } from 'vue'
  // import { RouterView, RouterLink } from 'vue-router'

  export default {
    name: 'HomeView',
    components: {
    },
    setup() {
      return {
        playing: false,
        music: ref(null),
        nameString: ref("SETHBRADY"),
        year: ref(new Date().getFullYear()),
        audioControlUrl: ref("/sound/mute.svg"),
      }
    },
    methods: {
      updatePlaying() {
        this.playing = !this.playing;
        if (this.playing) {
          this.$refs.music.play()
          this.audioControlUrl = "/sound/mute.svg"
        } else {
          this.$refs.music.pause()
          this.audioControlUrl = "/sound/play.svg"
        }
      }
    }
  }
</script>

<template>
  <div class="name-wrapper">
    <p class="big-pixels">
      <span
        v-for="(letter) in nameString"
        class="letter"
        :key="letter"
      >
      {{ letter }}
      </span>
    </p>

    <p class="small-pixels">{{ year }}</p>
    <button @click="updatePlaying()" class="audio-button">
      <img :src=audioControlUrl width="90%" height="90%">
    </button>
    <audio ref="music" class="audio-panel">
      <source src="/sound/smallPaint.mp3" type="audio/mpeg">
    </audio>
  </div>
</template>

<style scoped>

.name-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  margin: auto;
  max-height: 100vh;
  padding: 2rem;
  place-items: center;
  width: 100vw;
}

p {
  color: black;
  font-family: '16bitpaint', sans-serif;
}

.big-pixels {
  font-size: 6vw;
  margin: auto 0px;
}
.small-pixels {
  font-size: 1.75vw;
  opacity: 0.65;
}

.audio-button {
  background-color: white;
  border: none;
  bottom: 10px;
  height: 40px;
  left: 10px;
  opacity: 0.35;
  position: absolute;
  width: 40px;
}

.audio-button:hover {
  opacity: 1;
}

.letter:hover {
  color: rgb(122, 14, 14);
  cursor: pointer;
}

.audio-panel {
  display: none;
}

</style>
