<?php
include "/w3/web_topark/url_link.php"; 

$userId = $_SERVER['REMOTE_USER'];
if(strcmp($userId,"gest")==0)
  return;
if (isset($_POST['id']) ){
  $id = $_POST['id'];
}
if (isset($_POST['data_clob']) ){
  $data_clob = $_POST['data_clob'];
  if (get_magic_quotes_gpc()) 
       $data_clob = stripslashes($data_clob);
}

$solr="";
if (isset($_POST['solr']) ){
  $solr = $_POST['solr'];
  if (get_magic_quotes_gpc()) 
       $solr = stripslashes($solr);
}
$newRecord="";
if (isset($_POST['newRecord']) ){
  $newRecord = $_POST['newRecord'];
}

$app = $_SERVER['PHP_AUTH_USER'];


$conn = OCILogon($catalogue_user, $catalogue_user_passw, $connect_string,"UTF8");
//$conn = oci_connect($catalogue_user, $catalogue_user_passw, $connect_string,"UTF8");

 $ch = curl_init();
//header("Cache-Control: no-cache, must-revalidate");

 $header = array("Content-type:text/xml; charset=utf-8");
 curl_setopt($ch, CURLOPT_URL, $updateURL);
 curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
 curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
 curl_setopt($ch, CURLOPT_POST, 1);
 curl_setopt($ch, CURLOPT_POSTFIELDS, $solr);
 curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
 curl_setopt($ch, CURLINFO_HEADER_OUT, 1);

 $response = curl_exec($ch);
 curl_close($ch);


if(strlen($newRecord)>0){
  $fields = "id,data_clob";
  $values = ":ID,:DATA_CLOB";
  $stid = oci_parse($conn,'INSERT INTO  TOPARK('.$fields.')VALUES('.$values.')');
}else{
    $fields= "ID=:ID,DATA_CLOB=:DATA_CLOB";
    $stid = oci_parse($conn,"update topark set ".$fields. " where ID= :ID");
/*    $fields= "DATA_CLOB";
    $stid = oci_parse($conn,"update topark set ".$fields. " where ID=".$id);*/

}
//echo($data_clob);

oci_bind_by_name($stid, ":ID",$id);
oci_bind_by_name($stid, ":DATA_CLOB",$data_clob);
$res = oci_execute($stid);
oci_commit($conn);
oci_free_statement($stid);
oci_close($conn);
?>
