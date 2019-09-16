/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/thirdparty/jquery','../Device','../Global','../base/Object','./CalendarType','./Locale','sap/ui/thirdparty/URI',"sap/base/util/UriParameters","sap/base/util/deepEqual","sap/base/util/Version","sap/base/Log","sap/base/assert","sap/base/util/isEmptyObject"],function(q,D,G,B,C,L,U,a,d,V,b,c,i){"use strict";var f;var g=B.extend("sap.ui.core.Configuration",{constructor:function(l){this._oCore=l;function u(){function e(){if(D.os.android){var m=navigator.userAgent.match(/\s([a-z]{2}-[a-z]{2})[;)]/i);if(m){return m[1];}}return navigator.language;}return h((navigator.languages&&navigator.languages[0])||e()||navigator.userLanguage||navigator.browserLanguage)||new L("en");}var w={"theme":{type:"string",defaultValue:"base"},"language":{type:"Locale",defaultValue:u()},"formatLocale":{type:"Locale",defaultValue:null},"calendarType":{type:"string",defaultValue:null},"accessibility":{type:"boolean",defaultValue:true},"autoAriaBodyRole":{type:"boolean",defaultValue:true,noUrl:true},"animation":{type:"boolean",defaultValue:true},"animationMode":{type:g.AnimationMode,defaultValue:undefined},"rtl":{type:"boolean",defaultValue:null},"debug":{type:"boolean",defaultValue:false},"inspect":{type:"boolean",defaultValue:false},"originInfo":{type:"boolean",defaultValue:false},"noConflict":{type:"boolean",defaultValue:false,noUrl:true},"noDuplicateIds":{type:"boolean",defaultValue:true},"trace":{type:"boolean",defaultValue:false,noUrl:true},"modules":{type:"string[]",defaultValue:[],noUrl:true},"areas":{type:"string[]",defaultValue:null,noUrl:true},"onInit":{type:"code",defaultValue:undefined,noUrl:true},"uidPrefix":{type:"string",defaultValue:"__",noUrl:true},"ignoreUrlParams":{type:"boolean",defaultValue:false,noUrl:true},"preload":{type:"string",defaultValue:"auto"},"rootComponent":{type:"string",defaultValue:"",noUrl:true},"preloadLibCss":{type:"string[]",defaultValue:[]},"application":{type:"string",defaultValue:""},"appCacheBuster":{type:"string[]",defaultValue:[]},"bindingSyntax":{type:"string",defaultValue:"default",noUrl:true},"versionedLibCss":{type:"boolean",defaultValue:false},"manifestFirst":{type:"boolean",defaultValue:false},"flexibilityServices":{type:"string",defaultValue:"/sap/bc/lrep"},"whitelistService":{type:"string",defaultValue:null,noUrl:true},"frameOptions":{type:"string",defaultValue:"default",noUrl:true},"frameOptionsConfig":{type:"object",defaultValue:undefined,noUrl:true},"support":{type:"string[]",defaultValue:null},"xx-rootComponentNode":{type:"string",defaultValue:"",noUrl:true},"xx-appCacheBusterMode":{type:"string",defaultValue:"sync"},"xx-appCacheBusterHooks":{type:"object",defaultValue:undefined,noUrl:true},"xx-disableCustomizing":{type:"boolean",defaultValue:false,noUrl:true},"xx-viewCache":{type:"boolean",defaultValue:true},"xx-test-mobile":{type:"boolean",defaultValue:false},"xx-depCache":{type:"boolean",defaultValue:false},"xx-libraryPreloadFiles":{type:"string[]",defaultValue:[]},"xx-componentPreload":{type:"string",defaultValue:""},"xx-designMode":{type:"boolean",defaultValue:false},"xx-supportedLanguages":{type:"string[]",defaultValue:[]},"xx-bootTask":{type:"function",defaultValue:undefined,noUrl:true},"xx-suppressDeactivationOfControllerCode":{type:"boolean",defaultValue:false},"xx-lesssupport":{type:"boolean",defaultValue:false},"xx-handleValidation":{type:"boolean",defaultValue:false},"xx-fiori2Adaptation":{type:"string[]",defaultValue:[]},"xx-cache-use":{type:"boolean",defaultValue:true},"xx-cache-excludedKeys":{type:"string[]",defaultValue:[]},"xx-cache-serialization":{type:"boolean",defaultValue:false},"xx-nosync":{type:"string",defaultValue:""},"xx-waitForTheme":{type:"string",defaultValue:""},"xx-avoidAriaApplicationRole":{type:"boolean",defaultValue:false},"xx-hyphenation":{type:"string",defaultValue:""},"xx-flexBundleRequestForced":{type:"boolean",defaultValue:false},"statistics":{type:"boolean",defaultValue:false}};var x={"xx-test":"1.15","flexBoxPolyfill":"1.14","sapMeTabContainer":"1.14","sapMeProgessIndicator":"1.14","sapMGrowingList":"1.14","sapMListAsTable":"1.14","sapMDialogWithPadding":"1.14","sapCoreBindingSyntax":"1.24"};this.oFormatSettings=new g.FormatSettings(this);var y=this;function z(e,O){if(typeof O==="undefined"||O===null){return;}switch(w[e].type){case"boolean":if(typeof O==="string"){if(w[e].defaultValue){y[e]=O.toLowerCase()!="false";}else{y[e]=O.toLowerCase()==="true"||O.toLowerCase()==="x";}}else{y[e]=!!O;}break;case"string":y[e]=""+O;break;case"code":y[e]=typeof O==="function"?O:String(O);break;case"function":if(typeof O!=="function"){throw new Error("unsupported value");}y[e]=O;break;case"string[]":if(Array.isArray(O)){y[e]=O;}else if(typeof O==="string"){y[e]=O.split(/[ ,;]/).map(function(s){return s.trim();});}else{throw new Error("unsupported value");}break;case"object":if(typeof O!=="object"){throw new Error("unsupported value");}y[e]=O;break;case"Locale":var Q=h(O);if(Q||w[e].defaultValue==null){y[e]=Q;}else{throw new Error("unsupported value");}break;default:var v=w[e].type;if(typeof v==="object"){r(v,O,e);y[e]=O;}else{throw new Error("illegal state");}}}function A(s){var m=document.querySelector("META[name='"+s+"']"),e=m&&m.getAttribute("content");if(e){return e;}}function E(s){var e=A("sap-allowedThemeOrigins");return!!e&&e.split(",").some(function(m){return m==="*"||s===m.trim();});}function F(R){var m,s;try{m=new U(R).search("");var v=m.origin();if(v&&E(v)){s=m.toString();}else{s=m.absoluteTo(window.location.href).origin(window.location.origin).normalize().toString();}return s+(s.endsWith('/')?'':'/')+"UI5/";}catch(e){}}for(var n in w){y[n]=w[n].defaultValue;}var H=window["sap-ui-config"]||{};H.oninit=H.oninit||H["evt-oninit"];for(var n in w){if(H.hasOwnProperty(n.toLowerCase())){z(n,H[n.toLowerCase()]);}else if(!/^xx-/.test(n)&&H.hasOwnProperty("xx-"+n.toLowerCase())){z(n,H["xx-"+n.toLowerCase()]);}}if(H.libs){y.modules=H.libs.split(",").map(function(e){return e.trim()+".library";}).concat(y.modules);}var P="compatversion";var I=H[P];var J=V("1.14");this._compatversion={};function _(e){var v=!e?I||J.toString():H[P+"-"+e.toLowerCase()]||I||x[e]||J.toString();v=V(v.toLowerCase()==="edge"?G.version:v);return V(v.getMajor(),v.getMinor());}this._compatversion._default=_();for(var n in x){this._compatversion[n]=_(n);}if(!y.ignoreUrlParams){var K="sap-ui-";var N=a.fromQuery(window.location.search);if(N.has('sap-language')){var O=y.sapLogonLanguage=N.get('sap-language');var Q=O&&h(M[O.toUpperCase()]||O);if(Q){y.language=Q;}else if(O&&!N.get('sap-locale')&&!N.get('sap-ui-language')){b.warning("sap-language '"+O+"' is not a valid BCP47 language tag and will only be used as SAP logon language");}}if(N.has('sap-locale')){z("language",N.get('sap-locale'));}if(N.has('sap-rtl')){var O=N.get('sap-rtl');if(O==="X"||O==="x"){z('rtl',true);}else{z('rtl',false);}}if(N.has('sap-theme')){var O=N.get('sap-theme');if(O===""){y['theme']=w['theme'].defaultValue;}else{z('theme',O);}}if(N.has('sap-statistics')){var O=N.get('sap-statistics');z('statistics',O);}for(var n in w){if(w[n].noUrl){continue;}var O=N.get(K+n);if(O==null&&!/^xx-/.test(n)){O=N.get(K+"xx-"+n);}if(O===""){y[n]=w[n].defaultValue;}else{z(n,O);}}if(N.has('sap-ui-legacy-date-format')){this.oFormatSettings.setLegacyDateFormat(N.get('sap-ui-legacy-date-format'));}if(N.has('sap-ui-legacy-time-format')){this.oFormatSettings.setLegacyTimeFormat(N.get('sap-ui-legacy-time-format'));}if(N.has('sap-ui-legacy-number-format')){this.oFormatSettings.setLegacyNumberFormat(N.get('sap-ui-legacy-number-format'));}}y.sapparams=y.sapparams||{};y.sapparams['sap-language']=this.getSAPLogonLanguage();['sap-client','sap-server','sap-system'].forEach(function(s){if(!y.ignoreUrlParams&&N.get(s)){y.sapparams[s]=N.get(s);}else{y.sapparams[s]=A(s);}});this.derivedRTL=L._impliesRTL(y.language);var T=y.theme;var R;var S=T.indexOf("@");if(S>=0){R=F(T.slice(S+1));if(R){y.theme=T.slice(0,S);y.themeRoot=R;}else{y.theme=(H.theme&&H.theme!==T)?H.theme:"base";S=-1;}}y.theme=this._normalizeTheme(y.theme,R);var W=y['languagesDeliveredWithCore']=L._coreI18nLocales;var X=y['xx-supportedLanguages'];if(X.length===0||(X.length===1&&X[0]==='*')){X=[];}else if(X.length===1&&X[0]==='default'){X=W||[];}y['xx-supportedLanguages']=X;var Y=y['xx-fiori2Adaptation'];if(Y.length===0||(Y.length===1&&Y[0]==='false')){Y=false;}else if(Y.length===1&&Y[0]==='true'){Y=true;}y['xx-fiori2Adaptation']=Y;if(y["bindingSyntax"]==="default"){y["bindingSyntax"]=(y.getCompatibilityVersion("sapCoreBindingSyntax").compareTo("1.26")<0)?"simple":"complex";}if(!y["whitelistService"]){var Z=A('sap.whitelistService');if(Z){y["whitelistService"]=Z;if(y["frameOptions"]==="default"){y["frameOptions"]="trusted";}}}if(y["frameOptions"]==="default"||(y["frameOptions"]!=="allow"&&y["frameOptions"]!=="deny"&&y["frameOptions"]!=="trusted")){y["frameOptions"]="allow";}if(y.flexibilityServices&&y.flexibilityServices!==w.flexibilityServices.defaultValue&&y.modules.indexOf("sap.ui.fl.library")==-1){y.modules.push("sap.ui.fl.library");}var $=y['preloadLibCss'];if($.length>0){$.appManaged=$[0].slice(0,1)==="!";if($.appManaged){$[0]=$[0].slice(1);}if($[0]==="*"){$.shift();y.modules.forEach(function(e){var m=e.match(/^(.*)\.library$/);if(m){$.unshift(m[1]);}});}}if(y["xx-waitForTheme"]==="true"){y["xx-waitForTheme"]="rendering";}if(y["xx-waitForTheme"]!=="rendering"&&y["xx-waitForTheme"]!=="init"){y["xx-waitForTheme"]=undefined;}for(var n in w){if(y[n]!==w[n].defaultValue){b.info("  "+n+" = "+y[n]);}}if(this.getAnimationMode()===undefined){if(this.animation){this.setAnimationMode(g.AnimationMode.full);}else{this.setAnimationMode(g.AnimationMode.minimal);}}else{this.setAnimationMode(this.getAnimationMode());}},getVersion:function(){if(this._version){return this._version;}this._version=new V(G.version);return this._version;},getCompatibilityVersion:function(F){if(typeof(F)==="string"&&this._compatversion[F]){return this._compatversion[F];}return this._compatversion._default;},getTheme:function(){return this.theme;},_setTheme:function(T){this.theme=T;return this;},_normalizeTheme:function(T,s){if(T&&s==null&&T.match(/^sap_corbu$/i)){return"sap_goldreflection";}return T;},getLanguage:function(){return this.language.sLocaleId;},getLanguageTag:function(){return this.language.toString();},getSAPLogonLanguage:function(){return this.sapLogonLanguage||this.language.getSAPLogonLanguage();},setLanguage:function(l,s){var e=h(l),O=this.getRTL(),m;p(e,"Configuration.setLanguage: sLanguage must be a valid BCP47 language tag");p(s==null||(typeof s==='string'&&/[A-Z0-9]{2,2}/i.test(s)),"Configuration.setLanguage: sSAPLogonLanguage must be null or be a string of length 2, consisting of digits and latin characters only",true);if(e.toString()!=this.getLanguageTag()||s!==this.sapLogonLanguage){this.language=e;this.sapLogonLanguage=s||undefined;this.sapparams['sap-language']=this.getSAPLogonLanguage();m=this._collect();m.language=this.getLanguageTag();this.derivedRTL=L._impliesRTL(e);if(O!=this.getRTL()){m.rtl=this.getRTL();}this._endCollect();}return this;},getLocale:function(){return this.language;},getSAPParam:function(n){return this.sapparams&&this.sapparams[n];},isUI5CacheOn:function(){return this["xx-cache-use"];},setUI5CacheOn:function(e){this["xx-cache-use"]=e;return this;},isUI5CacheSerializationSupportOn:function(){return this["xx-cache-serialization"];},setUI5CacheSerializationSupport:function(e){this["xx-cache-serialization"]=e;return this;},getUI5CacheExcludedKeys:function(){return this["xx-cache-excludedKeys"];},getCalendarType:function(){var n;if(!f){f=sap.ui.requireSync("sap/ui/core/LocaleData");}if(this.calendarType){for(n in C){if(n.toLowerCase()===this.calendarType.toLowerCase()){this.calendarType=n;return this.calendarType;}}b.warning("Parameter 'calendarType' is set to "+this.calendarType+" which isn't a valid value and therefore ignored. The calendar type is determined from format setting and current locale");}var l=this.oFormatSettings.getLegacyDateFormat();switch(l){case"1":case"2":case"3":case"4":case"5":case"6":return C.Gregorian;case"7":case"8":case"9":return C.Japanese;case"A":case"B":return C.Islamic;case"C":return C.Persian;}return f.getInstance(this.getLocale()).getPreferredCalendarType();},setCalendarType:function(s){var m;if(this.calendarType!==s){m=this._collect();this.calendarType=m.calendarType=s;this._endCollect();}return this;},getFormatLocale:function(){return(this.formatLocale||this.language).toString();},setFormatLocale:function(F){var e=h(F),m;p(F==null||typeof F==="string"&&e,"sFormatLocale must be a BCP47 language tag or Java Locale id or null");if(t(e)!==t(this.formatLocale)){this.formatLocale=e;m=this._collect();m.formatLocale=t(e);this._endCollect();}return this;},getLanguagesDeliveredWithCore:function(){return this["languagesDeliveredWithCore"];},getSupportedLanguages:function(){return this["xx-supportedLanguages"];},getAccessibility:function(){return this.accessibility;},getAutoAriaBodyRole:function(){return this.autoAriaBodyRole;},getAvoidAriaApplicationRole:function(){return this.getAutoAriaBodyRole()&&this["xx-avoidAriaApplicationRole"];},getAnimation:function(){return this.animation;},getAnimationMode:function(){return this.animationMode;},setAnimationMode:function(A){r(g.AnimationMode,A,"animationMode");this.animation=(A!==g.AnimationMode.minimal&&A!==g.AnimationMode.none);this.animationMode=A;if(this._oCore&&this._oCore._setupAnimation){this._oCore._setupAnimation();}},getRTL:function(){return this.rtl===null?this.derivedRTL:this.rtl;},getFiori2Adaptation:function(){return this["xx-fiori2Adaptation"];},setRTL:function(R){p(R===null||typeof R==="boolean","bRTL must be null or a boolean");var e=this.getRTL(),m;this.rtl=R;if(e!=this.getRTL()){m=this._collect();m.rtl=this.getRTL();this._endCollect();}return this;},getDebug:function(){return this.debug;},getInspect:function(){return this.inspect;},getOriginInfo:function(){return this.originInfo;},getNoDuplicateIds:function(){return this.noDuplicateIds;},getTrace:function(){return this.trace;},getUIDPrefix:function(){return this.uidPrefix;},getDesignMode:function(){return this["xx-designMode"];},getSuppressDeactivationOfControllerCode:function(){return this["xx-suppressDeactivationOfControllerCode"];},getControllerCodeDeactivated:function(){return this.getDesignMode()&&!this.getSuppressDeactivationOfControllerCode();},getApplication:function(){return this.application;},getRootComponent:function(){return this.rootComponent;},getAppCacheBuster:function(){return this.appCacheBuster;},getAppCacheBusterMode:function(){return this["xx-appCacheBusterMode"];},getAppCacheBusterHooks:function(){return this["xx-appCacheBusterHooks"];},getDisableCustomizing:function(){return this["xx-disableCustomizing"];},getViewCache:function(){return this["xx-viewCache"];},getPreload:function(){return this.preload;},getDepCache:function(){return this["xx-depCache"];},getManifestFirst:function(){return this.manifestFirst;},isFlexBundleRequestForced:function(){return this["xx-flexBundleRequestForced"];},getFlexibilityServices:function(){if(!this.flexibilityServices){this.flexibilityServices=[];}if(typeof this.flexibilityServices==='string'){if(this.flexibilityServices[0]==="/"){this.flexibilityServices=[{url:this.flexibilityServices,layerFilter:["ALL"],connectorName:"LrepConnector"}];}else{this.flexibilityServices=JSON.parse(this.flexibilityServices);}}return this.flexibilityServices;},getComponentPreload:function(){return this['xx-componentPreload']||this.preload;},getFormatSettings:function(){return this.oFormatSettings;},getFrameOptions:function(){return this.frameOptions;},getWhitelistService:function(){return this.whitelistService;},getSupportMode:function(){return this.support;},_collect:function(){var m=this.mChanges||(this.mChanges={__count:0});m.__count++;return m;},_endCollect:function(){var m=this.mChanges;if(m&&(--m.__count)===0){delete m.__count;this._oCore&&this._oCore.fireLocalizationChanged(m);delete this.mChanges;}},getStatistics:function(){var l=this.statistics;try{l=l||window.localStorage.getItem("sap-ui-statistics")=="X";}catch(e){}return l;},getNoNativeScroll:function(){return false;},getHandleValidation:function(){return this["xx-handleValidation"];},getHyphenation:function(){return this["xx-hyphenation"];},applySettings:function(s){function e(l,m){var n,u;for(n in m){u="set"+n.slice(0,1).toUpperCase()+n.slice(1);if(n==='formatSettings'&&l.oFormatSettings){e(l.oFormatSettings,m[n]);}else if(typeof l[u]==='function'){l[u](m[n]);}else{b.warning("Configuration.applySettings: unknown setting '"+n+"' ignored");}}}c(typeof s==='object',"mSettings must be an object");this._collect();e(this,s);this._endCollect();return this;}});g.AnimationMode={full:"full",basic:"basic",minimal:"minimal",none:"none"};function h(l){try{if(l&&typeof l==='string'){return new L(l);}}catch(e){}}function t(l){return l?l.toString():null;}var M={"ZH":"zh-Hans","ZF":"zh-Hant","1Q":"en-US-x-saptrc","2Q":"en-US-x-sappsd"};var j={"":{pattern:null},"1":{pattern:"dd.MM.yyyy"},"2":{pattern:"MM/dd/yyyy"},"3":{pattern:"MM-dd-yyyy"},"4":{pattern:"yyyy.MM.dd"},"5":{pattern:"yyyy/MM/dd"},"6":{pattern:"yyyy-MM-dd"},"7":{pattern:"Gyy.MM.dd"},"8":{pattern:"Gyy/MM/dd"},"9":{pattern:"Gyy-MM-dd"},"A":{pattern:"yyyy/MM/dd"},"B":{pattern:"yyyy/MM/dd"},"C":{pattern:"yyyy/MM/dd"}};var k={"":{"short":null,medium:null,dayPeriods:null},"0":{"short":"HH:mm",medium:"HH:mm:ss",dayPeriods:null},"1":{"short":"hh:mm a",medium:"hh:mm:ss a",dayPeriods:["AM","PM"]},"2":{"short":"hh:mm a",medium:"hh:mm:ss a",dayPeriods:["am","pm"]},"3":{"short":"KK:mm a",medium:"KK:mm:ss a",dayPeriods:["AM","PM"]},"4":{"short":"KK:mm a",medium:"KK:mm:ss a",dayPeriods:["am","pm"]}};var o={"":{groupingSeparator:null,decimalSeparator:null}," ":{groupingSeparator:".",decimalSeparator:","},"X":{groupingSeparator:",",decimalSeparator:"."},"Y":{groupingSeparator:" ",decimalSeparator:","}};function p(e,m){if(!e){throw new Error(m);}}function r(e,v,P){var l=[];for(var K in e){if(e.hasOwnProperty(K)){if(e[K]===v){return;}l.push(e[K]);}}throw new Error("Unsupported Enumeration value for "+P+", valid values are: "+l.join(", "));}B.extend("sap.ui.core.Configuration.FormatSettings",{constructor:function(e){this.oConfiguration=e;this.mSettings={};this.sLegacyDateFormat=undefined;this.sLegacyTimeFormat=undefined;this.sLegacyNumberFormatSymbolSet=undefined;},getFormatLocale:function(){function e(m){var n=m.oConfiguration.language;if(!i(m.mSettings)){var l=n.toString();if(l.indexOf("-x-")<0){l=l+"-x-sapufmt";}else if(l.indexOf("-sapufmt")<=l.indexOf("-x-")){l=l+"-sapufmt";}n=new L(l);}return n;}return this.oConfiguration.formatLocale||e(this);},_set:function(K,v){var O=this.mSettings[K];if(v!=null){this.mSettings[K]=v;}else{delete this.mSettings[K];}if((O!=null||v!=null)&&!d(O,v)){var m=this.oConfiguration._collect();m[K]=v;this.oConfiguration._endCollect();}},getCustomUnits:function(){return this.mSettings["units"]?this.mSettings["units"]["short"]:undefined;},setCustomUnits:function(u){var m=null;if(u){m={"short":u};}this._set("units",m);return this;},addCustomUnits:function(u){var e=this.getCustomUnits();if(e){u=q.extend({},e,u);}this.setCustomUnits(u);return this;},setUnitMappings:function(u){this._set("unitMappings",u);return this;},addUnitMappings:function(u){var e=this.getUnitMappings();if(e){u=q.extend({},e,u);}this.setUnitMappings(u);return this;},getUnitMappings:function(){return this.mSettings["unitMappings"];},getDatePattern:function(s){c(s=="short"||s=="medium"||s=="long"||s=="full","sStyle must be short, medium, long or full");return this.mSettings["dateFormats-"+s];},setDatePattern:function(s,P){p(s=="short"||s=="medium"||s=="long"||s=="full","sStyle must be short, medium, long or full");this._set("dateFormats-"+s,P);return this;},getTimePattern:function(s){c(s=="short"||s=="medium"||s=="long"||s=="full","sStyle must be short, medium, long or full");return this.mSettings["timeFormats-"+s];},setTimePattern:function(s,P){p(s=="short"||s=="medium"||s=="long"||s=="full","sStyle must be short, medium, long or full");this._set("timeFormats-"+s,P);return this;},getNumberSymbol:function(T){c(T=="decimal"||T=="group"||T=="plusSign"||T=="minusSign","sType must be decimal, group, plusSign or minusSign");return this.mSettings["symbols-latn-"+T];},setNumberSymbol:function(T,s){p(T=="decimal"||T=="group"||T=="plusSign"||T=="minusSign","sType must be decimal, group, plusSign or minusSign");this._set("symbols-latn-"+T,s);return this;},getCustomCurrencies:function(){return this.mSettings["currency"];},setCustomCurrencies:function(m){p(typeof m==="object"||m==null,"mCurrencyDigits must be an object");Object.keys(m||{}).forEach(function(s){p(typeof s==="string");p(typeof m[s]==="object");});this._set("currency",m);return this;},addCustomCurrencies:function(m){var e=this.getCustomCurrencies();if(e){m=q.extend({},e,m);}this.setCustomCurrencies(m);return this;},setFirstDayOfWeek:function(v){p(typeof v=="number"&&v>=0&&v<=6,"iValue must be an integer value between 0 and 6");this._set("weekData-firstDay",v);return this;},_setDayPeriods:function(w,T){c(w=="narrow"||w=="abbreviated"||w=="wide","sWidth must be narrow, abbreviated or wide");this._set("dayPeriods-format-"+w,T);return this;},getLegacyDateFormat:function(){return this.sLegacyDateFormat||undefined;},setLegacyDateFormat:function(F){F=F?String(F).toUpperCase():"";p(!F||j.hasOwnProperty(F),"sFormatId must be one of ['1','2','3','4','5','6','7','8','9','A','B','C'] or empty");var m=this.oConfiguration._collect();this.sLegacyDateFormat=m.legacyDateFormat=F;this.setDatePattern("short",j[F].pattern);this.setDatePattern("medium",j[F].pattern);this.oConfiguration._endCollect();return this;},getLegacyTimeFormat:function(){return this.sLegacyTimeFormat||undefined;},setLegacyTimeFormat:function(F){p(!F||k.hasOwnProperty(F),"sFormatId must be one of ['0','1','2','3','4'] or empty");var m=this.oConfiguration._collect();this.sLegacyTimeFormat=m.legacyTimeFormat=F=F||"";this.setTimePattern("short",k[F]["short"]);this.setTimePattern("medium",k[F]["medium"]);this._setDayPeriods("abbreviated",k[F].dayPeriods);this.oConfiguration._endCollect();return this;},getLegacyNumberFormat:function(){return this.sLegacyNumberFormat||undefined;},setLegacyNumberFormat:function(F){F=F?F.toUpperCase():"";p(!F||o.hasOwnProperty(F),"sFormatId must be one of [' ','X','Y'] or empty");var m=this.oConfiguration._collect();this.sLegacyNumberFormat=m.legacyNumberFormat=F;this.setNumberSymbol("group",o[F].groupingSeparator);this.setNumberSymbol("decimal",o[F].decimalSeparator);this.oConfiguration._endCollect();return this;},setLegacyDateCalendarCustomizing:function(m){p(Array.isArray(m),"aMappings must be an Array");var e=this.oConfiguration._collect();this.aLegacyDateCalendarCustomizing=e.legacyDateCalendarCustomizing=m;this.oConfiguration._endCollect();return this;},getLegacyDateCalendarCustomizing:function(){return this.aLegacyDateCalendarCustomizing;},getCustomLocaleData:function(){return this.mSettings;}});return g;});
