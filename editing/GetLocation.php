<?php
    include"/w3/web_topark/url_link.php";

    $stedid = "";

    if (isset($_GET['stedid']) && strlen($_GET['stedid']) >0)
	{
		$stedid = $_GET['stedid'];
	}

    $conn = OCILogon($catalogue_user, $catalogue_user_passw, $connect_string,"UTF8");

   $query = "select topark_geo.* from topark_geo where topark_geo.stedid=".$stedid;
   $stid = oci_parse($conn, $query);
   $r = oci_execute($stid, OCI_DEFAULT);
   $row = oci_fetch_array($stid, OCI_ASSOC+OCI_RETURN_LOBS);
   $json="";
   if(!$row){
     $arr = array('ost' =>'','nord'=>'');
     $json = json_encode($arr);
   }
   else{
     $arr = array('ost' =>$row['OST'],'nord'=>$row['NORD']);
     $json = json_encode($arr);
   }
   echo($json);   
?>