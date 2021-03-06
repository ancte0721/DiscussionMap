<?php
require_once '../config.php';
require_once 'db.php';
require_once 'html.php';

session_start();



//************************************************
// 異常終了
//************************************************
function mydie($comment){
	echo $comment;
	die;
}

//************************************************
// esc処理
//************************************************
function escApostrophe($str){
	$str = str_replace("'", "\'", $str);
	$str = str_replace("\"", "\\\"", $str);
	return $str;
}

//************************************************
// 簡易xml出力
//************************************************
function outputSimpleXML($element, $text){
	// Content-Type設定
	header("Content-Type: text/xml");
	// DOMの作成と初期化
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