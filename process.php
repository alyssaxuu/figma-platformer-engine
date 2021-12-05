<?php
session_start();
// Generate a random state value. Usage explanation here: https://www.figma.com/developers/docs#oauth2
$_SESSION["state"] = ;
$_SESSION["fileurl"] = $_POST["file"];
echo $_SESSION["state"];
?>