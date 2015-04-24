<?php
	require_once '../lib/base.php';
	$conn = db_setting();

	// Content-Type設定
	header("Content-Type: text/xml");

	
	if($_POST["system"] !== 'pluto') outputSimpleXML('status','error');
	
	$sql = $conn->prepare("select id from pluto_tag order by id desc limit 1");
	$sql->execute();
	$row = $sql->fetch();
	$id = (int)$row['id'];
	$id++;
	$nullobj = null;
	
	if(isset($_POST["userid"]) && isset($_POST["newtag_name"]) && isset($_POST["newtag_color"]) && isset($_POST["newtag_validity"])){
		$sql = $conn->prepare("insert into pluto_tag (id,name,color,comment,url,validity,owner) values (:id,:name,:color,:comment,:url,:validity,:owner)");
		$sql->bindParam(':id',$id, PDO::PARAM_INT);
		$sql->bindParam(':name',$_POST["newtag_name"]);
		$sql->bindParam(':color',$_POST["newtag_color"]);
		$sql->bindParam(':validity',$_POST["newtag_validity"], PDO::PARAM_INT);
		$sql->bindParam(':owner',$_POST["userid"], PDO::PARAM_INT);
		
		if(isset($_POST["newtag_comment"])) $sql->bindParam(':comment',$_POST["newtag_comment"]);
		else $sql->bindParam(':comment',$nullobj, PDO::PARAM_NULL);
		if(isset($_POST["newtag_url"])) $sql->bindParam(':url',$_POST["newtag_url"]);
		else $sql->bindParam(':url',$nullobj, PDO::PARAM_NULL);
		
		if(!($sql->execute())){
			$error = $sql->errorInfo();
			outputSimpleXML('status',$error[2]);
		}
	}else outputSimpleXML('status','error2');

	// 正常終了
	outputSimpleXML('status','ok');
?>
