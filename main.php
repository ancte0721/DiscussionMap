<?php
	require_once '/home/users/2/secret.jp-ancte0721/web/pluto/lib/base.php';
	$conn = db_setting();

	// ヘッダー出力
	html_header();
	// ボディー出力
	html_body();


?>
<script type="text/javascript">
$(document).ready( function() {

init();
create();
$(function(){setInterval(getTagData,5000);});

});
</script>
<script type="text/javascript">
var _canvas, _stage;
var update = true;
var tag = [];
var message = [];
var tmpID = -1;
var tmpTYPE = -1;

//////////////////////////////////////////////////
// 各種設定
//////////////////////////////////////////////////
var _setting = [];
_setting['fps'] = 10;
_setting['longtouchframenum'] = 2;
_setting['getNearNodeDistance'] = 100;
_setting['tagColor'] = "#000000";
_setting['tagColor_selected'] = "#ff0000";
_setting['arrowType'] = [1,2,3];

// 線の色

var _border = [
			"#aaa",
			"#f00",
			"#0f0",
			"#00f",
			"#ff0",
			];
_setting['border_color'] = _border;


var _user = [];
_user['id'] = <?php echo isset($_GET["userid"])?$_GET["userid"]:0?>;
_user['num'] = 4;
_user['typenum'] = 5;



function create(){

	setCanvasStatus("normal");
	
	update = true;
}
		</script>
<!--<button onclick='getTagData();' class="btn_css">更新</button>-->
<button onclick='addNewTag();' class="btn_css">Add Node</button>
<button onclick='addNewTag();' class="btn_css">Option</button>
<button onclick='addNewTag();' class="btn_css">Help</button>
<div id="systemmessage">Message from system</div>
<canvas id="canvas" width="580" height="700"></canvas>

<?php
	// フッター出力
	html_footer();
?>