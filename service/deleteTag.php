<?php
	require_once '../lib/base.php';
	$conn = db_setting();

	// Content-Type設定
	header("Content-Type: text/xml");

	$nullobj = null;
	
	if($_POST["system"] !== 'pluto') outputSimpleXML('status','error');
	
	if(isset($_POST["userid"]) && isset($_POST["deletetag_id"])){
		$sql = $conn->prepare("update pluto_tag set validity=-1 where id=:id");
		$sql->bindParam(':id',$_POST["deletetag_id"], PDO::PARAM_INT);
		
		if(!($sql->execute())){
			$error = $sql->errorInfo();
			outputSimpleXML('status',$error[2]);
		}
	}else outputSimpleXML('status','error2');

	// 正常終了
	outputSimpleXML('status','ok');
?>
