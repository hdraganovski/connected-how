<template>
  <v-card class="wrap" v-if="resource">
    <!-- {{resourceData}} -->
    <div class="actions">
      <v-btn @click="add" class="close-button" text icon color="green lighten-2" small>
        <v-icon>mdi-plus</v-icon>
      </v-btn>

      <v-btn @click="close" class="close-button" text icon color="red lighten-2" small>
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>
    <div v-if="resourceData" class="content">
      <v-img v-if="resourceData.thumbnail" :src="resourceData.thumbnail" contain />
      <h4>{{ resourceData.label }}</h4>
      <p>{{ resourceData.abstract }}</p>
    </div>
    <div v-else class="content">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
  </v-card>
</template>

<script>
import DbpediaService from "@/services/dbpediaService";

export default {
  props: ["resource"],
  data: function() {
    return {
      loading: false,
      resourceData: null
    };
  },
  methods: {
    onResourceChange(val) {
      if (val) {
        this.$dbpediaService.shortInfo(val)
          .then(res => (res ? (this.resourceData = res) : this.$emit("close")))
          .catch(e => {
            console.log(e);
            this.resourceData = null;
            this.$emit("close");
          });
      } else {
        this.resourceData = null;
        this.$emit("close");
      }
    },
    close() {
      this.$emit("close");
    },
    add() {
      if (this.resourceData) {
        this.$emit("on-add", {
          uri: this.resource,
          label: this.resourceData.label
        });
      }
    }
  },
  watch: {
    resource(val) {
      this.onResourceChange(val);
    }
  }
};
</script>

<style lang="scss" scoped>
.actions {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>
