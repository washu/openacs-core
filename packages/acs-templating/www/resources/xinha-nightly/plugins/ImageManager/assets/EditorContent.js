/* This compressed file is part of Xinha. For uncomressed sources, forum, and bug reports, go to xinha.org */
function MM_findObj(f,e){var c,b,a;if(!e){e=document}if((c=f.indexOf("?"))>0&&parent.frames.length){e=parent.frames[f.substring(c+1)].document;f=f.substring(0,c)}if(!(a=e[f])&&e.all){a=e.all[f]}for(b=0;!a&&b<e.forms.length;b++){a=e.forms[b][f]}for(b=0;!a&&e.layers&&b<e.layers.length;b++){a=MM_findObj(f,e.layers[b].document)}if(!a&&e.getElementById){a=e.getElementById(f)}return a}var pic_x,pic_y;function P7_Snap(){var x,y,ox,bx,oy,p,tx,a,b,k,d,da,e,el,args=P7_Snap.arguments;a=parseInt(a);for(k=0;k<(args.length-3);k+=4){if((g=MM_findObj(args[k]))!=null){el=eval(MM_findObj(args[k+1]));a=parseInt(args[k+2]);b=parseInt(args[k+3]);x=0;y=0;ox=0;oy=0;p="";tx=1;da="document.all['"+args[k]+"']";if(document.getElementById){d="document.getElementsByName('"+args[k]+"')[0]";if(!eval(d)){d="document.getElementById('"+args[k]+"')";if(!eval(d)){d=da}}}else{if(document.all){d=da}}if(document.all||document.getElementById){while(tx==1){p+=".offsetParent";if(eval(d+p)){x+=parseInt(eval(d+p+".offsetLeft"));y+=parseInt(eval(d+p+".offsetTop"))}else{tx=0}}ox=parseInt(g.offsetLeft);oy=parseInt(g.offsetTop);var tw=x+ox+y+oy;if(tw==0||(navigator.appVersion.indexOf("MSIE 4")>-1&&navigator.appVersion.indexOf("Mac")>-1)){ox=0;oy=0;if(g.style.left){x=parseInt(g.style.left);y=parseInt(g.style.top)}else{var w1=parseInt(el.style.width);bx=(a<0)?-5-w1:-10;a=(Math.abs(a)<1000)?0:a;b=(Math.abs(b)<1000)?0:b;if(event==null){x=document.body.scrollLeft+bx}else{x=document.body.scrollLeft+event.clientX+bx}if(event==null){y=document.body.scrollTop}else{y=document.body.scrollTop+event.clientY}}}}else{if(document.layers){x=g.x;y=g.y;var q0=document.layers,dd="";for(var s=0;s<q0.length;s++){dd="document."+q0[s].name;if(eval(dd+".document."+args[k])){x+=eval(dd+".left");y+=eval(dd+".top");break}}}}if(el){e=(document.layers)?el:el.style;var xx=parseInt(x+ox+a),yy=parseInt(y+oy+b);if(navigator.appName=="Netscape"&&parseInt(navigator.appVersion)>4){xx+="px";yy+="px"}if(navigator.appVersion.indexOf("MSIE 5")>-1&&navigator.appVersion.indexOf("Mac")>-1){xx+=parseInt(document.body.leftMargin);yy+=parseInt(document.body.topMargin);xx+="px";yy+="px"}e.left=xx;e.top=yy}pic_x=parseInt(xx);pic_y=parseInt(yy)}}}var ie=document.all;var ns6=document.getElementById&&!document.all;var dragapproved=false;var z,x,y,status,ant,canvas,content,pic_width,pic_height,image,resizeHandle,oa_w,oa_h,oa_x,oa_y,mx2,my2;function init_resize(){if(mode=="scale"){P7_Snap("theImage","ant",0,0);if(canvas==null){canvas=MM_findObj("imgCanvas")}if(pic_width==null||pic_height==null){image=MM_findObj("theImage");pic_width=image.width;pic_height=image.height}if(ant==null){ant=MM_findObj("ant")}ant.style.left=pic_x;ant.style.top=pic_y;ant.style.width=pic_width;ant.style.height=pic_height;ant.style.visibility="visible";drawBoundHandle();jg_doc.paint()}}initEditor=function(){init_crop();init_resize();var a=MM_findObj("markerImg",window.top.document);if(a.src.indexOf("img/t_white.gif")>0){toggleMarker()}};function init_crop(){P7_Snap("theImage","ant",0,0)}function setMode(a){mode=a;reset()}function reset(){if(ant==null){ant=MM_findObj("ant")}ant.style.visibility="hidden";ant.style.left=0;ant.style.top=0;ant.style.width=0;ant.style.height=0;mx2=null;my2=null;jg_doc.clear();if(mode!="measure"){showStatus()}if(mode=="scale"){init_resize()}P7_Snap("theImage","ant",0,0)}function toggleMarker(){if(ant==null){ant=MM_findObj("ant")}if(ant.className=="selection"){ant.className="selectionWhite"}else{ant.className="selection"}if(jg_doc.getColor()=="#000000"){jg_doc.setColor("#FFFFFF")}else{jg_doc.setColor("#000000")}drawBoundHandle;jg_doc.paint()}function move(c){if(dragapproved){var a=ns6?temp1+c.clientX-x:temp1+event.clientX-x;var b=ns6?temp2+c.clientY-y:temp2+event.clientY-y;if(ant!=null){if(a>=0){ant.style.left=x;ant.style.width=a}else{ant.style.left=x+a;ant.style.width=-1*a}if(b>=0){ant.style.top=y;ant.style.height=b}else{ant.style.top=y+b;ant.style.height=-1*b}}showStatus();return false}}function moveContent(c){if(dragapproved){var b=ns6?oa_x+c.clientX-x:oa_x+event.clientX-x;var a=ns6?oa_y+c.clientY-y:oa_y+event.clientY-y;ant.style.left=b;ant.style.top=a;showStatus();return false}}function moveHandle(i){if(dragapproved){var b=ns6?i.clientX-x:event.clientX-x;var d=ns6?i.clientY-y:event.clientY-y;var f=MM_findObj("constProp",window.top.document);var c=document.theImage.height;var a=document.theImage.width;rapp=a/c;rapp_inv=c/a;switch(resizeHandle){case"s-resize":if(oa_h+d>=0){ant.style.height=oa_h+d;if(f.checked){ant.style.width=rapp*(oa_h+d);ant.style.left=oa_x-rapp*d/2}}break;case"e-resize":if(oa_w+b>=0){ant.style.width=oa_w+b;if(f.checked){ant.style.height=rapp_inv*(oa_w+b);ant.style.top=oa_y-rapp_inv*b/2}}break;case"n-resize":if(oa_h-d>=0){ant.style.top=oa_y+d;ant.style.height=oa_h-d;if(f.checked){ant.style.width=rapp*(oa_h-d);ant.style.left=oa_x+rapp*d/2}}break;case"w-resize":if(oa_w-b>=0){ant.style.left=oa_x+b;ant.style.width=oa_w-b;if(f.checked){ant.style.height=rapp_inv*(oa_w-b);ant.style.top=oa_y+rapp_inv*b/2}}break;case"nw-resize":if(oa_h-d>=0&&oa_w-b>=0){ant.style.left=oa_x+b;ant.style.width=oa_w-b;ant.style.top=oa_y+d;if(f.checked){ant.style.height=rapp_inv*(oa_w-b)}else{ant.style.height=oa_h-d}}break;case"ne-resize":if(oa_h-d>=0&&oa_w+b>=0){ant.style.top=oa_y+d;ant.style.width=oa_w+b;if(f.checked){ant.style.height=rapp_inv*(oa_w+b)}else{ant.style.height=oa_h-d}}break;case"se-resize":if(oa_h+d>=0&&oa_w+b>=0){ant.style.width=oa_w+b;if(f.checked){ant.style.height=rapp_inv*(oa_w+b)}else{ant.style.height=oa_h+d}}break;case"sw-resize":if(oa_h+d>=0&&oa_w-b>=0){ant.style.left=oa_x+b;ant.style.width=oa_w-b;if(f.checked){ant.style.height=rapp_inv*(oa_w-b)}else{ant.style.height=oa_h+d}}}showStatus();return false}}function drags(b){if(!ie&&!ns6){return}var c=ns6?b.target:event.srcElement;var a=ns6?"HTML":"BODY";while(c.tagName!=a&&!(c.className=="crop"||c.className=="handleBox"||c.className=="selection"||c.className=="selectionWhite")){c=ns6?c.parentNode:c.parentElement}if(c.className=="handleBox"){if(content!=null){if(content.width!=null&&content.height!=null){content.width=0;content.height=0}}resizeHandle=c.id;x=ns6?b.clientX:event.clientX;y=ns6?b.clientY:event.clientY;oa_w=parseInt(ant.style.width);oa_h=parseInt(ant.style.height);oa_x=parseInt(ant.style.left);oa_y=parseInt(ant.style.top);dragapproved=true;document.onmousemove=moveHandle;return false}else{if((c.className=="selection"||c.className=="selectionWhite")&&mode=="crop"){x=ns6?b.clientX:event.clientX;y=ns6?b.clientY:event.clientY;oa_x=parseInt(ant.style.left);oa_y=parseInt(ant.style.top);dragapproved=true;document.onmousemove=moveContent;return false}else{if(c.className=="crop"&&mode=="crop"){if(content!=null){if(content.width!=null&&content.height!=null){content.width=0;content.height=0}}if(status==null){status=MM_findObj("status")}if(ant==null){ant=MM_findObj("ant")}if(canvas==null){canvas=MM_findObj("imgCanvas")}if(content==null){content=MM_findObj("cropContent")}if(pic_width==null||pic_height==null){image=MM_findObj("theImage");pic_width=image.width;pic_height=image.height}ant.style.visibility="visible";obj=c;dragapproved=true;z=c;temp1=parseInt(z.style.left+0);temp2=parseInt(z.style.top+0);x=ns6?b.clientX:event.clientX;y=ns6?b.clientY:event.clientY;document.onmousemove=move;return false}else{if(c.className=="crop"&&mode=="measure"){if(ant==null){ant=MM_findObj("ant")}if(canvas==null){canvas=MM_findObj("imgCanvas")}x=ns6?b.clientX:event.clientX;y=ns6?b.clientY:event.clientY;dragapproved=true;document.onmousemove=measure;return false}}}}}function measure(a){if(dragapproved){mx2=ns6?a.clientX:event.clientX;my2=ns6?a.clientY:event.clientY;jg_doc.clear();jg_doc.setStroke(Stroke.DOTTED);jg_doc.drawLine(x,y,mx2,my2);jg_doc.paint();showStatus();return false}}function setMarker(a,d,b,c){if(isNaN(a)){a=0}if(isNaN(d)){d=0}if(isNaN(b)){b=0}if(isNaN(c)){c=0}if(ant==null){ant=MM_findObj("ant")}if(canvas==null){canvas=MM_findObj("imgCanvas")}if(content==null){content=MM_findObj("cropContent")}if(pic_width==null||pic_height==null){image=MM_findObj("theImage");pic_width=image.width;pic_height=image.height}ant.style.visibility="visible";a=pic_x+a;d=pic_y+d;if(b>=0){ant.style.left=a;ant.style.width=b}else{ant.style.left=a+b;ant.style.width=-1*b}if(c>=0){ant.style.top=d;ant.style.height=c}else{ant.style.top=d+c;ant.style.height=-1*c}}function max(a,b){if(b>a){return a}else{return b}}function drawBoundHandle(){if(ant==null||ant.style==null){return false}var a=parseInt(ant.style.height);var d=parseInt(ant.style.width);var c=parseInt(ant.style.left);var b=parseInt(ant.style.top);jg_doc.drawHandle(c-15,b-15,30,30,"nw-resize");jg_doc.drawHandle(c-15,b+a-15,30,30,"sw-resize");jg_doc.drawHandle(c+d-15,b-15,30,30,"ne-resize");jg_doc.drawHandle(c+d-15,b+a-15,30,30,"se-resize");jg_doc.drawHandle(c+max(15,d/10),b-8,d-2*max(15,d/10),8,"n-resize");jg_doc.drawHandle(c+max(15,d/10),b+a,d-2*max(15,d/10),8,"s-resize");jg_doc.drawHandle(c-8,b+max(15,a/10),8,a-2*max(15,a/10),"w-resize");jg_doc.drawHandle(c+d,b+max(15,a/10),8,a-2*max(15,a/10),"e-resize");jg_doc.drawHandleBox(c-4,b-4,8,8,"nw-resize");jg_doc.drawHandleBox(c-4,b+a-4,8,8,"sw-resize");jg_doc.drawHandleBox(c+d-4,b-4,8,8,"ne-resize");jg_doc.drawHandleBox(c+d-4,b+a-4,8,8,"se-resize");jg_doc.drawHandleBox(c+d/2-4,b-4,8,8,"n-resize");jg_doc.drawHandleBox(c+d/2-4,b+a-4,8,8,"s-resize");jg_doc.drawHandleBox(c-4,b+a/2-4,8,8,"w-resize");jg_doc.drawHandleBox(c+d-4,b+a/2-4,8,8,"e-resize")}function showStatus(){if(ant==null||ant.style==null){return false}if(mode=="measure"){mx1=x-pic_x;my1=y-pic_y;mw=mx2-x;mh=my2-y;md=parseInt(Math.sqrt(mw*mw+mh*mh)*100)/100;ma=(Math.atan(-1*mh/mw)/Math.PI)*180;if(mw<0&&mh<0){ma=ma+180}if(mw<0&&mh>0){ma=ma-180}ma=parseInt(ma*100)/100;if(m_sx!=null&&!isNaN(mx1)){m_sx.value=mx1+"px"}if(m_sy!=null&&!isNaN(my1)){m_sy.value=my1+"px"}if(m_w!=null&&!isNaN(mw)){m_w.value=mw+"px"}if(m_h!=null&&!isNaN(mh)){m_h.value=mh+"px"}if(m_d!=null&&!isNaN(md)){m_d.value=md+"px"}if(m_a!=null&&!isNaN(ma)){m_a.value=ma+""}if(r_ra!=null&&!isNaN(ma)){r_ra.value=ma}return false}var i=parseInt(ant.style.height);var c=parseInt(ant.style.width);var a=parseInt(ant.style.left);var k=parseInt(ant.style.top);var e=a-pic_x<0?0:a-pic_x;var d=k-pic_y<0?0:k-pic_y;e=e>pic_width?pic_width:e;d=d>pic_height?pic_height:d;var f=a-pic_x>0?c:c-(pic_x-a);var b=k-pic_y>0?i:i-(pic_y-k);b=k+i<pic_y+pic_height?b:b-(k+i-pic_y-pic_height);f=a+c<pic_x+pic_width?f:f-(a+c-pic_x-pic_width);b=b<0?0:b;f=f<0?0:f;if(ant.style.visibility=="hidden"){e="";d="";f="";b=""}if(mode=="crop"){if(t_cx!=null){t_cx.value=e}if(t_cy!=null){t_cy.value=d}if(t_cw!=null){t_cw.value=f}if(t_ch!=null){t_ch.value=b}}else{if(mode=="scale"){var j=c,h=i;if(s_sw.value.indexOf("%")>0&&s_sh.value.indexOf("%")>0){j=f/pic_width;h=b/pic_height}if(s_sw!=null){s_sw.value=j}if(s_sh!=null){s_sh.value=h}}}}function dragStopped(){dragapproved=false;if(ant==null||ant.style==null){return false}if(mode=="measure"){jg_doc.drawLine(x-4,y,x+4,y);jg_doc.drawLine(x,y-4,x,y+4);jg_doc.drawLine(mx2-4,my2,mx2+4,my2);jg_doc.drawLine(mx2,my2-4,mx2,my2+4);jg_doc.paint();showStatus();return false}var a=parseInt(ant.style.height);var f=parseInt(ant.style.width);var e=parseInt(ant.style.left);var d=parseInt(ant.style.top);jg_doc.clear();if(content!=null){if(content.width!=null&&content.height!=null){content.width=f-1;content.height=a-1}}if(mode=="crop"){jg_doc.fillRectPattern(pic_x,pic_y,pic_width,d-pic_y,pattern);var b=a;var c=d;if(a+d>=pic_height+pic_y){b=pic_height+pic_y-d}else{if(d<=pic_y){b=d+a-pic_y;c=pic_y}}jg_doc.fillRectPattern(pic_x,c,e-pic_x,b,pattern);jg_doc.fillRectPattern(e+f,c,pic_x+pic_width-e-f,b,pattern);jg_doc.fillRectPattern(pic_x,d+a,pic_width,pic_height+pic_y-d-a,pattern)}else{if(mode=="scale"){document.theImage.height=a;document.theImage.width=f;document.theImage.style.height=a+" px";document.theImage.style.width=f+" px";P7_Snap("theImage","ant",0,0)}}drawBoundHandle();jg_doc.paint();showStatus();return false}document.onmousedown=drags;document.onmouseup=dragStopped;