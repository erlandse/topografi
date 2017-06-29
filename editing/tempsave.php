<?php
include "/w3/web_topark/url_link.php"; 

if (isset($_POST['id']) ){
  $id = $_POST['id'];
}
if (isset($_POST['data_clob']) ){
  $data_clob = $_POST['data_clob'];
  if (get_magic_quotes_gpc()) 
       $data_clob = stripslashes($data_clob);
}

//$conn = OCILogon($catalogue_user, $catalogue_user_passw, $connect_string,"UTF8");

$conn = oci_connect($catalogue_user, $catalogue_user_passw, $connect_string,"UTF8");
if(!$conn){
   $e = oci_error();
   print_r($e);
   echo("\n");
}

$fields= "ID=:ID,DATA_CLOB=:DATA_CLOB";
$stid = oci_parse($conn,"update topark set ".$fields. " where ID= :ID");


oci_bind_by_name($stid, ":ID",$id);
oci_bind_by_name($stid, ":DATA_CLOB",$data_clob);

$res = oci_execute($stid);

oci_commit($conn);
oci_free_statement($stid);
oci_close($conn);
?>
