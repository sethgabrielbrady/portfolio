<script>
  // import { breakout } from '@/assets/javascript/other/breakout.ts'
  import { shootfox } from '@/assets/javascript/other/shootfox.ts'

  export default {
    setup() {
      return {
        currentId: '',
        appLaunched: true,
        show: true
      }
    },
    mounted() {
      // breakout();
      shootfox();
    },
  }
</script>

<template>
  <div style="width:100vw; height:100vh;">
    <div id="breakout" />
  </div>
</template>
