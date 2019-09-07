<template>
  <div>
    <v-expansion-panels accordion>
      <v-expansion-panel>
        <v-expansion-panel-header>Selected resources</v-expansion-panel-header>
        <v-expansion-panel-content>
          <template v-for="el in resourceList">
            <div class="content" :key="el.uri">
              <span style="flex-grow: 0; margin-right: 10px;">
                <v-btn icon x-small color="error">
                  <v-icon @click.prevent="$emit('on-remove', i)"
                    >mdi-close</v-icon
                  >
                </v-btn>
              </span>
              <span class="label">{{ el.label }}</span>
            </div>
          </template>
          <v-autocomplete
            :items="searchResult"
            :loading="loading"
            :search-input.sync="query"
            v-model="model"
            item-text="label"
            item-value="uri"
            cache-items
          >
            <template v-slot:append-outer>
              <v-btn
                @click="onAddResource(model)"
                fab
                outlined
                x-small
                color="primary"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
          </v-autocomplete>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import * as _ from "lodash";
import DbpediaService from "@/services/dbpediaService";

export default {
  props: ["resourceList"],
  data: function() {
    return {
      query: "",
      model: null,
      show: true,
      searchResult: [],
      loading: false,
      debouncedSearch: _.debounce(this.search, 500)
    };
  },
  methods: {
    onQueryChange(val) {
      if (val && val.length >= 2) this.debouncedSearch(val);
    },
    search(val) {
      this.loading = true;
      DbpediaService.search(val)
        .then(el => {
          this.searchResult = el;
        })
        .finally(() => (this.loading = false));
    },
    onAddResource(uri) {
      var res = _.find(this.searchResult, el => el.uri == uri);
      // this.resourcesList.push(res!);
      this.$emit("on-add", res);
      this.model = null;
    }
  },
  watch: {
    query: function(val) {
      this.onQueryChange(val);
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  vertical-align: middle;
  align-items: center;
  border-bottom: 1px;
  border-bottom-style: solid;
  border-color: #0001;
}

.label {
  vertical-align: middle;
}
</style>
