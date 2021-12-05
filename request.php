<?php
session_start();
$filename = $_SESSION["fileurl"];
$_SESSION["done"] = 1;
$code = $_POST["code"];
$state = $_POST["state"];
// Redirect URL
$redirect = "https://alyssax.com/x/platformer/play";
// Client & secret keys
$client = "YOUR_CLIENT_ID";
$secret = "SECRET";

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL,"https://www.figma.com/api/oauth/token");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS,
            "client_id=".$client."&client_secret=".$secret."&redirect_uri=".$redirect."&code=".$code."&grant_type=authorization_code");

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$ok = json_decode(curl_exec($ch));
curl_close ($ch);

$opts = array(
  'http'=>array(
    'method'=>"GET",
    'header'=>"Authorization: Bearer " . $ok->access_token
  )
);
$context = stream_context_create($opts);
$result = file_get_contents( "https://api.figma.com/v1/files/".$filename, false, $context);
$json = json_decode($result, true);

$nodes = $json["document"]["children"][0]["children"];
$imagenodes = [];
$imagetype = [];
$position = new stdClass();
$playerspawn = new stdClass();
foreach($nodes as $node) {
    if ($node["type"] == "COMPONENT") {
        array_push($imagenodes, $node["id"]);
        array_push($imagetype, $node["name"]);
    }
    if ($node["type"] == "FRAME" && strpos($node["name"], "Level") !== false) {
        //array_push($position, (object)$node["name"]=>[]);
        $oi = $node["name"];
        $position->$oi = [];
        $playerspawn->$oi = [];
        foreach($node["children"] as $instance) {
            if ($instance["type"] == "INSTANCE" && $instance["name"] != "Player") {
                array_push($position->$oi, array("name"=>$instance["name"], "x"=>($instance["absoluteBoundingBox"]["x"]-$node["absoluteBoundingBox"]["x"]), "y"=>($instance["absoluteBoundingBox"]["y"]-$node["absoluteBoundingBox"]["y"]), "width"=>$instance["absoluteBoundingBox"]["width"], "height" => $instance["absoluteBoundingBox"]["height"]));
            } else if ($instance["type"] == "INSTANCE" && $instance["name"] == "Player") {
                array_push($playerspawn->$oi, array("x"=>($instance["absoluteBoundingBox"]["x"]-$node["absoluteBoundingBox"]["x"]), "y" => ($instance["absoluteBoundingBox"]["y"]-$node["absoluteBoundingBox"]["y"])));
            }
        }
    }
}

$opts = array(
  'http'=>array(
    'method'=>"GET",
    'header'=>"Authorization: Bearer " . $ok->access_token
  )
);
$context = stream_context_create($opts);
$result = file_get_contents( "https://api.figma.com/v1/images/".$filename."?ids=".implode(",",$imagenodes), false, $context);

$json = json_decode($result, true);
$final = [];
array_push($final, $json["images"], $imagenodes, $position, $playerspawn, $imagetype);
echo json_encode($final, true);
?>