<?php
//************************************************
// DB接続
// return:DBconnectionインスタンス
//************************************************
function db_setting(){
	try {
		$conn = new PDO("mysql:dbname=".DB_NAME.";host=".DB_HOST,DB_ID,DB_PASS,
		array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET CHARACTER SET `utf8`"));
	} catch (PDOException $e) {
		mydie($e->getMessage());
	}
	return $conn;
}

//************************************************
// tag取得
// return:tagデータ
//************************************************
function db_getTag($conn){
	$sql = $conn->prepare("SELECT * FROM pluto_tag order by id");
	$sql->execute();
	
	$data = array();
	while($row = $sql->fetch()) {
		$item = array();
		foreach ($row as $key => $value){
			$item[$key] = escApostrophe($value);
		}
		$data[$row['id']] = $item;
	}
		return $data;
}

//************************************************
// tagのリンク取得
// param:userid, tagid
// return:リンク
//************************************************
function db_getTagStatus($conn, $usernum, $tagid, $type=0){
	
	$data = array();
	
	for($i=0;$i<$usernum;$i++){
		$sql = $conn->prepare("select * from pluto_status where userid = :userid and tagid = :tagid and relationtype = :type order by statusid desc limit 1");
		$sql->bindParam(':userid',$i, PDO::PARAM_INT);
		$sql->bindParam(':tagid',$tagid, PDO::PARAM_INT);
		$sql->bindParam(':type',$type, PDO::PARAM_INT);
		$sql->execute();
		
		if($row = $sql->fetch()){
			$data[$i] = split(",", $row['relationids']);
		}else{
			$data[$i] = null;
		}
	}
		return $data;
}

//************************************************
// message取得
// param:userid
// return:messageデータ
//************************************************
function db_getMessage($conn, $userid){
	$sql = $conn->prepare("SELECT * FROM pluto_message WHERE target = -1 OR target = :userid ORDER BY messageid DESC LIMIT 1");
	$sql->bindParam(':userid', $userid, PDO::PARAM_INT);
	$sql->execute();
	
	$item = array();
	
	if($row = $sql->fetch()) {
		foreach ($row as $key => $value){
			$item[$key] = escApostrophe($value);
		}
	}
	
		return $item;
}

?>