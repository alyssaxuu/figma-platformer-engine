<?php
session_start();
// Generate a random state value. Usage explanation here: https://www.figma.com/developers/docs#oauth2
$_SESSION["state"] = substr(md5(rand()), 0, 7);
$_SESSION["fileurl"] = $_POST["file"];
echo $_SESSION["state"];
?>