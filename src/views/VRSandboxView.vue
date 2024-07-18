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
  <div id="sandbox" />
</template>

<style scoped>
  #capture {
    font-family: '16bitpaint', sans-serif;
    src: url('@/assets/fonts/16bitpaint.ttf') format('truetype');
  }
</style>


