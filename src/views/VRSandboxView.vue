<script>
  import { sandbox } from '@/assets/javascript/VrSandbox/sandbox.ts'

  export default {
    components: {
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
  <!-- <div style="height: 200%;">
  <div style="position:fixed; color:blue; left: calc(50vw); top:calc(50vh); ">
    <h1>Text Text</h1>
  </div>
  <div id="sandbox" />
  </div> -->
  <div id="sandbox" />
</template>

<style scoped>
  #capture {
    font-family: '16bitpaint', sans-serif;
    src: url('@/assets/fonts/16bitpaint.ttf') format('truetype');
  }
</style>


