<?php
include "url_link.php"; //url-lenken til solr

$id = "";
$latitude = "";
$longitude="";
$zoom = "";
$newRecord=false;
$wholeupdate ="";


if (isset($_POST['latitude']) ){
  $latitude = $_POST['latitude'];
}
if (isset($_POST['longitude']) ){
  $longitude = $_POST['longitude'];
}

if (isset($_POST['zoom']) ){
  $zoom = $_POST['zoom'];
}


$arr = array();
foreach ($_POST as $param_name => $param_val) {
  $arr[$param_name] = $param_val;
}

$url ='http://itfds-prod03.uio.no/es/MapNewsUpdate.php/';


echo(loadURL($url,$arr));

function loadURL($urlToFetch,$data){
   $ch = curl_init();
   curl_setopt($ch, CURLOPT_URL, $urlToFetch);
   curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
   curl_setopt($ch, CURLOPT_POSTFIELDS,$data);
   curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
   $output  = curl_exec($ch);
   curl_close($ch);
   return $output;
}


$urlResponse = "polygon.html?latitude=".$latitude."&longitude=".$longitude."&zoom=".$zoom;

header('Location:'.$urlResponse);
?>