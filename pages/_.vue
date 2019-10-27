<template>
  <div class="application">
    <SearchComponent
      :resourceList="selectedResources"
      @on-add="onAddResource"
      @on-remove="onRemoveResource"
      class="resourceList"
    />
    <SelectedResource
      :resource="selectedResource"
      @close="selectedResource = null"
      @on-add="onAddResource"
      class="selectedResource"
    />
    <Graph
      :node-data="resourceNodes"
      :link-data="resourceLinks"
      class="graph"
      @on-node-click="onNodeClick"
    />
  </div>
</template>

<script>
import SearchComponent from "@/components/SearchComponent.vue";
import SelectedResource from "@/components/SelectedResource.vue";
import Graph from "@/components/Graph.vue";
import DbpediaService from "@/services/dbpediaService";

export default {
  components: { SearchComponent, SelectedResource, Graph },
  data: function() {
    return {
      selectedResource: null
    };
  },
  methods: {
    onAddResource(searchResult) {
      this.$store.dispatch("addSelectedResource", searchResult);
      this.$dbpediaService.getResourceObject(searchResult.uri).then(response => {
        this.$store.dispatch("addResourceInfo", {
          key: searchResult.uri,
          data: response
        });
      });
      this.$dbpediaService.getResourceSubject(searchResult.uri).then(response => {
        this.$store.dispatch("addSubjectInfo", {
          key: searchResult.uri,
          data: response
        })
      })
      this.selectedResource = null;
    },
    onRemoveResource(i) {
      this.$store.commit("removeResource", i);
    },
    onNodeClick(id) {
      this.selectedResource = id;
    }
  },
  computed: {
    selectedResources() {
      return this.$store.state.selectedResources;
    },
    resourceNodes() {
      return this.$store.getters.graphNodes;
    },
    resourceLinks() {
      return this.$store.getters.graphLinks;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/variables.scss";

.application {
  display: flex;

  flex-direction: column-reverse;
  padding: 15px 15px;
  height: 100vh;
  // align-items: end;
  justify-content: space-between;
  // margin-top: -58px;
  // padding-top: 58px;

  @media only screen and (min-width: $bp-s) {
    // margin-top: -68px;
    // padding-top: 68px;
    align-items: start;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    grid-template-rows: auto auto;
    grid-gap: 10px;
  }
}

.resource-list {
  grid-column: 1 / 2;
  grid-row: -1;
  @media only screen and (min-width: $bp-s) {
    grid-row: 1;
    grid-column: 1;
  }
}

.graph {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
}

.selectedResource {
  grid-column: -3 / span 2;
  max-height: 100%;
  overflow: auto;
  z-index: 1;
}
</style>
