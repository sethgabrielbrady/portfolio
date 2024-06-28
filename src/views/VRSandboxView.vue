<script>
  import { sandbox } from '@/assets/javascript/VrSandbox/sandbox.js'

  export default {
    setup() {
      return {
      }
    },
    mounted() {
      sandbox();
    },
  }
</script>

<template>
  <div id="sandbox"></div>
</template>