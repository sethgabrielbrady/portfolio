<script>
  import { sandbox } from '@/assets/javascript/VrSandbox/sandbox.js'
  import HomeView from '@/views/HomeView.vue'

  export default {
    components: {
      HomeView
    },
    setup() {
      return {
        canvas: null
      }
    },
    mounted() {
      sandbox();

    },
  }
</script>

<template>
  <div id="sandbox" />
  <HomeView id="capture" style="width:100vw; height:100vh;" />
</template>

<style scoped>

  #capture {
    font-family: '16bitpaint', sans-serif;
    src: url('@/assets/fonts/16bitpaint.ttf') format('truetype');
  }
</style>


