 var geocoder;
 var map = null;
 var polygon = null;
 var carpetBombing = null;
 var mapPolygon = null;;
 var markerArray = new Array();
 var overlay = null;
 var solr = null;
 var elastic = null;
 var solrPolygons = new Array();
 var solrMarkers = new Array();
 var polyIndex = new Array();
 var latitude = "";
 var longitude= "";
 var address = "";
 var ownPosition = "";	
 var startZoom =0;
 var newMode = true;
 var editIndex = -1;
 var win = null;
  var mapOptions = {
	   zoom: 10,
	   center: new google.maps.LatLng(60,9),
	   mapTypeControlOptions: {
	   mapTypeIds: [google.maps.MapTypeId.ROADMAP,google.maps.MapTypeId.SATELLITE,'kartdata2', 'sjo_hovedkart2', 'topo2', 'topo2graatone', 'toporaster2', 'europa'],
	   style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
	  }
	};


function StatkartMapType(name, layer) {
  this.layer = layer;
  this.name = name;
  this.alt = name;
  this.tileSize = new google.maps.Size(256,256);
  this.maxZoom = 19;
  this.getTile = function(coord, zoom, ownerDocument) {
     var div = ownerDocument.createElement('DIV');
     div.style.width = this.tileSize.width + 'px';
     div.style.height = this.tileSize.height + 'px';
     div.style.backgroundImage = "url(http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=" + this.layer + "&zoom=" + zoom + "&x=" + coord.x + "&y=" + coord.y + ")";
     return div;
  };
}



function initialize() {

  var currentZoom=15;
  $(document).ready(function(){
   // do jQuery
  });
//  document.getElementById("textdiv").style.visibility = 'hidden';
  address = gup("searchField");
  latitude = gup("latitude");
  longitude = gup("longitude");
  startZoom = gup("zoom");
  ownPosition = gup("position");


 geocoder = new google.maps.Geocoder();
 
 if(startZoom == "")
   startZoom = 15;
 else
   startZoom = parseInt(startZoom);
   
/*  var myOptions = {
 	     zoom:startZoom,
   mapTypeId: google.maps.MapTypeId.ROADMAP,
   mapTypeControl: true,
   draggable:true,
   panControl:true,
   panControlOptions:{
     position: google.maps.ControlPosition.BOTTOM_LEFT
   },
   mapTypeControlOptions: {
    style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
  },
   navigationControlOptions: {
        style: google.maps.NavigationControlStyle.ANDROID,
        position: google.maps.ControlPosition.TOP_RIGHT
    },
     mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  
*/
  mapOptions.zoom = startZoom;
  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);


  map.mapTypes.set('sjo_hovedkart2',new StatkartMapType("Sjo hovedkart", "sjo_hovedkart2"));
  map.mapTypes.set('kartdata2',new StatkartMapType("Kartdata 2", "kartdata2"));
  map.mapTypes.set('topo2',new StatkartMapType("Topografisk", "topo2"));
  map.mapTypes.set('topo2graatone',new StatkartMapType("Graatone", "topo2graatone"));
  map.mapTypes.set('toporaster2',new StatkartMapType("Toporaster", "toporaster2"));
  map.mapTypes.set('europa',new StatkartMapType("Europa", "europa"));



  map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
//  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

  overlay = new google.maps.OverlayView(); 	 
  overlay.draw = function() {};
  overlay.setMap(map);

  google.maps.event.addListener(map, 'bounds_changed',refreshWindow);


  google.maps.event.addListener(map,"click",function(event) {
		 setPosition(event);
  });
  
  if(address !=""){
	  address = '"'+ address +'"';
	  codeAddress();
  }
  else if(latitude !="" && longitude !=""){
    geoPosition();
  }
  else{
    setCurrentPosition();
  }  
  
 refreshWindow();
}

function handleNoGeolocation(errorFlag) {
	   if (errorFlag == true) {
	     alert("Placering fejlede - har du enablet lokalisering?");
	     initialLocation = holmestrand;
	   } else {
	    if(address==""){
	      alert('Forsøk igjen');
	      window.location = "index.html";
	      return;
	     }
	     alert("Din browser understøtter ikke lokalisering.");
	     initialLocation = siberia;
	   }
	   map.setCenter(initialLocation);
	 }


function codeAddress() {
  address = decodeURI(address);
  if (geocoder) {
    geocoder.geocode( { 'address': address}, getAddressResult);
  }
        
}

function getAddressResult(results,status){
/*       if(results.length>1){
          var pos = address.indexOf(",");
          if(pos==-1){
	        handleMoreResults(results);
	        return;
	      }  
       }*/
	
	   if (status == google.maps.GeocoderStatus.OK) {
	    showMap(results[0].geometry.location,false);
	   } else {
	     if(status.indexOf("ZERO")!= -1)
	       alert("Found no places");
	     else 
	       alert("Didn't succeed for th following reason: " + status);
	     window.location = "index.html";
	   }
}

function showMap(pos,createMarker){
    map.setCenter(pos);
    if(createMarker){
        marker = new google.maps.Marker({
	         position: pos,
	         title: "senter"
	  });
	  marker.setMap(map);  
	  marker.zIndex=100;
    }
//	  google.maps.event.trigger(map, 'resize');
	  google.maps.event.addListener(map, 'bounds_changed',refreshWindow);

	
}


function geoPosition(){
	var pos = new google.maps.LatLng(latitude,longitude);
    showMap(pos,false);
}

/*
 * sets the position according to the users current geographical position
 */

function setCurrentPosition(){
	if(navigator.geolocation){
		browserSupportFlag=true;
	    navigator.geolocation.getCurrentPosition(getPosition,handleNoGeolocation, {timeout:3000});
	  }else if (google.gears) {
		   browserSupportFlag = true;
		   var geo = google.gears.factory.create('beta.geolocation'); 
		   geo.getCurrentPosition(getPosition,handleNoGeolocation);
	  }else{
		 browserSupportFlag = false;
		 handleNoGeolocation(browserSupportFlag);
			 
	  }  	   
	
}

/*
 * callback function from setCurrentPostion
 */
function getPosition(pos){
    var initialLocation = new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude);
    showMap(initialLocation,true);
}


  function setPosition(event){
     if(document.getElementById('mode').checked==false){
       if(editIndex == -1)
         return;
       var docs = elastic.getDocs();
       var ob = JSON.parse(elastic.getSingleFieldFromDoc(docs[editIndex],"polygon"));
       if(ob.length > 2)
         return;
       if(markerArray.length == 1)
         markerArray[0].setMap(null);
       markerArray = new Array();  
     } 
     marker = new google.maps.Marker({
	         position: event.latLng,
	         icon:"marker_0.png",
	         title: ""+markerArray.length
	  });
      markerArray.push(marker);	  
      marker.setMap(map);  
  }



function createAPolygon(){
  polygon = new Array();
  
  for(var temp = 0;temp < markerArray.length;temp++){
    var p = markerArray[temp];
    polygon.push(p.getPosition());
    p.setMap(null);
  }
  mapPolygon = new google.maps.Polygon({
       paths: polygon,
       strokeColor: '#FF0000',
       strokeOpacity: 0.8,
       strokeWeight: 2,
       fillColor: '#FF0000',
       editable:true,
       fillOpacity: 0.35
   });
    mapPolygon.setMap(map);
    markerArray = new Array();
    document.getElementById('mode').checked = false;

}




function isPointInsidePolygon(point){
  if(mapPolygon==null)
    return false;
  return google.maps.geometry.poly.containsLocation(point, mapPolygon);
}


function setMode(){
   if(document.getElementById('mode').checked==true)
      map.setOptions({draggableCursor:'crosshair'});
   else
      map.setOptions({draggableCursor:'default'});
}

function clearPolygon(){
   if(mapPolygon != null)
       mapPolygon.setMap(null);
   for(var temp = 0;temp < markerArray.length;temp++)
     markerArray[temp].setMap(null);     
   markerArray = new Array();
   mapPolygon=null;  
   newMode = true;
   editIndex = -1;

}

function setPolygonPoints(){
  if(mapPolygon == null)
    return;
  carpetBombing = new Array();
  var bounds = new google.maps.LatLngBounds();
  for(var temp =0; temp < polygon.length;temp++)
    bounds.extend(polygon[temp]);
  var startX = bounds.getSouthWest().lng();
  var endX = bounds.getNorthEast().lng();
  var startY = bounds.getNorthEast().lat();
  var endY = bounds.getSouthWest().lat();
  var xAdd = (endX-startX)/5;
  var yAdd = (startY-endY)/5;
  var y = startY;

  while(y > endY){
     var x = startX;
     while(x <endX){
       var p = new google.maps.LatLng(y,x); 
       if(isPointInsidePolygon(p)){
          carpetBombing.push(p);
       }
       x = x+ xAdd;
     }
     y -=yAdd;
  }
}


function createPolygon(points){
  var result=JSON.parse("[]"); 
  for (var temp = 0; temp < points.length;temp++){
     var p= ""+points[temp];
     p=p.replace("(","");
     p=p.replace(")","");
     var n = p.split(", ");
     result.push(n[0]);
     result.push(n[1]);
   }
   return result;
}

function savePolygon(){
  var docs = elastic.getDocs();
  polygon = new  Array();
  var saveMarker = false;
  if(newMode==false && editIndex !=-1){
    var docs = elastic.getDocs();
    var ob = JSON.parse(elastic.getSingleFieldFromDoc(docs[editIndex],"polygon"));
    if(ob.length == 2){
      polygon.push(markerArray[0].getPosition());
      saveMarker = true;
      carpetBombing = new Array();
    }

  }
   if(saveMarker== false){
     var points = mapPolygon.getPath().getArray();
     for (var temp = 0; temp < points.length;temp++){
       var p= ""+points[temp];
       p=p.replace("(","");
       p=p.replace(")","");
       var n = p.split(", ");
       var latlng = new google.maps.LatLng(n[0],n[1]);
       polygon.push(latlng);
     }

   setPolygonPoints();
 }  

 var point = map.getCenter();

 var res=JSON.parse("{}");
 res.header=JSON.parse("{}");

 res.header.polygon=createPolygon(polygon);
 res.header.carpetBombing=createPolygon(carpetBombing);
 res.header.latitude=point.lat();
 res.header.longitude=point.lng();
 res.header.zoom=map.getZoom();


 if(newMode==false && editIndex !=-1){
      var docs = elastic.getDocs();
      res.header.title=elastic.getSingleFieldFromDoc(docs[editIndex],"title");
      res.header.textcontent=elastic.getSingleFieldFromDoc(docs[editIndex],"textcontent");
      res.header.layer=elastic.getSingleFieldFromDoc(docs[editIndex],"layer");
      res.header.id=docs[editIndex]._id;
      res.header.app=elastic.getSingleFieldFromDoc(docs[editIndex],"app");
 }

 localStorage.header = JSON.stringify(res); 
 window.location="SavePolygon.html?latitude="+point.lat()+"&longitude="+point.lng()+"&zoom="+map.getZoom();

}


/*
function refreshWindow(){
  document.getElementById('tooldiv').style.top= $( window ).height()-($("#tooldiv").height());
  document.getElementById('zoom').value  =  map.getZoom();
  var bounds = map.getBounds();
  var northeast = bounds.getNorthEast();
  var southwest = bounds.getSouthWest();
  var app = gup("app");
  var q;
  if (app != "")
     q = "q=app:"+app+"+AND+";
  else
    q="q=";
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
            solr = new SolrJsonClass();
            solr.setMainObject(data);
            writePolygons();
            writeMarkers();
     },
     dataType:"json"
  });    

}
*/

function refreshWindow(){
  document.getElementById('tooldiv').style.top= $( window ).height()-($("#tooldiv").height());
  document.getElementById('zoom').value  =  map.getZoom();
  var bounds = map.getBounds();
  if(bounds===undefined)
   return;
  var northeast = bounds.getNorthEast();
  var southwest = bounds.getSouthWest();
  var app = gup("app");

  var d = JSON.parse("{\"must\":[],\"should\":[],\"must_not\":[]}");

  var query = JsonTool.createJsonPath("query");
  query.size=100;
//  query.aggs = toparkAggregations.aggs;
  query.query.bool = d;
  var app = gup("app");
  if(app != ""){
      var obj = new Object();
      obj.term = new Object();
      obj.term.app = app;
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
     url: "PassMapNews.php", 
     type: 'POST',
     formData,
     error: function(XMLHttpRequest, textStatus, errorThrown){
        alert('status:' + XMLHttpRequest.status + ', status text: ' + XMLHttpRequest.statusText);
     },
     success: function(data){
            elastic = new ElasticClass(data);
            writePolygons();
            writeMarkers();
     },
     dataType:"json"
  });  

}


function writeMarkers(){
  var temp;
  var arr;

  for(temp = 0; temp < solrMarkers.length;temp++){
    var p = solrMarkers[temp];
    p.setMap(null);
  }
  solrMarkers = new Array();
  var docs = elastic.getDocs();
  for(temp = 0;temp < docs.length;temp++){
     var doc = docs[temp];
     var ob = JSON.parse(elastic.getSingleFieldFromDoc(doc,"polygon"));
     if(ob.length > 2)
       continue;
     var latlng = new google.maps.LatLng(ob[0],ob[1]);
     var marker = new google.maps.Marker({
	         position: latlng,
	         title: elastic.getSingleFieldFromDoc(doc,"title")
	  });
      marker.setMap(map);  
      solrMarkers.push(marker);
      handlePolygonFunction(marker,temp);
  }

}


function writePolygons(){
  var temp;
  var arr;
  for(temp = 0; temp < solrPolygons.length;temp++){
    var p = solrPolygons[temp];
    p.setMap(null);
  }
  solrPolygons = new Array();
  polyIndex= new Array()
  var docs = elastic.getDocs();
  for(temp = 0;temp < docs.length;temp++){
     arr = new Array();
     var doc = docs[temp];
     var ob = JSON.parse(elastic.getSingleFieldFromDoc(doc,"polygon"));
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
     solrPolygons.push(mp);
     polyIndex.push(temp);
     handlePolygonFunction(mp,temp);
    } 

}


function handlePolygonFunction(pol,temp){
	 google.maps.event.addListener(pol,"click",function(event) {
		 handlePolygonClick(event,temp);
	  });
}


function handlePolygonClick(event,index){
   if(document.getElementById('mode').checked==true){
       setPosition(event);
       return;
   }
   var docs = elastic.getDocs();
   if(document.getElementById("delete").checked == true){
        var res = confirm("Are you sure you want to delete: '"+ elastic.getSingleFieldFromDoc(docs[index],"title")+"'");
        if (res == false)
          return;
      deletePolygon(docs[index]._id);
      return;
   }
   if(document.getElementById("changePolygon").checked == true){
      if(newMode==false){
        alert('You are allready editing one object. Remove work object and start again');
        return;
      }
      newMode = false;
      editThisPolygon(index);
      return;
   }
   if(document.getElementById("mode").checked == true)
     return;
     
   showOnPolygonClick(event,index);
//   document.location.href = solr.getSingleFieldFromDoc(docs[index],"url");

}

function showOnPolygonClick(event,index){
   var docs = elastic.getDocs();
//   document.location.href = solr.getSingleFieldFromDoc(docs[index],"url");
//  alert(event);
  if(win != null)
    win.close();
  win = new google.maps.InfoWindow();
  win.setPosition(event.latLng);
  win.setContent(elastic.getSingleFieldFromDoc(docs[index],"textcontent"));
  win.open(map);
}


function deletePolygon(id){
var formData= new Object();
formData.resturl=id;
$.ajax({
    url: "DeletePolygon.php", 
    type: 'POST',
    data:formData,
    error: function(XMLHttpRequest, textStatus, errorThrown){
        alert('status:' + XMLHttpRequest.status + ', status text: ' + XMLHttpRequest.statusText);
        document.getElementById("error").value=XMLHttpRequest.status;
    },
    success: function(data){
      refreshWindow();
    }
});    

}




function reloadPage(){
  var point = map.getCenter();
  window.location="polygon.html?latitude="+point.lat()+"&longitude="+point.lng()+"&zoom="+map.getZoom();
}


/*
 * Extract the url argument value bound to name - copied from somewhere
 */
function gup( name )
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return results[1];
}

function editThisPolygon(index){
  var docs = elastic.getDocs();
  var ob = JSON.parse(elastic.getSingleFieldFromDoc(docs[index],"polygon"));
  if(ob.length == 2){
    var latlng = new google.maps.LatLng(ob[0],ob[1]);
    markerArray = new Array();
    marker = new google.maps.Marker({
         position: latlng,
         icon:"marker_0.png",
         title: elastic.getSingleFieldFromDoc(docs[index],"title")
    });
    markerArray.push(marker);	  
    marker.setMap(map);  
    document.getElementById('mode').checked = false;
    newMode= false;
    editIndex= index;
    return;
  }
  polygon = new Array();
  for(var i = 0;i <ob.length;i+=2){
     var latlng = new google.maps.LatLng(ob[i],ob[i+1]);
     polygon.push(latlng);
  }
  if(mapPolygon != null)
    mapPolygon.setMap(null);
  mapPolygon = new google.maps.Polygon({
       paths: polygon,
       strokeColor: '#FF0000',
       strokeOpacity: 0.8,
       strokeWeight: 1,
       fillColor: '#FF0000',
       editable:true,
       fillOpacity: 0.5
   });
   mapPolygon.setMap(map);
   markerArray = new Array();
   document.getElementById('mode').checked = false;
   newMode= false;
   editIndex= index;
}

function writeThisURL(){
  var lok = location.href;
  var pos = lok.indexOf("?");
  if(pos != -1)
	  lok=lok.substring(0,pos+1);
   else
     lok += "?";
  var point = map.getCenter();
  var lat = point.lat();
  var lng = point.lng();
  var zoom = map.getZoom();
  var app = gup("app");
  if(app != "")
    app = "&app="+app;
  alert(lok+"latitude="+lat+"&longitude="+lng+"&zoom="+zoom+app);


}

function showImportField(){
  document.getElementById('textinputdiv').style.visibility ='visible';
}

function cancelImport(){
  document.getElementById('textinputdiv').style.visibility ='hidden';
}

function importCoordinates(){
   var marker = null;
   if(mapPolygon != null)
       mapPolygon.setMap(null);
   for(var temp = 0;temp < markerArray.length;temp++)
     markerArray[temp].setMap(null);     
   map.setOptions({draggableCursor:'crosshair'});

   markerArray = new Array();
   mapPolygon=null;  
   newMode = true;
   editIndex = -1;
   var arr = document.getElementById('importfield').value.split(',');
   for(var temp = 0; temp < arr.length; temp += 2){
 	 var pos = new google.maps.LatLng(arr[temp].trim(),arr[temp+1].trim());
     marker = new google.maps.Marker({
	         position: pos,
	         icon:"marker_0.png",
	         title: ""+markerArray.length
	  });
      markerArray.push(marker);	  
      marker.setMap(map);  
   }
  document.getElementById('textinputdiv').style.visibility ='hidden';
}
