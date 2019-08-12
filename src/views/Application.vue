<template>
  <section>
    <SelectResource class="select-resource" />
    <SelectResource class="select-resource" />
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
  }

  section {
    text-align: center;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
  }
</style>
