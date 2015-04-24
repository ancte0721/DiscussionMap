//************************************************
// リスナー状態管理
//************************************************
function setCanvasStatus(status){
	clearAllListener();
	switch (status){
		// 通常
		case "normal":
			AddAllListener_tag("touch", Listener_tagpop);
			break;
		
		// tag選択
		case "select_tag":
			AddAllListener_tag("touch", Listener_tag_select);
			break;
	}
}
function clearAllListener(){
	clearAllListener_tag();
}
function clearAllListener_tag(){
	for(var i in tag) tag[i].listener = [];
}

//************************************************
// リスナー登録
//************************************************
function AddAllListener_tag(eventName, func){
	for(var i in tag){
		tag[i].listener[eventName] = func;
	}
}
function AddAllListener(eventName, func){
	AddAllListener_tag(eventName, func);
}

//************************************************
// リスナー解除
//************************************************
function RemoveAllListener(eventName, func){
	RemoveAllListener_tag(eventName, func);
}
function RemoveAllListener_tag(eventName, func){
	for(var i in tag){
		tag[i].listener[eventName] = null;
	}
}

//************************************************
// ポップアップ
//************************************************
function Listener_tagpop(tagID){
	//tag[id].item.color = "#0000ff";
	console.log("Listener_tagpop:" + tagID);
	openPOP(tagID);
	update = true;
}

//************************************************
// 関係選択
//************************************************
function Listener_tag_active(tagID){
	$.fancybox.close();
	setCanvasStatus("select_tag");
	// 自身をクリック時は選択解除
	tag[tagID].listener['touch'] = Listener_tag_unselect;
	
	tmpID = tagID;
	tag[tagID].item.color = _setting['tagColor_selected'];
	update = true;
}

//************************************************
// 関係選択解除
//************************************************
function Listener_tag_unselect(tagID){
	if(tmpID == -1) return;
	
	tag[tagID].item.color = tag[tagID].color;
	
	
	setCanvasStatus("normal");
	
	tmpID = -1;
	
	update = true;
}

//************************************************
// 関係追加
//************************************************
function Listener_tag_select(tagID){
	// 関係があれば関係削除する
	if(checkRelation(tmpID, tagID)){
		console.log("related");
		console.log(getRelationType(tmpID, tagID));
		removeRelation(tmpID, tagID, getRelationType(tmpID, tagID));
		return;
	}
	if(checkRelationFrom(tmpID, tagID)){
		console.log("arrow - related");
		console.log(getRelationType(tagID, tmpID));
		removeRelation(tagID, tmpID, getRelationType(tagID, tmpID));
		return;
	}
$.fancybox.open({
			content : "\
<div style='text-align: center;'>\
<p class='css_btn_class' onclick='setRelation(" + tagID + ", 0)'>同値</p>\
<p class='css_btn_class' onclick='setRelation(" + tagID + ", 1)'>親子</p>\
<p class='css_btn_class' onclick='setRelation(" + tagID + ", 2)'>関係2</p>\
<p class='css_btn_class' onclick='setRelation(" + tagID + ", 3)'>関係3</p>\
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

function setRelation(tagID, type){
	$.fancybox.close();
	if(tmpID == -1) return;
	
	
	
	// 関係を追加
	if(isArrowRelation(type)){
		// 片関係
		tag[tmpID].relation[type].push(tagID);
		console.log(tmpID+":"+tag[tmpID].relation[type]);
		console.log(tagID+":"+tag[tagID].relation[type]);
	}else{
		// 相互関係
		tag[tagID].relation[type].push(tmpID);
		tag[tmpID].relation[type].push(tagID);
	}
	// 線を引く
	drawLine(tmpID, tagID, type);

	
	// ソート
	tag[tagID].relation[type].sort(
		function(a,b){
				if( a < b ) return -1;
				if( a > b ) return 1;
				return 0;
		});
	tag[tmpID].relation[type].sort(
		function(a,b){
				if( a < b ) return -1;
				if( a > b ) return 1;
				return 0;
		});
	
	// tagデータ送信
	sendTagData(tmpID, tagID, type);
	//console.log("relationID:" + relationTmp.relationID);
	//console.log(relation[relationTmp.relationID-1000].relation);
	tag[tmpID].item.color = tag[tmpID].color;
	
	setCanvasStatus("normal");
	
	tmpID = -1;
	update = true;
}


function removeRelation(id1, id2, type){
		console.log("remove relation");
		if(type != -1){
			// TODO
			
			// 関係を削除
			if(isArrowRelation(type)){
				// 片関係
				for(var i in tag[id1].relation[type]){
					if(tag[id1].relation[type][i] == id2) tag[id1].relation[type].splice(i,1);
				}
				// 線を削除
				if((typeof tag[id1].shape[id2] !== 'undefined')) _stage.removeChild(tag[id1].shape[id2]);
				if(isArrowRelation(type)){
					var arrows = ['arrow-x', 'arrow-y'];
					for(var i in arrows){
						var s = arrows[i];
						if((typeof tag[id1].shape[id2+s] !== 'undefined')) _stage.removeChild(tag[id1].shape[id2+s]);
					}
				}
			}else{
				// 相互関係
				for(var i in tag[id1].relation[type]){
					if(tag[id1].relation[type][i] == id2) tag[id1].relation[type].splice(i,1);
				}
				for(var i in tag[id2].relation[type]){
					if(tag[id2].relation[type][i] == id1) tag[id2].relation[type].splice(i,1);
				}
				// 線を削除
				if((typeof tag[id1].shape[id2] !== 'undefined')) _stage.removeChild(tag[id1].shape[id2]);
				if((typeof tag[id2].shape[id1] !== 'undefined')) _stage.removeChild(tag[id2].shape[id1]);
			}
		}
		
		
		
	// tagデータ送信
	sendTagData(id1, id2, type);
	tag[tmpID].item.color = tag[tmpID].color;
	
	setCanvasStatus("normal");
	
	tmpID = -1;
	update = true;
}


//************************************************
// stageクリック時
//************************************************
function TouchStage(evt){
	
	// Touch or Move
	var flag = 0;
	
	// ロングタッチ用カウンタ
	var counter = 0;
	
	// 操作対象
	if(getNearNode(evt.stageX, evt.stageY) == null) return;
	var o = getNearNode(evt.stageX, evt.stageY).item;
	// var offset = {x:o.x-evt.stageX, y:o.y-evt.stageY};
	o.parent.addChild(o);
	update = true;
	
	
	evt.target.addEventListener("stagemousemove", function(ev) {
		if(flag){
			o.x = ev.stageX;
			o.y = ev.stageY;
			// ドラッグ時の関係線の再描画
			for(var tagId in tag){
				drawLineAgain(tagId);
			}
			
			update = true;
		}else flag = 1;
	});
	evt.target.addEventListener("stagemouseup", function(ev) {
		evt.target.removeAllEventListeners("stagemousemove");
		evt.target.removeAllEventListeners("stagemouseup");
		createjs.Ticker.removeEventListener("tick", checkTouch);
	});
	
	createjs.Ticker.addEventListener("tick", checkTouch);
	
	

	function checkTouch(ev) {
		if(!flag) counter++;
		if(counter > _setting['longtouchframenum']){
			if(o.id < 0) return;
				if(typeof tag[o.id].listener['touch'] == 'function') (tag[o.id].listener['touch'])(o.id);
			evt.target.removeAllEventListeners("stagemousemove");
			createjs.Ticker.removeEventListener("tick", checkTouch);
		}
	}
}

