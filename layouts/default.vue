<template>
  <v-app>
    <div class="bg">
      <div class="bg1"></div>
      <div class="bg2"></div>
      <div class="bg3"></div>
    </div>
    <div id="nav">
      <div id="logo">Connected how?</div>
      <!-- <nuxt-link to="/">Home</nuxt-link>
      <nuxt-link to="/app">App</nuxt-link>
      <nuxt-link to="/about">About</nuxt-link> -->
    </div>
    <v-content app>
      <nuxt />
      </v-content>
  </v-app>
</template>

<style lang="scss">
@import "~assets/scss/main.scss";

#router {
  z-index: 1;
  // position: relative;
  flex-grow: 1;
}

.bg {
  z-index: 0;
  height: 0;
}

.page-view {
  z-index: 1;
}
</style>