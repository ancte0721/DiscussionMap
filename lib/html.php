<?php
//************************************************
// ヘッダー
//************************************************
function html_header(){
echo <<<HTML
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no">
		<title>System</title>
		<link rel="stylesheet" type="text/css" href="./js/default.css">
		<script type='text/javascript' src="./js/lib/jquery-2.0.2.min.js"></script>
		<script type="text/javascript" src="./js/lib/easeljs-0.6.1.min.js"></script>
		<script type="text/javascript" src="./js/lib/ObjTree.js"></script>
		<script type="text/javascript" src="./js/base.js"></script>
		<script type="text/javascript" src="./js/Listener.js"></script>
		<script type="text/javascript" src="./js/lib/lightbox/jquery.fancybox.pack.js"></script>
		<link rel="stylesheet" type="text/css" href="./js/lib/lightbox/jquery.fancybox.css" media="screen" />
HTML;
}

//************************************************
// ボディー
//************************************************
function html_body(){
echo <<<HTML
	</head>
	<body>
	<div class="header">
    <div class="window"></div>
	  <div class="simple-modal-title"></div>
	</div>
HTML;
}

//************************************************
// フッター
//************************************************
function html_footer(){
echo <<<HTML
	</body>
</html>
HTML;
}
?>