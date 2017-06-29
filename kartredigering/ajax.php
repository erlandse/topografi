<?php 
//include 'SolrClass.php';
//header("Content-type: text/xml");
header("Content-type: application/json");

$lowlat = 60;
$highlat=  61;
$lowlng =  10;
$highlng = 10.5;
$layers = "";
$layerConditions = "";
$app= "";
if (isset($_GET['lowlat']) && strlen($_GET['lowlat']) >0)
	{
		$lowlat = $_GET['lowlat'];
	}
if (isset($_GET['highlat']) && strlen($_GET['highlat']) >0)
	{
		$highlat = $_GET['highlat'];
	}
	
if (isset($_GET['lowlng']) && strlen($_GET['lowlng']) >0)
	{
		$lowlng = $_GET['lowlng'];
	}
if (isset($_GET['highlng']) && strlen($_GET['highlng']) >0)
	{
		$highlng = $_GET['highlng'];
	}


$app = $_SERVER['PHP_AUTH_USER'];

/*
if (isset($_GET['layers']) && strlen($_GET['layers']) >0){
		$layers = $_GET['layers'];
		$arr = explode(",",$layers);
		$layerConditions = " AND layer:(";
		for($temp =0; $temp < count($arr);$temp++){
		  if($temp < count($arr)-1)
		    $layerConditions .= $arr[$temp]." OR ";
		  else  
		    $layerConditions .= $arr[$temp].")";
		}
		
}else
	$layerConditions = " AND layer:fhsdkjfhdsfhk";
 */
 
if($lowlng > $highlng){
  $searchString= "latitude:[" . $lowlat . " TO " . $highlat . "] AND( longitude:[" .$lowlng . " TO  180] OR longitude:[-180 TO ". $highlng."])";
}
else
  $searchString= "latitude:[" . $lowlat . " TO " . $highlat . "] AND longitude:[" . $lowlng . " TO " . $highlng ."]";
  $searchString = urlencode($searchString). urlencode( " AND app:".$app);  	
//  $searchString = urlencode($searchString);  	

$query = "http://ft-prod01.uio.no:8080/solr/polygon/select/?q=". $searchString ."&version=2.2&start=0&rows=50&wt=json";
$content = loadURL($query);
echo ($content);

function loadURL($urlToFetch){
	    // create curl resource
	  
	//       return load($urlToFetch);
	     
	        $ch = curl_init($urlToFetch);
	        // set url
	//        curl_setopt($ch, CURLOPT_URL, $urlToFetch);
	
	        //return the transfer as a string
	        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	        
	        // $output contains the output string
	        $output = curl_exec($ch);
	
	        // close curl resource to free up system resources
	        curl_close($ch);      
	        return $output;
	        
	}

?>