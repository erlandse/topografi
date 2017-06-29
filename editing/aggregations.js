var aggregations = {
    "aggs" : {
           "bruker":{
              "terms" : {
                "field": "bruker",
                "order" : { "_term" : "asc" },
              }
            },
           "fylke":{
              "terms" : {
                "field": "fylke",
                "size" : 1000,
                "order" : { "_term" : "asc" }
              }
            },
            "kommune":{
              "terms" : {
                "size" : 1000,
                "field": "kommune",
                "order" : { "_term" : "asc" }
              }
            }
        
    }
}
var wordListQuery = {
    "tags": {
      "terms": {
        "field": "textcontainer",
        "include": "",
        "order" : { "_term" : "asc" }
      }
    }
};
