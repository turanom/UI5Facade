/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/ManagedObject"],function(M){"use strict";var D=M.extend("sap.ui.integration.util.DataProvider",{metadata:{events:{dataRequested:{parameters:{}},dataChanged:{parameters:{data:{type:"object"}}},error:{parameters:{message:{type:"string"}}}}}});D.prototype.setDestinations=function(d){this._oDestinations=d;};D.prototype.setSettings=function(s){this._oSettings=s;};D.prototype.getSettings=function(){return this._oSettings;};D.prototype.triggerDataUpdate=function(){this.fireDataRequested();return this.getData().then(function(d){this.fireDataChanged({data:d});this.onDataRequestComplete();}.bind(this)).catch(function(e){this.fireError({message:e});this.onDataRequestComplete();}.bind(this));};D.prototype.getData=function(){var d=this.getSettings();return new Promise(function(r,a){if(d.json){r(d.json);}else{a("Could not get card data.");}});};D.prototype.destroy=function(){if(this._iIntervalId){clearInterval(this._iIntervalId);this._iIntervalId=null;}this._oSettings=null;M.prototype.destroy.apply(this,arguments);};D.prototype.onDataRequestComplete=function(){var i;if(!this._oSettings||!this._oSettings.updateInterval){return;}i=parseInt(this._oSettings.updateInterval);if(isNaN(i)){return;}setTimeout(function(){this.triggerDataUpdate();}.bind(this),i*1000);};return D;});
