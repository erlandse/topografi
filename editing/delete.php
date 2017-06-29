<?php
require '/w3/web_topark/url_link.php';

/*
$data=""; 
$id="";
if (isset($_POST['data']) ){
  $data = $_POST['data'];
}
if (isset($_POST['id']) ){
  $id = $_POST['id'];
}


 $ch = curl_init();
 $header = array("Content-type:text/xml; charset=utf-8");
 curl_setopt($ch, CURLOPT_URL, $updateURL);
 curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
 curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
 curl_setopt($ch, CURLOPT_POST, 1);
 curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
 curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
 curl_setopt($ch, CURLINFO_HEADER_OUT, 1);

 $response = curl_exec($ch);
 echo($response);
 curl_close($ch);


$conn = OCILogon($catalogue_user, $catalogue_user_passw, $connect_string,"UTF8");
$stid = oci_parse($conn,"delete from topark where id= :id");
oci_bind_by_name($stid, ":id",$id);
$res = oci_execute($stid);
*/

?>
