<script>
  // import { breakout } from '@/assets/javascript/VrSandbox/breakout.ts'
  import { sandbox } from '@/assets/javascript/VrSandbox/sandbox.ts';


  export default {
    components: {
    },
    setup() {
      return {
        canvas: null
      }
    },
    mounted() {
      // breakout();
      sandbox();

    },
  }
</script>

<template>
  <div style="height: 120vh; width:100vw;">
    <div id="sandbox" style="position:fixed; "/>
  </div>
</template>

<style scoped>
  #capture {
    font-family: '16bitpaint', sans-serif;
    src: url('@/assets/fonts/16bitpaint.ttf') format('truetype');
  }
</style>


