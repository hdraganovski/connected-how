<template>
  <v-app id="app">
    <div id="nav">
      <div id="logo">Connected how</div>
      <router-link to="/">Home</router-link>
      <router-link to="/app">App</router-link>
      <router-link to="/about">About</router-link>
    </div>
    <router-view />
  </v-app>
</template>

<style lang="scss">
@import "./assets/scss/main.scss";

html {
    overflow: auto !important;
}

#app {
  font-family: "Montserrat", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  font-weight: 300;
  color: $text-light;
}
#nav {
  display: flex;
  justify-content: end;
  margin: 0;
  padding: 10px;
  position: sticky;
  align-items: center;
  top: 0;
  background: $background;
  border-color: $text-light;
  border-bottom-width: 1px;
  border-bottom-style: solid;
    
  transition: all 200ms ease-in;
  
  a {
    transition: all 200ms ease-in;
    margin: 0 15px;
    padding: 5px 15px;
    border-radius: 10px;
    font-weight: bold;
    color: $white;
    border-color: $transparent;
    border-bottom-width: 2px;
    border-bottom-style: solid;
      background: #0002;
    &.router-link-exact-active {
      color: lighten($green, 20);
    }
    text-decoration: none;
    &:hover {
      border-color: $green;
      background: #0004;
    }
    &:active {
      background: darken($green, 20);
      border-color: $green;
      color: white;
    }
  }
}

#logo {
  flex-grow: 1;
  text-align: left;
  margin: 0 15px;
  padding: 5px 15px;
  font-size: 25px;
}
</style>
