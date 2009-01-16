/* This compressed file is part of Xinha. For uncomressed sources, forum, and bug reports, go to xinha.org */
InsertTable.prototype.show=function(c){if(!this.dialog){this.prepareDialog()}var b=this.editor;var a={caption:"",rows:"2",cols:"4",width:"100",unit:"%",fixed:"",align:"",border:"1",border_style:"dotted",border_color:"#000000",border_collapse:"on",spacing:"",padding:"5"};this.borderColorPicker.setColor("#000000");this.dialog.show(a);this.dialog.onresize()};InsertTable.prototype.apply=function(){var g=this.editor;var l=g._doc;var a=this.dialog.getValues();if(!a.rows||!a.cols){if(!a.rows){this.dialog.getElementById("rows_alert").style.display=""}if(!a.cols){this.dialog.getElementById("columns_alert").style.display=""}return}this.dialog.hide();var n=l.createElement("table");for(var k in a){var m=a[k];if(!m){continue}switch(k){case"width":n.style.width=m+a.unit.value;break;case"align":n.align=m.value;break;case"border":n.style.border=m+"px "+a.border_style.value+" "+a.border_color;break;case"border_collapse":n.style.borderCollapse=(m=="on")?"collapse":"";break;case"spacing":n.cellSpacing=parseInt(m,10);break;case"padding":n.cellPadding=parseInt(m,10);break}}if(a.caption){var o=n.createCaption();o.appendChild(l.createTextNode(a.caption))}var f=0;if(a.fixed){f=Math.floor(100/parseInt(a.cols,10))}var e=l.createElement("tbody");n.appendChild(e);for(var d=0;d<a.rows;++d){var h=l.createElement("tr");e.appendChild(h);for(var c=0;c<a.cols;++c){var b=l.createElement("td");if(f&&d===0){b.style.width=f+"%"}if(a.border){b.style.border=a.border+"px "+a.border_style.value+" "+a.border_color}h.appendChild(b);b.appendChild(l.createTextNode("\u00a0"))}}g.insertNodeAtSelection(n)};