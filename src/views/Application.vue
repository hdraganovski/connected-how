<template>
  <section>
      <v-autocomplete 
        :loading="loading"
        :items="response"
        :search-input.sync="search"
        :filter="filter"
        v-model="select"
        cache-items
        item-text="label"
        item-value="resource"
      />
    <ul>
      <li v-for="(val, key) in response" :key="key">{{ key }}: {{ val }}</li>
    </ul>
  </section>
</template>

<script>
import DbpediaService from "../services/dbpediaService";

export default {
  data: function() {
    return {
      response: [],
      loading: false,
      search: null,
      select: null
    };
  },
  watch: {
      search (val) {
          val && val != this.select && this.querySelections(val)
      }
  },
  methods: {
      querySelections (v) {
          this.loading = true

          DbpediaService.search(v)
            .then(response => {
                this.response = response
            })
            .catch(e => console.error(e))
            .finally(() => this.loading = false)
      },
      filter (item, queryText, itemText) {
          let regex = new RegExp(".*" + queryText + ".*")
          return regex.test(itemText)
      }
  }
};
</script>

<style lang="scss" scoped></style>
