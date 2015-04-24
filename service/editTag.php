<?php
	require_once '../lib/base.php';
	$conn = db_setting();

	// Content-Type設定
	header("Content-Type: text/xml");

	$nullobj = null;
	
	if($_POST["system"] !== 'pluto') outputSimpleXML('status','error');
	
	if(isset($_POST["userid"]) && isset($_POST["edittag_id"]) && isset($_POST["edittag_color"])){
		$sql = $conn->prepare("update pluto_tag set color=:color, comment=:comment, url=:url where id=:id");
		$sql->bindParam(':id',$_POST["edittag_id"], PDO::PARAM_INT);
		$sql->bindParam(':color',$_POST["edittag_color"]);
		
		if(isset($_POST["edittag_comment"])) $sql->bindParam(':comment',$_POST["edittag_comment"]);
		else $sql->bindParam(':comment',$nullobj, PDO::PARAM_NULL);
		if(isset($_POST["edittag_url"])) $sql->bindParam(':url',$_POST["edittag_url"]);
		else $sql->bindParam(':url',$nullobj, PDO::PARAM_NULL);
		
		if(!($sql->execute())){
			$error = $sql->errorInfo();
			outputSimpleXML('status',$error[2]);
		}
	}else outputSimpleXML('status','error2');

	// 正常終了
	outputSimpleXML('status','ok');
?>
