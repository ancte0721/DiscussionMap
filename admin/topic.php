<?php
	require_once '../lib/base.php';
	$conn = db_setting();

	$sql = $conn->prepare("select * from pluto_tag where owner != -1  order by id desc limit 1");
	$sql->execute();
	$row = $sql->fetch();
	
	$name = $row['name'];
	$id = (int)$row['id'];
	
		$sql = $conn->prepare("update pluto_tag set validity = 1 where id=:id");
		$sql->bindParam(':id',$id, PDO::PARAM_INT);
		$sql->execute();
		
		
		
	$message = "「".$name."」についてはどうでしょうか？？";
	$messagetype = 'topic';
	$sql = $conn->prepare("insert into pluto_message (message, messagetype, tagid) values (:message, :messagetype, :tagid)");
	$sql->bindParam(':message',$message);
	$sql->bindParam(':messagetype',$messagetype);
	$sql->bindParam(':tagid',$id, PDO::PARAM_INT);
	$sql->execute();

	header('Location: ./');
?>