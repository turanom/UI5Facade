/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./library','./PlanningCalendarHeader','./SegmentedButtonItem',"./SinglePlanningCalendarWeekView",'./SinglePlanningCalendarGrid','./SinglePlanningCalendarMonthGrid','./SinglePlanningCalendarRenderer','sap/base/Log','sap/ui/core/Control','sap/ui/core/InvisibleText','sap/ui/core/ResizeHandler','sap/ui/core/format/DateFormat','sap/ui/unified/calendar/CalendarDate','sap/ui/unified/DateRange','sap/ui/base/ManagedObjectObserver',"sap/ui/thirdparty/jquery"],function(l,P,S,a,b,c,d,L,C,I,R,D,e,f,M,q){"use strict";var g=l.PlanningCalendarStickyMode;var H="_sHeaderResizeHandlerId";var h=4;var j="--item";var k=C.extend("sap.m.SinglePlanningCalendar",{metadata:{library:"sap.m",properties:{title:{type:"string",group:"Appearance",defaultValue:""},startDate:{type:"object",group:"Data"},startHour:{type:"int",group:"Data",defaultValue:0},endHour:{type:"int",group:"Data",defaultValue:24},fullDay:{type:"boolean",group:"Data",defaultValue:true},stickyMode:{type:"sap.m.PlanningCalendarStickyMode",group:"Behavior",defaultValue:g.None},enableAppointmentsDragAndDrop:{type:"boolean",group:"Misc",defaultValue:false},enableAppointmentsResize:{type:"boolean",group:"Misc",defaultValue:false},enableAppointmentsCreate:{type:"boolean",group:"Misc",defaultValue:false}},aggregations:{actions:{type:"sap.ui.core.Control",multiple:true,singularName:"action",forwarding:{getter:"_getHeader",aggregation:"actions"}},appointments:{type:"sap.ui.unified.CalendarAppointment",multiple:true,singularName:"appointment",forwarding:{getter:"_getCurrentGrid",aggregation:"appointments"}},views:{type:"sap.m.SinglePlanningCalendarView",multiple:true,singularName:"view"},specialDates:{type:"sap.ui.unified.DateTypeRange",multiple:true,singularName:"specialDate",forwarding:{getter:"_getCurrentGrid",aggregation:"specialDates"}},_header:{type:"sap.m.PlanningCalendarHeader",multiple:false,visibility:"hidden"},_grid:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"},_mvgrid:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"}},associations:{selectedView:{type:"sap.m.SinglePlanningCalendarView",multiple:false},legend:{type:"sap.m.PlanningCalendarLegend",multiple:false}},events:{appointmentSelect:{parameters:{appointment:{type:"sap.ui.unified.CalendarAppointment"},appointments:{type:"sap.ui.unified.CalendarAppointment[]"}}},appointmentDrop:{parameters:{appointment:{type:"sap.ui.unified.CalendarAppointment"},startDate:{type:"object"},endDate:{type:"object"},copy:{type:"boolean"}}},appointmentResize:{parameters:{appointment:{type:"sap.ui.unified.CalendarAppointment"},startDate:{type:"object"},endDate:{type:"object"}}},appointmentCreate:{parameters:{startDate:{type:"object"},endDate:{type:"object"}}},headerDateSelect:{parameters:{date:{type:"object"}}},startDateChange:{parameters:{date:{type:"object"}}},cellPress:{parameters:{startDate:{type:"object"},endDate:{type:"object"}}},moreLinkPress:{parameters:{date:{type:"object"}}}}}});k.prototype.init=function(){var o=this.getId();this._oRB=sap.ui.getCore().getLibraryResourceBundle("sap.m");this._oDefaultView=new a({key:"DEFAULT_INNER_WEEK_VIEW_CREATED_FROM_CONTROL",title:""});this.setAssociation("selectedView",this._oDefaultView);this.setAggregation("_header",this._createHeader());this.setAggregation("_grid",new b(o+"-Grid"));this.setAggregation("_mvgrid",new c(o+"-GridMV"));this._attachHeaderEvents();this._attachGridEvents();this._attachDelegates();this.setStartDate(new Date());};k.prototype.onBeforeRendering=function(){this._toggleStickyClasses();};k.prototype.onAfterRendering=function(){var o=this._getHeader();this._adjustColumnHeadersTopOffset();this.toggleStyleClass("sapMSinglePCActionsHidden",!o._getActionsToolbar().getVisible());this._registerResizeHandler(H,o,this._onHeaderResize.bind(this));};k.prototype.exit=function(){if(this._oDefaultView){this._oDefaultView.destroy();this._oDefaultView=null;}if(this._afterRenderFocusCell){this.removeDelegate(this._afterRenderFocusCell);this._afterRenderFocusCell=null;}this._deRegisterResizeHandler(H);};k.prototype._onHeaderResize=function(E){if(E.oldSize.height===E.size.height){return this;}this.toggleStyleClass("sapMSinglePCActionsHidden",!this._getHeader()._getActionsToolbar().getVisible());this._adjustColumnHeadersTopOffset();return this;};k.prototype.setTitle=function(t){this._getHeader().setTitle(t);return this.setProperty("title",t,true);};k.prototype.setStartDate=function(o){this.setProperty("startDate",o,true);this._alignColumns();return this;};k.prototype.setStartHour=function(i){this.getAggregation("_grid").setStartHour(i);this.setProperty("startHour",i,true);return this;};k.prototype.setEndHour=function(i){this.getAggregation("_grid").setEndHour(i);this.setProperty("endHour",i,true);return this;};k.prototype.setFullDay=function(F){this.getAggregation("_grid").setFullDay(F);this.setProperty("fullDay",F,true);return this;};k.prototype.setEnableAppointmentsDragAndDrop=function(E){this.getAggregation("_grid").setEnableAppointmentsDragAndDrop(E);this.getAggregation("_mvgrid").setEnableAppointmentsDragAndDrop(E);return this.setProperty("enableAppointmentsDragAndDrop",E,true);};k.prototype.setEnableAppointmentsResize=function(E){this.getAggregation("_grid").setEnableAppointmentsResize(E);return this.setProperty("enableAppointmentsResize",E,true);};k.prototype.setEnableAppointmentsCreate=function(E){this.getAggregation("_grid").setEnableAppointmentsCreate(E);return this.setProperty("enableAppointmentsCreate",E,true);};k.prototype._toggleStickyClasses=function(){var s=this.getStickyMode();this.toggleStyleClass("sapMSinglePCStickyAll",s===g.All);this.toggleStyleClass("sapMSinglePCStickyNavBarAndColHeaders",s===g.NavBarAndColHeaders);return this;};k.prototype._adjustColumnHeadersTopOffset=function(){var s=this.getStickyMode(),G=this.getAggregation("_grid"),o=G&&G._getColumnHeaders(),t;if(!o||!o.getDomRef()){return this;}switch(s){case g.All:t=this._getHeader().$().outerHeight();break;case g.NavBarAndColHeaders:t=this._getHeader()._getNavigationToolbar().$().outerHeight();break;default:t="auto";break;}o.$().css("top",t);o._setTopPosition(t);return this;};k.prototype.addView=function(v){var V,o=this._getHeader(),s=v.getId()+j,i;if(!v){return this;}if(this._isViewKeyExisting(v.getKey())){L.error("There is an existing view with the same key.",this);return this;}this.addAggregation("views",v);V=o._getOrCreateViewSwitch();i=new S(s,{key:v.getKey(),text:v.getTitle()});V.addItem(i);this._observeViewTitle(v);if(this._getSelectedView().getKey()===this._oDefaultView.getKey()){this.setAssociation("selectedView",v);}this._alignView();if(this.getViews().length>h){o._convertViewSwitchToSelect();}return this;};k.prototype.insertView=function(v,p){var V,o=this._getHeader(),s=v.getId()+j,i;if(!v){return this;}if(this._isViewKeyExisting(v.getKey())){L.error("There is an existing view with the same key.",this);return this;}this.insertAggregation("views",v,p);V=o._getOrCreateViewSwitch();i=new S(s,{key:v.getKey(),text:v.getTitle()});V.insertItem(i,p);this._observeViewTitle(v);if(this._getSelectedView().getKey()===this._oDefaultView.getKey()){this.setAssociation("selectedView",v);}this._alignView();if(this.getViews().length>h){o._convertViewSwitchToSelect();}return this;};k.prototype.removeView=function(v){if(!v){return this;}var o=this._getHeader(),V=o._getOrCreateViewSwitch(),m=V.getItems(),n=this._getSelectedView(),p=v.getKey(),r,i;if(this.getViews().length===1){this._disconnectAndDestroyViewsObserver();}else{this._oViewsObserver.unobserve(v,{properties:["title"]});}for(i=0;i<m.length;i++){r=m[i];if(r.getKey()===p){V.removeItem(r);break;}}this.removeAggregation("views",v);if(p===n.getKey()){this.setAssociation("selectedView",this.getViews()[0]||this._oDefaultView);}this._alignView();if(this.getViews().length<=h){o._convertViewSwitchToSegmentedButton();}return this;};k.prototype.removeAllViews=function(){var v=this._getHeader()._getOrCreateViewSwitch();this._disconnectAndDestroyViewsObserver();v.removeAllItems();this.setAssociation("selectedView",this._oDefaultView);this._alignView();return this.removeAllAggregation("views");};k.prototype.destroyViews=function(){var v=this._getHeader()._getOrCreateViewSwitch();this._disconnectAndDestroyViewsObserver();v.destroyItems();this.setAssociation("selectedView",this._oDefaultView);this._alignView();return this.destroyAggregation("views");};k.prototype._viewsObserverCallbackFunction=function(o){sap.ui.getCore().byId(o.object.getId()+j).setText(o.current);};k.prototype._getViewsObserver=function(){if(!this._oViewsObserver){this._oViewsObserver=new M(this._viewsObserverCallbackFunction);}return this._oViewsObserver;};k.prototype._observeViewTitle=function(v){this._getViewsObserver().observe(v,{properties:["title"]});};k.prototype._disconnectAndDestroyViewsObserver=function(){if(this._oViewsObserver){this._oViewsObserver.disconnect();this._oViewsObserver.destroy();this._oViewsObserver=null;}};k.prototype.setSelectedView=function(v){var p=this._getCurrentGrid();this.setAssociation("selectedView",v);this._transferAggregations(p);this._alignColumns();this._adjustColumnHeadersTopOffset();this._getHeader()._getOrCreateViewSwitch().setSelectedKey(v.getKey());return this;};k.prototype.getSelectedAppointments=function(){return this.getAggregation("_grid").getSelectedAppointments();};k.prototype.setLegend=function(v){var o,s,i;this.setAssociation("legend",v);this.getAggregation("_grid").setAssociation("legend",v);this.getAggregation("_mvgrid").setAssociation("legend",v);s=this.getLegend();if(s){this.getAggregation("_grid")._sLegendId=s;this.getAggregation("_mvgrid")._sLegendId=s;i=sap.ui.getCore().byId(s);}if(i){o=new M(function(m){this.invalidate();}.bind(this));o.observe(i,{destroy:true});}return this;};k.prototype._alignView=function(){this._switchViewButtonVisibility();this._alignColumns();return this;};k.prototype._createHeader=function(){var o=new P(this.getId()+"-Header");o.getAggregation("_actionsToolbar").addAriaLabelledBy(I.getStaticId("sap.m","SPC_ACTIONS_TOOLBAR"));o.getAggregation("_navigationToolbar").addAriaLabelledBy(I.getStaticId("sap.m","SPC_NAVIGATION_TOOLBAR"));return o;};k.prototype._isViewKeyExisting=function(K){return this.getViews().some(function(v){return v.getKey()===K;});};k.prototype._getSelectedView=function(){var s,v=this.getViews(),m=sap.ui.getCore().byId(this.getAssociation("selectedView")).getKey();for(var i=0;i<v.length;i++){if(m===v[i].getKey()){s=v[i];break;}}return s||this._oDefaultView;};k.prototype._switchViewButtonVisibility=function(){var s=this._getHeader()._getOrCreateViewSwitch(),v=s.getItems().length>1;s.setProperty("visible",v);return this;};k.prototype._attachHeaderEvents=function(){var o=this._getHeader();o.attachEvent("pressPrevious",this._handlePressArrow,this);o.attachEvent("pressToday",this._handlePressToday,this);o.attachEvent("pressNext",this._handlePressArrow,this);o.attachEvent("dateSelect",this._handleCalendarPickerDateSelect,this);o._getOrCreateViewSwitch().attachEvent("selectionChange",this._handleViewSwitchChange,this);return this;};k.prototype._attachDelegates=function(){this._afterRenderFocusCell={onAfterRendering:function(){if(this._sGridCellFocusSelector){q(this._sGridCellFocusSelector).focus();this._sGridCellFocusSelector=null;}}.bind(this)};this.getAggregation("_grid").addDelegate(this._afterRenderFocusCell);this.getAggregation("_mvgrid").addDelegate(this._afterRenderFocusCell);};k.prototype._attachGridEvents=function(){var G=this.getAggregation("_grid"),o=this.getAggregation("_mvgrid");var i=function(E){this.fireHeaderDateSelect({date:E.getSource().getDate()});};var m=function(E){this.fireAppointmentSelect({appointment:E.getParameter("appointment"),appointments:E.getParameter("appointments")});};var n=function(E){this.fireAppointmentDrop({appointment:E.getParameter("appointment"),startDate:E.getParameter("startDate"),endDate:E.getParameter("endDate"),copy:E.getParameter("copy")});};var p=function(E){this.fireAppointmentResize({appointment:E.getParameter("appointment"),startDate:E.getParameter("startDate"),endDate:E.getParameter("endDate")});};var r=function(E){this.fireAppointmentCreate({startDate:E.getParameter("startDate"),endDate:E.getParameter("endDate")});};var s=function(E){this.fireEvent("cellPress",{startDate:E.getParameter("startDate"),endDate:E.getParameter("endDate")});};var t=function(E){this.fireEvent("moreLinkPress",{date:E.getParameter("date")});};var u=function(E){var G=this.getAggregation("_grid"),F=G._getDateFormatter(),N=this._getSelectedView().getScrollEntityCount()-G._getColumns()+1,w=new Date(E.getParameter("startDate")),x=E.getParameter("fullDay"),y=this.getStartDate();if(E.getParameter("next")){w.setDate(w.getDate()+N);y=new Date(y.setDate(y.getDate()+this._getSelectedView().getScrollEntityCount()));this.setStartDate(y);}else{w.setDate(w.getDate()-N);y=new Date(y.setDate(y.getDate()-this._getSelectedView().getScrollEntityCount()));this.setStartDate(y);}this._sGridCellFocusSelector=x?"[data-sap-start-date='"+F.format(w)+"'].sapMSinglePCBlockersColumn":"[data-sap-start-date='"+F.format(w)+"'].sapMSinglePCRow";};var v=function(E){var w=new Date(E.getParameter("startDate")),x=e.fromLocalJSDate(w),N;x.setDate(x.getDate()+E.getParameter("offset"));N=x.toLocalJSDate();this.setStartDate(N);this._sGridCellFocusSelector="[sap-ui-date='"+x.valueOf()+"'].sapMSPCMonthDay";};G._getColumnHeaders().attachEvent("select",i,this);G.attachEvent("appointmentSelect",m,this);G.attachEvent("appointmentDrop",n,this);o.attachEvent("appointmentDrop",n,this);G.attachEvent("appointmentResize",p,this);G.attachEvent("appointmentCreate",r,this);G.attachEvent("cellPress",s,this);o.attachEvent("cellPress",s,this);o.attachEvent("moreLinkPress",t,this);G.attachEvent("borderReached",u,this);o.attachEvent("borderReached",v,this);return this;};k.prototype._handlePressArrow=function(E){this._applyArrowsLogic(E.getId()==="pressPrevious");this._adjustColumnHeadersTopOffset();};k.prototype._handlePressToday=function(){var s=this._getSelectedView().calculateStartDate(new Date());this.setStartDate(s);this.fireStartDateChange({date:s});this._adjustColumnHeadersTopOffset();};k.prototype._handleViewSwitchChange=function(E){var p=this._getCurrentGrid();this.setAssociation("selectedView",E.getParameter("item"));this._transferAggregations(p);this._alignColumns();this._adjustColumnHeadersTopOffset();};k.prototype._transferAggregations=function(p){var n=this._getCurrentGrid(),A,s,i;if(p.getId()!==n.getId()){A=p.removeAllAggregation("appointments",true);for(i=0;i<A.length;i++){n.addAggregation("appointments",A[i],true);}s=p.removeAllAggregation("specialDates",true);for(i=0;i<s.length;i++){n.addAggregation("specialDates",s[i],true);}}};k.prototype._handleCalendarPickerDateSelect=function(){var s=this._getHeader().getStartDate(),o;o=this._getSelectedView().calculateStartDate(new Date(s.getTime()));this.setStartDate(o);if(!this._getSelectedView().isA("sap.m.SinglePlanningCalendarMonthView")){this.getAggregation("_grid")._getColumnHeaders().setDate(s);}this.fireStartDateChange({date:o});this._adjustColumnHeadersTopOffset();};k.prototype._updateCalendarPickerSelection=function(){var r=this._getFirstAndLastRangeDate(),s;s=new f({startDate:r.oStartDate.toLocalJSDate(),endDate:r.oEndDate.toLocalJSDate()});this._getHeader().getAggregation("_calendarPicker").removeAllSelectedDates();this._getHeader().getAggregation("_calendarPicker").addSelectedDate(s);};k.prototype._formatPickerText=function(){var r=this._getFirstAndLastRangeDate(),s=r.oStartDate.toLocalJSDate(),E=r.oEndDate.toLocalJSDate(),o=D.getDateInstance({style:"long"}),i=o.format(s);if(s.getTime()!==E.getTime()){i+=" - "+o.format(E);}return i;};k.prototype._applyArrowsLogic=function(B){var o=e.fromLocalJSDate(this.getStartDate()||new Date()),O=B?-1:1,n=this._getSelectedView().getScrollEntityCount(this.getStartDate(),O),s;if(B){n*=-1;}o.setDate(o.getDate()+n);s=o.toLocalJSDate();this.setStartDate(s);this.fireStartDateChange({date:s});};k.prototype._getFirstAndLastRangeDate=function(){var s=this._getSelectedView(),o=this._getHeader().getStartDate()||new Date(),i=s.getEntityCount()-1,m,n;m=e.fromLocalJSDate(s.calculateStartDate(new Date(o.getTime())));n=new e(m);n.setDate(m.getDate()+i);return{oStartDate:m,oEndDate:n};};k.prototype._alignColumns=function(){var o=this._getHeader(),G=this.getAggregation("_grid"),i=this.getAggregation("_mvgrid"),v=this._getSelectedView(),m=this.getStartDate()||new Date(),V=v.calculateStartDate(new Date(m.getTime())),n=e.fromLocalJSDate(V);o.setStartDate(V);o.setPickerText(this._formatPickerText(n));this._updateCalendarPickerSelection();G.setStartDate(V);i.setStartDate(V);G._setColumns(v.getEntityCount());this._setColumnHeaderVisibility();};k.prototype._setColumnHeaderVisibility=function(){var v;if(this._getSelectedView().isA("sap.m.SinglePlanningCalendarMonthView")){return;}v=!this._getSelectedView().isA("sap.m.SinglePlanningCalendarDayView");this.getAggregation("_grid")._getColumnHeaders().setVisible(v);this.toggleStyleClass("sapMSinglePCHiddenColHeaders",!v);};k.prototype._getHeader=function(){return this.getAggregation("_header");};k.prototype._getCurrentGrid=function(){if(this._getSelectedView().isA("sap.m.SinglePlanningCalendarMonthView")){return this.getAggregation("_mvgrid");}else{return this.getAggregation("_grid");}};k.prototype._registerResizeHandler=function(s,o,i){if(!this[s]){this[s]=R.register(o,i);}return this;};k.prototype._deRegisterResizeHandler=function(s){if(this[s]){R.deregister(this[s]);this[s]=null;}return this;};return k;});
