/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/thirdparty/jquery','sap/ui/base/EventProvider','sap/ui/commons/Button','sap/ui/core/Popup','sap/ui/commons/Slider','sap/ui/Device'],function(Q,E,B,P,S,D){"use strict";var a=E.extend("sap.ui.ux3.ShellColorPicker",{constructor:function(i){E.apply(this);this.id=i;}});a.M_EVENTS={liveChange:"liveChange"};a.prototype.attachLiveChange=function(f,l){this.attachEvent(a.M_EVENTS.liveChange,f,l);};a.prototype.detachLiveChange=function(f,l){this.detachEvent(a.M_EVENTS.liveChange,f,l);};a.prototype.fireLiveChange=function(c){var p={cssColor:a.hslToCss(c)};this.fireEvent(a.M_EVENTS.liveChange,p);};a.prototype.isOpen=function(){return(this.oPopup&&this.oPopup.isOpen());};a.prototype.open=function(c,d,m,b,o,e,f){if(this.oPopup&&this.oPopup.isOpen()){return;}this.oSlider=new S({width:"225px",liveChange:[this.handleSlider,this]});this.oOkBtn=new B({text:"OK",press:[this.handleOk,this]});this.oCancelBtn=new B({text:"Cancel",press:[this.handleCancel,this]});this.oInitialColor=c;this.oCurrentColor=Object.assign({},this.oInitialColor);this.oSlider.setValue(this.oCurrentColor.l);var r=sap.ui.getCore().createRenderManager();var g=document.createElement("div");var s=sap.ui.getCore().getStaticAreaRef();s.appendChild(g);this.renderHtml(r);r.flush(g);r.destroy;this.oPopup=new P(g.firstChild,false,true,true).attachClosed(this.handleClose,this);this.oPopup.setAutoCloseAreas([g.firstChild]);this.oPopup.open(d,m,b,o,e,f);s.removeChild(g);g=null;Q(document.getElementById(this.id)).bind("mousedown",Q.proxy(this.handleGeneralMouseDown,this));Q(document.getElementById(this.id+"-img")).bind("mousedown",Q.proxy(this.handleMouseDown,this));Q(document.getElementById(this.id+"-marker")).bind("mousedown",Q.proxy(this.handleMouseDown,this));this._imgOffset=Q(document.getElementById(this.id+"-img")).offset();this.adaptSliderBar(this.oCurrentColor);this.markColorOnImage(this.oCurrentColor);this.adaptPreview(this.oCurrentColor);};a.parseCssRgbString=function(r){r=r.replace(/rgb\(/,"").replace(/\)/,"").trim();var R=r.split(",");var o={r:parseInt(R[0]),g:parseInt(R[1]),b:parseInt(R[2])};return a.rgbToHsl(o);};a.prototype.renderHtml=function(r){r.write("<div id='"+this.id+"' class='sapUiUx3ShellColorPicker'>");r.write("<img id='"+this.id+"-img' src='"+sap.ui.resource('sap.ui.ux3','img/colors-h.png')+"' />");r.renderControl(this.oSlider);r.write("<div id='"+this.id+"-grad' class='sapUiUx3ShellColorPickerGradient'></div>");r.write("<div id='"+this.id+"-marker' class='sapUiUx3ShellColorPickerMarker'></div>");r.write("<div id='"+this.id+"-preview' class='sapUiUx3ShellColorPickerPreview'></div>");r.renderControl(this.oOkBtn);r.renderControl(this.oCancelBtn);r.write("</div>");};a.prototype.markColorOnImage=function(c){var x=c.h*225;var y=(1-c.s)*75;Q(document.getElementById(this.id+"-marker")).css("left",x+10).css("top",y+10);};a.prototype.markColorOnSlider=function(c){this.oSlider.setValue(c.l);};a.prototype.adaptSliderBar=function(c){var g="";var m=Object.assign({},c);m.l=50;var b=a.hslToCss(m);if(D.browser.firefox){g="-moz-linear-gradient(left, black, "+b+", white)";}else if(D.browser.webkit){g="-webkit-gradient(linear, left center, right center, from(#000), color-stop(0.5, "+b+"), to(#FFF))";}Q(document.getElementById(this.id+"-grad")).css("background-image",g);};a.prototype.adaptPreview=function(c){Q(document.getElementById(this.id+"-preview")).css("background-color",a.hslToCss(c));};a.prototype.handleSlider=function(e){var l=e.getParameter("value");this.oCurrentColor.l=l;this.adaptPreview(this.oCurrentColor);this.fireLiveChange(this.oCurrentColor);};a.prototype.handleGeneralMouseDown=function(e){e.preventDefault();};a.prototype.handleMouseDown=function(e){this.handleMousePos(e);e.preventDefault();Q(document).bind("mousemove",Q.proxy(this.handleMousePos,this)).bind("mouseup",Q.proxy(this.handleMouseUp,this));};a.prototype.handleMouseUp=function(e){this.handleMousePos(e);Q(document).unbind("mousemove",this.handleMousePos).unbind("mouseup",this.handleMouseUp);};a.prototype.handleMousePos=function(e){var x=e.pageX-this._imgOffset.left;var y=e.pageY-this._imgOffset.top;x=Math.min(Math.max(x,0),225);y=Math.min(Math.max(y,0),75);var h=x/225;var s=1-y/75;this.oCurrentColor.h=h;this.oCurrentColor.s=s;this.adaptSliderBar(this.oCurrentColor);this.markColorOnImage(this.oCurrentColor);this.adaptPreview(this.oCurrentColor);this.fireLiveChange(this.oCurrentColor);};a.prototype.handleOk=function(){this.fireLiveChange(this.oCurrentColor);this.oPopup.close();};a.prototype.handleCancel=function(){this.fireLiveChange(this.oInitialColor);this.oPopup.close();};a.prototype.handleClose=function(){Q(document.getElementById(this.id+"-img")).unbind("mousedown",this.handleMouseDown);Q(document.getElementById(this.id+"-marker")).unbind("mousedown",this.handleMouseDown);Q(document).unbind("mousemove",this.handleMousePos).unbind("mouseup",this.handleMouseUp);Q(document.getElementById(this.id)).unbind("mousedown",this.handleGeneralMouseDown);this.oSlider.destroy();this.oSlider=null;this.oOkBtn.destroy();this.oOkBtn=null;this.oCancelBtn.destroy();this.oCancelBtn=null;var d=document.getElementById(this.id);d.parentNode.removeChild(d);this.oPopup.destroy();this.oPopup=null;};a.rgbToHsl=function(c){var r=c.r/255,g=c.g/255,b=c.b/255;var m=Math.max(r,g,b);var e=Math.min(r,g,b);var h,s,l=(m+e)/2;if(m==e){h=s=0;}else{var d=m-e;s=l>0.5?d/(2-m-e):d/(m+e);switch(m){case r:h=(g-b)/d+(g<b?6:0);break;case g:h=(b-r)/d+2;break;case b:h=(r-g)/d+4;break;}h/=6;}return{h:h,s:s,l:l*100};};a.hslToRgb=function(c){var r,g,b;var l=c.l/100;if(c.s==0){r=g=b=l;}else{var q=l<0.5?l*(1+c.s):l+c.s-l*c.s;var p=2*l-q;r=a.hueToRgb(p,q,c.h+1/3);g=a.hueToRgb(p,q,c.h);b=a.hueToRgb(p,q,c.h-1/3);}return[r*255,g*255,b*255];};a.hueToRgb=function(p,q,t){if(t<0){t+=1;}if(t>1){t-=1;}if(t<1/6){return p+(q-p)*6*t;}if(t<1/2){return q;}if(t<2/3){return p+(q-p)*(2/3-t)*6;}return p;};a.hslToCss=function(c){var r=a.hslToRgb(c);return"rgb("+Math.round(r[0])+","+Math.round(r[1])+","+Math.round(r[2])+")";};return a;});
