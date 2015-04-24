<?php
require_once '../config.php';
require_once 'db.php';
require_once 'html.php';

session_start();



//************************************************
// �ُ�I��
//************************************************
function mydie($comment){
	echo $comment;
	die;
}

//************************************************
// esc����
//************************************************
function escApostrophe($str){
	$str = str_replace("'", "\'", $str);
	$str = str_replace("\"", "\\\"", $str);
	return $str;
}

//************************************************
// �Ȉ�xml�o��
//************************************************
function outputSimpleXML($element, $text){
	// Content-Type�ݒ�
	header("Content-Type: text/xml");
	// DOM�̍쐬�Ə�����
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