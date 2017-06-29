var toparkAggregations = {
    "aggs" : {
            "periode":{
              "terms" : {
                "field": "periode",
                 "size":100,
                "order" : { "_term" : "asc" }
              }
            },
            "geofacet":{
              "terms" : {
                "field": "geofacet",
                 "size":100,
                "order" : { "_term" : "asc" }
              }
            }
        
    }
}
