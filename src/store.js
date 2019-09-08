import Vue from "vue";
import Vuex from "vuex";
import _ from 'lodash';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    update: false,
    selectedResources: [],
    resourceInfoMap: {
      update: false
    }
  },
  getters: {
    graphNodes: state => {
      var nodes = [];
      state.update;
      state.selectedResources.forEach(el => {
        nodes.push({
          id: el.uri,
          label: el.label,
          data: {}
        });
        if (state.resourceInfoMap[el.uri]) {
          state.resourceInfoMap[el.uri]
            .filter(_el => _el.label)
            .forEach(_el => {
              nodes.push({
                id: _el.uri,
                label: _el.label,
                data: {}
              });
            });
        }
      });

      return _.uniqBy(nodes, 'id');
    },
    graphLinks: state => {
      var links = [];
      state.update;
      state.selectedResources.forEach(el => {
        if (state.resourceInfoMap[el.uri]) {
          state.resourceInfoMap[el.uri]
            .filter(_el => _el.label)
            .forEach(_el => {
              links.push({
                source: el.uri,
                target: _el.uri
              });
            });
        }
      });
      return links;
    }
  },
  mutations: {
    addResource(state, payload) {
      state.selectedResources.push(payload);
    },
    removeResource(state, payload) {
      state.selectedResources.splice(payload, 1);
    },
    addResourceInfo(state, payload) {
      state.resourceInfoMap[payload.key] = payload.data;
      state.resourceInfoMap.update = !state.resourceInfoMap.update;
      state.update = !state.update;
    }
  },
  actions: {
    addSelectedResource({ commit }, payload) {
      commit("addResource", payload);
    },
    addResourceInfo({ commit }, payload) {
      commit("addResourceInfo", payload);
    }
  }
});
