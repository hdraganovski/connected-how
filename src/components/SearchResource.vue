<template>
  <v-card class="wrap">
    <v-autocomplete
      :search-input.sync="query"
      :items="searchResults"
      :loading="loading"
      item-text="label"
      item-value="resource"
      v-model="value"
    />
    <div v-if="resource" class="res">
      <v-img :src="resource.thumbnail" />
      <h4>{{ resource.label }}</h4>
      <p>{{ resource.abstract }}</p>
    </div>
  </v-card>
</template>

<script>
import DbpediaService from "@/services/dbpediaService";
var _ = require("lodash");

export default {
  props: ["value", "resource"],
  data: function() {
    return {
      query: "",
      searchResults: [],
      loading: false
    };
  },
  methods: {
    search: _.debounce(function(query) {
      if (query && query.length >= 2) {
        this.loading = true;
        DbpediaService.search(query)
          .then(response => {
            this.searchResults = response;
          })
          .catch(e => console.error(e))
          .finally(() => (this.loading = false));
      }
    }, 500)
  },
  watch: {
    query(val) {
      this.search(val);
    },
    value(newVal) {
      if (newVal) this.$emit("input", newVal);
    }
  }
};
</script>

<style lang="scss" scoped>
.wrap {
  padding: 5px 20px;
}
</style>
