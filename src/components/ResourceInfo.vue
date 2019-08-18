<template>
  <v-card class="wrap">
    <!-- {{resourceData}} -->
    <v-btn
      @click="close"
      class="close-button"
      text
      icon
      color="red lighten-2"
      small
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <div v-if="resourceData" class="content">
      <v-img :src="resourceData.thumbnail" />
      <h4>{{ resourceData.label }}</h4>
      <p>{{ resourceData.abstract }}</p>
    </div>
    <div v-else class="content">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
  </v-card>
</template>

<script>
import DbpediaService from "../services/dbpediaService";

export default {
  props: ["resource"],
  data: function() {
    return {
      loading: false,
      resourceData: null
    };
  },
  mounted() {
    this.getResourceData();
  },
  watch: {
    resource() {
      this.resourceData = null;
      this.getResourceData();
    }
  },
  methods: {
    getResourceData() {
      if (this.resource.id.type == "uri") {
        //fetch data
        DbpediaService.shortInfo(this.resource.id.value).then(r => {
          this.resourceData = r
            ? r
            : {
                label: this.resource.id.value,
                abstract: this.resource.id.type
              };
        });
      } else {
        this.resourceData = {
          label: this.resource.id.value,
          abstract: this.resource.id.type
        };
      }
    },
    close() {
      this.$emit("close");
    }
  }
};
</script>

<style lang="scss" scoped>
.wrap {
  padding: 5px 20px;
  z-index: 1000;
  max-height: 90vh;
  overflow: auto;
}

.close-button {
  position: absolute;
  right: 5px;
}

.content {
  margin-top: 50px;
}
</style>
