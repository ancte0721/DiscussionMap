<?php
	require_once '../lib/base.php';
	$conn = db_setting();


	$namet = "pluto_tag".date("YmdHis");
	$names = "pluto_status".date("YmdHis");

	//$sql = $conn->prepare("create TABLE '"."pluto_tag".date("YmdHis")."' like pluto_tag");
	$sql = $conn->prepare("create table ".$namet." select * from pluto_tag");
	$sql->execute();

	$sql = $conn->prepare("create table ".$names." select * from pluto_status");
	$sql->execute();




	$sql = $conn->prepare("TRUNCATE TABLE pluto_tag");
	$sql->execute();

	$sql = $conn->prepare("TRUNCATE TABLE pluto_status");
	$sql->execute();

	$sql = $conn->prepare("TRUNCATE TABLE pluto_message");
	$sql->execute();

	$sql = $conn->prepare("insert into pluto_message (message, messagetype) values ('システムからのメッセージが表示されます', 'text')");
	$sql->execute();

	// ヘッダー出力
	//html_header();
	// ボディー出力
	//html_body();
	
	$fp = fopen('/home/users/2/secret.jp-ancte0721/web/pluto/scheme/tag.csv', 'r') or  mydie("file not found");
	$count = 0;
	$nullobj = null;
	while($data = fgetcsv($fp)){
		#csvファイルの列数だけ実行
		if(!$data[0]) break;
		$sql = $conn->prepare("insert into pluto_tag (id,name,color,comment,url) values (:id,:name,:color,:comment,:url)");
		$sql->bindParam(':id',$count, PDO::PARAM_INT);
		$sql->bindParam(':name',$data[0]);
		$sql->bindParam(':color',$data[1]);
		if($data[2]!=null && $data[2]!='') $sql->bindParam(':comment',$data[2]);
		else $sql->bindParam(':comment', $nullobj, PDO::PARAM_NULL);
		
		if($data[3]!=null && $data[3]!='') $sql->bindParam(':url',$data[3]);
		else $sql->bindParam(':url', $nullobj, PDO::PARAM_NULL);
		
		
		if(!($sql->execute())){
			$error = $sql->errorInfo();
			mydie($error[2]);
			//print_r($sql->errorInfo());
		}
		$count++;
	}
	fclose($fp);
	
header('Location: ./');
?>