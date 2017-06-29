var solr;
var doc = null;
var elastic = null;

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

function initialize(){
  $(document).ready(function(){
  });
  $.ajaxSetup ({
    cache: false
  });
  upload();    
}

/*
function upload(){
  query="wt=json&q=id:"+ gup('id');//+"&curtime="+Date.now()+"&";
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
*/

function upload() {
  var formData = new Object();
  var body = new Object();
  formData.elasticdata = "";
  formData.resturl = "q=id:" + gup('id');
  $.ajax({
    url: "passpost.php",
    type: 'POST',
    data: formData,
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      alert('status:' + XMLHttpRequest.status + ', status text: ' + XMLHttpRequest.statusText + " errorthrown " + errorThrown);
    },
    success: function (data) {
      elastic = new ElasticClass(data);
      if (elastic.getDocCount() != 1) {
        alert('Dokumentet eksisterer ikke');
        return;
      }
      var docs = elastic.getDocs();
      doc = docs[0];
      setUpDocument();
    },
    dataType: "json"
  })
}

function setUpDocument(){
  document.getElementById('tema').innerHTML="<h3>"+ elastic.getSingleFieldFromDoc(doc,'tema')+"&nbsp;<a href='"+elastic.getSingleFieldFromDoc(doc,'urlpath')+"'><img src='pdf.png'></a></h3>";
  document.getElementById('fylke').innerHTML=elastic.getSingleFieldFromDoc(doc,'fylke');
  document.getElementById('kommune').innerHTML=ucFirstAllWords(elastic.getSingleFieldFromDoc(doc,'kommune'));
  document.getElementById('gardsnavn').innerHTML=ucFirstAllWords(elastic.getSingleFieldFromDoc(doc,'gardsnavn'));
  document.getElementById('gardsnummer').innerHTML=elastic.getSingleFieldFromDoc(doc,'gardsnummer');
  document.getElementById('dokumenttype').innerHTML=elastic.getSingleFieldFromDoc(doc,'dokumenttype');
  var arr = elastic.getArrayFromDoc(doc,'periode');
  var res = "";
  for(var temp = 0; temp< arr.length;temp++){
    var periode = arr[temp].trim();
    if(periode !="")
      res += res==""?tema[periode]: ", "+tema[periode];
  }  
  document.getElementById('periode').innerHTML = res;  
  document.getElementById('sammendrag').innerHTML=elastic.getSingleFieldFromDoc(doc,'sammendrag');
  document.getElementById('avskrift').innerHTML=elastic.getSingleFieldFromDoc(doc,'avskrift');
  if(elastic.getSingleFieldFromDoc(doc,'museumsnr') !="")
    createMuseumLinks(elastic.getSingleFieldFromDoc(doc,'museumsnr'));
  //document.getElementById('museumsnr').innerHTML=elastic.getSingleFieldFromDoc(doc,'museumsnr');
  
//  document.getElementById('askeladd').innerHTML=elastic.getSingleFieldFromDoc(doc,'askeladd');
  createAskeladdLinks(elastic.getSingleFieldFromDoc(doc,'askeladd'));
  if(doc._source.lokation != undefined){
   document.getElementById('kart').innerHTML="<a href='http://app.uio.no/khm/topark/kart/kart.html?zoom=17&latitude="+doc._source.lokation.lat+"&longitude="+doc._source.lokation.lon +"&'>Gården er i sentrum av kart</a>"; 
  }
 
  
  var media = elastic.getSingleFieldFromDoc(doc,'mediaId');
  if(media !="")
    createPictures(media);
}

function createAskeladdLinks(askeladd){
 if(askeladd=="")
   return;
 var arr = askeladd.split(",");
 res= "";
 for(var temp=0;temp< arr.length;temp++){
   res += "<a href='http://www.kulturminnesok.no/kulturminnesok/kulturminne/?LOK_ID="+arr[temp].trim()+"'>"+arr[temp].trim() + " </a>&nbsp;&nbsp;"
 }
 document.getElementById('askeladd').innerHTML=res;
}


function createMuseumLinks(museumNumbers){
 var arr = museumNumbers.split(",");
 res= "";
 for(var temp=0;temp< arr.length;temp++){
   res += createOneMuseumLink(arr[temp].trim());
 }
 document.getElementById('museumsnr').innerHTML=res;
}

function createOneMuseumLink(museumNumber){
  var url= "http://www.unimus.no/artefacts/khm/search?q="+museumNumber+"&f=json&";
  var ob = new Object();
  ob.url = url;
  var response = JSON.parse(postRemote("phpcall.php",ob));
  if(response.numberOfRecords=="0")
    return museumNumber + " ";
  var entity = drill(response,"MusitEntities.Entity");
  var oid = entity[0]["@attributes"].id;
  var museumno = entity[0].MuseumNo;
  return("<a href='http://www.unimus.no/artefacts/khm/search/?oid="+oid+"&museumsnr="+museumno+"&f=html&'>"+museumno+"</a>&nbsp;&nbsp;");
}


function createPictures(media){
 var arr = media.split(",");
 var result;
 if(arr.length>1)
   result = "<hr><h3>Klikk på en av bilderne for å se flere bilder</h3><table>";
 else
   result = "<hr><h3>Klikk på bildet for å se flere bilder</h3><table>";
 var temp;
 for(temp =0;temp < arr.length;temp++){
	 if(temp%5 ==0){
 	   if(temp > 0)
  	     result +="</tr>";
	   result += "<tr>";  
	 }
	 result += 	createOnePictureCell(arr[temp].trim());
 }
 if(temp > 0){
	var i = temp % 5;
	for(var t = 0; t < i;t++)
	  result += "<td></td>";
	result += "</tr>";
 }
 result +="</table>";
 document.getElementById('bilder').innerHTML=result;
}

function createOnePictureCell(mediaId){
  var url= "http://www.unimus.no/photos/search?q="+mediaId+"_*&museum=KHM&f=json";
  var ob = new Object();
  ob.url = url;
  var photos = JSON.parse(postRemote("phpcall.php",ob));
  var entity = drill(photos,"MusitEntities.Entity");
  if(entity =="")
   return "<td></td>";
  var motive = drill(entity[0],"Motif");
  var fotoLink = drill(entity[0],"Photos.Photo.PhotoId");
  var fotograf = drill(entity[0],"Photos.Photo.Photographer");
  var licens = drill(entity[0],"Photos.Photo.CCLicense");
  var subtext ="";
  if(motive !="")
    subtext= "Motiv: "+ motive+"<br>";
  subtext += "<br>Fotograf: "+fotograf+"<br>Lisens: "+licens;
  var res = "<td><a href='http://www.unimus.no/foto/#/search?q="+mediaId+"_*&museum=KHM'><img src='"+fotoLink+"' width='200px'></a>"+subtext+"</td>";
  return res;
  
}

function postRemote(remote_url,formData) {
	return $.ajax({
		type: "POST",
		url: remote_url,
		data:formData,
		async: false
	}).responseText;
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


function drill (p, path) {
    if(isEmpty(p))
      return'';
	 a = path.split(".");
	 for (i in a) {
	   var key = a[i];
	   if (p[key] == null)
		 return '';
	   p = p[key];
	 }
	 return p;
  }

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}
