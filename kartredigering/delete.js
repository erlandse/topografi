
function initialize() {

  var currentZoom=15;
  $(document).ready(function(){
   // do jQuery
  });
  fillProject();
  fillLayer();
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


function removeAllSelectOptions(selectionId){
  var elSel = document.getElementById(selectionId);
  while(elSel.length > 0)
    elSel.options.remove(elSel.length - 1);
  var elOptNew = document.createElement('option');
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

function fillProject(){
  removeAllSelectOptions('projects');
  var q = "q=*:*&version=2.2&wt=json&facet=true&facet.field=app&rows=0&facet.sort=false&facet.mincount=1&";
  $.ajax({
     url: "newscall.php?"+q, 
     type: 'get',
     error: function(XMLHttpRequest, textStatus, errorThrown){
        alert('status:' + XMLHttpRequest.status + ', status text: ' + XMLHttpRequest.statusText);
     },
     success: function(data){
        solr = new SolrJsonClass();
        solr.setMainObject(data);
        var arr = solr.getFacetFieldWithFacetName("app");
        for(var temp =0;temp < arr.length;temp++){
          var arr2 = arr[temp];
          addOption('projects',arr2[0],arr2[0]);
        }

     },
     dataType:"json"
  });   
}

function fillLayer(){
  removeAllSelectOptions('layers');
  if(document.getElementById('projects').value == "")
    return;
  var q = "q=app:"+document.getElementById('projects').value+"&version=2.2&wt=json&facet=true&facet.field=layer&rows=0&facet.sort=false&facet.mincount=1&";
  $.ajax({
     url: "newscall.php?"+q, 
     type: 'get',
     error: function(XMLHttpRequest, textStatus, errorThrown){
        alert('status:' + XMLHttpRequest.status + ', status text: ' + XMLHttpRequest.statusText);
     },
     success: function(data){
        solr = new SolrJsonClass();
        solr.setMainObject(data);
        var arr = solr.getFacetFieldWithFacetName("layer");
        for(var temp =0;temp < arr.length;temp++){
          var arr2 = arr[temp];
          addOption('layers',arr2[0],arr2[0]);
        }

     },
     dataType:"json"
  });   
}


function postRemote (remote_url,formData) {
	return $.ajax({
		type: "POST",
		url: remote_url,
		data:formData,
		async: false
	}).responseText;
 }


function deleteProject(){
  if(document.getElementById('projects').value == "")
    return;
  var res = confirm("Are you sure you want to delete the project: '"+ document.getElementById('projects').value +"'");
  if (res == false)
     return;
  var deleteQuery = "<delete><query>app:"+document.getElementById('projects').value+"</query></delete>";
  var formData = new Object();
  formData.wholeupdate=deleteQuery;
  postRemote('delete.php',formData);
  fillProject();
  fillLayer();
}

function deleteLayer(){
  if(document.getElementById('projects').value == "")
    return;
  if(document.getElementById('layers').value == "")
    return;
  var res = confirm("Are you sure you want to delete the layer: '"+ document.getElementById('layers').value +"'");
  if (res == false)
     return;
  var deleteQuery = "<delete><query>app:"+document.getElementById('projects').value+" AND layer:"+document.getElementById('layers').value+"</query></delete>";
  var formData = new Object();
  formData.wholeupdate=deleteQuery;
  var res = postRemote('delete.php',formData);
  fillProject();
  fillLayer();
}

function deleteWholeIndex(){
  var res = confirm("Are you sure you want to delete the whole Index?");
  if (res == false)
     return;
  var deleteQuery = "<delete><query>*:*</query></delete>";
/*  alert('er pt disablet');
  return;*/
  var formData = new Object();
  formData.wholeupdate=deleteQuery;
  var res = postRemote('delete.php',formData);
  fillProject();
  fillLayer();
}