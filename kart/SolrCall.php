<?php
header("Content-type: text/plain;charset=UTF-8");
$id="";
$action="";
$searchString = $_SERVER["QUERY_STRING"];

//$query = "http://ft-prod01.uio.no:8080/khm/toparkKHM/select/?". $searchString;

$query = "http://itfds-prod02.uio.no:8080/khm/topark/select/?". $searchString;

//http://itfds-prod02.uio.no:8080/khm/topark/select/?

$content = loadURL($query);
echo ($content);

function loadURL($urlToFetch){

	        $ch = curl_init($urlToFetch);
	        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	        $output = curl_exec($ch);
	        curl_close($ch);
	        return $output;

	}

?>