import axios from "axios";
import _ from "lodash";

const dbpediaUrl = "https://dbpedia.org/sparql";

async function search(query) {
  let response = await axios.get(
    "http://lookup.dbpedia.org/api/search/KeywordSearch",
    {
      params: {
        QueryString: query,
        Accept: "application/json header"
      }
    }
  );

  return response.data["results"].map(el => {
    return {
      uri: el["uri"],
      label: el["label"],
      description: el["description"]
    };
  });
}

async function getResource(uri) {
  let query = [
    "prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>",
    "prefix dbr: <http://dbpedia.org/resource/>",
    "select *",
    "from <http://dbpedia.org>",
    "where",
    "{",
    "{",
    "<" + uri + ">",
    "?property ?value.",
    "?value rdfs:label ?label.",
    "?property rdfs:label ?relation.",
    'FILTER(langMatches(lang(?label), "EN")).',
    'FILTER(langMatches(lang(?relation), "EN")).',
    "}",
    "union",
    "{",
    "?value ?property",
    "<" + uri + ">.",
    "?value rdfs:label ?label.",
    "?property rdfs:label ?relation.",
    'FILTER(langMatches(lang(?label), "EN")).',
    'FILTER(langMatches(lang(?relation), "EN")).',
    "}",
    'FILTER(STRSTARTS(STR(?property), "http://dbpedia.org/property") || STRSTARTS(STR(?property), "http://dbpedia.org/ontology"))',
    'FILTER(!isLiteral(?value) || langMatches(lang(?value), "EN"))',
    'FILTER regex(?relation, "^(?!Wikipage)", "i")',
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
      label: el.label ? el.label.value : undefined,
      property: el.property ? el.property.value : undefined,
      relation: el.relation ? el.relation.value : undefined,
      uri: el.value.value
    };
  });
}

async function shortInfo(uri) {
  let query = [
    "prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>",
    "prefix dbr: <http://dbpedia.org/resource/>",
    "prefix dbo: <http://dbpedia.org/ontology/>",
    "select *",
    "from <http://dbpedia.org>",
    "where",
    "{",
    "<" + uri + ">",
    "rdfs:label ?label;",
    "dbo:abstract ?abstract.",
    "OPTIONAL {",
    "<" + uri + ">",
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
