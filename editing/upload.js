var currentId = "";

function initialize(){
  $(document).ready(function(){

  });
  document.getElementById('idnumber').disabled=true;
  document.getElementById('createButton').disabled=true;
  var curuser = getRemote('curuser.php');
  if(curuser.indexOf("khm")!=0){
    alert('Opprettelse av poster kan kun ske av personale fra KHM');
    window.location.href='index.html';
  }

}

function getBasisData(){
  var st = document.getElementById('urlpath').value;
  st += "/path.txt";

  var res = getRemote(st);
  var arr= res.split('\t');
  if(arr.length != 5){
    alert('Feil ved indlesning - sjekk url!');
    alert(res);
    return;
  }
  document.getElementById('fylke').innerHTML=arr[0];
  document.getElementById('kommune').innerHTML=arr[1];
  document.getElementById('gardsnavn').innerHTML=arr[2];
  document.getElementById('gardsnummer').innerHTML=arr[3];
  document.getElementById('gardsid').innerHTML=arr[4];
  loadGeoPoints();
  var data = getRemote("SolrCall.php?rows=200&wt=json&q=gardsid:"+document.getElementById('gardsid').innerHTML);
  var solr = new SolrJsonClass();
  solr.setMainObject(JSON.parse(data));
  var docs = solr.getDocs();
  for (var temp =0;temp <docs.length;temp++){
    var url = solr.getSingleFieldFromDoc(docs[temp],'urlpath');
    var pos = url.lastIndexOf("/");
    addOption(document.getElementById('registeredPDF'),url.substr(pos+1),url.substr(pos+1));
  }
  
  
}


function getRemote(remote_url) {
    return $.ajax({
        type: "GET",
        url: remote_url,
        async: false
    }).responseText;
}

function getNewNumber(){
  currentId = getRemote("get_sequence.php");
  document.getElementById('idnumber').value= currentId;
  document.getElementById('idnumber').disabled=false;
  document.getElementById('createButton').disabled=false;
  alert('Husk at tilføy .pdf på filnavn og last filen opp!');
}


 function postRemote(remote_url,formData) {
	return $.ajax({
		type: "POST",
		url: remote_url,
		data:formData,
		async: false
	}).responseText;
 }


function createRecord(){

  
  var formData = JSON.parse("{}");
  formData.urlpath= document.getElementById('urlpath').value+document.getElementById('idnumber').value+".pdf";
  var res = postRemote("exist_file.php",formData);
  if(res=="false"){
    alert("Dokumentet '"+document.getElementById('idnumber').value+ ".pdf' er ikke lastet opp til '"+document.getElementById('urlpath').value+"'\nså posten vil ikke blive opprettet!");
    return;
  }
  
  var data = getRemote("SolrCall.php?rows=200&wt=json&q=gardsid:"+document.getElementById('gardsid').innerHTML);
  var solr = new SolrJsonClass();
  solr.setMainObject(JSON.parse(data));
  var docs = solr.getDocs();
  for (var temp =0;temp <docs.length;temp++){
    if(solr.getSingleFieldFromDoc(docs[temp],'urlpath')  == formData.urlpath){
      alert("PDF filen er registrert fra før");
      return;
    }
  }
  formData.id= currentId;
  formData.fylke= document.getElementById('fylke').innerHTML;
  formData.kommune= document.getElementById('kommune').innerHTML;
  formData.gardsnavn= document.getElementById('gardsnavn').innerHTML;
  formData.gardsnummer= document.getElementById('gardsnummer').innerHTML;
  formData.gardsid= document.getElementById('gardsid').innerHTML;
  if(document.getElementById('latitude').innerHTML !=""){
    formData.latitude=document.getElementById('latitude').innerHTML;
    formData.longitude=document.getElementById('longitude').innerHTML;
    formData.geofacet= document.getElementById('gardsnavn').innerHTML + "_"+ document.getElementById('latitude').innerHTML + "_"+ document.getElementById('longitude').innerHTML;
  }else
    formData.latitude ="";
    
  makeSOLRData(formData);
  formData.data_clob = JSON.stringify(formData,null,2);
  formData.newRecord="true";
  var result = postRemote('save.php',formData);
  document.getElementById('idnumber').value = "";
  document.getElementById('idnumber').disabled=true;
  document.getElementById('createButton').disabled=true;
  alert("Dokumentet er opprettet");
}

function makeSOLRData(formData){
  var temp;
  var prefix="<![CDATA[";
  var postfix="]]>";
  var result = "<add><doc>\n";

  result += "<field name='id'>"+ formData.id+"</field>\n";
  result += "<field name='fylke'>"+ formData.fylke+"</field>\n";
  result += "<field name='kommune'>"+ formData.kommune+"</field>\n";
  result += "<field name='gardsnavn'>"+ formData.gardsnavn+"</field>\n";
  result += "<field name='gardsnummer'>"+ formData.gardsnummer+"</field>\n";
  result += "<field name='gardsid'>"+ formData.gardsid+"</field>\n";
  result += "<field name='urlpath'>"+ formData.urlpath+"</field>\n";
  if(formData.latitude !=""){
    result += "<field name='latitude'>"+ formData.latitude+"</field>\n";
    result += "<field name='longitude'>"+ formData.longitude+"</field>\n";
    result += "<field name='geofacet'>"+ formData.geofacet+"</field>\n";
  }

  result += "<field name='oppdatert'>false</field>\n";
  result += "<field name='evaluert'>false</field>\n";
  result += "<field name='publisert'>false</field>\n";
  var curuser = getRemote('curuser.php');
  result += "<field name='bruker'>"+curuser+"</field>\n";

  result += "</doc></add>";
  formData.solr= result;

}

function loadGeoPoints(){
  var res = JSON.parse(getRemote("GetLocation.php?stedid="+document.getElementById('gardsid').innerHTML));
  if(res.ost == ""){
    document.getElementById('latitude').innerHTML="";
    document.getElementById('longitude').innerHTML="";
    return;
  }
   var formData = JSON.parse("{}");
   var url = "http://gis-prod02.uio.no:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer/project?inSR=32632&outSR=4326&geometries="+res.ost+","+res.nord+"&transformation=&transformForward=false&f=json";
   formData.url=url;
   var r = JSON.parse(postRemote("GisCall.php",formData));
   document.getElementById('latitude').innerHTML=r.geometries[0].y;
   document.getElementById('longitude').innerHTML=r.geometries[0].x
   
}
