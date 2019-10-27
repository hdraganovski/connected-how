<template>
  <v-container class="home">
    <Graph :node-data="nodes" :link-data="links" class="graph" />
    <h1>Connected how?</h1>
    <v-card>
      <v-card-title>
        <span class="display-1">What is it about?</span>
        Connected how is a simple web app that visualizes how resources in DBpedia are connected.
        
      </v-card-title>
    </v-card>
    <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
  </v-container>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
import Graph from "@/components/Graph";

export default {
  name: "home",
  components: {
    // HelloWorld,
    Graph
  },
  data: function() {
    var nodes = [];
    var links = [];
    var i,
      j,
      n = 20;
    for (i = 0; i < n; i++) {
      nodes.push({ id: i });
      for (j = i + 1; j < n; j++) {
        links.push({ source: i, target: j });
      }
    }
    return {
      nodes: nodes,
      links: links
    };
  }
};
</script>

<style lang="scss" scoped>
.graph {
  width: 100%;
  height: 450px;
}
</style>
