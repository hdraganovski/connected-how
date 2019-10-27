import _ from 'lodash';

export const state = () => ({
    update: false,
    selectedResources: [],
    resourceInfoMap: {
        update: false
    },
    subjectMap: new Map()
});

export const mutations = {
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
    },
    addSubjectInfo(state, payload) {
        state.subjectMap[payload.key] = payload.data;
        state.update = !state.update;
    }
}

export const getters = {
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

            state.selectedResources.forEach(el2 => {
                if(el2.uri == el.uri) return
                if(state.subjectMap[el.uri]) {
                    if(state.subjectMap[el2.uri]) {
                        state.subjectMap[el.uri].forEach(sub1 => {
                            if(state.subjectMap[el2.uri].find(sub2 => sub2.uri == sub1.uri)) {
                                nodes.push({
                                    id: sub1.uri,
                                    label: sub1.label,
                                    data: {}
                                })
                            }
                        })
                    }
                }
            })
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

            state.selectedResources.forEach(el2 => {
                if(el.uri == el2.uri) return
                if(state.subjectMap[el.uri]) {
                    if(state.subjectMap[el2.uri]) {
                        state.subjectMap[el.uri].forEach(sub1 => {
                            if(state.subjectMap[el2.uri].find(sub2 => sub1.uri == sub2.uri)) {
                                links.push({
                                    source: el.uri,
                                    target: sub1.uri
                                })
                                links.push({
                                    source: el2.uri,
                                    target: sub1.uri
                                })
                            }
                        })
                    }
                }
            })
        });
        return links;
    }
}

export const actions = {
    addSelectedResource({ commit }, payload) {
        commit("addResource", payload);
    },
    addResourceInfo({ commit }, payload) {
        commit("addResourceInfo", payload);
    },
    addSubjectInfo({ commit }, payload) {
        commit("addSubjectInfo", payload)
    }
}