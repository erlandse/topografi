var newsElastic = null;
var newsPolygons = new Array();
var newsMarkers  = new Array();

function rewriteNews(){
  var bounds = map.getBounds();
  var northeast = bounds.getNorthEast();
  var southwest = bounds.getSouthWest();
  var d = JSON.parse("{\"must\":[],\"should\":[],\"must_not\":[]}");
  var query = JsonTool.createJsonPath("query");
  query.size=100;
  query.query.bool = d;
  if(gup("prosjekt")!= ""){
      var obj = new Object();
      obj.term = new Object();
      obj.term.app = gup("prosjekt");
      query.query.bool.must.push(obj);
  }
  query.query.bool.filter = new Object();
  query.query.bool.filter.geo_bounding_box= new Object();
  query.query.bool.filter.geo_bounding_box.location= new Object();
  query.query.bool.filter.geo_bounding_box.location.top_left = new Object();
  query.query.bool.filter.geo_bounding_box.location.bottom_right = new Object();

  query.query.bool.filter.geo_bounding_box.location.top_left.lat = northeast.lat();
  query.query.bool.filter.geo_bounding_box.location.top_left.lon = southwest.lng();
  query.query.bool.filter.geo_bounding_box.location.bottom_right.lat = southwest.lat();
  query.query.bool.filter.geo_bounding_box.location.bottom_right.lon = northeast.lng();

  var formData = new Object();
  formData.elasticdata = JSON.stringify(query,null,2);
  formData.resturl = "";
  $.ajax({
     url: "passNews.php", 
     type: "POST",
     data:formData,
     error: function(XMLHttpRequest, textStatus, errorThrown){
        alert('status:' + XMLHttpRequest.status + ', status text: ' + XMLHttpRequest.statusText);
     },
     success: function(data){
        newsElastic = new ElasticClass(data);
        writeNewsPolygons();
        writeNewsMarkers();
     },
     dataType:"json"
  });   


}

function addLayerString(){
  var layer = gup("lag");
  layer=layer.replace(/ /g,'');
  layer=layer.replace(/,/g,'+OR+');
  return("layer:("+layer+")+AND+");
}

function writeNewsPolygons(){
  var temp;
  var arr;
  for(temp = 0; temp < newsPolygons.length;temp++){
    var p = newsPolygons[temp];
    p.setMap(null);
  }
  newsPolygons = new Array();
  var docs = newsElastic.getDocs();
  for(temp = 0;temp < docs.length;temp++){
     arr = new Array();
     var doc = docs[temp];
     var ob = JSON.parse(newsElastic.getSingleFieldFromDoc(doc,"polygon"));
     if(ob.length ==2){
       continue;
     }  
     var bounds = new google.maps.LatLngBounds();
     for(var i = 0;i <ob.length;i+=2){
       var latlng = new google.maps.LatLng(ob[i],ob[i+1]);
       bounds.extend(latlng);
       arr.push(latlng);
     }
     var mp = new google.maps.Polygon({
        paths: arr,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: '#FFFF00',
        fillOpacity: 0.6
     });
     setCorrectOptions(docs[temp],mp);
     
   /*  if(polygonView !=null)
        mp.setOptions(polygonView.UnselectedPolygon);
     */
     mp.setMap(map);
     newsPolygons.push(mp);
     handleNewsPolygonFunction(mp,temp);
    } 

}

function handleNewsPolygonFunction(pol,temp){
	 google.maps.event.addListener(pol,"click",function(event) {
		 handleNewsPolygonClick(event,temp);
	  });
}


function handleNewsPolygonClick(event,index){
   showOnNewsPolygonClick(event,index);
//   document.location.href = solr.getSingleFieldFromDoc(docs[index],"url");

}

function showOnNewsPolygonClick(event,index){
  var docs = newsElastic.getDocs();
  if(infoWindow != null)
    infoWindow.setMap(null);
  infoWindow = null;
  infoWindow = new google.maps.InfoWindow();
  infoWindow.setPosition(event.latLng);
  infoWindow.setContent(newsElastic.getSingleFieldFromDoc(docs[index],"textcontent"));
  infoWindow.open(map);
}

function writeNewsMarkers(){
  var temp;
  var arr;

  for(temp = 0; temp < newsMarkers.length;temp++){
    var p = newsMarkers[temp];
    p.setMap(null);
  }
  newsMarkers = new Array();
  var docs = newsElastic.getDocs();
  for(temp = 0;temp < docs.length;temp++){
     var doc = docs[temp];
     var ob = JSON.parse(newsElastic.getSingleFieldFromDoc(doc,"polygon"));
     if(ob.length > 2)
       continue;
     var latlng = new google.maps.LatLng(ob[0],ob[1]);
     var marker = new google.maps.Marker({
	         position: latlng,
	         title: newsElastic.getSingleFieldFromDoc(doc,"title")
	  });
	  setCorrectOptions(docs[temp],marker);
      marker.setMap(map);  
      solrMarkers.push(marker);
      handleNewsPolygonFunction(marker,temp);
  }

}


function setCorrectOptions(doc,ob){
  if(polygonView == null)
    return;
  var layer = newsElastic.getSingleFieldFromDoc(doc,"layer");
  if(layer != ""){
     var path = eval("polygonView."+layer);
     if(path != null && path !=""){
        ob.setOptions(path);
        return;
     }
  }
}


