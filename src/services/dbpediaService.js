import axios from "axios";
import _ from "lodash";

const dbpediaUrl = "https://dbpedia.org/sparql";

async function search(query) {
  var response = await axios.get(
    "https://lookup.dbpedia.org/api/search/KeywordSearch",
    {
      params: {
        QueryString: query,
        Accept: "application/json header"
      }
    }
  );
  return response.data.results.map(el => {
    return {
      resource: el.uri,
      label: el.label
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
  });

  return response.data.results.bindings;
}

async function shortInfo(resource) {
  let query = [
    "prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>",
    "prefix dbr: <http://dbpedia.org/resource/>",
    "prefix dbo: <http://dbpedia.org/ontology/>",
    "select *",
    "from <http://dbpedia.org>",
    "where",
    "{",
    "<" + resource + ">",
    "rdfs:label ?label;",
    "dbo:abstract ?abstract.",
    "OPTIONAL {",
    "<" + resource + ">",
    "dbo:thumbnail ?thumbnail }.",
    'filter(langMatches(lang(?label), "EN")).',
    'filter(langMatches(lang(?abstract), "EN")).',
    "} LIMIT 1"
  ].join(" ");

  var response = await axios.get(dbpediaUrl, {
    params: {
      query: query,
      format: "json",
      "default-graph-uri": "http://dbpedia.org",
      run: "Run Query"
    }
  });

  return _.head(
    response.data.results.bindings.map(el => {
      return {
        label: el.label.value,
        abstract: el.abstract.value,
        thumbnail: el.thumbnail ? el.thumbnail.value : undefined
      };
    })
  );
}

async function intersection(uri1, uri2) {
  let query = [
    "prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>",
    "prefix dbr: <http://dbpedia.org/resource/>",
    "prefix dbo: <http://dbpedia.org/ontology/>",
    "select *",
    // 'from <http://dbpedia.org>',
    "where",
    "{",
    "{",
    "select *",
    // 'from <http://dbpedia.org>',
    "WHERE {",
    "<" + uri1 + "> ?a ?b.",
    "}",
    "}",
    "union",
    "{",
    "select *",
    // 'from <http://dbpedia.org>',
    "WHERE {",
    "?b ?a <" + uri1 + ">.",
    "}",
    "}.",
    "{",
    "select *",
    // 'from <http://dbpedia.org>',
    "WHERE {",
    "<" + uri2 + "> ?a1 ?b1.",
    "}",
    "}",
    "union",
    "{",
    "select *",
    // 'from <http://dbpedia.org>',
    "WHERE {",
    "?b1 ?a1 <" + uri2 + ">.",
    "}",
    "}.",
    "OPTIONAL {",
    "?b rdfs:label ?label.",
    'filter(langMatches(lang(?label), "EN")).',
    "}.",
    "filter(?b1 = ?b).",
    "}"
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
      id: el.b,
      label: el.label ? el.label.value : el.b.value
    };
  });
}

export default {
  search,
  getResource,
  shortInfo,
  intersection
};
