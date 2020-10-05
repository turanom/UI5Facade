/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/EventProvider","./Element","./ShortcutHint","./Popup","./InvisibleText","sap/ui/dom/containsOrEquals","sap/ui/events/checkMouseEnterOrLeave"],function(E,a,S,P,I,c,b){"use strict";var d=function(C){this.sControlId=C.getId();this._hintConfigs=[];};d.init=function(C){C._shortcutHintsMixin=new d(C);};d.addConfig=function(C,o,i){var m=C._shortcutHintsMixin;if(!m){d.init(C);m=C._shortcutHintsMixin;}m._hintConfigs.push(o);m.initHint(o,i);};d.hideAll=function(){var C;for(var s in h.mControls){C=a.registry.get(s);if(C){C._shortcutHintsMixin.hideShortcutHint();}}};d.isDOMIDRegistered=function(D){return h.mDOMNodes[D]&&!!h.mDOMNodes[D].length;};d.isControlRegistered=function(C){return!!h.mControls[C];};d.prototype._attachToEvents=function(){var C;if(!d.isControlRegistered(this.sControlId)){C=a.registry.get(this.sControlId);C.addEventDelegate(H,this);}};d.prototype.register=function(D,C,o){this._attachToEvents();h.mControls[this.sControlId]=true;if(!h.mDOMNodes[D]){h.mDOMNodes[D]=[];}h.mDOMNodes[D].push(new S(o,C));};d.prototype.initHint=function(C,o){var i=this._getShortcutHintInfo(C);if(i.message){this.register(i.id,{message:i.message},o);}else if(i.messageBundleKey){this.register(i.id,{messageBundleKey:i.messageBundleKey},o);}else if(i.event){var j=E.getEventList(o)[i.event],A=[];if(j){A=j.reduce(function(r,l){if(l.fFunction&&l.fFunction._sapui_commandName){r.push(l.fFunction._sapui_commandName);}return r;},[]);}if(A.length){this.register(i.id,{commandName:A[0]},o);}else{o.attachEvent("EventHandlerChange",function(k){var F=k.getParameter("func");if(k.getParameter("type")==="listenerAttached"&&F&&F._sapui_commandName&&k.getParameter("EventId")===i.event){this.register(i.id,{commandName:F._sapui_commandName},o);}},this);}}};d.prototype._getShortcutHintInfos=function(){return this._hintConfigs.map(this._getShortcutHintInfo,this);};d.prototype._getShortcutHintInfo=function(o){var i;if(o.domrefid){i=o.domrefid;}else if(o.domrefid_suffix){i=this.sControlId+o.domrefid_suffix;}else{i=this.sControlId;}return{id:i,event:o.event,position:o.position,messageBundleKey:o.messageBundleKey,message:o.message,addAccessibilityLabel:o.addAccessibilityLabel};};d.prototype.getRegisteredShortcutInfos=function(){return this._getShortcutHintInfos().filter(function(i){return d.isDOMIDRegistered(i.id);},this);};d.prototype.showShortcutHint=function(o){var t,p=o[0].position||"0 8",m=P.Dock.CenterTop,O=P.Dock.CenterBottom,i=e(),s=o[0].ref,j=_(o[0].id),T;T=this._getControlTooltips();if(T[o[0].id]){j=T[o[0].id].tooltip+" ("+j+")";}if(!i){i=f(j);}i.oContent.children[0].textContent=j;if(!i.isOpen()){i.open(1000,m,O,s,p,"flipfit",function(k){i.oContent.style.visibility="hidden";if(t){clearTimeout(t);}t=setTimeout(function(){i.oContent.style.visibility="visible";},1000);i._applyPosition(i._oLastPosition);});}};d.prototype.hideShortcutHint=function(){var p=e();if(p&&p.isOpen()){p.close();}};d.prototype._findShortcutOptionsForRef=function(j){var o,k=this.getRegisteredShortcutInfos(),i,r=[];for(i=0;i<k.length;i++){o=k[i];o.ref=document.getElementById(o.id);if(c(o.ref,j)){r.push(o);}}return r;};d.prototype._getControlTooltips=function(){var i=this.getRegisteredShortcutInfos(),C=a.registry.get(this.sControlId);return i.reduce(function(r,o){var t=C._getTitleAttribute&&C._getTitleAttribute(o.id);if(!t){t=C.getTooltip();}if(t){r[o.id]={tooltip:t};}return r;},{});};d.prototype._updateShortcutHintAccLabel=function(o){var i,s,C;if(!o.addAccessibilityLabel){return;}i=g();s=i.getId();i.setText(_(o.id));C=a.registry.get(this.sControlId);if(i.getText()){if(C.getAriaDescribedBy().indexOf(s)===-1){C.addAriaDescribedBy(s);}}else{C.removeAriaDescribedBy(s);}};var h=Object.create(null);h.mControls={};h.mDOMNodes={};var H={"onfocusin":function(o){var s=this._findShortcutOptionsForRef(o.target);if(!s.length){return;}d.hideAll();this._updateShortcutHintAccLabel(s[0]);this.showShortcutHint(s);},"onfocusout":function(o){var s=this._findShortcutOptionsForRef(o.target);if(!s.length){return;}this.hideShortcutHint();},"onmouseover":function(o){var s=this._findShortcutOptionsForRef(o.target);if(!s.length){return;}if(b(o,s[0].ref)){d.hideAll();this.showShortcutHint(s);}},"onmouseout":function(o){var s=this._findShortcutOptionsForRef(o.target);if(!s.length){return;}if(b(o,s[0].ref)){if(c(s[0].ref,document.activeElement)){return;}this.hideShortcutHint();}},"onAfterRendering":function(){var j=this.getRegisteredShortcutInfos(),o,D;for(var i=0;i<j.length;i++){D=j[i].id;o=document.getElementById(D);o.setAttribute("aria-keyshortcuts",_(D));}}};function _(D){var i=h.mDOMNodes[D];if(!i||!i.length){return;}return i.map(function(o){return o._getShortcutText();}).join(", ");}function g(){if(!d._invisibleText){d._invisibleText=new I();d._invisibleText.toStatic();}return d._invisibleText;}function e(){return d._popup;}function f(t){var p,C,T;C=document.createElement("span");C.classList.add("sapUiHintContainer");T=document.createElement("div");T.classList.add("sapUiHintText");T.textContent=t;C.appendChild(T);p=new P(C,false,false,false);p.setAnimations(function($,D,i){setTimeout(i,D);},function($,D,i){i();});d._popup=p;return p;}return d;});
