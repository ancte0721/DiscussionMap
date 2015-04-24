<?php
	require_once '../lib/base.php';
	$conn = db_setting();
	
	$tags = db_getTag($conn);
	$getmessage = db_getMessage($conn, $_POST["userid"]);
	
	// Content-Type設定
	header("Content-Type: text/xml");

	// DOMの作成と初期化
	$dom = new DOMDocument();
	$dom->encoding = 'UTF-8';
	$dom->formatOutput = true;

	// タグの作成
	$result = $dom->appendChild($dom->createElement('result'));
	for ($i = 0 ; $i < count($tags); $i++) {
		$tag = $result->appendChild($dom->createElement('tag'));
		$id = $tag->appendChild($dom->createElement('id'));
		$id->appendChild($dom->createCDATASection($i));
		$name = $tag->appendChild($dom->createElement('name'));
		$name->appendChild($dom->createCDATASection($tags[$i]['name']));
		$color = $tag->appendChild($dom->createElement('color'));
		$color->appendChild($dom->createCDATASection($tags[$i]['color']));
		$validity = $tag->appendChild($dom->createElement('validity'));
		$validity->appendChild($dom->createCDATASection($tags[$i]['validity']));
		$owner = $tag->appendChild($dom->createElement('owner'));
		$owner->appendChild($dom->createCDATASection($tags[$i]['owner']));
		$comment = $tag->appendChild($dom->createElement('comment'));
		$comment->appendChild($dom->createCDATASection($tags[$i]['comment']));
		$url = $tag->appendChild($dom->createElement('url'));
		$url->appendChild($dom->createCDATASection($tags[$i]['url']));
	}

	// メッセージ
	$message = $result->appendChild($dom->createElement('message'));
	
	$messageid = $message->appendChild($dom->createElement('messageid'));
	$messageid->appendChild($dom->createCDATASection($getmessage['messageid']));
	
	$messagetype = $message->appendChild($dom->createElement('messagetype'));
	$messagetype->appendChild($dom->createCDATASection($getmessage['messagetype']));
	
	$tagid = $message->appendChild($dom->createElement('tagid'));
	$tagid->appendChild($dom->createCDATASection($getmessage['tagid']));
	
	$target = $message->appendChild($dom->createElement('target'));
	$target->appendChild($dom->createCDATASection($getmessage['target']));
	
	$text = $message->appendChild($dom->createElement('text'));
	$text->appendChild($dom->createCDATASection($getmessage['message']));

	// XML出力
	echo $dom->saveXML();
?>
