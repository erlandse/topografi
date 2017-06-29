<?php
    header("Content-type: application/json;charset=utf-8");
    if (isset($_GET['filename']) && strlen($_GET['filename']) >0)
	{
		$filename = $_GET['filename'];
		$filename = urlencode($filename);
	}

    $url = "http://app.uio.no/khm/topark/resources/".$filename;

    $content = loadURL($url);
    echo($content);
	function loadURL($urlToFetch){
	    // create curl resource
	  
	//       return load($urlToFetch);
	     
	        $ch = curl_init($urlToFetch);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
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