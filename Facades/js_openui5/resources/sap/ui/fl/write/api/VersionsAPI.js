/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/apply/_internal/flexState/FlexState","sap/ui/fl/write/_internal/Versions","sap/ui/fl/Utils","sap/ui/fl/apply/_internal/flexState/ManifestUtils"],function(F,V,U,M){"use strict";function g(A){if(A){var m=A.getManifest();var r=M.getFlexReference({manifest:m,componentData:A.getComponentData()});var s=U.getAppVersionFromManifest(m);}return{reference:r,appVersion:s};}var a={};a.initialize=function(p){if(!p.selector){return Promise.reject("No selector was provided");}if(!p.layer){return Promise.reject("No layer was provided");}var A=U.getAppComponentForControl(p.selector);var o=g(A);if(!o.reference){return Promise.reject("The application ID could not be determined");}return V.initialize({reference:U.normalizeReference(o.reference),layer:p.layer});};a.isDraftAvailable=function(p){if(!p.selector){throw Error("No selector was provided");}if(!p.layer){throw Error("No layer was provided");}var A=U.getAppComponentForControl(p.selector);var o=g(A);if(!o.reference){throw Error("The application ID could not be determined");}var v=V.getVersionsModel({reference:U.normalizeReference(o.reference),layer:p.layer}).getProperty("/versions");var d=v.find(function(b){return b.version===sap.ui.fl.Versions.Draft;});return!!d;};a.loadDraftForApplication=function(p){if(!p.selector){return Promise.reject("No selector was provided");}if(!p.layer){return Promise.reject("No layer was provided");}var A=U.getAppComponentForControl(p.selector);var o=g(A);if(!o.reference){return Promise.reject("The application ID could not be determined");}return F.clearAndInitialize({componentId:A.getId(),reference:o.reference,version:sap.ui.fl.Versions.Draft});};a.activateDraft=function(p){if(!p.selector){return Promise.reject("No selector was provided");}if(!p.layer){return Promise.reject("No layer was provided");}if(!p.title){return Promise.reject("No version title was provided");}var A=U.getAppComponentForControl(p.selector);var o=g(A);if(!o.reference){return Promise.reject("The application ID could not be determined");}return V.activateDraft({nonNormalizedReference:o.reference,reference:U.normalizeReference(o.reference),appVersion:o.appVersion,layer:p.layer,title:p.title,appComponent:A});};a.discardDraft=function(p){if(!p.selector){return Promise.reject("No selector was provided");}if(!p.layer){return Promise.reject("No layer was provided");}var A=U.getAppComponentForControl(p.selector);var o=g(A);if(!o.reference){return Promise.reject("The application ID could not be determined");}return V.discardDraft({nonNormalizedReference:o.reference,reference:U.normalizeReference(o.reference),layer:p.layer,appVersion:o.appVersion}).then(function(d){if(d.backendChangesDiscarded){F.clearAndInitialize({componentId:A.getId(),reference:o.reference});}return d;});};return a;});
