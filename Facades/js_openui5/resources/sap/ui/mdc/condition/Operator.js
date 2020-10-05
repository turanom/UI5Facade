/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
*/
sap.ui.define(['sap/ui/base/Object','sap/ui/model/Filter','sap/ui/model/ParseException','sap/ui/Device','sap/base/Log','sap/base/util/ObjectPath','./Condition','sap/ui/mdc/enum/ConditionValidated',"sap/base/strings/escapeRegExp"],function(B,F,P,D,L,O,C,a,e){"use strict";var m=sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");sap.ui.getCore().attachLocalizationChanged(function(){m=sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");});var b=B.extend("sap.ui.mdc.condition.Operator",{constructor:function(c){B.apply(this,arguments);if(!c){throw new Error("Operator configuration missing");}if(!c.name){L.warning("Operator configuration expects a name property");}if(!c.filterOperator&&!c.getModelFilter){throw new Error("Operator configuration for "+c.name+" needs a default filter operator from sap.ui.model.FilterOperator or the function getModelFilter");}this.name=c.name;this.filterOperator=c.filterOperator;this.valueTypes=c.valueTypes;this.paramTypes=c.paramTypes;this.displayFormats=c.displayFormats;var t="operators."+this.name;var l=t+".longText";var T=t+".tokenText";this.longText=c.longText||_(l)||"";this.tokenText=c.tokenText||_(T)||"";if(this.longText===l){this.longText=this.tokenText.replace(/\{0\}/g,"x");}if(this.tokenText===T){this.tokenText=this.longText;}if(this.tokenText){var r;var s;if(c.tokenParse){s=e(this.tokenText);if(D.browser.msie){s=s.replace(/\$/g,"$$$");}this.tokenParse=c.tokenParse.replace(/#tokenText#/g,s);for(var i=0;i<this.valueTypes.length;i++){var R=this.paramTypes?this.paramTypes[i]:this.valueTypes[i];this.tokenParse=this.tokenParse.replace(new RegExp("\\\\\\$"+i+"|"+i+"\\\\\\$"+"|"+"\\\\\\{"+i+"\\\\\\}","g"),R);}r=this.tokenParse;}else{r=e(this.tokenText);}this.tokenParseRegExp=new RegExp(r,"i");if(c.tokenFormat){s=this.tokenText;if(D.browser.msie){s=s.replace(/\$/g,"$$$");}this.tokenFormat=c.tokenFormat.replace(/\#tokenText\#/g,s);}else{this.tokenFormat=this.tokenText;}}if(c.format){this.format=c.format;}if(c.parse){this.parse=c.parse;}if(c.validate){this.validate=c.validate;}if(c.getModelFilter){this.getModelFilter=c.getModelFilter;}if(c.isEmpty){this.isEmpty=c.isEmpty;}if(c.createControl){this.createControl=c.createControl;}if(c.splitText){this.splitText=c.splitText;}if(c.getCheckValue){this.getCheckValue=c.getCheckValue;}if(c.getValues){this.getValues=c.getValues;}if(c.checkValidated){this.checkValidated=c.checkValidated;}this.exclude=!!c.exclude;this.validateInput=!!c.validateInput;}});b.ValueType={Self:"self",Static:"static"};function _(k,t){var c=k+(t?"."+t:""),T;if(m.hasText(c)){T=m.getText(c);}else if(t){T=m.getText(k);}else{T=c;}return T;}b.prototype.getTypeText=function(k,t){return _(k,t);};b.prototype.getModelFilter=function(c,f,t){var v=c.values[0];var o;var d;var g=f.split(",");if(Array.isArray(v)&&g.length>1){v=v[0];f=g[0];d=new F({path:g[1],operator:"EQ",value1:c.values[0][1]});}if(d&&v===undefined){o=d;d=undefined;}else if(this.valueTypes.length==1){o=new F({path:f,operator:this.filterOperator,value1:v});}else{var V=c.values[1];if(Array.isArray(V)&&g.length>1){V=V[0];}o=new F({path:f,operator:this.filterOperator,value1:v,value2:V});}if(d){o=new F({filters:[o,d],and:true});}if(c.inParameters){var h=[o];for(var i in c.inParameters){h.push(new F({path:i,operator:"EQ",value1:c.inParameters[i]}));}o=new F({filters:h,and:true});}return o;};b.prototype.isEmpty=function(c,t){var d=false;if(c){for(var i=0;i<this.valueTypes.length;i++){if(this.valueTypes[i]!==b.ValueType.Static){var v=c.values[i];if(v===null||v===undefined||v===""){d=true;break;}}}}return d;};b.prototype.format=function(c,t,d){var V=c.values;var T=this.tokenFormat;var f=this.valueTypes.length;for(var i=0;i<f;i++){if(this.valueTypes[i]!==b.ValueType.Static){var v=V[i]!==undefined&&V[i]!==null?V[i]:"";if(this.valueTypes[i]!==b.ValueType.Self){t=this._createLocalType(this.valueTypes[i]);}var r=t?t.formatValue(v,"string"):v;T=T.replace(new RegExp("\\$"+i+"|"+i+"\\$"+"|"+"\\{"+i+"\\}","g"),r);}}return T;};b.prototype.parse=function(t,T,d,c){var v=this.getValues(t,d,c);var r;if(v){r=[];for(var i=0;i<this.valueTypes.length;i++){if(this.valueTypes[i]&&[b.ValueType.Self,b.ValueType.Static].indexOf(this.valueTypes[i])===-1){T=this._createLocalType(this.valueTypes[i]);}try{if(this.valueTypes[i]!==b.ValueType.Static){var V;if(this.valueTypes[i]){V=this._parseValue(v[i],T);}else{V=v[i];}r.push(V);}}catch(f){L.warning(f.message);throw f;}}}return r;};b.prototype._parseValue=function(v,t){if(v===undefined){return v;}var c;if(t instanceof sap.ui.model.CompositeType&&t._aCurrentValue&&t.getParseWithValues()){c=t._aCurrentValue;}var V=t?t.parseValue(v,"string",c):v;if(c&&Array.isArray(V)){for(var j=0;j<V.length;j++){if(V[j]===undefined){V[j]=c[j];}}}return V;};b.prototype.validate=function(v,t){var c=this.valueTypes.length;for(var i=0;i<c;i++){var V=v[i]!==undefined&&v[i]!==null?v[i]:"";if(this.valueTypes[i]&&this.valueTypes[i]!==b.ValueType.Static){if([b.ValueType.Self,b.ValueType.Static].indexOf(this.valueTypes[i])===-1){t=this._createLocalType(this.valueTypes[i]);}if(t){t.validateValue(V);}}}};b.prototype._createLocalType=function(t){if(!this._oType){var T;var f;var c;if(typeof t==="string"){T=t;}else if(t&&typeof t==="object"){T=t.name;f=t.formatOptions;c=t.constraints;}sap.ui.requireSync(T.replace(/\./g,"/"));var o=O.get(T||"");this._oType=new o(f,c);}return this._oType;};b.prototype.test=function(t){return this.tokenParseRegExp.test(t);};b.prototype.getValues=function(t,d,c){var M=t.match(this.tokenParseRegExp);var v;if(M||(c&&t)){v=[];for(var i=0;i<this.valueTypes.length;i++){var V;if(M){V=M[i+1];}else if(c){if(i>0){break;}V=t;}v.push(V);}}return v;};b.prototype.getCondition=function(t,T,d,c){if(this.test(t)||(c&&t)){var v=this.parse(t,T,d,c);if(v.length==this.valueTypes.length||this.valueTypes[0]===b.ValueType.Static||(v.length===1&&this.valueTypes.length===2&&!this.valueTypes[1])){var o=C.createCondition(this.name,v);this.checkValidated(o);return o;}else{throw new P("Parsed value don't meet operator");}}return null;};b.prototype.isSingleValue=function(){if(this.valueTypes.length>1&&this.valueTypes[1]){return false;}return true;};b.prototype.getCheckValue=function(c){if(this.valueTypes[0]&&this.valueTypes[0]===b.ValueType.Static){return{};}else{return{values:c.values};}};b.prototype.compareConditions=function(c,o){var E=false;if(c.operator===this.name&&c.operator===o.operator){var d=this.getCheckValue(c);var f=this.getCheckValue(o);if(c.inParameters&&o.inParameters){d.inParameters=c.inParameters;f.inParameters=o.inParameters;}if(c.outParameters&&o.outParameters){d.outParameters=c.outParameters;f.outParameters=o.outParameters;}if(c.validated&&o.validated){d.validated=c.validated;f.validated=o.validated;}var s=JSON.stringify(d);var g=JSON.stringify(f);if(s===g){E=true;}}return E;};b.prototype.checkValidated=function(c){c.validated=a.NotValidated;};return b;});
