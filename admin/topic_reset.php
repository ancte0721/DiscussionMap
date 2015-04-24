<?php
	require_once '../lib/base.php';
	$conn = db_setting();
	
	$sql = $conn->prepare("insert into pluto_message (message, messagetype) values ('システムからのメッセージが表示されます', 'text')");
	$sql->execute();

	header('Location: ./');
?>