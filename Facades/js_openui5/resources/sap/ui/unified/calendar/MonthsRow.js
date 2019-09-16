/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Control','sap/ui/core/LocaleData','sap/ui/core/delegate/ItemNavigation','sap/ui/unified/calendar/CalendarUtils','sap/ui/unified/calendar/CalendarDate','sap/ui/unified/library','sap/ui/core/format/DateFormat','sap/ui/core/library','sap/ui/core/Locale',"./MonthsRowRenderer","sap/ui/dom/containsOrEquals","sap/ui/thirdparty/jquery","sap/ui/unified/DateRange"],function(C,L,I,a,c,l,D,d,e,M,f,q,g){"use strict";var h=d.CalendarType;var j=C.extend("sap.ui.unified.calendar.MonthsRow",{metadata:{library:"sap.ui.unified",properties:{date:{type:"object",group:"Data"},startDate:{type:"object",group:"Data"},months:{type:"int",group:"Appearance",defaultValue:12},intervalSelection:{type:"boolean",group:"Behavior",defaultValue:false},singleSelection:{type:"boolean",group:"Behavior",defaultValue:true},showHeader:{type:"boolean",group:"Appearance",defaultValue:false}},aggregations:{selectedDates:{type:"sap.ui.unified.DateRange",multiple:true,singularName:"selectedDate"},specialDates:{type:"sap.ui.unified.DateTypeRange",multiple:true,singularName:"specialDate"}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"},legend:{type:"sap.ui.unified.CalendarLegend",multiple:false}},events:{select:{},focus:{parameters:{date:{type:"object"},notVisible:{type:"boolean"}}}}}});j.prototype.init=function(){this._oFormatYyyymm=D.getInstance({pattern:"yyyyMMdd",calendarType:h.Gregorian});this._oFormatLong=D.getInstance({pattern:"MMMM y"});this._mouseMoveProxy=q.proxy(this._handleMouseMove,this);this._rb=sap.ui.getCore().getLibraryResourceBundle("sap.ui.unified");};j.prototype.exit=function(){if(this._oItemNavigation){this.removeDelegate(this._oItemNavigation);this._oItemNavigation.destroy();delete this._oItemNavigation;}if(this._sInvalidateMonths){clearTimeout(this._sInvalidateMonths);}};j.prototype.onAfterRendering=function(){_.call(this);y.call(this);};j.prototype.onsapfocusleave=function(E){if(!E.relatedControlId||!f(this.getDomRef(),sap.ui.getCore().byId(E.relatedControlId).getFocusDomRef())){if(this._bMouseMove){B.call(this,true);u.call(this,this._getDate());this._bMoveChange=false;this._bMousedownChange=false;x.call(this);}if(this._bMousedownChange){this._bMousedownChange=false;x.call(this);}}};j.prototype.invalidate=function(O){if(!this._bDateRangeChanged&&(!O||!(O instanceof g))){C.prototype.invalidate.apply(this,arguments);}else if(this.getDomRef()&&!this._sInvalidateMonths){if(this._bInvalidateSync){z.call(this);}else{this._sInvalidateMonths=setTimeout(z.bind(this),0);}}};j.prototype.removeAllSelectedDates=function(){this._bDateRangeChanged=true;var R=this.removeAllAggregation("selectedDates");return R;};j.prototype.destroySelectedDates=function(){this._bDateRangeChanged=true;var b=this.destroyAggregation("selectedDates");return b;};j.prototype.removeAllSpecialDates=function(){this._bDateRangeChanged=true;var R=this.removeAllAggregation("specialDates");return R;};j.prototype.destroySpecialDates=function(){this._bDateRangeChanged=true;var b=this.destroyAggregation("specialDates");return b;};j.prototype.setDate=function(b){p.call(this,c.fromLocalJSDate(b),false);return this;};j.prototype._setDate=function(b){var i=b.toLocalJSDate();this.setProperty("date",i,true);this._oDate=b;};j.prototype._getDate=function(){if(!this._oDate){this._oDate=new c();}return this._oDate;};j.prototype.setStartDate=function(S){a._checkJSDateObject(S);var b,Y,O;Y=S.getFullYear();a._checkYearInValidRange(Y);b=c.fromLocalJSDate(S);this.setProperty("startDate",S,true);this._oStartDate=b;this._oStartDate.setDate(1);if(this.getDomRef()){O=this._getDate().toLocalJSDate();this._bNoRangeCheck=true;this.displayDate(S);this._bNoRangeCheck=false;if(O&&this.checkDateFocusable(O)){this.setDate(O);}}return this;};j.prototype._getStartDate=function(){if(!this._oStartDate){this._oStartDate=new c();this._oStartDate.setDate(1);}return this._oStartDate;};j.prototype.displayDate=function(b){p.call(this,c.fromLocalJSDate(b),true);return this;};j.prototype._getLocale=function(){var P=this.getParent();if(P&&P.getLocale){return P.getLocale();}else if(!this._sLocale){this._sLocale=sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale().toString();}return this._sLocale;};j.prototype._getLocaleData=function(){var P=this.getParent();if(P&&P._getLocaleData){return P._getLocaleData();}else if(!this._oLocaleData){var b=this._getLocale();var i=new e(b);this._oLocaleData=L.getInstance(i);}return this._oLocaleData;};j.prototype._getFormatLong=function(){var b=this._getLocale();if(this._oFormatLong.oLocale.toString()!=b){var i=new e(b);this._oFormatLong=D.getInstance({style:"long"},i);}return this._oFormatLong;};j.prototype.getIntervalSelection=function(){var P=this.getParent();if(P&&P.getIntervalSelection){return P.getIntervalSelection();}else{return this.getProperty("intervalSelection");}};j.prototype.getSingleSelection=function(){var P=this.getParent();if(P&&P.getSingleSelection){return P.getSingleSelection();}else{return this.getProperty("singleSelection");}};j.prototype.getSelectedDates=function(){var P=this.getParent();if(P&&P.getSelectedDates){return P.getSelectedDates();}else{return this.getAggregation("selectedDates",[]);}};j.prototype.getSpecialDates=function(){var P=this.getParent();if(P&&P.getSpecialDates){return P.getSpecialDates();}else{return this.getAggregation("specialDates",[]);}};j.prototype._getShowHeader=function(){var P=this.getParent();if(P&&P._getShowItemHeader){return P._getShowItemHeader();}else{return this.getProperty("showHeader");}};j.prototype.getAriaLabelledBy=function(){var P=this.getParent();if(P&&P.getAriaLabelledBy){return P.getAriaLabelledBy();}else{return this.getAssociation("ariaLabelledBy",[]);}};j.prototype.getLegend=function(){var P=this.getParent();if(P&&P.getLegend){return P.getLegend();}else{return this.getAssociation("ariaLabelledBy",[]);}};j.prototype._setAriaRole=function(R){this._ariaRole=R;return this;};j.prototype._getAriaRole=function(){return this._ariaRole?this._ariaRole:"gridcell";};j.prototype._checkDateSelected=function(b){var R,S,E,T,F=0,G=0,H=0,i,J,K;a._checkCalendarDate(b);J=this.getSelectedDates();K=new c(b);K.setDate(1);T=K.toUTCJSDate().getTime();for(i=0;i<J.length;i++){R=J[i];S=R.getStartDate();F=0;if(S){S=c.fromLocalJSDate(S);S.setDate(1);F=S.toUTCJSDate().getTime();}E=R.getEndDate();G=0;if(E){E=c.fromLocalJSDate(E);E.setDate(1);G=E.toUTCJSDate().getTime();}if(T==F&&!E){H=1;break;}else if(T==F&&E){H=2;if(E&&T==G){H=5;}break;}else if(E&&T==G){H=3;break;}else if(E&&T>F&&T<G){H=4;break;}if(this.getSingleSelection()){break;}}return H;};j.prototype._getDateType=function(b){a._checkCalendarDate(b);var T,R,i,S,E=0,F,G=0,H,J=this.getSpecialDates(),K=new c(b);K.setDate(1);H=K.toUTCJSDate().getTime();for(i=0;i<J.length;i++){R=J[i];S=R.getStartDate();E=0;if(S){S=c.fromLocalJSDate(S);S.setDate(1);E=S.toUTCJSDate().getTime();}F=R.getEndDate();G=0;if(F){F=c.fromLocalJSDate(F);F.setDate(a._daysInMonth(F));G=F.toUTCJSDate().getTime();}if((H==E&&!F)||(H>=E&&H<=G)){T={type:R.getType(),tooltip:R.getTooltip_AsString()};break;}}return T;};j.prototype._checkMonthEnabled=function(b){a._checkCalendarDate(b);var P=this.getParent();if(P&&P._oMinDate&&P._oMaxDate){if(a._isOutside(b,P._oMinDate,P._oMaxDate)){return false;}}return true;};j.prototype._handleMouseMove=function(E){if(!this.$().is(":visible")){B.call(this,true);}var T=q(E.target);if(T.hasClass("sapUiCalItemText")){T=T.parent();}if(T.hasClass("sapUiCalItem")){var O=this._getDate();var F=c.fromLocalJSDate(this._oFormatYyyymm.parse(T.attr("data-sap-month")));F.setDate(1);if(!F.isSame(O)){this._setDate(F);u.call(this,F,true);this._bMoveChange=true;}}};j.prototype.onmouseup=function(E){if(this._bMouseMove){B.call(this,true);var F=this._getDate();var b=this._oItemNavigation.getItemDomRefs();for(var i=0;i<b.length;i++){var $=q(b[i]);if($.attr("data-sap-month")==this._oFormatYyyymm.format(F.toUTCJSDate(),true)){$.focus();break;}}if(this._bMoveChange){var T=q(E.target);if(T.hasClass("sapUiCalItemText")){T=T.parent();}if(T.hasClass("sapUiCalItem")){F=c.fromLocalJSDate(this._oFormatYyyymm.parse(T.attr("data-sap-month")));F.setDate(1);}u.call(this,F);this._bMoveChange=false;this._bMousedownChange=false;x.call(this);}}if(this._bMousedownChange){this._bMousedownChange=false;x.call(this);}};j.prototype.onsapselect=function(E){var S=u.call(this,this._getDate());if(S){x.call(this);}E.stopPropagation();E.preventDefault();};j.prototype.onsapselectmodifiers=function(E){this.onsapselect(E);};j.prototype.onsappageupmodifiers=function(E){var F=new c(this._getDate());var Y=F.getYear();if(E.metaKey||E.ctrlKey){F.setYear(Y-10);}else{var i=this.getMonths();if(i<=12){F.setYear(Y-1);}else{F.setMonth(F.getMonth()-i);}}this.fireFocus({date:F.toLocalJSDate(),notVisible:true});E.preventDefault();};j.prototype.onsappagedownmodifiers=function(E){var F=new c(this._getDate());var Y=F.getYear();if(E.metaKey||E.ctrlKey){F.setYear(Y+10);}else{var i=this.getMonths();if(i<=12){F.setYear(Y+1);}else{F.setMonth(F.getMonth()+i);}}this.fireFocus({date:F.toLocalJSDate(),notVisible:true});E.preventDefault();};j.prototype.onThemeChanged=function(){if(this._bNoThemeChange){return;}this._bNamesLengthChecked=undefined;this._bLongWeekDays=undefined;var b=this._getLocaleData();var E=b.getMonthsStandAlone("wide");var F=this.$("months").children();var G=this._getStartDate().getMonth();for(var i=0;i<F.length;i++){var $=q(q(F[i]).children(".sapUiCalItemText"));$.text(E[(i+G)%12]);}y.call(this);};j.prototype.checkDateFocusable=function(b){a._checkJSDateObject(b);if(this._bNoRangeCheck){return false;}var S=this._getStartDate();var E=new c(S);E.setDate(1);E.setMonth(E.getMonth()+this.getMonths());var i=c.fromLocalJSDate(b);return i.isSameOrAfter(S)&&i.isBefore(E);};j.prototype.applyFocusInfo=function(i){this._oItemNavigation.focusItem(this._oItemNavigation.getFocusedIndex());return this;};function _(){var b=this._getDate();var Y=this._oFormatYyyymm.format(b.toUTCJSDate(),true);var E=0;var R=this.$("months").get(0);var F=this.$("months").children(".sapUiCalItem");for(var i=0;i<F.length;i++){var $=q(F[i]);if($.attr("data-sap-month")===Y){E=i;break;}}if(!this._oItemNavigation){this._oItemNavigation=new I();this._oItemNavigation.attachEvent(I.Events.AfterFocus,k,this);this._oItemNavigation.attachEvent(I.Events.FocusAgain,m,this);this._oItemNavigation.attachEvent(I.Events.BorderReached,n,this);this.addDelegate(this._oItemNavigation);this._oItemNavigation.setDisabledModifiers({sapnext:["alt"],sapprevious:["alt"],saphome:["alt"],sapend:["alt"]});this._oItemNavigation.setCycling(false);this._oItemNavigation.setColumns(1,true);}this._oItemNavigation.setRootDomRef(R);this._oItemNavigation.setItemDomRefs(F);this._oItemNavigation.setFocusedIndex(E);this._oItemNavigation.setPageSize(F.length);}function k(b){var i=b.getParameter("index");var E=b.getParameter("event");if(!E){return;}var O=this._getDate();var F=new c(O);var G=this._oItemNavigation.getItemDomRefs();var $=q(G[i]);F=c.fromLocalJSDate(this._oFormatYyyymm.parse($.attr("data-sap-month")));F.setDate(1);this._setDate(F);this.fireFocus({date:F.toLocalJSDate(),notVisible:false});if(E.type=="mousedown"){o.call(this,E,F,i);}}function m(b){var i=b.getParameter("index");var E=b.getParameter("event");if(!E){return;}if(E.type=="mousedown"){var F=this._getDate();o.call(this,E,F,i);}}function n(b){var E=b.getParameter("event");var i=this.getMonths();var O=this._getDate();var F=new c(O);if(E.type){switch(E.type){case"sapnext":case"sapnextmodifiers":F.setMonth(F.getMonth()+1);break;case"sapprevious":case"sappreviousmodifiers":F.setMonth(F.getMonth()-1);break;case"sappagedown":F.setMonth(F.getMonth()+i);break;case"sappageup":F.setMonth(F.getMonth()-i);break;default:break;}this.fireFocus({date:F.toLocalJSDate(),notVisible:true});}}function o(E,F,i){if(E.button){return;}var S=u.call(this,F);if(S){this._bMousedownChange=true;}if(this._bMouseMove){B.call(this,true);this._bMoveChange=false;}else if(S&&this.getIntervalSelection()&&this.$().is(":visible")){A.call(this,true);}E.preventDefault();E.setMark("cancelAutoClose");}function p(b,N){a._checkCalendarDate(b);var Y=b.getYear();a._checkYearInValidRange(Y);var F=true;if(!this.getDate()||!b.isSame(c.fromLocalJSDate(this.getDate()))){var i=new c(b);i.setDate(1);F=this.checkDateFocusable(b.toLocalJSDate());if(!this._bNoRangeCheck&&!F){throw new Error("Date must be in visible date range; "+this);}this.setProperty("date",b.toLocalJSDate(),true);this._oDate=i;}if(this.getDomRef()){if(F){r.call(this,this._oDate,N);}else{s.call(this,N);}}}function r(b,N){var Y=this._oFormatYyyymm.format(b.toUTCJSDate(),true);var E=this._oItemNavigation.getItemDomRefs();var $;for(var i=0;i<E.length;i++){$=q(E[i]);if($.attr("data-sap-month")==Y){if(document.activeElement!=E[i]){if(N){this._oItemNavigation.setFocusedIndex(i);}else{this._oItemNavigation.focusItem(i);}}break;}}}function s(N){var b=this._getStartDate();var $=this.$("months");if($.length>0){var R=sap.ui.getCore().createRenderManager();this.getRenderer().renderMonths(R,this,b);R.flush($[0]);R.destroy();}t.call(this);_.call(this);if(!N){this._oItemNavigation.focusItem(this._oItemNavigation.getFocusedIndex());}}function t(){var S=this._getStartDate();if(this._getShowHeader()){var $=this.$("Head");if($.length>0){var b=this._getLocaleData();var R=sap.ui.getCore().createRenderManager();this.getRenderer().renderHeaderLine(R,this,b,S);R.flush($[0]);R.destroy();}}}function u(b,E){if(!this._checkMonthEnabled(b)){return false;}var S=this.getSelectedDates();var F;var G=this._oItemNavigation.getItemDomRefs();var $;var Y;var i=0;var P=this.getParent();var H=this;var J;if(P&&P.getSelectedDates){H=P;}if(this.getSingleSelection()){if(S.length>0){F=S[0];J=F.getStartDate();if(J){J=c.fromLocalJSDate(J);J.setDate(1);}}else{F=new g();H.addAggregation("selectedDates",F,true);}if(this.getIntervalSelection()&&(!F.getEndDate()||E)&&J){var K;if(b.isBefore(J)){K=J;J=b;if(!E){F.setProperty("startDate",J.toLocalJSDate(),true);F.setProperty("endDate",K.toLocalJSDate(),true);}}else if(b.isSameOrAfter(J)){K=b;if(!E){F.setProperty("endDate",K.toLocalJSDate(),true);}}v.call(this,J,K);}else{v.call(this,b);F.setProperty("startDate",b.toLocalJSDate(),true);F.setProperty("endDate",undefined,true);}}else{if(this.getIntervalSelection()){throw new Error("Calender don't support multiple interval selection");}else{var N=this._checkDateSelected(b);if(N>0){for(i=0;i<S.length;i++){J=S[i].getStartDate();if(J){J=c.fromLocalJSDate(J);J.setDate(1);if(b.isSame(J)){H.removeAggregation("selectedDates",i,true);break;}}}}else{F=new g({startDate:b.toLocalJSDate()});H.addAggregation("selectedDates",F,true);}Y=this._oFormatYyyymm.format(b.toUTCJSDate(),true);for(i=0;i<G.length;i++){$=q(G[i]);if($.attr("data-sap-month")==Y){if(N>0){$.removeClass("sapUiCalItemSel");$.attr("aria-selected","false");}else{$.addClass("sapUiCalItemSel");$.attr("aria-selected","true");}}}}}return true;}function v(S,E){var b=this._oItemNavigation.getItemDomRefs();var $;var i=0;var F=false;var G=false;if(!E){var Y=this._oFormatYyyymm.format(S.toUTCJSDate(),true);for(i=0;i<b.length;i++){$=q(b[i]);F=false;G=false;if($.attr("data-sap-month")==Y){$.addClass("sapUiCalItemSel");$.attr("aria-selected","true");F=true;}else if($.hasClass("sapUiCalItemSel")){$.removeClass("sapUiCalItemSel");$.attr("aria-selected","false");}if($.hasClass("sapUiCalItemSelStart")){$.removeClass("sapUiCalItemSelStart");}else if($.hasClass("sapUiCalItemSelBetween")){$.removeClass("sapUiCalItemSelBetween");}else if($.hasClass("sapUiCalItemSelEnd")){$.removeClass("sapUiCalItemSelEnd");}w.call(this,$,F,G);}}else{var H;for(i=0;i<b.length;i++){$=q(b[i]);F=false;G=false;H=c.fromLocalJSDate(this._oFormatYyyymm.parse($.attr("data-sap-month")));H.setDate(1);if(H.isSame(S)){$.addClass("sapUiCalItemSelStart");F=true;$.addClass("sapUiCalItemSel");$.attr("aria-selected","true");if(E&&H.isSame(E)){$.addClass("sapUiCalItemSelEnd");G=true;}$.removeClass("sapUiCalItemSelBetween");}else if(E&&a._isBetween(H,S,E)){$.addClass("sapUiCalItemSel");$.attr("aria-selected","true");$.addClass("sapUiCalItemSelBetween");$.removeClass("sapUiCalItemSelStart");$.removeClass("sapUiCalItemSelEnd");}else if(E&&H.isSame(E)){$.addClass("sapUiCalItemSelEnd");G=true;$.addClass("sapUiCalItemSel");$.attr("aria-selected","true");$.removeClass("sapUiCalItemSelStart");$.removeClass("sapUiCalItemSelBetween");}else{if($.hasClass("sapUiCalItemSel")){$.removeClass("sapUiCalItemSel");$.attr("aria-selected","false");}if($.hasClass("sapUiCalItemSelStart")){$.removeClass("sapUiCalItemSelStart");}else if($.hasClass("sapUiCalItemSelBetween")){$.removeClass("sapUiCalItemSelBetween");}else if($.hasClass("sapUiCalItemSelEnd")){$.removeClass("sapUiCalItemSelEnd");}}w.call(this,$,F,G);}}}function w($,S,E){if(!this.getIntervalSelection()){return;}var b="";var F=[];var G=this.getId();var H=false;b=$.attr("aria-describedby");if(b){F=b.split(" ");}var J=-1;var K=-1;for(var i=0;i<F.length;i++){var N=F[i];if(N==(G+"-Start")){J=i;}if(N==(G+"-End")){K=i;}}if(J>=0&&!S){F.splice(J,1);H=true;if(K>J){K--;}}if(K>=0&&!E){F.splice(K,1);H=true;}if(J<0&&S){F.push(G+"-Start");H=true;}if(K<0&&E){F.push(G+"-End");H=true;}if(H){b=F.join(" ");$.attr("aria-describedby",b);}}function x(){if(this._bMouseMove){B.call(this,true);}this.fireSelect();}function y(){if(!this._bNamesLengthChecked){var i=0;var E=this.$("months").children();var T=false;var F=this.getMonths();var G=Math.ceil(12/F);var H=0;var J=this._getLocaleData();var K=J.getMonthsStandAlone("wide");var $;for(var b=0;b<G;b++){if(F<12){for(i=0;i<E.length;i++){$=q(q(E[i]).children(".sapUiCalItemText"));$.text(K[(i+H)%12]);}H=H+F;if(H>11){H=11;}}for(i=0;i<E.length;i++){var N=E[i];if(Math.abs(N.clientWidth-N.scrollWidth)>1){T=true;break;}}if(T){break;}}if(F<12){H=this._getStartDate().getMonth();for(i=0;i<E.length;i++){$=q(q(E[i]).children(".sapUiCalItemText"));$.text(K[(i+H)%12]);}}if(T){this._bLongMonth=false;var O=J.getMonthsStandAlone("abbreviated");H=this._getStartDate().getMonth();for(i=0;i<E.length;i++){$=q(q(E[i]).children(".sapUiCalItemText"));$.text(O[(i+H)%12]);}}else{this._bLongMonth=true;}this._bNamesLengthChecked=true;}}function z(){this._sInvalidateMonths=undefined;s.call(this,this._bNoFocus);this._bDateRangeChanged=undefined;this._bNoFocus=undefined;}function A(){q(window.document).bind('mousemove',this._mouseMoveProxy);this._bMouseMove=true;}function B(){q(window.document).unbind('mousemove',this._mouseMoveProxy);this._bMouseMove=undefined;}return j;});
