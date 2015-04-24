<?php
	// TODO relationtype�Ή�
	require_once '../lib/base.php';
	$conn = db_setting();
	
	if($_POST["system"] !== 'pluto') outputSimpleXML('status','error');
	if(!isset($_POST["userid"]) || !isset($_POST["usernum"]) || !isset($_POST["tagid"])) outputSimpleXML('status','error');



	// Content-Type�ݒ�
	header("Content-Type: text/xml");

	// DOM�̍쐬�Ə�����
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
	// XML�o��
	echo $dom->saveXML();
?>
