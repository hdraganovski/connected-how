import axios from "axios";

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
    "} LIMIT 100"
  ].join(" ");

  var response = await axios.get("http://dbpedia.org/sparql", {
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

export default {
  search
};
