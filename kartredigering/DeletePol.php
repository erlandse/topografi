<?php 

header("Content-type: application/json");
include"url_link.php";

 
 $data = "<delete><id>".$_GET['id']."</id></delete>";
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
 if (curl_errno($ch)) {
 //          echo("curl_error:" . curl_error($ch));
}
 curl_close($ch);

echo("{\"result\":\"OK\"}");

?>