<template>
  <v-app id="app">
    <div class="bg">
      <div class="bg1"></div>
      <div class="bg2"></div>
      <div class="bg3"></div>
    </div>
    <div id="nav">
      <div id="logo">Connected how?</div>
      <router-link to="/">Home</router-link>
      <router-link to="/app">App</router-link>
      <router-link to="/about">About</router-link>
    </div>
    <div id="router">
      <router-view />
    </div>
  </v-app>
</template>

<style lang="scss">
@import "./assets/scss/main.scss";

#router {
  z-index: 1;
  // position: relative;
  flex-grow: 1;
}

.bg {
  z-index: 0;
}

.page-view {
  z-index: 1;
}
</style>
