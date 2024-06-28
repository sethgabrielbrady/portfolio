<script setup lang="ts">

</script>

<template>
  <div style="position:relative; left: 0; top:0;">
    <RouterLink class="routerlink" style="left:10px" to="/">Home</RouterLink>
    <RouterLink class="routerlink" style="left:60px;" to="/breakout">Breakout</RouterLink>
    <RouterLink class="routerlink" style="left:130px;" to="/sandbox">Sandbox</RouterLink>
    <RouterView />
  </div>
</template>

<style scoped>
.routerlink {
  color: var(--color-text);
  margin: .25rem;
  padding: .25rem;
  position: absolute;
  text-decoration: none;
}

.routerlink:hover {
  background-color: var(--color-background);
  color: var(--color-text);
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    padding-right: calc(var(--section-gap) / 2);
    place-items: center;
  }

  header .wrapper {
    display: flex;
    flex-wrap: wrap;
    place-items: flex-start;
  }
}
</style>
