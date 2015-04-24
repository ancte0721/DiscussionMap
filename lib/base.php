<?php
require_once '../config.php';
require_once 'db.php';
require_once 'html.php';

session_start();



//************************************************
// ˆÙíI—¹
//************************************************
function mydie($comment){
	echo $comment;
	die;
}

//************************************************
// escˆ—
//************************************************
function escApostrophe($str){
	$str = str_replace("'", "\'", $str);
	$str = str_replace("\"", "\\\"", $str);
	return $str;
}

//************************************************
// ŠÈˆÕxmlo—Í
//************************************************
function outputSimpleXML($element, $text){
	// Content-TypeÝ’è
	header("Content-Type: text/xml");
	// DOM‚Ìì¬‚Æ‰Šú‰»
	$dom = new DOMDocument();
	$dom->encoding = 'UTF-8';
	$dom->formatOutput = true;
	$tag = $dom->appendChild($dom->createElement($element));
	$tag->appendChild($dom->createCDATASection($text));
	//$status = $dom->appendChild($dom->createElement('status','text'));
	echo $dom->saveXML();
	die;
}
?>