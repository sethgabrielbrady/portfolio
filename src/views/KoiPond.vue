<script>
  import { koiPond } from '@/assets/javascript/koiPond/koiPond'

  export default {
    setup() {
      return {
        currentId: '',
        appLaunched: true,
        show: true
      }
    },
    mounted() {
      koiPond();
    },
  }
</script>

<template>
  <div style="width:100vw; height:100vh;">
    <div id="koiPond" />
  </div>
</template>
