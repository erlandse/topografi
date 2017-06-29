var start =0;
var pageSize=20;
var solr;
var fylke="";
var kommune=""
var bruker="";
var missing ="";
var wheelInstance = "";
var elastic = null;
var defaultTerm = JSON.parse("{\"term\":{}}");
var defaultPhrase = JSON.parse("{\"match_phrase\":{}}");
var defaultWildcard = JSON.parse("{\"wildcard\":{}}");

function initialize(){
  $(document).ready(function(){
  });
  $.ajaxSetup ({
    // Disable caching of AJAX responses
    cache: false
  });
  $("#includedContent").load("foot.html"); 
  wheelInstance = new Wheel('wheelInstance','wordwheel_div','ul','lookupIndex','freetext');
  wheelInstance.followObject(document.getElementById('freetext'),0,24);
  start=0;
  var q = gup("q");
  if(q != ""){
    setUpPageExternal(q);
  }
  else
    setUpPage();
}

//dette er midllertidig funktionalitet
function setUpPageExternal(q){
  pageSize=1000;
  var facet="facet=true&facet.field=fylke&facet.field=kommune&facet.field=bruker&facet.sort=false&facet.mincount=1&";
  $.ajax({
     url: "SolrCall.php?wt=json&sort=dokumentDato+desc&rows=1000&"+facet+"q="+q, 
     type: 'get',
     error: function(XMLHttpRequest, textStatus, errorThrown){
        alert('status:' + XMLHttpRequest.status + ', status text: ' + XMLHttpRequest.statusText+ " errorthrown "+ errorThrown);
     },
     success: function(data){
            solr = new SolrJsonClass();
            solr.setMainObject(data);
            if(solr.getDocCount()==1){
              var docs = solr.getDocs();
              var id =  solr.getSingleFieldFromDoc(docs[0],"id");
              window.location = "edit.html?id="+id;
              return;
            }
            fillPage();
     },
     dataType:"json"
  });
  
}



function getSearch(includeTextField){

  var searching = false;
  searchObj = JsonTool.createJsonPath("query.bool");

  searchObj.query.bool = JSON.parse("{\"must\":[],\"should\":[],\"must_not\":[]}");


  missing = document.getElementById('missingFields').value;
  if(missing !=""){
    switch(missing){
/*      case "dokumentDato":
      case "dokumenttype":
         q += delimiter+"-"+missing+":[* TO *]";
         break;*/
      case "notUpdated":
         var term = JsonTool.cloneJSON(defaultTerm);
         term.term.oppdatert = false;
         searching = true;
         searchObj.query.bool.must.push(term);
         break;
     case "readyEvaluate":
         var term = JsonTool.cloneJSON(defaultTerm);
         term.term.oppdatert = true;
         searching = true;
         searchObj.query.bool.must.push(term);
         term = JsonTool.cloneJSON(defaultTerm);
         term.term.evaluert = false;
         searchObj.query.bool.must.push(term);
        break;
      case "readyPublish":
         var term = JsonTool.cloneJSON(defaultTerm);
         term.term.evaluert = true;
         searching = true;
         searchObj.query.bool.must.push(term);
         term = JsonTool.cloneJSON(defaultTerm);
         term.term.publisert = false;
         searchObj.query.bool.must.push(term);
         break;
      default:
        break;
    }    
    delimiter = "+AND+";
  }


  if(includeTextField == true){

    if(document.getElementById('freetext').value !=""){
         str = document.getElementById('freetext').value;
         str = document.getElementById('searchSelect').value =="gardsnavn"? str.toLowerCase():str;
         var term = JsonTool.cloneJSON(defaultTerm);
         eval("term.term."+document.getElementById('searchSelect').value+"=str");
         searching = true;
         searchObj.query.bool.must.push(term);
    }
  }
  
  fylke = document.getElementById('fylkeMeny').value;
  if (fylke != "") {
    var term = JsonTool.cloneJSON(defaultTerm);
    term.term.fylke = fylke;
    searching = true;
    searchObj.query.bool.must.push(term);

  }
  kommune = document.getElementById('kommuneMeny').value;
  if (kommune != "") {
    var term = JsonTool.cloneJSON(defaultTerm);
    term.term.kommune = kommune;
    searching = true;
    searchObj.query.bool.must.push(term);

  }
  bruker = document.getElementById('brukerMeny').value;
  if (bruker != "") {
    var term = JsonTool.cloneJSON(defaultTerm);
    term.term.bruker = bruker;
    searching = true;
    searchObj.query.bool.must.push(term);

  }
  if(searching == true)
    return searchObj;
  else  
   return null;  
}


function getRemote(remote_url) {
    return $.ajax({
        type: "GET",
        url: remote_url,
        async: false
    }).responseText;
}

function postRemote(remote_url,formData) {
	return $.ajax({
		type: "POST",
		url: remote_url,
		data:formData,
		async: false
	}).responseText;
 }

function initSearch(){
  start=0;
  setUpPage();
}

function setUpPage() {
  wheelInstance.clearUl();
  wheelInstance.hideOverlay();
  var formData = new Object();
  var searchObject = getSearch(true);
  if (searchObject == null)
    searchObject = new Object();
  searchObject.from = start;
  searchObject.aggs = aggregations.aggs;
  // alert(JSON.stringify(searchObject,null,2));
  formData.resturl = "";
  document.getElementById("debugarea").value = JSON.stringify(searchObject, null, 2);
  formData.elasticdata = JSON.stringify(searchObject, null, 2);
  $.ajax({
    url: "passpost.php",
    type: 'POST',
    data: formData,
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      alert('status:' + XMLHttpRequest.status + ', status text: ' + XMLHttpRequest.statusText + " errorthrown " + errorThrown);
    },
    success: function (data) {
      elastic = new ElasticClass(data);
      fillPage();
    },
    dataType: "json"
  });
}

function fillPage(){
  loadMenu("fylkeMeny","fylke",fylke);
  loadMenu("kommuneMeny","kommune",kommune);
  loadMenu("brukerMeny","bruker",bruker);
  document.getElementById('missingFields').value=missing;
  document.getElementById("bla").innerHTML = nextAndPreviousButtons();
  fillResultTable();
}


function loadMenu(menuName,facetName,menuVar){
  removeAllOptions(menuName);
  var selBox = document.getElementById(menuName);
  var arr = elastic.getFacetFieldWithFacetName(facetName);
  addOption(selBox,"Velg","");
  for (var temp = 0;temp < arr.length;temp++){
    var bucket = arr[temp];
    addOption(selBox,bucket.key +" ("+ bucket.doc_count+")",bucket.key);
 }
 selBox.value=menuVar;
 
}


//---------------

function nextAndPreviousButtons(){
  var form2 = "";
  form2 = "<hr><form method='get' name='moveForm' accept-charset='UTF-8'>";
  form2 +=  "<table width='100%' style='margin-left: 10px;text-align: left;' border='0' cellpadding='2' cellspacing='2'>";
  form2 += "<tr><td colspan='1' style='text-align: left; height: 40px'>";
  if(isNextPage()||isPrevPage()){
     if(isPrevPage()){
      var s = start-pageSize; 
      form2 += "<input type='button' class='button_class' value='Forrige' ";
      form2 += " onclick='move("+s+")'/> ";
     }
     if(isNextPage()){
       var s = start+pageSize; 
       form2 += "<input type='button' class='button_class' value='Neste' ";
       form2 += " onclick='move("+s+")'/>";
     }
     form2 += " "+  getCountLabel();
  }
  form2 +="</td></tr></table></form>";
  return form2;
}

function move(newStart){
  start=newStart;
  setUpPage();
}


function getCountLabel(){
   var countLabel = ""
   if(elastic.getDocCount() >0){
     if(start == 0)
       countLabel = "1";
     else
       countLabel=start;
     countLabel += "-";
     if(isNextPage())
       countLabel +=(start+pageSize);
     else
       countLabel += elastic.getDocCount();
     countLabel += " av " + elastic.getDocCount();
   }else{
     countLabel = "0 poster - Søk igjen"; 
   }
   return countLabel;  
}


function isNextPage(){
  if((start+pageSize)<elastic.getDocCount())
    return true;
}

function isPrevPage(){
  if(start>0)
    return true;
}

function fillResultTable(){
  document.getElementById("resultTableDiv").innerHTML = "<table class='tableClass'>"+fillResultRows()+"</table>";
}

function getDato(doc){
  var dato = elastic.getSingleFieldFromDoc(doc,'dokumentDato');
  if(dato !=""){
    var pos = dato.indexOf("T00:00:00Z");
    dato = dato.substring(0,pos);
  }
  return dato;
}

function fillResultRows(){
  var resultCode="";
  var docs = elastic.getDocs();
  var pos;
  resultCode +="<tr class='trResult'><th class='thResultSmall'>Fylke</th><th class='thResult'>Kommune</th><th class='thResult'>Gårdsnavn</th><th class='thResultSmall'>Dato</th><th class='thResult'>Dokumenttype</th><th class='thResult'>Tema</th><th class='thResultSmall'>Rediger</th></tr>";
  for(var temp=0;temp<docs.length;temp++){
    resultCode +="<tr>"; 
    resultCode +="<td class='tdBorder'>"+ elastic.getSingleFieldFromDoc(docs[temp],"fylke")+"</td>";
    resultCode +="<td class='tdBorder'>"+ ucFirstAllWords(elastic.getSingleFieldFromDoc(docs[temp],"kommune"))+"</td>";
    resultCode +="<td class='tdBorder'>"+ ucFirstAllWords(elastic.getSingleFieldFromDoc(docs[temp],"gardsnavn"))+"</td>";
    resultCode +="<td class='tdBorder'>"+ getDato(docs[temp])+"</td>";
    resultCode +="<td class='tdBorder'>"+ elastic.getSingleFieldFromDoc(docs[temp],"dokumenttype")+"</td>";
    resultCode +="<td class='tdBorder'>"+ elastic.getSingleFieldFromDoc(docs[temp],"tema")+"</td>";
    resultCode +="<td class='tdBorder'><a target='_blank' href='edit.html?id="+ elastic.getSingleFieldFromDoc(docs[temp],"id") +"'>Rediger "+ elastic.getSingleFieldFromDoc(docs[temp],"id")+"</a></td>";

//    resultCode +="<td class='tdBorder'>"+ solr.getSingleFieldFromDoc(docs[temp],"id")+"</td>";
    resultCode +="</tr>";
  }  
  return resultCode;
}

function lookupIndex(string){
  start=0;
  document.getElementById('freetext').value= wheelInstance.replaceLastWord(document.getElementById('freetext').value,string);
  wheelInstance.hideOverlay();
}


function changeWordwheel(event){
 document.getElementById("debugarea").value="";
  if (wheelInstance.handleWheel(event) == true)
    return;
  var searchSelect = document.getElementById('searchSelect').value;
  var str = document.getElementById('freetext').value.toLowerCase();
  document.getElementById("debugarea").value="1";
  if (str.length > 0){
     var ar = str.split(" ");
     var temp= ar.length-1;
     while(ar[temp]=="")
       temp--;
     var query = getSearch(false);
     if(query == null)
       query = new Object();
     wordListQuery.tags.terms.include = ar[temp] + ".*";
     wordListQuery.tags.terms.field=searchSelect;
     query.aggs = wordListQuery;
     query.size = 0;
     let formData = new Object();
     formData.elasticdata = JSON.stringify(query, null, 2);
     formData.resturl = "";
     document.getElementById("debugarea").value=JSON.stringify(query, null, 2);
     $.ajax({
       url: "passpost.php",
       type: 'post',
       data: formData,
       error: function (XMLHttpRequest, textStatus, errorThrown) {
        alert('status:' + XMLHttpRequest.status + ', status text: ' + XMLHttpRequest.statusText + " errorthrown " + errorThrown);
      },
      success: function (data) {
        var el = new ElasticClass(data);
        var ar = el.getFacetFieldWithFacetName("tags");
        wheelInstance.fillFacets(ar);
      },
      dataType: "json"
    });

  }else{
     wheelInstance.clearUl();
     wheelInstance.hideOverlay();
  }
}

function zeroSearch(){
  document.getElementById('fylkeMeny').value = "";
  document.getElementById('kommuneMeny').value = "";
  document.getElementById('brukerMeny').value = "";
  document.getElementById('freetext').value = "";
  document.getElementById('missingFields').value = "";
  
  initSearch();

}

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