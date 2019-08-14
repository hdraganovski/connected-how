<template>
  <v-card class="wrap">
    <v-autocomplete
      :search-input.sync="query"
      :items="searchResults"
      :loading="loading"
      item-text="label"
      item-value="resource"
      v-model="selected"
      :class="{ compact: compact }"
    />
    <div v-if="selectedResource" class="res">
      <img :src="selectedResource.thumbnail" 
      :class="{ compact: compact }"/>
      <h4 >{{selectedResource.label}}</h4>
      <p 
      :class="{ compact: compact }">{{selectedResource.abstract}}</p>
    </div>
    <!-- <ul class="res">
      <li v-for="(val, key) in selectedResource" :key="key">{{key}}: {{val}}</li>
    </ul> -->
  </v-card>
</template>

<script>
var _ = require("lodash");

import DbpediaService from "../services/dbpediaService";

export default {
  props: ['value', 'compact'],
  data: function() {
    return {
      selected: this.value,
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
            // console.log("Got to here")
            this.$emit("input", newVal)
            DbpediaService.shortInfo(newVal)
            .then(response => this.selectedResource = response )
            .catch(e => console.error(e))
        // }
    }
  }
};
</script>

<style lang="scss" scoped>
  .wrap {
    padding: 5px 20px;
    
    & * {
      transition: 500ms ease-in-out;
      max-height: 9999px;
    }
  }

  .compact {
    opacity: 0;
    max-height: 0;
    overflow: hidden;
  }
</style>
