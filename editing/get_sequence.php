<?php
include "/w3/web_topark/url_link.php"; //url-lenken til solr
$conn = OCILogon($catalogue_user, $catalogue_user_passw, $connect_string,"UTF8");
$stid= oci_parse($conn,"Select TOPARK_SEQ.Nextval From Dual"); 
$res  = oci_execute($stid);
$row = oci_fetch_array($stid, OCI_ASSOC);
$id = $row['NEXTVAL'];
echo ($id);
?>
