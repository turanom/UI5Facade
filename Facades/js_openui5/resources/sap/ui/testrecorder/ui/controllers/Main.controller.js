/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/Device","sap/ui/util/Storage","sap/ui/core/mvc/Controller","sap/ui/testrecorder/ui/models/SharedModel","sap/ui/testrecorder/CommunicationBus","sap/ui/testrecorder/CommunicationChannels","sap/ui/model/json/JSONModel","sap/ui/model/resource/ResourceModel","sap/ui/model/Binding","sap/m/MessageToast","sap/m/Dialog","sap/m/CheckBox","sap/m/Button","sap/m/VBox","sap/ui/support/supportRules/ui/external/ElementTree","sap/ui/testrecorder/interaction/ContextMenu"],function($,D,S,C,a,b,c,J,R,B,M,d,e,f,V,E,g){"use strict";return C.extend("sap.ui.testrecorder.ui.controllers.Main",{onInit:function(){this._minimized=false;this._treeSelectionId=null;this._localStorage=new S(S.Type.local,"sap-ui-test-recorder");$.sap.includeStyleSheet("sap/ui/testrecorder/ui/styles/overlay.css");this.elementTree=new E(null,{filter:{issues:false,search:true},onSelectionChanged:this._onTreeSelectionChanged.bind(this),onContextMenu:this._onTreeContextMenu.bind(this)});this._setupModels();this.toggleHeaderToolbars();},onBeforeRendering:function(){b.publish(c.REQUEST_ALL_CONTROLS_DATA);},onAfterRendering:function(){b.subscribe(c.RECEIVE_ALL_CONTROLS_DATA,this._onUpdateAllControls.bind(this));b.subscribe(c.RECEIVE_CONTROL_DATA,this._onReceiveControlDetails.bind(this));b.subscribe(c.RECEIVE_CODE_SNIPPET,this._onUpdateCodeSnippet.bind(this));b.subscribe(c.SELECT_CONTROL_IN_TREE,this._onUpdateSelection.bind(this));b.subscribe(c.DIALECT_CHANGED,this._changeDialect.bind(this));},toggleHeaderToolbars:function(){this.byId("ttMaximizeHeaderBar").setVisible(this._minimized);},toggleMinimize:function(){this._minimized=!this._minimized;this.toggleHeaderToolbars();if(this._minimized){b.publish(c.MINIMIZE_IFRAME);}else{b.publish(c.SHOW_IFRAME);}},dockBottom:function(){b.publish(c.DOCK_IFRAME_BOTTOM);},dockRight:function(){b.publish(c.DOCK_IFRAME_RIGHT);},dockLeft:function(){b.publish(c.DOCK_IFRAME_LEFT);},openWindow:function(){b.publish(c.OPEN_NEW_WINDOW);},close:function(){b.publish(c.CLOSE_IFRAME);},copyCodeSnippet:function(){var s=this.byId("codeEditor").getValue();var h=function(o){if(o.clipboardData){o.clipboardData.setData('text/plain',s);}else{o.originalEvent.clipboardData.setData('text/plain',s);}o.preventDefault();};if(D.browser.msie&&window.clipboardData){window.clipboardData.setData("text",s);}else{document.addEventListener('copy',h);document.execCommand('copy');document.removeEventListener('copy',h);}},clearCodeSnippet:function(){b.publish(c.CLEAR_SNIPPETS);this.byId("codeEditor").setValue("");},openSettingsDialog:function(){if(!this.settingsDialog){this.settingsDialog=new d({title:this.getView().getModel("i18n").getProperty("TestRecorder.SettingsDialog.Title"),content:[new V({items:[new e({text:this.getView().getModel("i18n").getProperty("TestRecorder.SettingsDialog.IDCheckBox.Text"),name:"preferViewId",selected:this.model.getProperty("/settings/preferViewId"),select:this._onSelectCheckBox.bind(this)}),new e({text:this.getView().getModel("i18n").getProperty("TestRecorder.SettingsDialog.POMethodCheckBox.Text"),name:"formatAsPOMethod",selected:this.model.getProperty("/settings/formatAsPOMethod"),select:this._onSelectCheckBox.bind(this)})]})],endButton:new f({text:this.getView().getModel("i18n").getProperty("TestRecorder.SettingsDialog.CloseButton.Text"),press:this.closeSettingsDialog.bind(this)})});this.getView().addDependent(this.settingsDialog);}this.settingsDialog.open();},closeSettingsDialog:function(){if(this.settingsDialog){this.settingsDialog.close();}},_setupModels:function(){this.model=a;this.getView().setModel(this.model);this.model.setProperty("/isInIframe",!window.opener);var s=this._localStorage.get("dialect");var p=this._localStorage.get("settings-preferViewId");var F=this._localStorage.get("settings-formatAsPOMethod");if(s){this.model.setProperty("/selectedDialect",s);b.publish(c.SET_DIALECT,s);}if(p!==null&&p!=="undefined"){this.model.setProperty("/settings/preferViewId",p);}if(F!==null&&F!=="undefined"){this.model.setProperty("/settings/formatAsPOMethod",F);}b.publish(c.UPDATE_SETTINGS,this.model.getProperty("/settings"));var h=new B(a,"/",a.getContext("/selectedDialect"));h.attachChange(function(){b.publish(c.SET_DIALECT,this.model.getProperty("/selectedDialect"));}.bind(this));var i=new R({bundleName:"sap.ui.core.messagebundle"});this.getView().setModel(i,"i18n");this.getView().setModel(new J({framework:{}}),"framework");this.getView().setModel(new J({controls:{bindings:{},properties:{},codeSnippet:"",renderedControls:[]}}),"controls");},_onUpdateAllControls:function(m){this.elementTree.setContainerId(this.byId("elementTreeContainer").getId());this._clearControlData();if(m.framework){this.getView().getModel("controls").setProperty("/framework",m.framework);}if(m.renderedControls){this.getView().getModel("controls").setProperty("/renderedControls",m.renderedControls);this.elementTree.setData({controls:m.renderedControls});}if(!this._minimized){M.show(this.getView().getModel("i18n").getProperty("TestRecorder.ControlTree.MessageToast"),{duration:1000});}},_onReceiveControlDetails:function(m){if(m.properties){this.getView().getModel("controls").setProperty("/properties",m.properties);}if(m.bindings){this.getView().getModel("controls").setProperty("/bindings",m.bindings);}},_onUpdateCodeSnippet:function(m){if(m.codeSnippet!==undefined){this.getView().getModel("controls").setProperty("/codeSnippet",m.codeSnippet);}else if(m.error){var n=this.getView().getModel("i18n").getResourceBundle().getText("TestRecorder.Inspect.Snippet.NotFound.Text","#"+m.domElementId);this.getView().getModel("controls").setProperty("/codeSnippet",n);}},_onUpdateSelection:function(m){this.elementTree.setSelectedElement(m.rootElementId,false);this._clearControlData();b.publish(c.REQUEST_CONTROL_DATA,{domElementId:m.rootElementId});b.publish(c.REQUEST_CODE_SNIPPET,{domElementId:m.interactionElementId,action:m.action});b.publish(c.HIGHLIGHT_CONTROL,{domElementId:m.rootElementId});},_onTreeSelectionChanged:function(h){this._clearControlData();b.publish(c.REQUEST_CONTROL_DATA,{domElementId:h});b.publish(c.REQUEST_CODE_SNIPPET,{domElementId:h});b.publish(c.HIGHLIGHT_CONTROL,{domElementId:h});},_onTreeContextMenu:function(m){m=m||{};m.withEvents=true;m.items={highlight:false};g.show(m);},_clearControlData:function(){this.getView().getModel("controls").setProperty("/properties",{});this.getView().getModel("controls").setProperty("/bindings",{});this.getView().getModel("controls").setProperty("/codeSnippet","");},_changeDialect:function(m){this._localStorage.put("dialect",m.dialect);},_onSelectCheckBox:function(o){var s=o.getParameter("selected");var h=o.getSource().getName();var m={};m[h]=s;this.model.setProperty("/settings/"+h,s);this._localStorage.put("settings-"+h,s);b.publish(c.UPDATE_SETTINGS,m);},_onChangeMultiple:function(o){var s=o.getParameter("state");b.publish(c.UPDATE_SETTINGS,{multipleSnippets:s});},_onCodeEditorChange:function(o){var h=this.byId("codeEditor");var l=h.getValue().split("\n").length;if(l){h._oEditor.scrollToLine(l);}}});});
