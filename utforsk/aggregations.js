var aggregations = {
    "aggs" : {
        "periods" : {
            "date_histogram" : {
                "field" : "dokumentDato",
                "interval" : "3650d",
                 "format" : "yyyy",
                 "min_doc_count":1
             }    

        },
            "fylke":{
              "terms" : {
                "field": "fylke",
                 "size":1000,
                "order" : { "_term" : "asc" }
              }
            },
            "kommune":{
              "terms" : {
                "field": "kommune",
                 "size":1000,
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
