var newsSolr = null;
var newsPolygons = new Array();
var newsMarkers  = new Array();

function rewriteNews(){
  var bounds = map.getBounds();
  var northeast = bounds.getNorthEast();
  var southwest = bounds.getSouthWest();
  var q = "q=";
  if(southwest.lng() > northeast.lng())
    q += "latitude:[" + southwest.lat() + " TO " + northeast.lat() + "]AND ( longitude:["+southwest.lng()+" TO 180] OR longitude:[-180 TO "+northeast.lng()+"])";
  else
    q += "latitude:["+southwest.lat()+ " TO " + northeast.lat() + "] AND longitude:[" + southwest.lng()+" TO " + northeast.lng() +"]";
  q += "&version=2.2&start=0&rows=100&wt=json&facet=true&";
  $.ajax({
     url: "newscall.php?"+q, 
     type: 'get',
     error: function(XMLHttpRequest, textStatus, errorThrown){
        alert('status:' + XMLHttpRequest.status + ', status text: ' + XMLHttpRequest.statusText);
     },
     success: function(data){
            newsSolr = new SolrJsonClass();
            newsSolr.setMainObject(data);
            writePolygons();
            writeMarkers();
     },
     dataType:"json"
  });    

}

function writePolygons(){
  var temp;
  var arr;
  for(temp = 0; temp < newsPolygons.length;temp++){
    var p = newsPolygons[temp];
    p.setMap(null);
  }
  newsPolygons = new Array();
  var docs = newsSolr.getDocs();
  for(temp = 0;temp < docs.length;temp++){
     arr = new Array();
     var doc = docs[temp];
     var ob = JSON.parse(newsSolr.getSingleFieldFromDoc(doc,"polygon"));
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
        fillOpacity: 0.35
     });
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
   var docs = newsSolr.getDocs();
   showOnNewsPolygonClick(event,index);
//   document.location.href = solr.getSingleFieldFromDoc(docs[index],"url");

}

function showOnNewsPolygonClick(event,index){
  var docs = newsSolr.getDocs();
  var win = new google.maps.InfoWindow();
  win.setPosition(event.latLng);
  win.setContent(solr.getSingleFieldFromDoc(docs[index],"textcontent"));
  win.open(map);
}

function writeNewsMarkers(){
  var temp;
  var arr;

  for(temp = 0; temp < newsMarkers.length;temp++){
    var p = newsMarkers[temp];
    p.setMap(null);
  }
  newsMarkers = new Array();
  var docs = newsSolr.getDocs();
  for(temp = 0;temp < docs.length;temp++){
     var doc = docs[temp];
     var ob = JSON.parse(solr.getSingleFieldFromDoc(doc,"polygon"));
     if(ob.length > 2)
       continue;
     var latlng = new google.maps.LatLng(ob[0],ob[1]);
     var marker = new google.maps.Marker({
	         position: latlng,
	         title: solr.getSingleFieldFromDoc(doc,"title")
	  });
      marker.setMap(map);  
      solrMarkers.push(marker);
      handleNewsPolygonFunction(marker,temp);
  }

}


