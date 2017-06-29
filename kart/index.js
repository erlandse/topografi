
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
}



 function initialize(){
  $(document).ready(function(){
  });
} 



function search(){
   var searchSpec;
    if(document.getElementById("searchField").value ==""){
      searchSpec="kart.html?zoom="+document.getElementById("zoomLevel").value+"&";
    }
    else 
      searchSpec="kart.html?searchField="+document.getElementById("searchField").value+"&zoom="+document.getElementById("zoomLevel").value+"&";
    window.location=searchSpec;

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



//----------------------------------------------------

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
