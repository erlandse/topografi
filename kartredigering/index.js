
var browserSupportFlag = new Boolean();
 

function indexOf(array, value) {
    for (var i = 0, l = array.length; i < l; ++i) {
        if (array[i] === value) return i;
    }
    return -1;
}

 

function setSelectedByValue(values){
 for(var temp = 0; temp < values.length;temp++)
   document.getElementById(l[temp]).checked=true;
/*    var options = select.options;
    for (var i = 0, l = options.length; i < l; ++i) {
        var option = options[i];
        var value = option.value;
        option.selected = (indexOf(values, value) != -1);
    }*/
}


/*
 function initialize(){
  var solr;
  $(document).ready(function(){
  });
  removeAllSelectOptions('applicationSelect');
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
          addOption('applicationSelect',arr2[0],arr2[0]);
        }

     },
     dataType:"json"
  });   
} 
*/

 function initialize(){
  var elastic;
  $(document).ready(function(){
  });
  removeAllSelectOptions('applicationSelect');
  var formData = new Object();
  formData.elasticdata = JSON.stringify(newsAggregations,null,2);;
  $.ajax({
     url: "PassMapNews.php", 
     type: 'POST',
     data:formData,
     error: function(XMLHttpRequest, textStatus, errorThrown){
        alert('status:' + XMLHttpRequest.status + ', status text: ' + XMLHttpRequest.statusText);
     },
     success: function(data){
        elastic = new ElasticClass(data);
        var arr = elastic.getFacetFieldWithFacetName("app");
        for(var temp =0;temp < arr.length;temp++){
          var bucket = arr[temp];
          addOption('applicationSelect',bucket.key,bucket.key);
        }

     },
     dataType:"json"
  });   
} 



function search(){
    window.location="polygon.html?searchField="+document.getElementById("searchField").value+"&zoom="+document.getElementById("zoomLevel").value+"&app="+document.getElementById('applicationSelect').value;
}

 function checkInput(event){
	switch(event.keyCode){
	  case 13:
   	    search();
	    return true;
	  default:
	    return false;
     }

 }

function removeAllSelectOptions(selectionId){
  var elSel = document.getElementById(selectionId);
  while(elSel.length > 0)
    elSel.options.remove(elSel.length - 1);
  var elOptNew = document.createElement('option');
  addOption(selectionId,'Select project','');
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
