import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    leftUri: null,
    rightUri: null,
    leftResource: null,
    rightResource: null
  },
  mutations: {
    setLeftUri(state, uri) {
      state.leftUri = uri;
    },
    setRightUri(state, uri) {
      state.rightUri = uri;
    },
    setLeftResource(state, resource) {
      state.leftResource = resource;
    },
    setRightResource(state, resource) {
      state.rightResource = resource;
    }
  },
  actions: {}
});
