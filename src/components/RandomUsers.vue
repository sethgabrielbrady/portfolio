<script>
  import { randomMain } from '@/assets/javascript/RandomUsers/randomMain.js'

  export default {
    setup() {
      return {
        currentId: '',
        appLaunched: true,
        show: true
      }
    },
    mounted() {
      console.log("App Launched");
      setTimeout(() => {
        randomMain();
      }, "1000");
    },
    // watchers: {
    //   isAppLaunched(oldValue, newValue) {
    //     if (newValue !== oldValue) {
    //       console.log("App Launched");
    //     }
    //   }
    // },
    // computed: {
    //   isAppLaunched() {
    //     return this.appLaunched;
    //   }
    // },
    // methods: {
    //   toggleShow() {
    //     this.show = !this.show;
    //   },
    //   launchRandomUsers() {
    //     this.show = !this.show;
    //     this.appLaunched = false;
    //     this.currentId = "randomUsers";
    //     console.log("id", this.currentId)
    //     setTimeout(() => {
    //       randomMain();
    //     }, "1000");
    //   }
    // }
  }


</script>


<template>
  <div>
    <div id="randomUsers"></div>
    <div id="appLaunchers" class="p-4">
    </div>
  </div>
</template>