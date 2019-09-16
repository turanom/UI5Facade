/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/core/Component","sap/ui/fl/ChangePersistence","sap/ui/fl/Utils"],function(q,C,a,U){"use strict";var b={};b._instanceCache={};b.getChangePersistenceForComponent=function(c,A){var o;A=A||U.DEFAULT_APP_VERSION;if(!b._instanceCache[c]){b._instanceCache[c]={};}o=b._instanceCache[c][A];if(!o){var d={name:c,appVersion:A};o=new a(d);b._instanceCache[c][A]=o;}return o;};b.getChangePersistenceForControl=function(c){var s;s=this._getComponentClassNameForControl(c);var A=U.getAppVersionFromManifest(U.getAppComponentForControl(c).getManifest());return b.getChangePersistenceForComponent(s,A);};b._getComponentClassNameForControl=function(c){return U.getComponentClassName(c);};b.registerLoadComponentEventHandler=function(){C._fnLoadComponentCallback=this._onLoadComponent.bind(this);};b._doLoadComponent=function(c,m){var o={oChangePersistence:{},oRequestOptions:{appName:c.name}};var s=U.getFlexReference(m);var A=U.getAppVersionFromManifest(m);var M;var S;var t;S=c&&c.componentData&&c.componentData.startupParameters||{};t=c&&c.componentData&&c.componentData.technicalParameters;if(S["sap-app-id"]&&S["sap-app-id"].length===1){s=S["sap-app-id"][0];}else if(c){var d=c.asyncHints;if(d&&d.requests&&Array.isArray(d.requests)){var f=this._findFlAsyncHint(d.requests,s);if(f){o.oRequestOptions.cacheKey=f.cachebusterToken||"<NO CHANGES>";}}}var e=t||S;if(e&&e["sap-ui-fl-max-layer"]&&e["sap-ui-fl-max-layer"].length===1){M=e["sap-ui-fl-max-layer"][0];}U.setMaxLayerParameter(M);o.oRequestOptions.siteId=U.getSiteIdByComponentData(c.componentData);o.oChangePersistence=this.getChangePersistenceForComponent(s,A);return o;};b._onLoadComponent=function(c,m){if(!U.isApplication(m)){return;}var o=this._doLoadComponent(c,m);o.oRequestOptions.componentData={};Object.assign(o.oRequestOptions.componentData,c.componentData);o.oChangePersistence.getChangesForComponent(o.oRequestOptions);};b._getChangesForComponentAfterInstantiation=function(c,m,o){if(!U.isApplication(m)){return Promise.resolve(function(){return{mChanges:{},mDependencies:{},mDependentChangesOnMe:{}};});}var d=this._doLoadComponent(c,m);return d.oChangePersistence.loadChangesMapForComponent(o,d.oRequestOptions);};b._findFlAsyncHint=function(A,r){var t=this;var f;q.each(A,function(n,o){if(t._flAsyncHintMatches(o,r)){f=o;return false;}});return f;};b._flAsyncHintMatches=function(A,r){return A.name==="sap.ui.fl.changes"&&A.reference===r;};return b;},true);
