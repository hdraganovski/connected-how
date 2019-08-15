<template>
  <section>
    <div class="graph">
      <transition name="slide-right">
        <MiniResourceInfo v-if="showGraph" :resource="leftResource" class="mini-card" />
      </transition>
      <transition name="slide-left">
        <MiniResourceInfo v-if="showGraph" :resource="rightResource" class="mini-card" />
      </transition>
    </div>
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
    <div class="action-button" v-if="left && right">
      <v-btn
        rounded
        color="secondary"
        dark
        @click="showGraph = !showGraph"
      >{{showGraph ? 'Close graph' : 'Show graph'}}</v-btn>
    </div>
  </section>
</template>

<script>
import DbpediaService from "../services/dbpediaService";
import SearchResource from "../components/SearchResource";
import MiniResourceInfo from "../components/MiniResourceInfo";
import _ from "lodash";

export default {
  components: {
    SearchResource,
    MiniResourceInfo
  },
  data: function() {
    return {
      showGraph: false
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

.graph,
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

.action-button {
  position: absolute;
  bottom: 20px;
  width: 100%;

  animation: 400ms slide-in;
  transition-timing-function: ease-out;
}

.mini-card {
  padding: 5px 20px;
  margin: 20px;
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
