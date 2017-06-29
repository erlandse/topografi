var wheelInstance = "";
var solr;
var fylke="";
var kommune="";
var dokumentDato="";
var periode="";
var interval = 10;
var pageSize=10;
var start = 0;
var elastic = null;

var defaultSpanOr = JSON.parse("{\"span_or\":{\"clauses\":[]}}");
var defaultTerm = JSON.parse("{\"term\":{}}");
var defaultPhrase = JSON.parse("{\"match_phrase\":{}}");
var defaultWildcard = JSON.parse("{\"wildcard\":{}}");

//var jsonTool = new JsonTool();

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


function initialize(){
  $(document).ready(function(){
  });
  $.ajaxSetup ({
    cache: false
  });
  var selBox = document.getElementById("periode");
  for(var temp = 0; temp < timetable.length;temp++)
    addOption(selBox,timetable[temp].display,timetable[temp].kode);
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

function initSearch(){
  start=0;
  fylke = document.getElementById("fylkeMeny").value;
  kommune = document.getElementById("kommuneMeny").value;
  dokumentDato = document.getElementById("dokumentDato").value;
  periode = document.getElementById("periode").value;
  setUpPage();
}


function lookupIndex(string){
  start=0;
  document.getElementById('freetext').value= wheelInstance.replaceLastWord(document.getElementById('freetext').value,string);
  wheelInstance.hideOverlay();
}

//	$facet =$facet ."facet.date=facetDate&facet.date.gap=%2B10YEAR&facet.date.start=1850-01-01T00:00:00Z&facet.date.end=NOW&";


function setUpPage(){
 var formData = new Object();
 var searchObject = getSearch(true);
 if(searchObject == null)
   searchObject = new Object();
 searchObject.from = start;
 searchObject.aggs= aggregations.aggs;
// alert(JSON.stringify(searchObject,null,2));
 formData.resturl="";
 document.getElementById("debugarea").value= JSON.stringify(searchObject,null,2);
 formData.elasticdata = JSON.stringify(searchObject,null,2);
  $.ajax({
     url: "passpost.php", 
     type: 'POST',
     data:formData,
     error: function(XMLHttpRequest, textStatus, errorThrown){
        alert('status:' + XMLHttpRequest.status + ', status text: ' + XMLHttpRequest.statusText+ " errorthrown "+ errorThrown);
     },
     success: function(data){
       elastic = new ElasticClass(data);
       fillPage();
       
     },
     dataType:"json"
  });
  
}


function fillPage(){
  loadMenu("fylkeMeny","fylke",fylke);
  loadMenu("kommuneMeny","kommune",kommune);
  loadDateMenu("dokumentDato","periods",dokumentDato);
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

function loadDateMenu (menuName,facetName,menuVar){
  removeAllOptions(menuName);
  var selBox = document.getElementById(menuName);
  var arr = elastic.getFacetFieldWithFacetName(facetName);
  addOption(selBox,"Velg","");
  for (var temp = 0;temp < arr.length;temp++){
    var bucket = arr[temp];
    var startDate = parseInt(bucket.key_as_string.substring(0,4));
    var res = startDate + "-"+(startDate+10);
    addOption(selBox,res+" ("+bucket.doc_count+")",bucket.key_as_string.substring(0,4));
 }
 selBox.value=menuVar;
}


function getSearch(includeTextField) {
  var q = "";
  var searching = false;
  //  searchObj = JsonTool.createJsonPath("query.bool.filter");
  searchObj = JsonTool.createJsonPath("query.bool");

  //  searchObj.query.bool.filter.bool = JSON.parse("{\"must\":[],\"should\":[],\"must_not\":[]}");
  searchObj.query.bool = JSON.parse("{\"must\":[],\"should\":[],\"must_not\":[]}");

  fylke = document.getElementById('fylkeMeny').value;
  if (fylke != "") {
    var term = JsonTool.cloneJSON(defaultTerm);
    term.term.fylke = fylke;
    searching = true;
    searchObj.query.bool.must.push(term);

    //    searchObj.query.bool.filter.bool.must.push(term);
  }
  kommune = document.getElementById('kommuneMeny').value;
  if (kommune != "") {
    var term = JsonTool.cloneJSON(defaultTerm);
    term.term.kommune = kommune;
    searching = true;
    searchObj.query.bool.must.push(term);
  }
  dokumentDato = document.getElementById('dokumentDato').value;
  if (dokumentDato != "") {
    var obj = JsonTool.createJsonPath("range.dokumentDato");
    obj.range.dokumentDato.from = dokumentDato;
    var d = (parseInt(dokumentDato)) + 10;
    obj.range.dokumentDato.to = "" + d;
    searchObj.query.bool.must.push(obj);
    searching = true;
  }

  periode = document.getElementById('periode').value;
  if (periode != "") {
    if (toparkquery[periode].length == 1) {
      var obj = new Object();
      obj.term = new Object();
      obj.term.periode = toparkquery[periode][0];
      searchObj.query.bool.must.push(obj);
    } else {
      for (var temp = 0; temp < toparkquery[periode].length; temp++) {
        var obj = new Object();
        obj.term = new Object();
        obj.term.periode = toparkquery[periode][temp];
        searchObj.query.bool.should.push(obj);
      }
    }
    searching = true;
  }
  if (includeTextField == true) {
    if (document.getElementById('freetext').value != "") {
      var term = JsonTool.cloneJSON(defaultTerm);
      searching = true;
      if (document.getElementById('searchSelect').value == "gardsnavn")
        term.term.gardsnavn = document.getElementById('freetext').value;
      else {
        var pos = document.getElementById('freetext').value.indexOf("*");
        var pos2 = document.getElementById('freetext').value.indexOf("?");
        if(pos !=-1 || pos2 != -1){
          term = JsonTool.cloneJSON(defaultWildcard);
          term.wildcard.textcontainer = document.getElementById('freetext').value;
        }else{
          term = JsonTool.cloneJSON(defaultPhrase);
          term.match_phrase.textcontainer = document.getElementById('freetext').value;
        }
      }
      searchObj.query.bool.must.push(term);
    }
  }
  if (searching == true)
    return searchObj;
  else
    return null;

}



/*
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
              window.location = "document.html?id="+id;
              return;
            }
            fillPage();
     },
     dataType:"json"
  });
  
}
*/

function setUpPageExternal(q) {
  var formData = new Object();
  var body = new Object();
  body.size = 1000;
  body.aggs = aggregations.aggs;
  formData.elasticdata = JSON.stringify(body);
  formData.resturl = "q="+q;
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

function nextAndPreviousButtons(){
  var form2 = "";
  form2 = "<hr><form method='get' name='moveForm' accept-charset='UTF-8'>";
  form2 +=  "<table width='100%' style='margin-left: 60px;text-align: left;' border='0' cellpadding='2' cellspacing='2'>";
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


function zeroSearch(){
  document.getElementById("freetext").value ="";
  document.getElementById("fylkeMeny").value ="";
  document.getElementById("kommuneMeny").value ="";
  document.getElementById("dokumentDato").value ="";
  document.getElementById("periode").value ="";
  fylke = "";
  kommune ="";
  dokumentDato="";
  periode="";
  setUpPage();

}

function getCountLabel(){
   var countLabel = ""
   if(elastic.getDocCount() > 0){
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
  if((start+pageSize)< elastic.getDocCount())
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
  resultCode +="<tr class='trResult'><th class='thResultSmall'>Fylke</th><th class='thResult'>Kommune</th><th class='thResult'>Gårdsnavn</th><th class='thResultSmall'>Dato</th><th class='thResult'>Dokumenttype</th><th class='thResult'>Tema</th><th class='thResultSmall'>Se dokument</th></tr>";
  for(var temp=0;temp<docs.length;temp++){
    resultCode +="<tr>"; 
    resultCode +="<td class='tdBorder'>"+ elastic.getSingleFieldFromDoc(docs[temp],"fylke")+"</td>";
    resultCode +="<td class='tdBorder'>"+ ucFirstAllWords(elastic.getSingleFieldFromDoc(docs[temp],"kommune"))+"</td>";
    resultCode +="<td class='tdBorder'>"+ ucFirstAllWords(elastic.getSingleFieldFromDoc(docs[temp],"gardsnavn"))+"</td>";
    resultCode +="<td class='tdBorder'>"+ getDato(docs[temp])+"</td>";
    resultCode +="<td class='tdBorder'>"+ elastic.getSingleFieldFromDoc(docs[temp],"dokumenttype")+"</td>";
    resultCode +="<td class='tdBorder'>"+ elastic.getSingleFieldFromDoc(docs[temp],"tema")+"</td>";
    resultCode +="<td class='tdBorder'><a target='_blank' href='document.html?id="+ elastic.getSingleFieldFromDoc(docs[temp],"id") +"'>Se dokumentet</a></td>";

//    resultCode +="<td class='tdBorder'>"+ solr.getSingleFieldFromDoc(docs[temp],"id")+"</td>";
    resultCode +="</tr>";
  }  
  return resultCode;
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


function changeWordwheel(event) {
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
