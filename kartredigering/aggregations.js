var newsAggregations = {
    "aggs" : {
            "app":{
              "terms" : {
                "field": "app",
                 "size":100,
                "order" : { "_term" : "asc" }
              }
            },
            "layer":{
              "terms" : {
                "field": "layer",
                 "size":100,
                "order" : { "_term" : "asc" }
              }
            }
        
    }
}
