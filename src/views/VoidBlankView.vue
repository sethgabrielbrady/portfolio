<script>
  import { voidblank } from '@/assets/javascript/other/VoidBlank/voidBlank'

  export default {
    setup() {
      return {
        currentId: '',
        appLaunched: true,
        show: true
      }
    },
    mounted() {
      voidblank();
    },
  }
</script>

<template>
  <div style="width:100vw; height:100vh;">
    <div id="voidblank" />
  </div>
</template>
