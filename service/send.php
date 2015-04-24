<?php
	require_once '../lib/base.php';
	$conn = db_setting();

	// Content-Type設定
	header("Content-Type: text/xml");

	
	if($_POST["system"] !== 'pluto') outputSimpleXML('status','error');

	if(isset($_POST["userid"]) && isset($_POST["tagid1"]) && isset($_POST["type"])){
		$sql = $conn->prepare("insert into pluto_status (userid,tagid,relationids,relationtype) values (:userid,:tagid,:relationids,:type)");
		$sql->bindParam(':userid',$_POST["userid"], PDO::PARAM_INT);
		$sql->bindParam(':tagid',$_POST["tagid1"], PDO::PARAM_INT);
		$sql->bindParam(':type',$_POST["type"], PDO::PARAM_INT);
		if(isset($_POST["relationids1"])) $sql->bindParam(':relationids',$_POST["relationids1"]);
		else{
			// bindParamの第2引数は変数にしないとエラーが出る
			$nullobj = null;
			$sql->bindParam(':relationids', $nullobj, PDO::PARAM_NULL);
		}
		if(!($sql->execute())){
			$error = $sql->errorInfo();
			outputSimpleXML('status',$error[2]);
		}
	}else outputSimpleXML('status','error2');

	if(isset($_POST["userid"]) && isset($_POST["tagid2"]) && isset($_POST["type"])){
		$sql = $conn->prepare("insert into pluto_status (userid,tagid,relationids,relationtype) values (:userid,:tagid,:relationids,:type)");
		$sql->bindParam(':userid',$_POST["userid"], PDO::PARAM_INT);
		$sql->bindParam(':tagid',$_POST["tagid2"], PDO::PARAM_INT);
		$sql->bindParam(':type',$_POST["type"], PDO::PARAM_INT);
		if(isset($_POST["relationids2"])) $sql->bindParam(':relationids',$_POST["relationids2"]);
		else{
			// bindParamの第2引数は変数にしないとエラーが出る
			$nullobj = null;
			$sql->bindParam(':relationids', $nullobj, PDO::PARAM_NULL);
		}
		if(!($sql->execute())){
			$error = $sql->errorInfo();
			outputSimpleXML('status',$error[2]);
		}
	}

	// 正常終了
	outputSimpleXML('status','ok');
?>
