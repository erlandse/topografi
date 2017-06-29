var solr;
var doc;
var users;
var curuser;
function initialize(){
  $(document).ready(function(){

  });
  query="wt=json&q=id:"+ gup('id');
  $.ajax({
     url: "SolrCall.php?"+query, 
     type: 'get',
     error: function(XMLHttpRequest, textStatus, errorThrown){
        alert('status:' + XMLHttpRequest.status + ', status text: ' + XMLHttpRequest.statusText+ " errorthrown "+ errorThrown);
     },
     success: function(data){
            solr = new SolrJsonClass();
            solr.setMainObject(data);
            if(solr.getDocCount()!=1){
              alert('Dokumentet eksisterer ikke');
              return;
            }
            var docs = solr.getDocs();
            doc= docs[0];
            setUpDocument();
     },
     dataType:"json"
  });  
}


function getRemote(remote_url) {
    return $.ajax({
        type: "GET",
        url: remote_url,
        async: false
    }).responseText;
}

function setUpDocument(){
  document.getElementById('fylke').innerHTML=solr.getSingleFieldFromDoc(doc,'fylke');
  document.getElementById('kommune').innerHTML=solr.getSingleFieldFromDoc(doc,'kommune');
  document.getElementById('gardsnavn').innerHTML=solr.getSingleFieldFromDoc(doc,'gardsnavn');
  document.getElementById('gardsnummer').innerHTML=solr.getSingleFieldFromDoc(doc,'gardsnummer');
  document.getElementById('gardsid').innerHTML=solr.getSingleFieldFromDoc(doc,'gardsid');
  var pdf=document.getElementById('pdffile');
  pdf.innerHTML = "<a target='_blank' href='"+solr.getSingleFieldFromDoc(doc,'urlpath')+"'>Dokumentet</a>";
  if(solr.getSingleFieldFromDoc(doc,"latitude")!=""){
    var kart = document.getElementById("kart");
    kart.innerHTML="<a target='_blank' href='map.html?latitude="+solr.getSingleFieldFromDoc(doc,'latitude')+"&longitude="+ solr.getSingleFieldFromDoc(doc,'longitude') + "&'>Se kart</a>";
  }
  
  var dato = solr.getSingleFieldFromDoc(doc,'dokumentDato');
  if(dato !=""){
    var pos = dato.indexOf("T00:00:00Z");
    dato = dato.substring(0,pos);
    document.getElementById('dokumentDato').value=dato;
  }
  
  
  document.getElementById('askeladd').value=solr.getSingleFieldFromDoc(doc,'askeladd');
  document.getElementById('avsender').value=solr.getSingleFieldFromDoc(doc,'avsender');
  document.getElementById('mottaker').value=solr.getSingleFieldFromDoc(doc,'mottaker');
  document.getElementById('dokumenttype').value=solr.getSingleFieldFromDoc(doc,'dokumenttype');

  document.getElementById('oppdatert').checked=solr.getSingleFieldFromDoc(doc,'oppdatert');
  document.getElementById('evaluert').checked=solr.getSingleFieldFromDoc(doc,'evaluert');
  document.getElementById('publisert').checked=solr.getSingleFieldFromDoc(doc,'publisert');
  curuser = getRemote('curuser.php');
  if(curuser.indexOf("khm")!=0){
    document.getElementById('evaluert').disabled=true;
    document.getElementById('publisert').disabled=true;
  }
  users= solr.getArrayFromDoc(doc,'bruker');
  var perioder = solr.getArrayFromDoc(doc,'periode');
  var p="";
  for(temp =0;temp < perioder.length;temp++){
    if(p=="")
      p=perioder[temp];
   else
      p +=","+perioder[temp];
  }
  setupPeriode(p);
  
  var bruk = solr.getArrayFromDoc(doc,'bruk');
  var sel = document.getElementById('brukene');
  for(temp=0;temp <bruk.length;temp++){
    addOption(sel,bruk[temp],bruk[temp]);
  }
  
  document.getElementById('tema').value=solr.getSingleFieldFromDoc(doc,'tema');
  document.getElementById('merknad').value=solr.getSingleFieldFromDoc(doc,'merknad');
  document.getElementById('avskrift').value=solr.getSingleFieldFromDoc(doc,'avskrift');
  var pdf = document.getElementById('pdfpage');
  var str = "<object data='"+solr.getSingleFieldFromDoc(doc,'urlpath')+ "' type='application/pdf' width='100%' height='1100px'></object>";
  pdf.innerHTML = str;
/*
 <object data="myfile.pdf" type="application/pdf" width="100%" height="100%">
 
  <p>It appears you don't have a PDF plugin for this browser.
  No biggie... you can <a href="myfile.pdf">click here to
  download the PDF file.</a></p>
  
</object>
*/
}

function setupPeriode(perioder){
 var select = document.getElementById("periode");
 var array = perioder.split(",");
 for(count=0; count<array.length; count++) {
   for(i=0; i<select.options.length; i++) {
      if(select.options[i].value == array[count]) {
        select.options[i].selected="selected";
      }
    }
  }

}

function addBruk(){
  var t=document.getElementById('bruk').value+"/"+document.getElementById('bruksnummer').value;
  var sel = document.getElementById('brukene');
  addOption(sel,t,t);
  document.getElementById('bruk').value ="";
  document.getElementById('bruksnummer').value ="";
  
}

function deleteBruk(){
  var elSel = document.getElementById('brukene');
  var i;
  for (i = elSel.length - 1; i>=0; i--) {
    if (elSel.options[i].selected==true) {
      elSel.remove(i);
      break;
    }
  }
}

 function postRemote(remote_url,formData) {
	return $.ajax({
		type: "POST",
		url: remote_url,
		data:formData,
		async: false
	}).responseText;
 }


function isDateValid(){
  var dato = document.getElementById('dokumentDato').value;
  if(dato =="")
    return true;
  var arr = dato.split("-");
  if(arr.length !=3)
    return false;
  if(arr[0].length != 4 ||  arr[1].length != 2 || arr[2].length != 2)
    return false;
  if(parseInt(arr[1],10) >12)
    return false;
  if(parseInt(arr[2],10) >31)
    return false;
  if(isNaN(arr[0]) == true || isNaN(arr[1]) == true || isNaN(arr[2]) == true)
     return false;
  return true;   
}


function savePost(){

  if(isDateValid()==false){
    alert('Dato felt forkert utfyllt');
    return;
  }

  insertUser();
  var formData = JSON.parse("{}" );
  createJSON(formData);
  createSOLR(formData);
  postRemote("save.php",formData);
  alert('post lagret');
}

function insertUser(){
  var temp;
  for(temp = 0; temp < users.length;temp++)
    if(users[temp]==curuser)
      return;
   users.push(curuser);   
}

function createSOLR(formData){
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

  result += "<field name='askeladd'>"+ formData.askeladd+"</field>\n";
  result += "<field name='avsender'>"+ formData.avsender+"</field>\n";
  result += "<field name='mottaker'>"+ formData.mottaker+"</field>\n";
  var l = formData.bruk.split("#");
  for(temp=0;temp< l.length;temp++)
    result += "<field name='bruk'>"+ l[temp]+"</field>\n";
  result += "<field name='dokumenttype'>"+ formData.dokumenttype+"</field>\n";
  l = formData.periode.split("#");
  for(temp=0;temp< l.length;temp++)
    result += "<field name='periode'>"+ l[temp]+"</field>\n";
  result += "<field name='tema'>"+ formData.tema+"</field>\n";
  result += "<field name='merknad'>"+prefix+formData.merknad+postfix+"</field>\n";
  result += "<field name='avskrift'>"+prefix+formData.avskrift+postfix+"</field>\n";

  result += "<field name='oppdatert'>"+ formData.oppdatert+"</field>\n";
  result += "<field name='evaluert'>"+ formData.evaluert+"</field>\n";
  result += "<field name='publisert'>"+ formData.publisert+"</field>\n";
  if(formData.dokumentDato !="")
    result += "<field name='dokumentDato'>"+ formData.dokumentDato+"</field>\n";
  for(temp=0; temp<users.length;temp++)
    result += "<field name='bruker'>"+ users[temp]+"</field>\n";
  
  result += "</doc></add>";
  formData.solr= result;

}
function createJSON(formData){
  formData.id=solr.getSingleFieldFromDoc(doc,'id');
  formData.fylke=solr.getSingleFieldFromDoc(doc,'fylke');
  formData.kommune=solr.getSingleFieldFromDoc(doc,'kommune');
  formData.gardsnavn=solr.getSingleFieldFromDoc(doc,'gardsnavn');
  formData.gardsnummer=solr.getSingleFieldFromDoc(doc,'gardsnummer');
  formData.gardsid=solr.getSingleFieldFromDoc(doc,'gardsid');
  formData.urlpath=solr.getSingleFieldFromDoc(doc,'urlpath');
  if(solr.getSingleFieldFromDoc(doc,'latitude')!=""){
    formData.latitude=solr.getSingleFieldFromDoc(doc,'latitude');
    formData.longitude=solr.getSingleFieldFromDoc(doc,'longitude');
    formData.geofacet= solr.getSingleFieldFromDoc(doc,'gardsnavn')+"_"+solr.getSingleFieldFromDoc(doc,'latitude')+solr.getSingleFieldFromDoc(doc,'longitude');
  }else
    formData.latitude="";  
  formData.askeladd=document.getElementById('askeladd').value;
  formData.avsender=document.getElementById('avsender').value;
  formData.mottaker=document.getElementById('mottaker').value;
  if(document.getElementById('dokumentDato').value !="")
    formData.dokumentDato=document.getElementById('dokumentDato').value+"T00:00:00Z";
  else 
    formData.dokumentDato="";
  var b ="";
  var sel = document.getElementById('brukene');
  for(temp = 0;temp < sel.length;temp++){
    if(b=="")
      b=sel.options[temp].value;
    else  
      b+="#"+sel.options[temp].value;

  }
  formData.bruk=b;
  formData.dokumenttype=document.getElementById('dokumenttype').value;
  sel = document.getElementById('periode');
  b="";
  for(temp = 0;temp < sel.length;temp++){
    if(sel.options[temp].selected==true){
		if(b=="")
		  b=sel.options[temp].value;
		else  
		  b+="#"+sel.options[temp].value;
    }
  }
  formData.periode=b;
  b="";
  for (temp=0;temp < users.length;temp++){
	if(b=="")
	  b=users[temp];
	else  
	  b+="#"+users[temp];
  }
  formData.bruker=b;
  formData.tema=document.getElementById('tema').value;
  formData.merknad=document.getElementById('merknad').value;
  formData.avskrift=document.getElementById('avskrift').value;
  formData.oppdatert=document.getElementById('oppdatert').checked;
  formData.evaluert=document.getElementById('evaluert').checked;
  formData.publisert=document.getElementById('publisert').checked;
  formData.data_clob = JSON.stringify(formData,null,2);
}