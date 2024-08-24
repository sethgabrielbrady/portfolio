<script>
  import { shootfox } from '@/assets/javascript/other/Shootfox/shootfox'

  export default {
    setup() {
      return {
        currentId: '',
        appLaunched: true,
        show: true
      }
    },
    mounted() {
      shootfox();
    },
  }
</script>

<template>
  <div style="width:100vw; height:100vh;">
    <div id="shootfox" />
  </div>
</template>