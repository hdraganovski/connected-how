import axios from "axios";
import _ from "lodash";

const dbpediaUrl = "https://dbpedia.org/sparql"

async function search(term) {
  let query = [
    "prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>",
    "prefix dbr: <http://dbpedia.org/resource/>",
    "select *",
    "from <http://dbpedia.org>",
    "where",
    "{",
    "?resource rdfs:label ?label.",
    'filter(langMatches(lang(?label), "EN")).',
    'filter regex(?label, ".*' + term + '.*").',
    "} LIMIT 10"
  ].join(" ");

  var response = await axios.get(dbpediaUrl, {
    params: {
      query: query,
      format: "json",
      "default-graph-uri": "http://dbpedia.org",
      run: "Run Query"
    }
  });

  return response.data.results.bindings.map(el => {
    return {
      resource: el.resource.value,
      label: el.label.value
    };
  });
}

async function getResource(resource) {
  let query = [
    "prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>",
    "prefix dbr: <http://dbpedia.org/resource/>",
    "select *",
    "from <http://dbpedia.org>",
    "where",
    "{",
    "<" + resource + ">",
    "?a ?b.",
    "}"
  ].join(" ");

  var response = await axios.get(dbpediaUrl, {
    params: {
      query: query,
      format: "json",
      "default-graph-uri": "http://dbpedia.org",
      run: "Run Query"
    }
  })

  return response.data.results.bindings
}

async function shortInfo(resource) {
  let query = [
    'prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>',
    'prefix dbr: <http://dbpedia.org/resource/>',
    'prefix dbo: <http://dbpedia.org/ontology/>',
    'select *',
    'from <http://dbpedia.org>',
    'where',
    '{',
    '<' + resource + '>',
    'rdfs:label ?label;',
    'dbo:abstract ?abstract.',
    'OPTIONAL {',
    '<' + resource + '>',
    'dbo:thumbnail ?thumbnail }.',
    'filter(langMatches(lang(?label), "EN")).',
    'filter(langMatches(lang(?abstract), "EN")).',
    '} LIMIT 1'
  ].join(" ")

  var response = await axios.get(dbpediaUrl, {
    params: {
      query: query,
      format: "json",
      "default-graph-uri": "http://dbpedia.org",
      run: "Run Query"
    }
  })

  return _.head(response.data.results.bindings.map(el => {
    return {
      label: el.label.value,
      abstract: el.abstract.value,
      thumbnail: el.thumbnail ? el.thumbnail.value : undefined
    }
  }))
}

export default {
  search, getResource, shortInfo
};
