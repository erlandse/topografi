 var geocoder;
 var map = null;
 var polygon = null;
 var markerArray = new Array();
 var overlay = null;
 var solr = null;
 var solrMarkers = new Array();

 var arkSolr = null;
 var arkSolrMarkers = new Array();

 var selectedPeriod = "";
 var dokumenttype ="";
 var zoomin="zoom.png";
 var museumIcon="museum2.png";
 var documentIcon="document2.png";
 var currentIcon="curpos.png";
 var currentIcon2="cur2.png";
 var showFirstIcon=true; 
 var zoomMarker = null;
 var currentMarker = null;

 var latitude = "";
 var longitude= "";
 var address = "";
 var startZoom =0;
 var newMode = true;
 var infoWindow=null;
// var mapType = "topo2";
 var mapType= google.maps.MapTypeId.ROADMAP;
 var polygonView = null;
 var application='test';
 var maxMatch = 100;

 var elastic = null;
 var arkElastic = null;


 var showslidervalue = false;
  var mapOptions = {
	   zoom: 10,
	   center: new google.maps.LatLng(60,9),
	   mapTypeControlOptions: {
	   mapTypeIds: [google.maps.MapTypeId.ROADMAP,google.maps.MapTypeId.SATELLITE,'kartdata2', 'sjo_hovedkart2', 'topo2', 'topo2graatone', 'toporaster2', 'europa'],
	   style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
       position: google.maps.ControlPosition.TOP_RIGHT
	  }
	};

var tema= {
  '725':'steinalder', 
  '1264':'eldre steinalder', 
  '50010':'tidligmesolitikum', 
  '50011':'mellommesolitikum', 
  '50012':'senmesolitikum', 
  '1265':'yngre steinalder', 
  '1266':'tidligneolitikum', 
  '1267':'mellomneolitikum', 
  '1268':'senneolitikum', 
  '941':'bronsealder', 
  '1269':'eldre bronsealder', 
  '1270':'yngre bronsealder', 
  '50419':'samisk jernalder', 
  '1065':'jernalder', 
  '988':'eldre jernalder', 
  '998':'førromersk jernalder', 
  '709':'romertid', 
  '990':'eldre romertid', 
  '1271':'yngre romertid', 
  '853':'folkevandringstid', 
  '142':'yngre jernalder', 
  '1272':'merovingertid', 
  '836':'vikingtid', 
  '172':'middelalder', 
  '1273':'tidligmiddelalder', 
  '1274':'høymiddelalder', 
  '648':'senmiddelalder', 
  '513':'nyere tid', 
  '50009':'annen' 
};


var toparkquery= {
  '725':[ "725","1264","50010","50011","50012","1265","1266","1267","1268"], 
  '1264':["1264","50010","50011","50012"], 
  '50010':["50010"], 
  '50011':["50011"], 
  '50012':["50012"], 
  '1265':["1265","1266","1267","1268"], 
  '1266':["1266"], 
  '1267':["1267"], 
  '1268':["1268"], 
  '941':["941","1269","1270"], 
  '1269':["eldre bronsealder"], 
  '1270':["yngre bronsealder"], 
  '1065':["1065","988","998","709","990","1271","853","142","1272","836"], 
  '988':["988","998","709","990","1271","853"], 
  '998':["998"], 
  '709':["709","990","1271"], 
  '990':["990"], 
  '1271':["1271"], 
  '853':["853"], 
  '142':["142","1272","836"], 
  '1272':["1272"], 
  '836':["836"], 
  '172':["172","1273","1274","648"], 
  '1273':["1273"], 
  '1274':["1274"], 
  '648':["648"], 
  '513':["513"] 
};



/*
var arkquery= {
  '725':'(\"steinalder\",\"eldre steinalder\"+OR+\"tidligmesolitikum\"+OR+\"mellommesolitikum\"+OR+\"senmesolitikum\"+OR+\"yngre steinalder\"+OR+\"tidligneolitikum\"+OR+\"mellomneolitikum\"+OR+\"senneolitikum\")', 
  '1264':'(\"eldre steinalder\"+OR+\"tidligmesolitikum\"+OR+\"mellommesolitikum\"+OR+\"senmesolitikum\")', 
  '50010':'\"tidligmesolitikum\"', 
  '50011':'\"mellommesolitikum\"', 
  '50012':'\"senmesolitikum\"', 
  '1265':'(\"yngre steinalder\"+OR+\"tidligneolitikum\"+OR+\"mellomneolitikum\"+OR+\"senneolitikum\")', 
  '1266':'\"tidligneolitikum\"', 
  '1267':'\"mellomneolitikum\"', 
  '1268':'\"senneolitikum\"', 
  '941':'(\"bronsealder\"+OR+\"eldre bronsealder\"+OR+\"yngre bronsealder\")', 
  '1269':'\"eldre bronsealder\"', 
  '1270':'\"yngre bronsealder\"', 
  '1065':'(\"jernalder\"+OR+\"eldre jernalder\"+OR+\"førromersk jernalder\"+OR+\"romertid\"+OR+\"eldre romertid\"+OR+\"yngre romertid\"+OR+\"folkevandringstid\"+OR+\"yngre jernalder\"+OR+\"merovingertid\"+OR+\"vikingtid\")', 
  '988':'(\"eldre jernalder\"+OR+\"førromersk jernalder\"+OR+\"romertid\"+OR+\"eldre romertid\"+OR+\"yngre romertid\"+OR+\"folkevandringstid\")', 
  '998':'\"førromersk jernalder\"', 
  '709':'\"romertid\"+OR+\"eldre romertid\"+OR+\"yngre romertid\")', 
  '990':'\"eldre romertid\"', 
  '1271':'\"yngre romertid\"', 
  '853':'\"folkevandringstid\"', 
  '142':'(\"yngre jernalder\"+OR+\"merovingertid\"+OR+\"vikingtid\")', 
  '1272':'\"merovingertid\"', 
  '836':'\"vikingtid\"', 
  '172':'(\"middelalder\"+OR+\"tidligmiddelalder\"+OR+\"høymiddelalder\"+OR+\"senmiddelalder\")', 
  '1273':'\"tidligmiddelalder\"', 
  '1274':'\"høymiddelalder\"', 
  '648':'\"senmiddelalder\"', 
  '513':'\"nyere tid\"' 
};
*/

var arkquery= {
  '725':["steinalder","eldre steinalder","tidligmesolitikum","mellommesolitikum","senmesolitikum","yngre steinalder","tidligneolitikum","mellomneolitikum","senneolitikum"], 
  '1264':["eldre steinalder","tidligmesolitikum","mellommesolitikum","senmesolitikum"], 
  '50010':["tidligmesolitikum"], 
  '50011':["mellommesolitikum"], 
  '50012':["senmesolitikum"], 
  '1265':["yngre steinalder","tidligneolitikum","mellomneolitikum","senneolitikum"], 
  '1266':["tidligneolitikum"], 
  '1267':["mellomneolitikum"], 
  '1268':["senneolitikum"], 
  '941':["bronsealder","eldre bronsealder","yngre bronsealder"], 
  '1269':["eldre bronsealder"], 
  '1270':["yngre bronsealder"], 
  '1065':["jernalder","eldre jernalder","førromersk jernalder","romertid","eldre romertid","yngre romertid","folkevandringstid","yngre jernalder","merovingertid","vikingtid"], 
  '988':["eldre jernalder","førromersk jernalder","romertid","eldre romertid","yngre romertid","folkevandringstid"], 
  '998':["førromersk jernalder"], 
  '709':["romertid","eldre romertid","yngre romertid"], 
  '990':["eldre romertid"], 
  '1271':["yngre romertid"], 
  '853':["folkevandringstid"], 
  '142':["yngre jernalder","merovingertid","vikingtid"], 
  '1272':["merovingertid"], 
  '836':["vikingtid"], 
  '172':["middelalder","tidligmiddelalder","høymiddelalder","senmiddelalder"], 
  '1273':["tidligmiddelalder"], 
  '1274':["høymiddelalder"], 
  '648':["senmiddelalder"], 
  '513':["nyere tid"] 
};




var timetable=[{"kode":"725","display":"steinalder (9500 f.kr - 1700 f.kr)","start":-9500,"end":-1700},
	{"kode":"1264","display":"eldre steinalder (9500 f.kr - 4000 f.kr)","start":-9500,"end":-4000},
	{"kode":"50010","display":"tidligmesolitikum (9500 f.kr - 8200 f.kr)","start":-9500,"end":-8200},
	{"kode":"50011","display":"mellommesolitikum (8200 f.kr - 6300 f.kr)","start":-8200,"end":-6300},
	{"kode":"50012","display":"senmesolitikum (6300 f.kr - 400 f.kr)","start":-6300,"end":-4000},
	{"kode":"1265","display":"yngre steinalder (400 f.kr - 1700 f.kr)","start":-4000,"end":-1700},
	{"kode":"1266","display":"tidligneolitikum (4000 f.kr - 3300 f.kr)","start":-4000,"end":-3300},
	{"kode":"1267","display":"mellomneolitikum (3300 f.kr - 2400 f.kr)","start":-3300,"end":-2400},
	{"kode":"1268","display":"senneolitikum (2400 f.kr - 1700 f.kr)","start":-2400,"end":-1700},
	{"kode":"941","display":"bronsealder (1700 f.kr - 500 f.kr)","start":-1700,"end":-500},
	{"kode":"1269","display":"eldre bronsealder (1700 f.kr - 1100 f.kr)","start":-1700,"end":-1100},
	{"kode":"1270","display":"yngre bronsealder (1100 f.kr - 500 f.kr)","start":-1100,"end":-500},
	{"kode":"1065","display":"jernalder (500 f.kr - 1050 e.kr)","start":-500,"end":1050},
	{"kode":"988","display":"eldre jernalder (500 f.kr - 550 e.kr)","start":-500,"end":550},
	{"kode":"998","display":"førromersk jernalder (500 f.kr - 0 e.kr)","start":-500,"end":0},
	{"kode":"709","display":"romertid (0 - 400 e.kr)","start":0,"end":400},
	{"kode":"990","display":"eldre romertid (0 - 200)","start":0,"end":200},
	{"kode":"1271","display":"yngre romertid (200 - 400)","start":200,"end":400},
	{"kode":"853","display":"folkevandringstid (400 - 550)","start":400,"end":550},
	{"kode":"142","display":"yngre jernalder (550 - 1050)","start":550,"end":1050},
	{"kode":"1272","display":"merovingertid (550 - 800)","start":550,"end":800},
	{"kode":"836","display":"vikingtid (800 - 1050)","start":800,"end":1050},
	{"kode":"172","display":"middelalder (1050 - 1537)","start":1050,"end":1537},
	{"kode":"1273","display":"tidlig middelalder (1050 - 1200)","start":1050,"end":1200},
	{"kode":"1274","display":"høymiddelalder (1200 - 1350)","start":1200,"end":1350},
	{"kode":"648","display":"senmiddelalder (1350 - 1537)","start":1350,"end":1537},
	{"kode":"513","display":"nyere tid (1537 - )","start":1537,"end":2015}];

var timespan=[{"kode":"725","start":-9500,"end":-2000},
	{"kode":"1264","start":-9500,"end":-4000},
	{"kode":"50010","start":-9500,"end":-8200},
	{"kode":"50011","start":-8200,"end":-6300},
	{"kode":"50012","start":-6300,"end":-4000},
	{"kode":"1265","start":-4000,"end":-1700},
	{"kode":"1266","start":-4000,"end":-3300},
	{"kode":"1267","start":-3300,"end":-2400},
	{"kode":"1268","start":-2400,"end":-1700},
	{"kode":"941","start":-1700,"end":-500},
	{"kode":"1269","start":-1700,"end":-1100},
	{"kode":"1270","start":-1100,"end":-500},
	{"kode":"1065","start":-500,"end":1050},
	{"kode":"988","start":-500,"end":550},
	{"kode":"998","start":-500,"end":0},
	{"kode":"709","start":0,"end":400},
	{"kode":"990","start":0,"end":200},
	{"kode":"1271","start":200,"end":400},
	{"kode":"853","start":400,"end":550},
	{"kode":"142","start":550,"end":1050},
	{"kode":"1272","start":550,"end":800},
	{"kode":"836","start":800,"end":1050},
	{"kode":"172","start":1050,"end":1537},
	{"kode":"1273","start":1050,"end":1200},
	{"kode":"1274","start":1200,"end":1350},
	{"kode":"648","start":1350,"end":1537},
	{"kode":"513","start":1537,"end":2015}];




function getRemote(remote_url) {
	return $.ajax({
		type: "GET",
		url: remote_url,
		async: false
	}).responseText;
 }


function initialize() {
  if(navigator.geolocation == false)
    document.getElementById('locationImg').style.visibility='hidden';
  else 
    testGeoLocation();
  var currentZoom=15;
  $(document).ready(function(){
   // do jQuery
  });
  
  application = gup("prosjekt");
  
  if(application !=""){
    try{
      polygonView = JSON.parse(getRemote("template.php?filename="+application+".options"));
    }catch (err){
      polygonView=null;
    }
  }else{
    try{
      polygonView = JSON.parse(getRemote("template.php?filename=default.options"));
    }catch (err){
      polygonView=null;
    }
  }

  removeAllSelectOptions("opt");
  for(var i =0;i<timetable.length;i++){
    addOption("opt",timetable[i].display,timetable[i].kode);
  }  
  $(document).on('keyup', function (event) {
   switch(event.keyCode){
      case 56:
      case 104:
        var latlng = map.getCenter();
        var i = "zoom="+map.getZoom() + "&" + "latitude="+latlng.lat()+ "&" + "longitude=" + latlng.lng()+"&";
        messageWindow(i,latlng);
        break;
      default:
       
        break;
   }
   if(event.keyCode == 67){//c
     document.getElementById('copytext').focus();
   } 
   if(event.keyCode == 27){//slip focus fra aktivt element escape
      document.activeElement.blur();
   }
   if(event.keyCode==73){//i
     map.setZoom(map.getZoom()+1);
   } 
   if(event.keyCode==85)//u
     map.setZoom(map.getZoom()-1);

});
  
  
  document.getElementById("textdiv").style.visibility = 'hidden';

  address = gup("searchField");
  latitude = gup("latitude");
  longitude = gup("longitude");
  startZoom = gup("zoom");
  dokumenttype = gup("dokumenttype");
  if(gup("maptype")!="")
    mapType=gup("maptype");
  geocoder = new google.maps.Geocoder();
 
 
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

 document.getElementById("pulldown").style.visibility = 'visible';
 refreshWindow();
}

function initMap(){
  startZoom = gup("zoom");
 
  if(startZoom == "")
    startZoom = 15;
  else
    startZoom = parseInt(startZoom);

  mapOptions.zoom = startZoom;
  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

  map.mapTypes.set('sjo_hovedkart2',new StatkartMapType("Sjo hovedkart", "sjo_hovedkart2"));
  map.mapTypes.set('kartdata2',new StatkartMapType("Kartdata 2", "kartdata2"));
  map.mapTypes.set('topo2',new StatkartMapType("Topografisk", "topo2"));
  map.mapTypes.set('topo2graatone',new StatkartMapType("Graatone", "topo2graatone"));
  map.mapTypes.set('toporaster2',new StatkartMapType("Toporaster", "toporaster2"));
  map.mapTypes.set('europa',new StatkartMapType("Europa", "europa"));



  map.setMapTypeId(mapType);
  overlay = new google.maps.OverlayView(); 	 
  overlay.draw = function() {};
  overlay.setMap(map);

  google.maps.event.addListener(map, 'bounds_changed',refreshWindow);

  google.maps.event.addListener(map,"click",function(event) {
		 setPosition(event);
  });

}


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


function handleNoGeolocation(errorFlag) {
	   if (errorFlag == true) {
	     alert("Placering fejlede - har du enablet lokalisering?");
	   } else {
	    if(address==""){
	      alert('Forsøk igjen');
	      window.location = "index.html";
	      return;
	     }
	     alert("Din nettleser understøtter ikke lokalisering.");
	   }
	 }


function codeAddress() {
  address = decodeURI(address);
  if (geocoder) {
    geocoder.geocode( { 'address': address}, getAddressResult);
  }
        
}

function getAddressResult(results,status){
	   if (status == google.maps.GeocoderStatus.OK) {
	    showMap(results[0].geometry.location,false);
	   } else {
	     if(status.indexOf("ZERO")!= -1)
	       alert("Fannt ingen steder");
	     else 
	       alert("Lyktes ikke av følgende grund: " + status);
	     window.location = "index.html";
	   }
}

function showMap(pos,createMarker){
    if(map== null)
        initMap();
    map.setCenter(pos);
    if(createMarker){
        marker = new google.maps.Marker({
	         position: pos,
	         title: "senter"
	  });
	  marker.setMap(map);  
	  marker.zIndex=100;
    }

}


function geoPosition(){
	var pos = new google.maps.LatLng(latitude,longitude);
    showMap(pos,false);
}



function setCurrentPosition(){
	if(navigator.geolocation){
		browserSupportFlag=true;
	    navigator.geolocation.getCurrentPosition(getPosition,handleNoGeolocation, {enableHighAccuracy: true,maximumAge:10000,timeout:10000});
	  }else if (google.gears) {
		   browserSupportFlag = true;
		   var geo = google.gears.factory.create('beta.geolocation'); 
		   geo.getCurrentPosition(getPosition,handleNoGeolocation);
	  }else{
		 browserSupportFlag = false;
		 handleNoGeolocation(browserSupportFlag);
			 
	  }  	   
	
}

function getPosition(pos){
    var initialLocation = new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude);
    showMap(initialLocation,false);
}

function changePeriod(){
  selectedPeriod = document.getElementById("opt").value;
  if(selectedPeriod != ""){
	  var index = -1;
	  var temp;
	  for(temp = 0;temp < timetable.length;temp++){
		if(selectedPeriod == timetable[temp].kode)
		  index=temp;
	  }
	  if(index==-1)
		return;
  }
  refreshWindow();
}


function refreshWindow(){
 rewriteTopark();
}

function rewriteArk(){
  for(temp = 0; temp < arkSolrMarkers.length;temp++){
    var p = arkSolrMarkers[temp];
    p.setMap(null);
  }
  arkSolrMarkers = new Array();

  var bounds = map.getBounds();
  var northeast = bounds.getNorthEast();
  var southwest = bounds.getSouthWest();

  var d = JSON.parse("{\"must\":[],\"should\":[],\"must_not\":[]}");

  var query = JsonTool.createJsonPath("query");
  query.size=100;
  query.aggs = toparkAggregations.aggs;
  query.query.bool = d;
  if (selectedPeriod != "") {
    if (arkquery[selectedPeriod].length == 1) {
      var obj = new Object();
      obj.term = new Object();
      obj.term.periode = arkquery[selectedPeriod][0];
      query.query.bool.must.push(obj);
    } else {
      for (var temp = 0; temp < arkquery[selectedPeriod].length; temp++) {
        var obj = new Object();
        obj.term = new Object();
        obj.term.periode = arkquery[selectedPeriod][temp];
        query.query.bool.should.push(obj);
      }
    }
  }
  query.query.bool.filter = new Object();
  query.query.bool.filter.geo_bounding_box= new Object();
  query.query.bool.filter.geo_bounding_box.lokation= new Object();
  query.query.bool.filter.geo_bounding_box.lokation.top_left = new Object();
  query.query.bool.filter.geo_bounding_box.lokation.bottom_right = new Object();

  query.query.bool.filter.geo_bounding_box.lokation.top_left.lat = northeast.lat();
  query.query.bool.filter.geo_bounding_box.lokation.top_left.lon = southwest.lng();
  query.query.bool.filter.geo_bounding_box.lokation.bottom_right.lat = southwest.lat();
  query.query.bool.filter.geo_bounding_box.lokation.bottom_right.lon = northeast.lng();

  var formData = new Object();
  formData.elasticdata = JSON.stringify(query,null,2);
  formData.resturl = "";
  $.ajax({
     url: "passArk.php", 
     type: "POST",
     data:formData,
     error: function(XMLHttpRequest, textStatus, errorThrown){
        alert('status:' + XMLHttpRequest.status + ', status text: ' + XMLHttpRequest.statusText);
     },
     success: function(data){
            arkElastic = new ElasticClass(data);
            addArkPeriodes();
            writeArkMarkers();
            rewriteNews();
     },
     dataType:"json"
  });   

}






function writeArkMarkers(){
  var temp;
  var arr;
  
  if(zoomMarker != null){
    zoomMarker.setMap(null);
    zoomMarker = null;
  }

  for(temp = 0; temp < arkSolrMarkers.length;temp++){
    var p = arkSolrMarkers[temp];
    p.setMap(null);
  }
 arkSolrMarkers = new Array();
 if(document.getElementById("arkCheck").checked==false)
   return;

  var arr = arkElastic.getFacetFieldWithFacetName("geofacet");
  if(arr.length >= maxMatch){
    setZoom();
    return;
  }
  for(temp = 0;temp < arr.length;temp++){
     var content = arr[temp].key.split("_");
     if(content.length < 2)
       continue;
     var latlng = new google.maps.LatLng(content[0],content[1]);
     var marker = new google.maps.Marker({
	         position: latlng,
	         icon:museumIcon,
	         title: "Gjenstander ("+arr[temp].doc_count+")"
	  });
      marker.setMap(map);  
      arkSolrMarkers.push(marker);
      handleArkFunction(marker,temp);
  }

}

function handleArkFunction(pol,temp){
	 google.maps.event.addListener(pol,"click",function(event) {
		 handleArkClick(event,temp);
	  });
}

function handleArkClick(event,index){
  var content = document.createElement("DIV");
  if(infoWindow != null)
    infoWindow.setMap(null);
  infoWindow = null;
  var arr = arkElastic.getFacetFieldWithFacetName("geofacet");
  var f = arr[index];
  var facet=f.key;
  var q="q=geofacet:\""+facet+"\"";
  if(document.getElementById("opt").value !=""){
    q+="+AND+periode:"+ arkquery[document.getElementById("opt").value];
  }
  var obj = new Object();
  obj.size=100;
  var formData = new Object();
  formData.resturl=q;
  formData.elasticdata = JSON.stringify(obj,null,2);
  var textContent = "";
  $.ajax({
     url: "passArk.php", 
     type: 'POST',
     data:formData,
     error: function(XMLHttpRequest, textStatus, errorThrown){
        alert('status:' + XMLHttpRequest.status + ', status text: ' + XMLHttpRequest.statusText);
     },
     success: function(data){
            tempElastic = new ElasticClass(data);
            var docs = tempElastic.getDocs();
            if(tempElastic.getDocCount()==1){
             var doc = docs[0];  
             window.open("http://www.unimus.no/artefacts/khm/search/?oid="+tempElastic.getSingleFieldFromDoc(doc,"art_id")+"&museumsnr="+ tempElastic.getSingleFieldFromDoc(doc,"museumsnr")+"&f=html",'_blank');
             return;
            }
            for(temp = 0;temp < docs.length;temp++){
              var doc = docs[temp];
              textContent +="<a target='_blank' href='http://www.unimus.no/artefacts/khm/search/?oid="+
                          tempElastic.getSingleFieldFromDoc(doc,"art_id")+"&museumsnr="+
                          tempElastic.getSingleFieldFromDoc(doc,"museumsnr")+"&f=html&'>"+tempElastic.getSingleFieldFromDoc(doc,"gjenstandstype")+extractPeriodes(tempElastic,doc)+"</a><br>";
            }
            if(docs.length < tempElastic.getDocCount()){
                var st = "<br><b>Kun de første "+ docs.length +" av "+ tempSolr.getDocCount() + " gjenstander vises </b><br>"
                textContent = st + textContent + st;
            }

            content.innerHTML = textContent;
		    infoWindow = new google.maps.InfoWindow({
				  content: content
			});
		    infoWindow.setPosition(event.latLng);
		    infoWindow.open(map);
            
     },
     dataType:"json"
  });   

}



function extractPeriodes(elastic,doc){
 var st = "";
 var ar = elastic.getArrayFromDoc(doc,"periode");
 for(var temp = 0; temp < ar.length;temp++){
   if(st == "")
     st = ar[temp];
   else 
    st += "," +  ar[temp];
 }
 if(st == "")
   return "";
 else 
   return " (" + st + ")";
}

function rewriteTopark(){
  for(temp = 0; temp < solrMarkers.length;temp++){
    var p = solrMarkers[temp];
    p.setMap(null);
  }
  solrMarkers = new Array();
  var bounds = map.getBounds();
  var northeast = bounds.getNorthEast();
  var southwest = bounds.getSouthWest();
  var d = JSON.parse("{\"must\":[]}");
  var query = JsonTool.createJsonPath("query");
  query.size=100;
  query.aggs = toparkAggregations.aggs;
  query.query.bool = d;
  if (selectedPeriod != "") {
    if (toparkquery[selectedPeriod].length == 1) {
      var obj = new Object();
      obj.term = new Object();
      obj.term.periode = toparkquery[selectedPeriod][0];
      query.query.bool.must.push(obj);
    } else {xxx
      for (var temp = 0; temp < toparkquery[selectedPeriod].length; temp++) {
        var obj = new Object();
        obj.term = new Object();
        obj.term.periode = toparkquery[selectedPeriod][temp];
        query.query.bool.should.push(obj);
      }
    }
  }
  query.query.bool.filter = new Object();
  query.query.bool.filter.geo_bounding_box= new Object();
  query.query.bool.filter.geo_bounding_box.lokation= new Object();
  query.query.bool.filter.geo_bounding_box.lokation.top_left = new Object();
  query.query.bool.filter.geo_bounding_box.lokation.bottom_right = new Object();

  query.query.bool.filter.geo_bounding_box.lokation.top_left.lat = northeast.lat();
  query.query.bool.filter.geo_bounding_box.lokation.top_left.lon = southwest.lng();
  query.query.bool.filter.geo_bounding_box.lokation.bottom_right.lat = southwest.lat();
  query.query.bool.filter.geo_bounding_box.lokation.bottom_right.lon = northeast.lng();


  var formData = new Object();
  formData.elasticdata = JSON.stringify(query,null,2);
//  alert(formData.elasticdata);
  formData.resturl = "";
  $.ajax({
     url: "passTopografi.php", 
     type: 'post',
     data:formData,
     error: function(XMLHttpRequest, textStatus, errorThrown){
        alert('status:' + XMLHttpRequest.status + ', status text: ' + XMLHttpRequest.statusText);
     },
     success: function(data){
            elastic = new ElasticClass(data);
            setUpPeriode();
            writeToparkMarkers();
            rewriteArk();
     },
     dataType:"json"
  });   

}



function writeToparkMarkers(){
  var temp;
  var arr;

  if(document.getElementById("toparkCheck").checked == false)
    return;

  
  if(zoomMarker != null){
    zoomMarker.setMap(null);
    zoomMarker = null;
  }

  var arr = elastic.getFacetFieldWithFacetName("geofacet");
  if(arr.length >= maxMatch){
    setZoom();
    return;
  }
  for(temp = 0;temp < arr.length;temp++){
     var content = arr[temp].key.split("_");
     if(content.length < 3)
       continue;
     var latlng = new google.maps.LatLng(content[1],content[2]);
     var marker = new google.maps.Marker({
	         position: latlng,
	         icon:documentIcon,
	         title: content[0]+" ("+arr[temp].doc_count+")"
	  });
//	  setCorrectIcon(doc,marker);
      marker.setMap(map);  
      solrMarkers.push(marker);
      handleToparkFunction(marker,temp);
  }

}





function handleToparkFunction(pol,temp){
	 google.maps.event.addListener(pol,"click",function(event) {
		 handleToparkClick(event,temp);
	  });
}



function messageWindow(innerHTML,position){
  var content = document.createElement("DIV");
  content.innerHTML = innerHTML;
  var win = new google.maps.InfoWindow({
        content: content
      });
   win.setPosition(position);
   win.open(map);
}


function handleToparkClick(event,index){
  var content = document.createElement("DIV");
  if(infoWindow != null)
    infoWindow.setMap(null);
  infoWindow = null;
  var arr = elastic.getFacetFieldWithFacetName("geofacet");
  var arr2 = arr[index].key;
  var arr3 = arr2.split("_");
  content.innerHTML = "<a href='http://app.uio.no/khm/topark/utforsk/search.html?q=geofacet:\""+ arr[index].key+"\"&' target=_blank&>" + ucFirstAllWords(arr3[0]) +" ("+arr[index].doc_count+")</a>";
  infoWindow = new google.maps.InfoWindow({
        content: content
      });
  infoWindow.setPosition(event.latLng);
  infoWindow.open(map);

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

function jsonValue(key){
  return key == undefined? "":key;
}


function zoomClick(){
	  if( zoomMarker != null && zoomMarker.map != null){
		  map.setZoom(map.getZoom()+2);
//		  map.setCenter(event.latLng);
	  }
	}


/*
 * set a zoom marker in the middle of the map if the result exceeds (100)
 */
function setZoom(){
	 var pos = map.getCenter();
	 zoomMarker = new google.maps.Marker({
	         position: pos,
	         icon:zoomin,
	         title: "Zoom inn - for mange resultater"
	  });

	 google.maps.event.addListener(zoomMarker,"click",function(event) {
		 zoomClick();
	  });
	 zoomMarker.setMap(map);  
	
}


function setUpPeriode(){
}

function addArkPeriodes(){
 setSlider();  
 refreshOptions();
}


//----------------------------------------------------------------------------------


function ucFirstAllWords( str )
{
    var pieces = str.split(" ");
    for ( var i = 0; i < pieces.length; i++ )
    {
        var j = pieces[i].charAt(0).toUpperCase();
        pieces[i] = j + pieces[i].substr(1);
    }
    return pieces.join(" ");
}

function removeAllSelectOptions(selectionId){
  var elSel = document.getElementById(selectionId);
  while(elSel.length > 0)
    elSel.options.remove(elSel.length - 1);
  var elOptNew = document.createElement('option');
  addOption(selectionId,'Velg periode','');
}


function addOption(selectionId,text,value){
  var elSel = document.getElementById(selectionId);
  var elOptNew = document.createElement('option');
  elOptNew.text = text;
  elOptNew.value = value;
  try {
    elSel.options.add(elOptNew, null); // standards compliant; doesn't work in IE
  }
  catch(ex) {
    elSel.options.add(elOptNew); // IE only
  }
}

//-----------------------------
function getInternetExplorerVersion()
// Returns the version of Internet Explorer or a -1
// (indicating the use of another browser).
{
  var rv = -1; // Return value assumes failure.
  if (navigator.appName == 'Microsoft Internet Explorer')
  {
    var ua = navigator.userAgent;
    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null)
      rv = parseFloat( RegExp.$1 );
  }
  return rv;
}

function setSlider(){
 showslidervalue=false;
 var textToWrite = "";
 var index = -1;
 document.getElementById('slidediv').style.top= $( window ).height()-($("#slidediv").height());
 if(selectedPeriod == ""){
   document.getElementById('slidediv').style.visibility = 'hidden';
   return; 
 }else{
   document.getElementById('slidediv').style.visibility = 'visible';
 }
 for(temp=0;temp<timetable.length;temp++){
   if(selectedPeriod==timetable[temp].kode){
     index=temp;
     break;
   }
 }
 if(index==-1)
   return;
   
}

function getTextToWrite(index){
  return(timetable[index].display);
}


function showValue(newValue)
{
   var index=-1;
   if(showslidervalue==false)
     return;
   for(temp = 0;temp<timetable.length;temp++)
     if(newValue >= timetable[temp].start && newValue <= timetable[temp].end)
       index=temp;
   if(index==-1)
     return;
   document.getElementById("textdiv").innerHTML="<h2>"+getTextToWrite(index)+"</h2>";

   var arr = findPosObject(document.getElementById('slidediv'));  
   var div = document.getElementById('textdiv');
//   div.style.top = arr[1]-20+"px";
    div.style.top = window.innerHeight/2+"px";

   var c = window.innerWidth/2;
   div.style.left = (c-(document.getElementById("textdiv").offsetWidth/2))+"px";
   
}


function setTextFromSlider(value){
 var index=-1;
 document.getElementById('textdiv').style.visibility="hidden";

 for(temp = 0;temp<timetable.length;temp++)
    if(value >= timetable[temp].start && value <= timetable[temp].end)
      index=temp;
 if(index==-1)
   return;
 var temp;  
 selectedPeriod=timetable[index].kode;
 
 refreshWindow();
}

function whenMouseDownSlider(value){
  showslidervalue=true;
  document.getElementById('textdiv').style.visibility="visible";
  showValue(value);

}
 

 function findPosObject (obj){
	var curleft = curtop = 0;
    if (obj.offsetParent) {
      do {
	    curleft += obj.offsetLeft;
	    curtop += obj.offsetTop;
	  } while (obj = obj.offsetParent);
   }
   return [curleft,curtop];
}


function refreshOptions(){
  var temp = 0;
  var cnt = 0;
  var arr;
  var arr2;

  for(temp=0;temp<timetable.length;temp++)
    timetable[temp].count = 0;
  if(document.getElementById("toparkCheck").checked==true){  
    arr = elastic.getFacetFieldWithFacetName("periode");
    for(temp = 0;temp < arr.length;temp++){
/*         arr2=arr[temp];
         cnt = arr2[1];*/
         cnt = arr[temp].doc_count;
         for(var i=0;i<timetable.length;i++)
           if(timetable[i].kode==arr[temp].keyCode)
             timetable[i].count +=cnt;
    } 
  }
  if(document.getElementById("arkCheck").checked==true){  
    arr = arkElastic.getFacetFieldWithFacetName("periode");
    for(temp=0;temp<arr.length;temp++){
/*      arr2 = arr[temp];
      cnt = arr2[1];*/
      cnt = arr[temp].doc_count;
      for(var i=0;i< timetable.length;i++){
        var name = tema[timetable[i].kode];
        if(name==arr[temp].key)
             timetable[i].count +=cnt;
      }
    }
  
  }
  for(temp=0;temp< timespan.length;temp++){
    for(var i = temp+1;i<timespan.length;i++)
      if(timespan[i].start >=timespan[temp].start && timespan[i].end <=timespan[temp].end)
        timetable[temp].count+= timetable[i].count;
  }

  removeAllSelectOptions("opt");
  for(var i =0;i<timetable.length;i++){
    if(selectedPeriod == "")
      addOption("opt",timetable[i].display+ " ("+timetable[i].count+")",timetable[i].kode);
    else{
      if(timetable[i].kode == selectedPeriod)
         addOption("opt",timetable[i].display+ " ("+timetable[i].count+")",timetable[i].kode);
      else   
         addOption("opt",timetable[i].display,timetable[i].kode);
    }  

  }
   var menu=document.getElementById('opt');
   menu.value = selectedPeriod;

}




function setFollowPosition(){
	if(navigator.geolocation){
		browserSupportFlag=true;
	    navigator.geolocation.getCurrentPosition(fetchPosition,handleNoGeolocation, {enableHighAccuracy: true,maximumAge:10000,timeout:10000});
	  }else if (google.gears) {
		   browserSupportFlag = true;
		   var geo = google.gears.factory.create('beta.geolocation'); 
		   geo.getCurrentPosition(fetchPosition,handleNoGeolocation);
	  }else{
		 browserSupportFlag = false;
		 handleNoGeolocation(browserSupportFlag);
			 
	  }  	   
	
}

function fetchPosition(pos){
    var center = new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude);
    map.setCenter(center);
    if(currentMarker == null)
      followPosition();
}



function followPosition(){
   if (navigator.geolocation) {
        navigator.geolocation.watchPosition(showPosition);
    } else {
        alert('Aktuelle position understøttes ikke av denne nettleser');
    }
}

function showPosition(pos) {
 if(currentMarker != null){
    currentMarker.setMap(null);
//    currentMarker = null;
  }
  var loc = new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude);
  var ci= null;
  ci = showFirstIcon==true? currentIcon: currentIcon2;
  showFirstIcon = showFirstIcon==true?false:true;
  currentMarker = new google.maps.Marker({
	    position: loc,
        icon:ci,
        title: "Her står du"
	  });
  currentMarker.setMap(map);
}

function testGeoLocation(){
   navigator.geolocation.getCurrentPosition(dummyPos,hideLocationImage, {enableHighAccuracy: true,maximumAge:10000,timeout:10000});
}

function dummyPos(pos){
}

function hideLocationImage(err){
    document.getElementById('locationImg').style.visibility='hidden';
    document.getElementById('locationImg').style.display='none';

}
