<script>
  import { breakout } from '@/assets/javascript/other/3DBreakout.ts'

  export default {
    setup() {
      return {
        currentId: '',
        appLaunched: true,
        show: true
      }
    },
    mounted() {
      breakout();
    },
  }
</script>

<template>
  <div id="3dBreakout" style="width:100vw; height:100vh;" />
</template>
