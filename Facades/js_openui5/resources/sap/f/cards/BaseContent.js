/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Control","sap/ui/model/json/JSONModel","sap/base/Log","sap/ui/base/ManagedObjectObserver","sap/ui/core/Core"],function(C,J,L,M,a){"use strict";var B=C.extend("sap.f.cards.BaseContent",{metadata:{library:"sap.f",aggregations:{_content:{multiple:false,visibility:"hidden"}},events:{press:{}}},renderer:function(r,c){var s="sapFCard";var l=c.getMetadata().getLibraryName();var n=c.getMetadata().getName();var t=n.slice(l.length+1,n.length);var h=B.getMinHeight(t,c.getConfiguration());var o=c.getParent();s+=t;r.write("<div");r.writeElementData(c);r.addClass(s);r.addClass("sapFCardBaseContent");r.writeClasses();if(o&&o.isA("sap.f.ICard")&&o.getHeight()==="auto"){r.addStyle("min-height",h);}r.writeStyles();r.write(">");r.renderControl(c.getAggregation("_content"));r.write("</div>");}});B.prototype.init=function(){this._aReadyPromises=[];this._bReady=false;this._mObservers={};this._awaitEvent("_dataReady");this._awaitEvent("_actionContentReady");Promise.all(this._aReadyPromises).then(function(){this._bReady=true;this.fireEvent("_ready");}.bind(this));this.setBusyIndicatorDelay(0);};B.prototype.ontap=function(e){if(!e.isMarked()){this.firePress({});}};B.prototype.exit=function(){this._oServiceManager=null;this._oDataProviderFactory=null;if(this._oDataProvider){this._oDataProvider.destroy();this._oDataProvider=null;}};B.prototype._awaitEvent=function(e){this._aReadyPromises.push(new Promise(function(r){this.attachEventOnce(e,function(){r();});}.bind(this)));};B.prototype.destroy=function(){this.setAggregation("_content",null);this.setModel(null);this._aReadyPromises=null;if(this._mObservers){Object.keys(this._mObservers).forEach(function(k){this._mObservers[k].disconnect();delete this._mObservers[k];},this);}return C.prototype.destroy.apply(this,arguments);};B.prototype.setConfiguration=function(c){this._oConfiguration=c;if(!c){return this;}var l=this.getInnerList(),m=c.maxItems;if(l&&m){l.setGrowing(true);l.setGrowingThreshold(parseInt(m));l.addStyleClass("sapFCardMaxItems");}this._setData(c.data);return this;};B.prototype.getConfiguration=function(){return this._oConfiguration;};B.prototype.getInnerList=function(){return null;};B.prototype._setData=function(d){var p="/";if(d&&d.path){p=d.path;}this.bindObject(p);if(this._oDataProvider){this._oDataProvider.destroy();}if(this._oDataProviderFactory){this._oDataProvider=this._oDataProviderFactory.create(d,this._oServiceManager);}if(this._oDataProvider){this.setBusy(true);this.setModel(new J());this._oDataProvider.attachDataChanged(function(e){this._updateModel(e.getParameter("data"));this.setBusy(false);}.bind(this));this._oDataProvider.attachError(function(e){this._handleError(e.getParameter("message"));this.setBusy(false);}.bind(this));this._oDataProvider.triggerDataUpdate().then(function(){this.fireEvent("_dataReady");}.bind(this));}else{this.fireEvent("_dataReady");}};function _(A,c,b){var o=this.getBindingContext(),d=c.getAggregation(A);if(o){b.path=o.getPath();c.bindAggregation(A,b);if(this.getModel("parameters")&&d){this.getModel("parameters").setProperty("/visibleItems",d.length);}if(!this._mObservers[A]){this._mObservers[A]=new M(function(e){if(e.name===A&&(e.mutation==="insert"||e.mutation==="remove")){var d=c.getAggregation(A);var l=d?d.length:0;if(this.getModel("parameters")){this.getModel("parameters").setProperty("/visibleItems",l);}}}.bind(this));this._mObservers[A].observe(c,{aggregations:[A]});}}}B.prototype._bindAggregation=function(A,c,b){var d=A&&typeof A==="string";var e=b&&typeof b==="object";if(!d||!c||!e){return;}if(this.getBindingContext()){_.apply(this,arguments);}else{c.attachModelContextChange(_.bind(this,A,c,b));}};B.prototype.isReady=function(){return this._bReady;};B.prototype._updateModel=function(d){this.getModel().setData(d);};B.prototype._handleError=function(l){this.fireEvent("_error",{logMessage:l});};B.prototype.setServiceManager=function(s){this._oServiceManager=s;return this;};B.prototype.setDataProviderFactory=function(d){this._oDataProviderFactory=d;return this;};B.create=function(t,c,s,d){return new Promise(function(r,b){var f=function(g){var o=new g();o.setServiceManager(s);o.setDataProviderFactory(d);o.setConfiguration(c);r(o);};try{switch(t.toLowerCase()){case"list":sap.ui.require(["sap/f/cards/ListContent"],f);break;case"table":sap.ui.require(["sap/f/cards/TableContent"],f);break;case"object":sap.ui.require(["sap/f/cards/ObjectContent"],f);break;case"analytical":a.loadLibrary("sap.viz",{async:true}).then(function(){sap.ui.require(["sap/f/cards/AnalyticalContent"],f);}).catch(function(){b("Analytical content type is not available with this distribution.");});break;case"timeline":a.loadLibrary("sap.suite.ui.commons",{async:true}).then(function(){sap.ui.require(["sap/f/cards/TimelineContent"],f);}).catch(function(){b("Timeline content type is not available with this distribution.");});break;case"component":sap.ui.require(["sap/f/cards/ComponentContent"],f);break;default:b(t.toUpperCase()+" content type is not supported.");}}catch(e){b(e);}});};B.getMinHeight=function(t,c){var b=5,h;if(jQuery.isEmptyObject(c)){return"0rem";}switch(t){case"ListContent":h=B._getMinListHeight(c);break;case"TableContent":h=B._getMinTableHeight(c);break;case"TimelineContent":h=B._getMinTimelineHeight(c);break;case"AnalyticalContent":h=14;break;case"ObjectContent":h=0;break;default:h=0;}return(h!==0?h:b)+"rem";};B._getMinListHeight=function(c){var i=c.maxItems||0,t=c.item,I=3;if(!t){return 0;}if(t.icon||t.description){I=4;}return i*I;};B._getMinTableHeight=function(c){var i=c.maxItems||0,r=3,t=3;return i*r+t;};B._getMinTimelineHeight=function(c){var i=c.maxItems||0,I=6;return i*I;};return B;});
