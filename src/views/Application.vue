<template>
  <section>
    <!-- {{eventData}} -->
    <div class="search">
      <transition name="slide-right">
        <SearchResource
          class="search-card"
          v-if="!showGraph"
          v-model="left"
          :resource="leftResource"
        />
      </transition>
      <transition name="slide-left">
        <SearchResource
          class="search-card"
          v-if="!showGraph"
          v-model="right"
          :resource="rightResource"
        />
      </transition>
    </div>
    <transition name="slide-right">
      <div class="mini-resource" v-if="showGraph">
        <!-- <MiniResourceInfo :resource="leftResource" class="mini-card" /> -->
        <v-card class="mini-card">{{
          leftResource ? leftResource.label : ""
        }}</v-card>
        <v-card class="mini-card">{{
          rightResource ? rightResource.label : ""
        }}</v-card>
      </div>
    </transition>
    <transition name="slide-left">
      <ResourceInfo
        @close="eventData = null"
        v-if="eventData"
        :resource="eventData"
        class="resource-info"
      />
    </transition>
    <Graph
      v-if="showGraph"
      :node-data="graphData.nodes"
      :link-data="graphData.links"
      class="graph"
      @on-node-click="d => (eventData = d)"
    />
    <div class="action-button" v-if="left && right">
      <v-btn rounded color="secondary" dark @click="toggleGraph">
        {{ showGraph ? "Close graph" : "Show graph" }}
      </v-btn>
    </div>
  </section>
</template>

<script>
import DbpediaService from "../services/dbpediaService";
import SearchResource from "../components/SearchResource";
import ResourceInfo from "../components/ResourceInfo";
import Graph from "@/components/Graph";

export default {
  components: {
    SearchResource,
    ResourceInfo,
    Graph
  },
  data: function() {
    var nodes = [];
    var links = [];
    var i,
      j,
      n = 20;
    for (i = 0; i < n; i++) {
      nodes.push({ id: i, label: i });
      for (j = i + 1; j < n; j++) {
        links.push({ source: i, target: j });
      }
    }

    return {
      showGraph: false,
      nodes: nodes,
      links: links,
      intersection: null,
      eventData: null
    };
  },
  computed: {
    left: {
      get() {
        return this.$store.state.leftUri;
      },
      set(val) {
        DbpediaService.shortInfo(val)
          .then(response => (this.leftResource = response))
          .catch(e => console.error(e));
        this.$store.commit("setLeftUri", val);
        this.getIntersection();
      }
    },
    right: {
      get() {
        return this.$store.state.rightUri;
      },
      set(val) {
        DbpediaService.shortInfo(val)
          .then(response => (this.rightResource = response))
          .catch(e => console.error(e));
        this.$store.commit("setRightUri", val);
        this.getIntersection();
      }
    },
    leftResource: {
      get() {
        return this.$store.state.leftResource;
      },
      set(val) {
        this.$store.commit("setLeftResource", val);
      }
    },
    rightResource: {
      get() {
        return this.$store.state.rightResource;
      },
      set(val) {
        this.$store.commit("setRightResource", val);
      }
    },
    graphData() {
      if (this.intersection) {
        var nodes = this.intersection.map(el => {
          el.data = JSON.parse(JSON.stringify(el));
          el.id = el.id.value;
          return el;
        });
        var leftObj = {
          data: {
            id: {
              type: "uri",
              value: this.left
            },
            label: this.leftResource ? this.leftResource.label : ""
          },
          id: this.left,
          label: this.leftResource ? this.leftResource.label : ""
        };
        var rightObj = {
          data: {
            id: {
              type: "uri",
              value: this.right
            },
            label: this.rightResource ? this.rightResource.label : ""
          },
          id: this.right,
          label: this.rightResource ? this.rightResource.label : ""
        };

        var links = [];

        nodes.forEach(el => {
          links.push({
            source: leftObj.id,
            target: el.id
          });
          links.push({
            source: rightObj.id,
            target: el.id
          });
        });

        nodes.push(leftObj);
        nodes.push(rightObj);

        return {
          nodes: nodes,
          links: links
        };
      } else {
        return {
          nodes: [],
          links: []
        };
      }
    }
  },
  methods: {
    getIntersection() {
      if (this.left && this.right) {
        DbpediaService.intersection(this.left, this.right).then(
          res => (this.intersection = res)
        );
      } else {
        this.intersection = null;
      }
    },
    toggleGraph() {
      this.showGraph = !this.showGraph;
      this.eventData = null
    }
  }
};
</script>

<style lang="scss" scoped>
.aside {
  transition: 500ms ease-in;
}

.search-card {
  width: 500px;
  height: 85vh;
  overflow: auto;
  margin: 0 auto;
}

.search {
  text-align: center;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  justify-content: space-between;
  transition: 500ms ease-in;
  position: absolute;
  width: 100%;
}

.graph {
  position: absolute;
  width: 100vw;
  height: 85vh;
}

.mini-resource {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  width: 300px;
  position: absolute;
}

.resource-info {
  position: absolute;
  width: 500px;
  right: 20px;
}

.action-button {
  position: absolute;
  bottom: 20px;
  width: 100%;

  animation: 400ms slide-in;
  transition-timing-function: ease-out;
}

.mini-card {
  padding: 5px 20px;
  margin: 5px 20px;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: 0.5s;
}

.slide-left-enter,
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: 0.5s;
}

.slide-right-enter,
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}

@keyframes slide-in-left {
  0% {
    transform: translateX(100px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
