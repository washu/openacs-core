/* This compressed file is part of Xinha. For uncomressed sources, forum, and bug reports, go to xinha.org */
Xinha.Config.prototype.cssPluginConfig={combos:[{label:"Syntax",options:{None:"",Code:"code",String:"string",Comment:"comment","Variable name":"variable-name",Type:"type",Reference:"reference",Preprocessor:"preprocessor",Keyword:"keyword","Function name":"function-name","Html tag":"html-tag","Html italic":"html-helper-italic",Warning:"warning","Html bold":"html-helper-bold"},context:"pre"},{label:"Info",options:{None:"",Quote:"quote",Highlight:"highlight",Deprecated:"deprecated"}}]};function CSS(f,d){this.editor=f;var g=f.config;var j=this;var c;if(d&&d.length){c=d[0]}else{c=f.config.cssPluginConfig}var k=c.combos;for(var e=0;e<k.length;e++){var b=k[e];var a="CSS-class"+e;var h={id:a,options:b.options,action:function(i){j.onSelect(i,this,b.context,b.updatecontextclass)},refresh:function(i){j.updateValue(i,this)},context:b.context};g.registerDropdown(h);g.addToolbarElement(["T["+b.label+"]",a,"separator"],"formatblock",-1)}}CSS._pluginInfo={name:"CSS",version:"1.0",developer:"Mihai Bazon",developer_url:"http://dynarch.com/mishoo/",c_owner:"Mihai Bazon",sponsor:"Miro International",sponsor_url:"http://www.miro.com.au",license:"htmlArea"};CSS.prototype.onSelect=function(d,c,b,f){var i=d._toolbarObjects[c.id];var e=i.element.selectedIndex;var g=i.element.value;var k=d.getParentElement();var j=true;var h=(k&&k.tagName.toLowerCase()=="span");var a=(b&&f&&k&&k.tagName.toLowerCase()==b);if(a){k.className=g;d.updateToolbar();return}if(h&&e==0&&!/\S/.test(k.style.cssText)){while(k.firstChild){k.parentNode.insertBefore(k.firstChild,k)}k.parentNode.removeChild(k);d.updateToolbar();return}if(h){if(k.childNodes.length==1){k.className=g;j=false;d.updateToolbar()}}if(j){d.surroundHTML("<span class='"+g+"'>","</span>")}};CSS.prototype.updateValue=function(f,h){var a=f._toolbarObjects[h.id].element;var e=f.getParentElement();if(typeof e.className!="undefined"&&/\S/.test(e.className)){var b=a.options;var g=e.className;for(var c=b.length;--c>=0;){var d=b[c];if(g==d.value){a.selectedIndex=c;return}}}a.selectedIndex=0};