// MooTools: the javascript framework.
// Load this file's selection again by visiting: http://mootools.net/more/ef740ab86da14be5003e0c9eafd21fa9 
// Or build this file again with packager using: packager build More/Fx.Reveal More/Fx.Slide
/*
---
copyrights:
  - [MooTools](http://mootools.net)

licenses:
  - [MIT License](http://mootools.net/license.txt)
...
*/
MooTools.More={version:"1.3.1.1",build:"0292a3af1eea242b817fecf9daa127417d10d4ce"};Element.implement({isDisplayed:function(){return this.getStyle("display")!="none";
},isVisible:function(){var a=this.offsetWidth,b=this.offsetHeight;return(a==0&&b==0)?false:(a>0&&b>0)?true:this.style.display!="none";},toggle:function(){return this[this.isDisplayed()?"hide":"show"]();
},hide:function(){var b;try{b=this.getStyle("display");}catch(a){}if(b=="none"){return this;}return this.store("element:_originalDisplay",b||"").setStyle("display","none");
},show:function(a){if(!a&&this.isDisplayed()){return this;}a=a||this.retrieve("element:_originalDisplay")||"block";return this.setStyle("display",(a=="none")?"block":a);
},swapClass:function(a,b){return this.removeClass(a).addClass(b);}});Document.implement({clearSelection:function(){if(window.getSelection){var a=window.getSelection();
if(a&&a.removeAllRanges){a.removeAllRanges();}}else{if(document.selection&&document.selection.empty){try{document.selection.empty();}catch(b){}}}}});(function(){var b=function(e,d){var f=[];
Object.each(d,function(g){Object.each(g,function(h){e.each(function(i){f.push(i+"-"+h+(i=="border"?"-width":""));});});});return f;};var c=function(f,e){var d=0;
Object.each(e,function(h,g){if(g.test(f)){d=d+h.toInt();}});return d;};var a=function(d){return !!(!d||d.offsetHeight||d.offsetWidth);};Element.implement({measure:function(h){if(a(this)){return h.call(this);
}var g=this.getParent(),e=[];while(!a(g)&&g!=document.body){e.push(g.expose());g=g.getParent();}var f=this.expose(),d=h.call(this);f();e.each(function(i){i();
});return d;},expose:function(){if(this.getStyle("display")!="none"){return function(){};}var d=this.style.cssText;this.setStyles({display:"block",position:"absolute",visibility:"hidden"});
return function(){this.style.cssText=d;}.bind(this);},getDimensions:function(d){d=Object.merge({computeSize:false},d);var i={x:0,y:0};var h=function(j,e){return(e.computeSize)?j.getComputedSize(e):j.getSize();
};var f=this.getParent("body");if(f&&this.getStyle("display")=="none"){i=this.measure(function(){return h(this,d);});}else{if(f){try{i=h(this,d);}catch(g){}}}return Object.append(i,(i.x||i.x===0)?{width:i.x,height:i.y}:{x:i.width,y:i.height});
},getComputedSize:function(d){d=Object.merge({styles:["padding","border"],planes:{height:["top","bottom"],width:["left","right"]},mode:"both"},d);var g={},e={width:0,height:0},f;
if(d.mode=="vertical"){delete e.width;delete d.planes.width;}else{if(d.mode=="horizontal"){delete e.height;delete d.planes.height;}}b(d.styles,d.planes).each(function(h){g[h]=this.getStyle(h).toInt();
},this);Object.each(d.planes,function(i,h){var k=h.capitalize(),j=this.getStyle(h);if(j=="auto"&&!f){f=this.getDimensions();}j=g[h]=(j=="auto")?f[h]:j.toInt();
e["total"+k]=j;i.each(function(m){var l=c(m,g);e["computed"+m.capitalize()]=l;e["total"+k]+=l;});},this);return Object.append(e,g);}});}).call(this);(function(){var a=function(d){var b=d.options.hideInputs;
if(window.OverText){var c=[null];OverText.each(function(e){c.include("."+e.options.labelClass);});if(c){b+=c.join(", ");}}return(b)?d.element.getElements(b):null;
};Fx.Reveal=new Class({Extends:Fx.Morph,options:{link:"cancel",styles:["padding","border","margin"],transitionOpacity:!Browser.ie6,mode:"vertical",display:function(){return this.element.get("tag")!="tr"?"block":"table-row";
},opacity:1,hideInputs:Browser.ie?"select, input, textarea, object, embed":null},dissolve:function(){if(!this.hiding&&!this.showing){if(this.element.getStyle("display")!="none"){this.hiding=true;
this.showing=false;this.hidden=true;this.cssText=this.element.style.cssText;var d=this.element.getComputedSize({styles:this.options.styles,mode:this.options.mode});
if(this.options.transitionOpacity){d.opacity=this.options.opacity;}var c={};Object.each(d,function(f,e){c[e]=[f,0];});this.element.setStyles({display:Function.from(this.options.display).call(this),overflow:"hidden"});
var b=a(this);if(b){b.setStyle("visibility","hidden");}this.$chain.unshift(function(){if(this.hidden){this.hiding=false;this.element.style.cssText=this.cssText;
this.element.setStyle("display","none");if(b){b.setStyle("visibility","visible");}}this.fireEvent("hide",this.element);this.callChain();}.bind(this));this.start(c);
}else{this.callChain.delay(10,this);this.fireEvent("complete",this.element);this.fireEvent("hide",this.element);}}else{if(this.options.link=="chain"){this.chain(this.dissolve.bind(this));
}else{if(this.options.link=="cancel"&&!this.hiding){this.cancel();this.dissolve();}}}return this;},reveal:function(){if(!this.showing&&!this.hiding){if(this.element.getStyle("display")=="none"){this.hiding=false;
this.showing=true;this.hidden=false;this.cssText=this.element.style.cssText;var d;this.element.measure(function(){d=this.element.getComputedSize({styles:this.options.styles,mode:this.options.mode});
}.bind(this));if(this.options.heightOverride!=null){d.height=this.options.heightOverride.toInt();}if(this.options.widthOverride!=null){d.width=this.options.widthOverride.toInt();
}if(this.options.transitionOpacity){this.element.setStyle("opacity",0);d.opacity=this.options.opacity;}var c={height:0,display:Function.from(this.options.display).call(this)};
Object.each(d,function(f,e){c[e]=0;});c.overflow="hidden";this.element.setStyles(c);var b=a(this);if(b){b.setStyle("visibility","hidden");}this.$chain.unshift(function(){this.element.style.cssText=this.cssText;
this.element.setStyle("display",Function.from(this.options.display).call(this));if(!this.hidden){this.showing=false;}if(b){b.setStyle("visibility","visible");
}this.callChain();this.fireEvent("show",this.element);}.bind(this));this.start(d);}else{this.callChain();this.fireEvent("complete",this.element);this.fireEvent("show",this.element);
}}else{if(this.options.link=="chain"){this.chain(this.reveal.bind(this));}else{if(this.options.link=="cancel"&&!this.showing){this.cancel();this.reveal();
}}}return this;},toggle:function(){if(this.element.getStyle("display")=="none"){this.reveal();}else{this.dissolve();}return this;},cancel:function(){this.parent.apply(this,arguments);
if(this.cssText!=null){this.element.style.cssText=this.cssText;}this.hiding=false;this.showing=false;return this;}});Element.Properties.reveal={set:function(b){this.get("reveal").cancel().setOptions(b);
return this;},get:function(){var b=this.retrieve("reveal");if(!b){b=new Fx.Reveal(this);this.store("reveal",b);}return b;}};Element.Properties.dissolve=Element.Properties.reveal;
Element.implement({reveal:function(b){this.get("reveal").setOptions(b).reveal();return this;},dissolve:function(b){this.get("reveal").setOptions(b).dissolve();
return this;},nix:function(b){var c=Array.link(arguments,{destroy:Type.isBoolean,options:Type.isObject});this.get("reveal").setOptions(b).dissolve().chain(function(){this[c.destroy?"destroy":"dispose"]();
}.bind(this));return this;},wink:function(){var c=Array.link(arguments,{duration:Type.isNumber,options:Type.isObject});var b=this.get("reveal").setOptions(c.options);
b.reveal().chain(function(){(function(){b.dissolve();}).delay(c.duration||2000);});}});}).call(this);Fx.Slide=new Class({Extends:Fx,options:{mode:"vertical",wrapper:false,hideOverflow:true,resetHeight:false},initialize:function(b,a){b=this.element=this.subject=document.id(b);
this.parent(a);a=this.options;var d=b.retrieve("wrapper"),c=b.getStyles("margin","position","overflow");if(a.hideOverflow){c=Object.append(c,{overflow:"hidden"});
}if(a.wrapper){d=document.id(a.wrapper).setStyles(c);}if(!d){d=new Element("div",{styles:c}).wraps(b);}b.store("wrapper",d).setStyle("margin",0);if(b.getStyle("overflow")=="visible"){b.setStyle("overflow","hidden");
}this.now=[];this.open=true;this.wrapper=d;this.addEvent("complete",function(){this.open=(d["offset"+this.layout.capitalize()]!=0);if(this.open&&a.resetHeight){d.setStyle("height","");
}},true);},vertical:function(){this.margin="margin-top";this.layout="height";this.offset=this.element.offsetHeight;},horizontal:function(){this.margin="margin-left";
this.layout="width";this.offset=this.element.offsetWidth;},set:function(a){this.element.setStyle(this.margin,a[0]);this.wrapper.setStyle(this.layout,a[1]);
return this;},compute:function(c,b,a){return[0,1].map(function(d){return Fx.compute(c[d],b[d],a);});},start:function(b,e){if(!this.check(b,e)){return this;
}this[e||this.options.mode]();var d=this.element.getStyle(this.margin).toInt(),c=this.wrapper.getStyle(this.layout).toInt(),a=[[d,c],[0,this.offset]],g=[[d,c],[-this.offset,0]],f;
switch(b){case"in":f=a;break;case"out":f=g;break;case"toggle":f=(c==0)?a:g;}return this.parent(f[0],f[1]);},slideIn:function(a){return this.start("in",a);
},slideOut:function(a){return this.start("out",a);},hide:function(a){this[a||this.options.mode]();this.open=false;return this.set([-this.offset,0]);},show:function(a){this[a||this.options.mode]();
this.open=true;return this.set([0,this.offset]);},toggle:function(a){return this.start("toggle",a);}});Element.Properties.slide={set:function(a){this.get("slide").cancel().setOptions(a);
return this;},get:function(){var a=this.retrieve("slide");if(!a){a=new Fx.Slide(this,{link:"cancel"});this.store("slide",a);}return a;}};Element.implement({slide:function(d,e){d=d||"toggle";
var b=this.get("slide"),a;switch(d){case"hide":b.hide(e);break;case"show":b.show(e);break;case"toggle":var c=this.retrieve("slide:flag",b.open);b[c?"slideOut":"slideIn"](e);
this.store("slide:flag",!c);a=true;break;default:b.start(d,e);}if(!a){this.eliminate("slide:flag");}return this;}});