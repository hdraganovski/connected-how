<template>
  <div>
    <v-autocomplete
      :search-input.sync="query"
      :items="searchResults"
      :loading="loading"
      item-text="label"
      item-value="resource"
      v-model="selected"
    />
    <div v-if="selectedResource" class="res">
      <img :src="selectedResource.thumbnail" />
      <h4>{{selectedResource.label}}</h4>
      <p>{{selectedResource.abstract}}</p>
    </div>
    <!-- <ul class="res">
      <li v-for="(val, key) in selectedResource" :key="key">{{key}}: {{val}}</li>
    </ul> -->
  </div>
</template>

<script>
var _ = require("lodash");

import DbpediaService from "../services/dbpediaService";

export default {
  data: function() {
    return {
      selected: null,
      query: "",
      searchResults: [],
      loading: false,
      selectedResource: null
    };
  },
  methods: {
    search: _.debounce(function(query) {
      DbpediaService.search(query)
        .then(response => {
          this.searchResults = response;
        })
        .catch(e => console.error(e))
        .finally(() => (this.loading = false));
    }, 500),
    theCall() {
      this.loading = true;
      this.search(this.query);
    }
  },
  watch: {
    query(val) {
      this.theCall();
    },
    selected(newVal, oldVal) {
        // if(oldVal != newVal && newVal) {
            console.log("Got to here")
            DbpediaService.shortInfo(newVal)
            .then(response => this.selectedResource = response )
            .catch(e => console.error(e))
        // }
    }
  }
};
</script>

<style lang="scss" scoped>
.res {
    max-width: 300px;
}
</style>
