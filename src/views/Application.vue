<template>
  <section>
    <SelectResource v-model="left" class="select-resource" :compact="showGraph"/>
    <SelectResource v-model="right" class="select-resource" :compact="showGraph"/>
    <div class="action-button" v-if="left && right">
      <v-btn rounded color="secondary" dark @click="showGraph = !showGraph">{{showGraph ? 'Close graph' : 'Show graph'}}</v-btn>
    </div>
  </section>
</template>

<script>
import DbpediaService from "../services/dbpediaService";
import SelectResource from "../components/SelectResource";
import _ from "lodash"

export default {
  components: {
    SelectResource
  },
  data: function() {
    return {
      left: null,
      right: null,
      showGraph: false
    }
  },
  methods: {
    querySelections() {
      this.loading = true;
      DbpediaService.search(this.search)
        .then(response => {
          this.response = response;
        })
        .catch(e => console.error(e))
        .finally(() => (this.loading = false));
    },
    filter(item, queryText, itemText) {
      let regex = new RegExp(".*" + queryText + ".*");
      return regex.test(itemText);
    },
    theCall() {
      console.log("Got to here")
      _.debounce(this.querySelections, 20);
    }
  }
};
</script>

<style lang="scss" scoped>
  .select-resource {
    margin: 0 auto;
    width: 500px;
    height: 85vh;
    overflow: auto;
  }

  section {
    text-align: center;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .action-button {
    position: absolute;
    bottom: 20px;
    width: 100%;

    animation: 400ms slide-in;
      transition-timing-function: ease-out;
  }

  @keyframes slide-in {
    0% {
      transform: translateY(10px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
</style>
