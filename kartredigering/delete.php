<?php
include "url_link.php"; //url-lenken til solr

$wholeupdate ="";



if (isset($_POST['wholeupdate']) ){
  if(get_magic_quotes_gpc())
    $wholeupdate = stripslashes($_POST['wholeupdate']);
  else  
    $wholeupdate = $_POST['wholeupdate'];
}else return;


 $ch = curl_init();

 $header = array("Content-type:text/xml; charset=utf-8");
 curl_setopt($ch, CURLOPT_URL, $updateURL);
 curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
 curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
 curl_setopt($ch, CURLOPT_POST, 1);
 curl_setopt($ch, CURLOPT_POSTFIELDS, $wholeupdate);
 curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
 curl_setopt($ch, CURLINFO_HEADER_OUT, 1);

 $response = curl_exec($ch);
 echo ($response);
 curl_close($ch);

?>