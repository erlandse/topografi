
var h =null;
function initialize(){
  $(document).ready(function(){

  });

  h = JSON.parse(localStorage.header);
  document.getElementById('polygon').value = JSON.stringify(h.header.polygon);
  document.getElementById('carpetBombing').value = JSON.stringify(h.header.carpetBombing);
  document.getElementById('latitude').value = jsonValue(h.header.latitude);
  document.getElementById('longitude').value = jsonValue(h.header.longitude);
  document.getElementById('zoom').value = jsonValue(h.header.zoom);
  document.getElementById('title').value = jsonValue(h.header.title);
  document.getElementById('id').value = jsonValue(h.header.id);
  var v = jsonValue(h.header.textcontent);
  v = v.replace("<![CDATA[","");
  v = v.replace("]]>","");
  document.getElementById('textcontent').value = v;

  document.getElementById('layer').value = jsonValue(h.header.layer);
  if(document.getElementById('layer').value !=""){
     document.getElementById('layersToApp').value = document.getElementById('layer').value;
  }  

  document.getElementById('app').value = jsonValue(h.header.app);
  if(document.getElementById('layer').value !=""){
     document.getElementById('appToApp').value = document.getElementById('layer').value;
  }  
  loadApp();

}


function jsonValue(key){
  return key == undefined? "":key;
}
 
function addKeyValue(key,value){
 var res = "\""+key+"\":"+JSON.stringify(value);
 return res;
}


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

function savePolygon(){
  var formData = new Object();
  var json = new Object();
  json.title = document.getElementById('title').value;
  var geopoints = new Array();
  for(var temp=0;temp < h.header.polygon.length;temp+=2){
    geopoints.push(parseFloat(h.header.polygon[temp+1]));
    geopoints.push(parseFloat(h.header.polygon[temp]));
  }  
  for(var temp=0;temp < h.header.carpetBombing.length;temp+=2){
    geopoints.push(parseFloat(h.header.carpetBombing[temp+1]));
    geopoints.push(parseFloat(h.header.carpetBombing[temp]));
  } 
  json.location = geopoints;
  json.textcontent=document.getElementById('textcontent').value;
  json.polygon = document.getElementById('polygon').value;
  if(document.getElementById('layer').value !="")
     json.layer=document.getElementById('layer').value;
  json.app = document.getElementById('app').value;
  document.getElementById('elasticdata').value=JSON.stringify(json,null,2);
  document.forms["myform"].submit();
}



 function getRemote(remote_url) {
	return $.ajax({
		type: "GET",
		url: remote_url,
		async: false,
	}).responseText;
 }

/*
function loadLayer(){
    removeAllOptions('layersToApp');
    if(document.getElementById('app').value =="")
      return;
    facet="wt=json&rows=0&facet=true&facet.field=layer&facet.sort=false&facet.mincount=1&";
    var query = "q=app:"+document.getElementById('app').value+"&";
    var temp;
    var layerSelect = document.getElementById('layersToApp');
    addOption(layerSelect,"Select","");
    query += facet;
    $.ajax({
		 url: "SolrCall.php?"+query, 
		 type: 'get',
		 error: function(XMLHttpRequest, textStatus, errorThrown){
			alert('status:' + XMLHttpRequest.status + ', status text: ' + XMLHttpRequest.statusText+ " errorthrown "+ errorThrown);
		 },
		 success: function(data){
				var sol = new SolrJsonClass();
				sol.setMainObject(data);
				var ar=sol.getFacetFieldWithFacetName("layer");
				for(temp=0; temp < ar.length;temp++){
				  var ar2 = ar[temp];
				  addOption(layerSelect,ar2[0],ar2[0]);
				}
				document.getElementById('layersToApp').value= document.getElementById('layer').value;
		 },
		 dataType:"json"
	});  
}
*/

function loadLayer(){
    removeAllOptions('layersToApp');
    if(document.getElementById('app').value =="")
      return;
    var layerSelect = document.getElementById('layersToApp');
    addOption(layerSelect,"Select","");

   var d = JSON.parse("{\"must\":[],\"should\":[],\"must_not\":[]}");

   var query = JsonTool.createJsonPath("query");
   query.size=100;
   query.aggs = toparkAggregations.aggs;
   query.query.bool = d;
   var obj = new Object();
   obj.term = new Object();
   obj.term.app = document.getElementById('app').value;
   query.query.bool.must.push(obj);
   var formData = new Object();
   formData.elasticdata = JSON.stringify(query,null,2);
   formData.resturl = "";
   $.ajax({
		 url: "PassMapNews.php", 
		 type: 'POST',
     data,formData,
		 error: function(XMLHttpRequest, textStatus, errorThrown){
			alert('status:' + XMLHttpRequest.status + ', status text: ' + XMLHttpRequest.statusText+ " errorthrown "+ errorThrown);
		 },
		 success: function(data){
				var elastic = new ElasticClass();
				var ar=elastic.getFacetFieldWithFacetName("layer");
				for(temp=0; temp < ar.length;temp++){
				  var ar2 = ar[temp];
				  addOption(layerSelect,ar2.key,ar2.key);
				}
				document.getElementById('layersToApp').value= document.getElementById('layer').value;
		 },
		 dataType:"json"
	});  
}



/*
function loadApp(){
    facet="wt=json&rows=0&facet=true&facet.field=app&facet.sort=false&facet.mincount=1&";
    var query = "q=*:*&";
    var temp;
    var appSelect = document.getElementById('appToApp');
    removeAllOptions('appToApp');
    addOption(appSelect,"Select","");
    query += facet;
    $.ajax({
		 url: "SolrCall.php?"+query, 
		 type: 'get',
		 error: function(XMLHttpRequest, textStatus, errorThrown){
			alert('status:' + XMLHttpRequest.status + ', status text: ' + XMLHttpRequest.statusText+ " errorthrown "+ errorThrown);
		 },
		 success: function(data){
				var sol = new SolrJsonClass();
				sol.setMainObject(data);
				var ar=sol.getFacetFieldWithFacetName("app");
				for(temp=0; temp < ar.length;temp++){
				  var ar2 = ar[temp];
				  addOption(appSelect,ar2[0],ar2[0]);
				}
				document.getElementById('appToApp').value= document.getElementById('app').value;
				loadLayer();
		 },
		 dataType:"json"
	});  
}
*/

function loadApp(){
    var appSelect = document.getElementById('appToApp');
    removeAllOptions('appToApp');
    addOption(appSelect,"Select","");
    var formData = new Object();
    formData.elasticdata = JSON.stringify(newsAggregations,null,2);
    $.ajax({
		 url: "PassMapNews.php", 
		 type: 'POST',
     data:formData,
		 error: function(XMLHttpRequest, textStatus, errorThrown){
			alert('status:' + XMLHttpRequest.status + ', status text: ' + XMLHttpRequest.statusText+ " errorthrown "+ errorThrown);
		 },
		 success: function(data){
				var elastic = new ElasticClass(data);
				var ar=elastic.getFacetFieldWithFacetName("app");
				for(temp=0; temp < ar.length;temp++){
				  var ar2 = ar[temp];
				  addOption(appSelect,ar2.key,ar2.key);
				}
				document.getElementById('appToApp').value= document.getElementById('app').value;
				loadLayer();
		 },
		 dataType:"json"
	});  
}



function changeLayer(){
  document.getElementById('layer').value=document.getElementById('layersToApp').value;
}

function changeApp(){
  document.getElementById('app').value=document.getElementById('appToApp').value;
  loadLayer();
}


function addOption(elSel,text,value){
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

function removeAllOptions(selectId){
 var elSel = document.getElementById(selectId);
 while(elSel.length > 0)
      elSel.remove(elSel.length-1);
}
