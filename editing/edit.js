var solr;
var doc;
var users;
var curuser;
var gardsid ="";
var elastic = null;
function initialize(){
  $(document).ready(function(){
  });
  $.ajaxSetup({ cache: false });
  upload();
}


function upload(){
  var formData = new Object();
  formData.elasticdata = "";
  formData.resturl = "q=id:"+gup("id");

  $.ajax({
    url: "passpost.php",
    type: 'POST',
    data: formData,
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      alert('status:' + XMLHttpRequest.status + ', status text: ' + XMLHttpRequest.statusText + " errorthrown " + errorThrown);
    },
    success: function (data) {
      elastic = new ElasticClass(data);
      var docs = elastic.getDocs();
      doc=docs[0];
      setUpDocument();
    },
    dataType: "json"
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
  document.getElementById('fylke').innerHTML=elastic.getSingleFieldFromDoc(doc,'fylke');
  document.getElementById('kommune').innerHTML=ucFirstAllWords(elastic.getSingleFieldFromDoc(doc,'kommune'));
  document.getElementById('gardsnavn').innerHTML=ucFirstAllWords(elastic.getSingleFieldFromDoc(doc,'gardsnavn'));
  document.getElementById('gardsnummer').innerHTML=elastic.getSingleFieldFromDoc(doc,'gardsnummer');
  document.getElementById('gardsid').innerHTML=elastic.getSingleFieldFromDoc(doc,'gardsid');
  gardsid=elastic.getSingleFieldFromDoc(doc,'gardsid');
  var pdf=document.getElementById('pdffile');
  pdf.innerHTML = "<a target='_blank' href='"+elastic.getSingleFieldFromDoc(doc,'urlpath')+"'>Dokumentet</a>";

  if(doc._source.lokation != undefined){
   var kart = document.getElementById("kart");
    kart.innerHTML="<a target='_blank' href='map.html?latitude="+doc._source.lokation.lat+"&longitude="+ doc._source.lokation.lon + "&'>Se kart</a>";
  }
/*
  if(solr.getSingleFieldFromDoc(doc,"latitude")!=""){
    var kart = document.getElementById("kart");
    kart.innerHTML="<a target='_blank' href='map.html?latitude="+solr.getSingleFieldFromDoc(doc,'latitude')+"&longitude="+ solr.getSingleFieldFromDoc(doc,'longitude') + "&'>Se kart</a>";
  }
  */
  var dato = elastic.getSingleFieldFromDoc(doc,'dokumentDato');
  if(dato !=""){
    var pos = dato.indexOf("T00:00:00Z");
    dato = dato.substring(0,pos);
    document.getElementById('dokumentDato').value=dato;
  }
  
  
  document.getElementById('askeladd').value=elastic.getSingleFieldFromDoc(doc,'askeladd');
  document.getElementById('museumsnr').value=elastic.getSingleFieldFromDoc(doc,'museumsnr');
  document.getElementById('mediaId').value=elastic.getSingleFieldFromDoc(doc,'mediaId');
  document.getElementById('avsender').value=elastic.getSingleFieldFromDoc(doc,'avsender');
  document.getElementById('mottaker').value=elastic.getSingleFieldFromDoc(doc,'mottaker');
  document.getElementById('dokumenttype').value=elastic.getSingleFieldFromDoc(doc,'dokumenttype');


  document.getElementById('unntattOffentlighet').checked=elastic.getSingleFieldFromDoc(doc,'unntattOffentlighet');
  document.getElementById('ukurantFormat').checked=elastic.getSingleFieldFromDoc(doc,'ukurantFormat');
  document.getElementById('handskrevet').checked=elastic.getSingleFieldFromDoc(doc,'handskrevet');


  document.getElementById('oppdatert').checked=elastic.getSingleFieldFromDoc(doc,'oppdatert');
  document.getElementById('evaluert').checked=elastic.getSingleFieldFromDoc(doc,'evaluert');
  document.getElementById('publisert').checked=elastic.getSingleFieldFromDoc(doc,'publisert');

  curuser = getRemote('curuser.php');
  if(curuser == "" || curuser == null)
    curuser="khmerlandse";
 
  if(curuser.indexOf("khm")!=0){
    document.getElementById('evaluert').disabled=true;
    document.getElementById('publisert').disabled=true;
    document.getElementById('deleteButton').disabled=true;
  }
  if(curuser=="gest")
    document.getElementById('saveButton').disabled=true;
  users= elastic.getArrayFromDoc(doc,'bruker');
  var perioder = elastic.getArrayFromDoc(doc,'periode');
  var p="";
  for(temp =0;temp < perioder.length;temp++){
    if(p=="")
      p=perioder[temp];
   else
      p +=","+perioder[temp];
  }
  setupPeriode(p);
  
  removeAllOptions('brukene');
  var bruk = elastic.getArrayFromDoc(doc,'bruk');
  var sel = document.getElementById('brukene');
  for(temp=0;temp <bruk.length;temp++){
    addOption(sel,bruk[temp],bruk[temp]);
  }
  
  document.getElementById('tema').value=elastic.getSingleFieldFromDoc(doc,'tema');
  document.getElementById('merknad').value=elastic.getSingleFieldFromDoc(doc,'merknad');
  document.getElementById('sammendrag').value=elastic.getSingleFieldFromDoc(doc,'sammendrag');

  document.getElementById('avskrift').value=elastic.getSingleFieldFromDoc(doc,'avskrift');
  var pdf = document.getElementById('pdfpage');
  var str = "<object data='"+elastic.getSingleFieldFromDoc(doc,'urlpath')+ "' type='application/pdf' width='100%' height='1100px'>alt : <a href='"+ elastic.getSingleFieldFromDoc(doc,'urlpath')+"'>Kan ikke vises denne nettleser - last ned istedet</a></object>";
  pdf.innerHTML = str;
}

function setupPeriode(perioder){
 deselectAllOptions('periode');
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


function savePost(){
  insertUser();
  var formData = JSON.parse("{}");
  var elasticData = new Object();
  createJSON(elasticData);
  formData.elasticdata = JSON.stringify(elasticData,null,2);
  formData.id= elasticData.id;
  var  res = postRemote("PassUpdate.php",formData);
  formData = new Object();
  formData.data_clob=JSON.stringify(elasticData,null,2);
  formData.id = elasticData.id;
  var  res = postRemote("save.php",formData);
  alert('Posten er lagret');
  upload();
}

function insertUser(){
  var temp;
  for(temp = 0; temp < users.length;temp++)
    if(users[temp]==curuser)
      return;
   users.push(curuser);   
}


function createJSON(formData){
  formData.id=elastic.getSingleFieldFromDoc(doc,'id');
  formData.fylke=elastic.getSingleFieldFromDoc(doc,'fylke');
  formData.kommune=elastic.getSingleFieldFromDoc(doc,'kommune');
  formData.gardsnavn=elastic.getSingleFieldFromDoc(doc,'gardsnavn');
  formData.gardsnummer=elastic.getSingleFieldFromDoc(doc,'gardsnummer');
  formData.gardsid=elastic.getSingleFieldFromDoc(doc,'gardsid');
  formData.urlpath=elastic.getSingleFieldFromDoc(doc,'urlpath');
  if(doc._source.lokation != undefined){
    formData.lokation = doc._source.lokation;
    formData.geofacet= elastic.getSingleFieldFromDoc(doc,'gardsnavn')+"_"+doc._source.lokation.lat+"_"+ doc._source.lokation.long
  }
  formData.askeladd=document.getElementById('askeladd').value;
  formData.museumsnr=document.getElementById('museumsnr').value;
  formData.mediaId=document.getElementById('mediaId').value;
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
  var  b = new Array();
  for(var temp =0; temp < users.length;temp++)
    b.push(users[temp]);
  formData.bruker=b;
  formData.tema=document.getElementById('tema').value;
  formData.merknad=document.getElementById('merknad').value;
  formData.sammendrag=document.getElementById('sammendrag').value;
  formData.avskrift=document.getElementById('avskrift').value;

  formData.unntattOffentlighet=document.getElementById('unntattOffentlighet').checked;
  formData.ukurantFormat=document.getElementById('ukurantFormat').checked;
  formData.handskrevet=document.getElementById('handskrevet').checked;

  formData.oppdatert=document.getElementById('oppdatert').checked;
  formData.evaluert=document.getElementById('evaluert').checked;
  formData.publisert=document.getElementById('publisert').checked;
}

function deletePost(){
  alert("Ikke implementeret for elastic");
/*  var id="";
  var result = confirm("Ønsker du at slette posten?");
  if(result==false)
    return;
  var formData = JSON.parse("{}");
  id=solr.getSingleFieldFromDoc(doc,'id');
  formData.data="<delete><query>id:"+id+"</query></delete>";
  formData.id=id;
  $.ajax({
		url : "delete.php",
		type: "POST",
		data : formData,
		success: function(data, textStatus, jqXHR)
		{
		  alert("Posten er slettet!");
          window.location.assign("index.html")		  
		},
		error: function (XMLHttpRequest, textStatus, errorThrown)
		{
           alert('status:' + XMLHttpRequest.status + ', status text: ' + XMLHttpRequest.statusText+ " errorthrown "+ errorThrown);
	 
		}
  });*/

}

function nextNotUpdatedDocument(){
  var formData = new Object();
  formData.elasticdata="";
  formData.resturl="q=gardsid:"+gardsid+"+AND+oppdatert:false&"
  $.ajax({
     url: "passpost.php?", 
     type: 'POST',
     data:formData,
     error: function(XMLHttpRequest, textStatus, errorThrown){
        alert('status:' + XMLHttpRequest.status + ', status text: ' + XMLHttpRequest.statusText+ " errorthrown "+ errorThrown);
     },
     success: function(data){
            el = new ElasticClass(data);
            if(el.getDocCount()==0){
              alert('Alle dokumenter til gården er oppdaterte');
              return;
            }
            var docs = el.getDocs();
            doc= docs[0];
            window.location = "edit.html?id="+tempsol.getSingleFieldFromDoc(doc,'id');
     },
     dataType:"json"
  });  

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