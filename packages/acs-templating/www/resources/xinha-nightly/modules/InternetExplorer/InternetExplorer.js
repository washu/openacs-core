/* This compressed file is part of Xinha. For uncomressed sources, forum, and bug reports, go to xinha.org */
InternetExplorer._pluginInfo={name:"Internet Explorer",origin:"Xinha Core",version:"$LastChangedRevision: 1148 $".replace(/^[^:]*:\s*(.*)\s*\$$/,"$1"),developer:"The Xinha Core Developer Team",developer_url:"$HeadURL: http://svn.xinha.org/trunk/modules/InternetExplorer/InternetExplorer.js $".replace(/^[^:]*:\s*(.*)\s*\$$/,"$1"),sponsor:"",sponsor_url:"",license:"htmlArea"};function InternetExplorer(a){this.editor=a;a.InternetExplorer=this}InternetExplorer.prototype.onKeyPress=function(a){if(this.editor.isShortCut(a)){switch(this.editor.getKey(a).toLowerCase()){case"n":this.editor.execCommand("formatblock",false,"<p>");Xinha._stopEvent(a);return true;break;case"1":case"2":case"3":case"4":case"5":case"6":this.editor.execCommand("formatblock",false,"<h"+this.editor.getKey(a).toLowerCase()+">");Xinha._stopEvent(a);return true;break}}switch(a.keyCode){case 8:case 46:if(this.handleBackspace()){Xinha._stopEvent(a);return true}break}return false};InternetExplorer.prototype.handleBackspace=function(){var e=this.editor;var f=e.getSelection();if(f.type=="Control"){var g=e.activeElement(f);Xinha.removeFromParent(g);return true}var d=e.createRange(f);var c=d.duplicate();c.moveStart("character",-1);var b=c.parentElement();if(b!=d.parentElement()&&(/^a$/i.test(b.tagName))){c.collapse(true);c.moveEnd("character",1);c.pasteHTML("");c.select();return true}};InternetExplorer.prototype.inwardHtml=function(a){a=a.replace(/<(\/?)del(\s|>|\/)/ig,"<$1strike$2");a=a.replace(/(<script|<!--)/i,"&nbsp;$1");a=a.replace(/<span[^>]+id="__InsertSpan_Workaround_[a-z]+".*?>([\s\S]*?)<\/span>/i,"$1");return a};InternetExplorer.prototype.outwardHtml=function(a){a=a.replace(/&nbsp;(\s*)(<script|<!--)/i,"$1$2");a=a.replace(/<span[^>]+id="__InsertSpan_Workaround_[a-z]+".*?>([\s\S]*?)<\/span>/i,"$1");return a};InternetExplorer.prototype.onExecCommand=function(f,d,c){switch(f){case"saveas":var o=null;var l=this.editor;var h=document.createElement("iframe");h.src="about:blank";h.style.display="none";document.body.appendChild(h);try{if(h.contentDocument){o=h.contentDocument}else{o=h.contentWindow.document}}catch(n){}o.open("text/html","replace");var k="";if(l.config.browserQuirksMode===false){var e='<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">'}else{if(l.config.browserQuirksMode===true){var e=""}else{var e=Xinha.getDoctype(document)}}if(!l.config.fullPage){k+=e+"\n";k+="<html>\n";k+="<head>\n";k+='<meta http-equiv="Content-Type" content="text/html; charset='+l.config.charSet+'">\n';if(typeof l.config.baseHref!="undefined"&&l.config.baseHref!==null){k+='<base href="'+l.config.baseHref+'"/>\n'}if(typeof l.config.pageStyleSheets!=="undefined"){for(var j=0;j<l.config.pageStyleSheets.length;j++){if(l.config.pageStyleSheets[j].length>0){k+='<link rel="stylesheet" type="text/css" href="'+l.config.pageStyleSheets[j]+'">'}}}if(l.config.pageStyle){k+='<style type="text/css">\n'+l.config.pageStyle+"\n</style>"}k+="</head>\n";k+="<body>\n";k+=l.getEditorContent();k+="</body>\n";k+="</html>"}else{k=l.getEditorContent();if(k.match(Xinha.RE_doctype)){l.setDoctype(RegExp.$1)}}o.write(k);o.close();o.execCommand(f,d,c);document.body.removeChild(h);return true;break;case"removeformat":var l=this.editor;var b=l.getSelection();var p=l.saveSelection(b);var j,a,g;function m(q){if(q.nodeType!=1){return}q.removeAttribute("style");for(var i=0;i<q.childNodes.length;i++){m(q.childNodes[i])}if((q.tagName.toLowerCase()=="span"&&!q.attributes.length)||q.tagName.toLowerCase()=="font"){q.outerHTML=q.innerHTML}}if(l.selectionEmpty(b)){g=l._doc.body.childNodes;for(j=0;j<g.length;j++){a=g[j];if(a.nodeType!=1){continue}if(a.tagName.toLowerCase()=="span"){newNode=l.convertNode(a,"div");a.parentNode.replaceChild(newNode,a);a=newNode}m(a)}}l._doc.execCommand(f,d,c);l.restoreSelection(p);return true;break}return false};Xinha.prototype.insertNodeAtSelection=function(a){this.insertHTML(a.outerHTML)};Xinha.prototype.getParentElement=function(d){if(typeof d=="undefined"){d=this.getSelection()}var a=this.createRange(d);switch(d.type){case"Text":var c=a.parentElement();while(true){var b=a.duplicate();b.moveToElementText(c);if(b.inRange(a)){break}if((c.nodeType!=1)||(c.tagName.toLowerCase()=="body")){break}c=c.parentElement}return c;case"None":return a.parentElement();case"Control":return a.item(0);default:return this._doc.body}};Xinha.prototype.activeElement=function(c){if((c===null)||this.selectionEmpty(c)){return null}if(c.type.toLowerCase()=="control"){return c.createRange().item(0)}else{var b=c.createRange();var a=this.getParentElement(c);if(a.innerHTML==b.htmlText){return a}return null}};Xinha.prototype.selectionEmpty=function(a){if(!a){return true}return this.createRange(a).htmlText===""};Xinha.prototype.saveSelection=function(){return this.createRange(this.getSelection())};Xinha.prototype.restoreSelection=function(k){if(!k){return}var b=this.createRange(this.getSelection());var f=function(m){for(var e=m;e;e=e.parentNode){if(e.tagName.toLowerCase()=="html"){return e.parentNode}}return null};if(f(k.parentElement())==f(b.parentElement())){if((0==b.compareEndPoints("StartToStart",k))&&(0==b.compareEndPoints("EndToEnd",k))){return}}try{k.select()}catch(c){}b=this.createRange(this.getSelection());if(b.parentElement()!=k.parentElement()){var d=this.config.selectWorkaround||"VisibleCue";switch(d){case"SimulateClick":case"InsertSpan":var g=f(k.parentElement());var i=function(o){var n="";for(var m=0;m<26;++m){n+=String.fromCharCode("a".charCodeAt(0)+m)}var e="";for(var m=0;m<o;++m){e+=n.substr(Math.floor(Math.random()*n.length+1),1)}return e};var l=1;var j="__InsertSpan_Workaround_"+i(l);while(g.getElementById(j)){l+=1;j="__InsertSpan_Workaround_"+i(l)}k.pasteHTML('<span id="'+j+'"></span>');var h=g.getElementById(j);k.moveToElementText(h);k.select();break;case"JustificationHack":var a=String.fromCharCode(1);k.pasteHTML(a);k.findText(a,-1);k.select();k.execCommand("JustifyNone");k.pasteHTML("");break;case"VisibleCue":default:var a=String.fromCharCode(1);k.pasteHTML(a);k.findText(a,-1);k.select()}}};Xinha.prototype.selectNodeContents=function(d,e){this.focusEditor();this.forceRedraw();var a;var f=typeof e=="undefined"?true:false;if(f&&d.tagName&&d.tagName.toLowerCase().match(/table|img|input|select|textarea/)){a=this._doc.body.createControlRange();a.add(d)}else{a=this._doc.body.createTextRange();if(3==d.nodeType){if(d.parentNode){a.moveToElementText(d.parentNode)}else{a.moveToElementText(this._doc.body)}var g=this._doc.body.createTextRange();var b=0;var c=d.previousSibling;for(;c&&(1!=c.nodeType);c=c.previousSibling){if(3==c.nodeType){b+=c.nodeValue.length-c.nodeValue.split("\r").length-1}}if(c&&(1==c.nodeType)){g.moveToElementText(c);a.setEndPoint("StartToEnd",g)}if(b){a.moveStart("character",b)}b=0;c=d.nextSibling;for(;c&&(1!=c.nodeType);c=c.nextSibling){if(3==c.nodeType){b+=c.nodeValue.length-c.nodeValue.split("\r").length-1;if(!c.nextSibling){b+=1}}}if(c&&(1==c.nodeType)){g.moveToElementText(c);a.setEndPoint("EndToStart",g)}if(b){a.moveEnd("character",-b)}if(!d.nextSibling){a.moveEnd("character",-1)}}else{a.moveToElementText(d)}}if(typeof e!="undefined"){a.collapse(e);if(!e){a.moveStart("character",-1);a.moveEnd("character",-1)}}a.select()};Xinha.prototype.insertHTML=function(b){this.focusEditor();var c=this.getSelection();var a=this.createRange(c);a.pasteHTML(b)};Xinha.prototype.getSelectedHTML=function(){var b=this.getSelection();if(this.selectionEmpty(b)){return""}var a=this.createRange(b);if(a.htmlText){return a.htmlText}else{if(a.length>=1){return a.item(0).outerHTML}}return""};Xinha.prototype.getSelection=function(){return this._doc.selection};Xinha.prototype.createRange=function(a){if(!a){a=this.getSelection()}return a.createRange()};Xinha.prototype.isKeyEvent=function(a){return a.type=="keydown"};Xinha.prototype.getKey=function(a){return String.fromCharCode(a.keyCode)};Xinha.getOuterHTML=function(a){return a.outerHTML};Xinha.cc=String.fromCharCode(8201);Xinha.prototype.setCC=function(h){var d=Xinha.cc;if(h=="textarea"){var f=this._textArea;var j=document.selection.createRange();j.collapse();j.text=d;var g=f.value.indexOf(d);var k=f.value.substring(0,g);var b=f.value.substring(g+d.length,f.value.length);if(b.match(/^[^<]*>/)){var i=b.indexOf(">")+1;f.value=k+b.substring(0,i)+d+b.substring(i,b.length)}else{f.value=k+d+b}f.value=f.value.replace(new RegExp("(&[^"+d+"]*?)("+d+")([^"+d+"]*?;)"),"$1$3$2");f.value=f.value.replace(new RegExp("(<script[^>]*>[^"+d+"]*?)("+d+")([^"+d+"]*?<\/script>)"),"$1$3$2");f.value=f.value.replace(new RegExp("^([^"+d+"]*)("+d+")([^"+d+"]*<body[^>]*>)(.*?)"),"$1$3$2$4")}else{var c=this.getSelection();var a=c.createRange();if(c.type=="Control"){var e=a.item(0);e.outerHTML+=d}else{a.collapse();a.text=d}}};Xinha.prototype.findCC=function(b){var a=(b=="textarea")?this._textArea:this._doc.body;range=a.createTextRange();if(range.findText(escape(Xinha.cc))){range.select();range.text="";range.select()}if(range.findText(Xinha.cc)){range.select();range.text="";range.select()}if(b=="textarea"){this._textArea.focus()}};Xinha.getDoctype=function(a){return(a.compatMode=="CSS1Compat"&&Xinha.ie_version<8)?'<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">':""};