<?php
	// TODO relationtype対応
	require_once '../lib/base.php';
	$conn = db_setting();
	
	if($_POST["system"] !== 'pluto') outputSimpleXML('status','error');
	if(!isset($_POST["userid"]) || !isset($_POST["usernum"]) || !isset($_POST["tagid"])) outputSimpleXML('status','error');



	// Content-Type設定
	header("Content-Type: text/xml");

	// DOMの作成と初期化
	$dom = new DOMDocument();
	$dom->encoding = 'UTF-8';
	$dom->formatOutput = true;
	$result = $dom->appendChild($dom->createElement('result'));
	$tagid = $result->appendChild($dom->createElement('tagid'));
	$tagid->appendChild($dom->createCDATASection($_POST["tagid"]));
	
	for($i=0;$i<$_POST["usernum"];$i++){
		$user = $result->appendChild($dom->createElement('user'));
		$userid = $user->appendChild($dom->createElement('userid'));
		$userid->appendChild($dom->createCDATASection($i));
		
		$sql = $conn->prepare("select * from pluto_status where userid = :userid and tagid = :tagid order by statusid desc limit 1");
		$sql->bindParam(':userid',$i, PDO::PARAM_INT);
		$sql->bindParam(':tagid',$_POST["tagid"], PDO::PARAM_INT);
		$sql->execute();
		if($row = $sql->fetch()){
			$id = $user->appendChild($dom->createElement('id'));
			$id->appendChild($dom->createCDATASection($row['relationids']));
		}else{
			$id = $user->appendChild($dom->createElement('id'));
			$id->appendChild($dom->createCDATASection(''));
		}
	}
	// XML出力
	echo $dom->saveXML();
?>
