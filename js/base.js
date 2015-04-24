//************************************************
// 初期化
//************************************************
function init(){
	_canvas = document.getElementById("canvas");
	_stage = new createjs.Stage(_canvas);
	//_stage.autoClear = false;
	createjs.Touch.enable(_stage);
	createjs.Ticker.setFPS(_setting['fps']);
	createjs.Ticker.addEventListener("tick", tick);
	_stage.enableMouseOver(10);
	_stage.mouseMoveOutside = true; // keep tracking the mouse even when it leaves the canvas

	_stage.addEventListener("stagemousedown", TouchStage);
}

//************************************************
// ajax通信
//************************************************
function service(service, element, callbackfunc){
	xmlhttp = createXMLHttpRequest();
	if(typeof callbackfunc != 'function') callbackfunc = defaultcallbackfunc;
	if(xmlhttp){
		xmlhttp.onreadystatechange = xmlhttpcallback;
		xmlhttp.open('POST', 'http://ancte0721.secret.jp/pluto/service/'+service);
		xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xmlhttp.send(element);
	}else{
		console.log("XMLHttpRequestError");
	}
	
	// コールバック
	function xmlhttpcallback(){
		if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
			//console.log(xmlhttp.responseText);
			
			var xotree = new XML.ObjTree();
			callbackfunc(xotree.parseDOM(xmlhttp.responseXML.documentElement));
		}
	}
	
	// デフォルトコールバック
	function defaultcallbackfunc(json){
		console.log(json);
	}
	// XMLHttpRequest
	function createXMLHttpRequest(){
		//Win ie用
		if(window.ActiveXObject){
			try {
				//MSXML2以降用
				return new ActiveXObject("Msxml2.XMLHTTP");
			} catch (e) {
				try {
					//旧MSXML用
					return new ActiveXObject("Microsoft.XMLHTTP");
				} catch (e2) {
					return null;
				}
			}
		} else if(window.XMLHttpRequest){
			//Win ie以外のXMLHttpRequestオブジェクト実装ブラウザ用
			return new XMLHttpRequest();
		} else {
			return null;
		}
	}
}



//************************************************
// 再描画
//************************************************
function tick(event) {
	if (update) {
		update = false;
		
		// フィードバック
		feedback();
		
		_stage.clear();
		_stage.update(event);
	}
}

//************************************************
// tagオブジェクト
//************************************************
function tagObj(item){
	this.type = "tag";
	this.item = item;
	this.color = '';
	this.owner = -1;
	this.visible = -1;
	this.validity = -1;
	this.validity_ja = '';
	this.text = "";
	this.imgURL = "";
	this.listener = [];
	this.relation = [];
	for (var i = 0; i < _user['typenum']; i++) {
		this.relation[i] = [];
	}
	this.shape = [];
}


//************************************************
// shapeオブジェクト
//************************************************
function shapeObj(item){
	this.type = "shape";
	this.item = item;
}

//************************************************
// tag間に関係があるか
// return : 関係があったらtrue
//************************************************
function checkRelation(id1, id2){
	for(var j in tag[id1].relation){
		for(var i in tag[id1].relation[j]){
			if(tag[id1].relation[j][i] == id2) return true;
		}
	}
	return false;
}

//************************************************
// tag1がtag2に対し被関係があるか
// return : 被関係があったらtrue
//************************************************
function checkRelationFrom(id1, id2){
	return checkRelation(id2, id1);
}

//************************************************
// tag間の関係　被関係 or 関係なしは返り値-1
// return : RelationType
//************************************************
function getRelationType(id1, id2){
	for(var j in tag[id1].relation){
		for(var i in tag[id1].relation[j]){
			if(tag[id1].relation[j][i] == id2) return j;
		}
	}
	return -1;
}

//************************************************
// 片関係か
// return : T or F
//************************************************
function isArrowRelation(type){
		for(var i in _setting['arrowType'])
			if(_setting['arrowType'][i] == type) return true;
	return false;
}
//************************************************
// tagからtagに線を引く
//************************************************
function drawLine(id1, id2, type){

	if((typeof tag[id1].shape[id2] !== 'undefined')) _stage.removeChild(tag[id1].shape[id2]);
	if(tag[id1].visible == 0 || tag[id2].visible == 0) return;
	tag[id1].shape[id2] = new createjs.Shape();
	tag[id1].shape[id2].graphics
		.setStrokeStyle(3)
		.beginStroke(_setting['border_color'][type])
		.moveTo(tag[id1].item.x, tag[id1].item.y)
		.lineTo(tag[id2].item.x, tag[id2].item.y)
		.endStroke();
	_stage.addChildAt(tag[id1].shape[id2], 0);
	
		
	if(isArrowRelation(type)){
		var arrows = ['arrow-x', 'arrow-y'];
		var rads = [0.3, -0.3];
		for(var i in arrows){
			var s = arrows[i];
			var r = rads[i];
		
		
			var rad = Math.atan2(tag[id2].item.y - tag[id1].item.y, tag[id2].item.x - tag[id1].item.x);
			var x = -50*(Math.cos(rad + r));
			var y = -50*(Math.sin(rad + r));
			
			if((typeof tag[id1].shape[id2+s] !== 'undefined')) _stage.removeChild(tag[id1].shape[id2+s]);
			tag[id1].shape[id2+s] = new createjs.Shape();
			tag[id1].shape[id2+s].graphics
				.setStrokeStyle(3)
				.beginStroke(_setting['border_color'][type])
				.moveTo(tag[id2].item.x, tag[id2].item.y)
				.lineTo(tag[id2].item.x + x, tag[id2].item.y + y)
				.endStroke();
			_stage.addChildAt(tag[id1].shape[id2+s], 0);
		}
	}
	
	update = true;
}

//************************************************
// 線の再描画
//************************************************
function drawLineAgain(id){
	if(id < 0) return;
	for(var j in tag[id].relation){
		for(var i in tag[id].relation[j]){
			drawLine(id, tag[id].relation[j][i], j);
		}
	}
}

//************************************************
// 座標の最適化
//************************************************
function positionOptimization_tag(tagID){
	// TODO
	/*
	$.fancybox.close();
	if(tag[tagID].relation.length < 2) return;
	var num=0,x=0,y=0;
	// tagの座標の平均を取る
	for(var i in tag[tagID].relation){
		x += tag[tag[tagID].relation[i]].item.x;
		y += tag[tag[tagID].relation[i]].item.y;
		num++;
	}
	tag[tagID].item.x = x/num;
	tag[tagID].item.y = y/num;
	console.log("// 最適化 " + x/num + "," + y/num);
	drawLineAgain(tagID);
	*/
}

//************************************************
// ポップアップ
//************************************************
function openPOP(tagID){
	if(tagID < 0) return;
	if(tagID > 1000) return;


	//tmpID = tagID;

		$.fancybox.open({
			content : "\
<p class='css_btn_class' onclick='Listener_tag_active("+tagID+");'>選択</p>\
<p class='css_btn_class' onclick='openWiki("+tagID+");'>補足説明</p>\
<p class='css_btn_class' onclick='positionOptimization_tag("+tagID+");'>整列</p>\
<p class='css_btn_class' onclick='getTagStatus("+tagID+");'>リンク情報</p>\
<p class='css_btn_class' onclick='editTag("+tagID+");'>編集</p>\
<p class='css_btn_class' onclick='deleteTag("+tagID+");'>削除</p>\
\
								",
			autoSize : false,
			width : 320,
			height : 500,
			helpers : {
				overlay : {
					css : {
						'background' : 'rgba(238,238,238,0.85)'
					}
				}
			}
		});
}

//************************************************
// tagの追加
//************************************************
function addNewTag(){

		$.fancybox.open({
			content : "\
<div style='text-align: center;'>\
名前：<input type='text' id='newtag_name' size='20'><br>\
説明：<input type='text' id='newtag_comment' size='20'><br>\
画像url：<input type='text' id='newtag_url' size='20'><br>\
状態：<!--<input type='text' id='newtag_color' size='20' value='#000000'><br>-->\
<select id='newtag_color'>\
<option value='#000000'>議論中</option>\
<option value='#009900'>議論済</option>\
<option value='#000099'>終端</option>\
</select><br>\
<!--公開範囲：\
<select id='newtag_validity'>\
<option value='1'>公開</option>\
<option value='0'>非公開</option>\
</select>-->\
<p class='css_btn_class' onclick='sendNewTag(1);'>パブリックに追加</p>\
<p class='css_btn_class' onclick='sendNewTag(0);'>プライベートに追加</p>\
</div>\
								",
			autoSize : false,
			width : 320,
			height : 500,
			helpers : {
				overlay : {
					css : {
						'background' : 'rgba(238,238,238,0.85)'
					}
				}
			}
		});
}

function sendNewTag(newtag_validity){
	$.fancybox.close();
	
	if(document.getElementById('newtag_name').value == '' || document.getElementById('newtag_color').value == '') return;
	
	var element = 'system=pluto&userid=' + _user['id'];
	
	element += '&newtag_name=' + document.getElementById('newtag_name').value;
	element += '&newtag_color=' + document.getElementById('newtag_color').value;
	//element += '&newtag_validity=' + document.getElementById('newtag_validity').value;
	element += '&newtag_validity=' + newtag_validity;
	if(document.getElementById('newtag_comment').value != '') element += '&newtag_comment=' + document.getElementById('newtag_comment').value;
	if(document.getElementById('newtag_url').value != '') element += '&newtag_url=' + document.getElementById('newtag_url').value;

	console.log(element);

	// ajax送信
	service('addNewTag.php', element, addNewTagCallBack);
	
	function addNewTagCallBack(json){
		console.log(json);
		getTagData();
	}
}

//************************************************
// tagの編集
//************************************************
function editTag(tagID){

		$.fancybox.open({
			content : "\
<div style='text-align: center;'>\
<input type='hidden' id='edittag_id' value="+tagID+">\
名前："+tag[tagID].item.text+"<br>\
説明：<input type='text' id='edittag_comment' size='20' value='"+tag[tagID].text+"'><br>\
画像url：<input type='text' id='edittag_url' size='20' value='"+((tag[tagID].imgURL==null)?'':tag[tagID].imgURL)+"'><br>\
状態：<!--<input type='text' id='edittag_color' size='20' value='"+tag[tagID].color+"'>-->\
<select id='edittag_color'>\
<option value='#000000' "+((tag[tagID].color=='#000000')?'selected':'')+">議論中</option>\
<option value='#009900' "+((tag[tagID].color=='#009900')?'selected':'')+">議論済</option>\
<option value='#000099' "+((tag[tagID].color=='#000099')?'selected':'')+">終端</option>\
</select><br>\
公開範囲："+((tag[tagID].validity==1)?'公開':'非公開')+"\
<p class='css_btn_class' onclick='sendeditTag();'>変更</p>\
</div>\
								",
			autoSize : false,
			width : 320,
			height : 500,
			helpers : {
				overlay : {
					css : {
						'background' : 'rgba(238,238,238,0.85)'
					}
				}
			}
		});
}

function sendeditTag(){
	$.fancybox.close();
	
	if(document.getElementById('edittag_id').value == '') return;
	
	var element = 'system=pluto&userid=' + _user['id'];
	
	//element += '&edittag_name=' + document.getElementById('edittag_name').value;
	element += '&edittag_id=' + document.getElementById('edittag_id').value;
	element += '&edittag_color=' + document.getElementById('edittag_color').value;
	//element += '&edittag_validity=' + document.getElementById('edittag_validity').value;
	if(document.getElementById('edittag_comment').value != '' && document.getElementById('edittag_comment').value != '説明文なし') element += '&edittag_comment=' + document.getElementById('edittag_comment').value;
	if(document.getElementById('edittag_url').value != '' && document.getElementById('edittag_url').value != 'null') element += '&edittag_url=' + document.getElementById('edittag_url').value;

	console.log(element);

	// ajax送信
	service('editTag.php', element, editTagCallBack);
	
	function editTagCallBack(json){
		console.log(json);
		getTagData();
	}
}

//************************************************
// tagの削除
//************************************************
function deleteTag(tagID){
	$.fancybox.close();
	
	if(tagID < 0) return;
	
	var element = 'system=pluto&userid=' + _user['id'];
	element += '&deletetag_id=' + tagID;

	console.log(element);

	// ajax送信
	service('deleteTag.php', element, deleteTagCallBack);
	
	function deleteTagCallBack(json){
		console.log(json);
		getTagData();
	}
}

//************************************************
// wiki
//************************************************
function openWiki(tagID){
	if(tagID < 0) return;
	if(tagID > 1000) return;


	if(tag[tagID].imgURL)
		$.fancybox.open({
			href : tag[tagID].imgURL,
			title : tag[tagID].text,
			//autoSize : false,
			//autoResize  : false,
			//fitToView   : false,
			//minWidth  : 400,
			//maxWidth  : 400,
			//maxHeight  : 400,
			//width : 400,
			//height : 500,
			helpers : {
				title : {
					type : 'inside'
				},
				overlay : {
					css : {
						'background' : 'rgba(238,238,238,0.85)'
					}
				}
			}
		});
		
	else
		$.fancybox.open({
			
			content : tag[tagID].text,
			autoSize : false,
			width : 400,
			height : 400,
			helpers : {
				overlay : {
					css : {
						'background' : 'rgba(238,238,238,0.85)'
					}
				}
			}
		});
}

//************************************************
// 最近傍のノード
// return : ノードオブジェクト
//************************************************
function getNearNode(x, y){
	var tmp = 10000;
	var tmpID = -1;
	
	for(var i in tag){
		if(tag[i].visible == 0) continue;
		if(tmp > (Math.sqrt(Math.pow((x-tag[i].item.x),2) + Math.pow((y-tag[i].item.y),2)))){
			tmp = (Math.sqrt(Math.pow((x-tag[i].item.x),2) + Math.pow((y-tag[i].item.y),2)));
			tmpID = i;
		}
	}
	
	if(tmp > _setting['getNearNodeDistance']) return null;
	return tag[tmpID];
}

//************************************************
// statusデータ送信
//************************************************
function sendTagData(id1,id2, type){
	var ids1 = '';
	var ids2 = '';
	var element = 'system=pluto';
	
	for(var i in tag[id1].relation[type]) ids1 += tag[id1].relation[type][i] + ',';
	for(var i in tag[id2].relation[type]) ids2 += tag[id2].relation[type][i] + ',';
	ids1 = ids1.slice(0, -1);
	ids2 = ids2.slice(0, -1);
	
	//console.log('tag:'+id1+',ids:'+ids1+'###tag:'+id2+',ids:'+ids2);
	
	
	if(isArrowRelation(type)){
		element += '&userid=' + _user['id'] + '&tagid1=' + id1 + '&type=' + type;
		if(ids1 != '') element += '&relationids1=' + ids1;
	}else{
		element += '&userid=' + _user['id'] + '&tagid1=' + id1 + '&tagid2=' + id2 + '&type=' + type;
		if(ids1 != '') element += '&relationids1=' + ids1;
		if(ids2 != '') element += '&relationids2=' + ids2;
	}
	
	//console.log(element);
	
	// ajax送信
	service('send.php', element);
}

//************************************************
// statusデータ受信
//************************************************
function getTagStatus(tagid){
	var element = 'system=pluto';
	
	element += '&userid=' + _user['id'] + '&tagid=' + tagid + '&usernum=' + _user['num'];
	
	// ajax送信
	service('getTagStatus.php', element, getTagStatusCallBack);
	
	
	// コールバック
	function getTagStatusCallBack(json){
		
		console.log(json)
		
		var user = json.result.user;
		var text = '';
		for(i=0;i<user.length;i++){
			if(i == _user['id']) text += '自分:'+user[i].id + '<br>\n';
			else text += 'user'+i+':'+user[i].id + '<br>\n';
		}
		
		$.fancybox.open({
			content : "<div style='text-align: center;'>" + text + "</div>",
			autoSize : false,
			width : 320,
			height : 500,
			helpers : {
				overlay : {
					css : {
						'background' : 'rgba(238,238,238,0.85)'
					}
				}
			}
		});
	}
}

//************************************************
// tagデータ受信
//************************************************
function getTagData(){
	// 選択中なら中止
	if(tmpID!=-1) return;

	// ajax送信
	service('getTagData.php', 'userid='+_user['id'], getTagData_callback);
	
	function getTagData_callback(json){
		
		// メッセージの追加
		if(message.length){
			if(message[message.length-1].messageid != json.result.message.messageid) message.push(json.result.message);
		}else message.push(json.result.message);
		
		console.log(message);
		console.log(json.result.tag);
		
		// canvas上のタグ更新
		placeTag(json.result.tag);
		
		// フィードバック
		//feedback();
	}
}

//************************************************
// tagのcanvas配置
//************************************************
function placeTag(data){
var j=0;
	for(i=0;i<data.length;i++){
		if(typeof tag[i] === 'undefined'){
			tag[i] = new tagObj(new createjs.Text(data[i]['name'], '30px Arial', data[i]['color']));
			tag[i].color = data[i]['color'];
			tag[i].owner = data[i]['owner'];
			tag[i].validity = data[i]['validity'];
			tag[i].item.id = i;
			tag[i].item.x = 100+ (Math.floor(j/12)*200)%600;
			tag[i].item.y = (j*50) % 600 + 50;
			tag[i].item.regX = tag[i].item.getMeasuredWidth()/2;
			tag[i].item.regY = tag[i].item.getMeasuredHeight()/2;
			if(data[i]['url'] != '') tag[i].imgURL = data[i]['url'];
			else tag[i].imgURL = null;
			if(data[i]['comment'] != '') tag[i].text = data[i]['comment'];
			else tag[i].text = '説明文なし';
			j++;
		}else{
			tag[i].color = data[i]['color'];
			tag[i].owner = data[i]['owner'];
			tag[i].validity = data[i]['validity'];
			if(data[i]['url'] != '') tag[i].imgURL = data[i]['url'];
			else tag[i].imgURL = null;
			if(data[i]['comment'] != '') tag[i].text = data[i]['comment'];
			else tag[i].text = '説明文なし';
			tag[i].item.color = data[i]['color'];
			
		}
		_stage.removeChild(tag[i].item);
		tag[i].visible = 0;
		
		// パブリックならaddChild + visible=1
		if(data[i]['validity'] == 1){
			_stage.addChild(tag[i].item);
			tag[i].visible = 1;
			
			
		// プライベートなら色を強制してaddChild + visible=1
		}else if(data[i]['validity'] == 0 && data[i]['owner'] == _user['id']){
			_stage.addChild(tag[i].item);
			tag[i].visible = 1;
			tag[i].item.color = '#FF8C00';
			tag[i].color = '#FF8C00';
		}
		
		// 線の再描画
		drawLineAgain(i);
	}
	setCanvasStatus("normal");
	update = true;
}

//************************************************
// ユーザへのフィードバック
//************************************************
function feedback(){
	var item;
	
	if(message.length) item = message[message.length-1];

	if(item){
		// メッセージdivの書き換え
		//document.getElementById("systemmessage").innerText = item.text;
				
		switch(item.messagetype){
			// 話題の提案
			case 'topic':
				if((typeof feedbackmark !== 'undefined')) _stage.removeChild(feedbackmark);
				feedbackmark = new createjs.Shape();
				feedbackmark.graphics.setStrokeStyle(3).beginStroke("#FF0000").drawCircle(0,0,30).endFill();
				feedbackmark.x = tag[item.tagid].item.x;
				feedbackmark.y = tag[item.tagid].item.y;
				_stage.addChild(feedbackmark);
				break;
				
			// デフォルト
			default:
				if((typeof feedbackmark !== 'undefined')) _stage.removeChild(feedbackmark);
					break;
		}
	}
}