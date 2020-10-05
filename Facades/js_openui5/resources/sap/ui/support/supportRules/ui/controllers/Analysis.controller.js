/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","sap/ui/support/supportRules/ui/controllers/BaseController","sap/ui/model/json/JSONModel","sap/m/Panel","sap/m/List","sap/m/ListItemBase","sap/m/StandardListItem","sap/m/InputListItem","sap/m/Button","sap/m/Toolbar","sap/m/ToolbarSpacer","sap/m/Label","sap/m/MessageToast","sap/ui/support/supportRules/CommunicationBus","sap/ui/support/supportRules/WCBChannels","sap/ui/support/supportRules/ui/models/SharedModel","sap/ui/support/supportRules/RuleSerializer","sap/ui/support/supportRules/Constants","sap/ui/support/supportRules/Storage","sap/ui/support/supportRules/ui/models/SelectionUtils","sap/ui/support/supportRules/ui/controllers/PresetsController","sap/ui/support/supportRules/ui/models/PresetsUtils","sap/ui/support/supportRules/ui/models/CustomJSONListSelection"],function(jQuery,BaseController,JSONModel,Panel,List,ListItemBase,StandardListItem,InputListItem,Button,Toolbar,ToolbarSpacer,Label,MessageToast,CommunicationBus,channelNames,SharedModel,RuleSerializer,Constants,Storage,SelectionUtils,PresetsController,PresetsUtils,CustomJSONListSelection){"use strict";return BaseController.extend("sap.ui.support.supportRules.ui.controllers.Analysis",{onInit:function(){this.model=SharedModel;this.setCommunicationSubscriptions();this.tempRulesLoaded=false;this.getView().setModel(this.model);this.treeTable=SelectionUtils.treeTable=this.byId("ruleList");this.ruleSetView=this.byId("ruleSetsView");this.rulesViewContainer=this.byId("rulesNavContainer");this.bAdditionalViewLoaded=false;this.bAdditionalRulesetsLoaded=false;this.oApplicationinfo={};new CustomJSONListSelection(this.treeTable,true,"id");CommunicationBus.subscribe(channelNames.UPDATE_SUPPORT_RULES,function(){if(!this.bAdditionalViewLoaded){CommunicationBus.publish(channelNames.RESIZE_FRAME,{bigger:true});this.bAdditionalViewLoaded=true;this.loadAdditionalUI();}},this);if(this.model.getProperty("/persistingSettings")){var c=Storage.getVisibleColumns()||[];if(c.length){this.setColumnVisibility(c,true);}}this.byId("presetVariant").addEventDelegate({onclick:this.onPresetVariantClick.bind(this)});this.treeTable.attachEvent("rowSelectionChange",function(e){if(e.getParameter("userInteraction")){PresetsUtils.syncCurrentSelectionPreset(SelectionUtils.getSelectedRules());}});},loadAdditionalUI:function(){this._ruleDetails=sap.ui.xmlfragment("sap.ui.support.supportRules.ui.views.RuleDetails",this);this.byId("rulesDisplayPage").addContentArea(this._ruleDetails);this._ruleCreateUpdatePages=sap.ui.xmlfragment("sap.ui.support.supportRules.ui.views.RuleUpdate",this);this._ruleCreateUpdatePages.forEach(function(r){this.byId("rulesNavContainer").insertPage(r);},this);this._updateRuleList();},onAfterRendering:function(){var t=function(){CommunicationBus.publish(channelNames.ON_INIT_ANALYSIS_CTRL);sap.ui.getCore().detachThemeChanged(t);};if(sap.ui.getCore().isThemeApplied()){CommunicationBus.publish(channelNames.ON_INIT_ANALYSIS_CTRL);}else{sap.ui.getCore().attachThemeChanged(t);}},onAsyncSwitch:function(e){var s=e.getSource();if(e.getParameter("selected")){var a=s.getCustomData()[0].getValue()==="true";var r=s.getProperty("groupName")==="asyncContext"?"/newRule":"/editRule";this.model.setProperty(r+"/async",a);this._updateCheckFunction(r,a);}},_updateCheckFunction:function(r,a){var c=this.model.getProperty(r+"/check");if(!c){return;}var m=c.match(/function[^(]*\(([^)]*)\)/);if(!m){return;}var p=m[1].trim().split(/\W+/);p[0]=p[0]||"oIssueManager";p[1]=p[1]||"oCoreFacade";p[2]=p[2]||"oScope";if(a){p[3]=p[3]||"fnResolve";}else{p=p.slice(0,3);}var n=c.replace(/function[^(]*\(([^)]*)\)/,"function ("+p.join(", ")+")");this.model.setProperty(r+"/check",n);},getTemporaryLib:function(){var l=this.model.getProperty("/libraries");for(var i=0;i<l.length;i++){if(l[i].title==Constants.TEMP_RULESETS_NAME){return Object.assign({},l[i]);}}},setCommunicationSubscriptions:function(){CommunicationBus.subscribe(channelNames.UPDATE_SUPPORT_RULES,this.updatesupportRules,this);CommunicationBus.subscribe(channelNames.VERIFY_RULE_CREATE_RESULT,function(d){var r=d.result,n=RuleSerializer.deserialize(d.newRule,true),t=this.getTemporaryLib();if(r=="success"){t.rules.push(n);if(!this.oJsonModel){this.oJsonModel=new JSONModel();this.treeTable.setModel(this.oJsonModel,"treeModel");}this._syncTreeTableVieModelTempRulesLib(t,this.model.getProperty("/treeModel"));PresetsUtils.syncCurrentSelectionPreset(SelectionUtils.getSelectedRules());if(Storage.readPersistenceCookie(Constants.COOKIE_NAME)){SelectionUtils.persistSelection();Storage.setRules(t.rules);if(this.showRuleCreatedToast){MessageToast.show('Your temporary rule "'+n.id+'" was persisted in the local storage');this.showRuleCreatedToast=false;}}this.oJsonModel.setData(this.model.getProperty("/treeModel"));var e=this.model.getProperty("/newEmptyRule");this.model.setProperty("/newRule",jQuery.extend(true,{},e));this.goToRuleProperties();this.model.setProperty("/selectedRule",n);this._updateRuleList();this.treeTable.updateSelectionFromModel();}else{MessageToast.show("Add rule failed because: "+r);}},this);CommunicationBus.subscribe(channelNames.VERIFY_RULE_UPDATE_RESULT,function(d){var r=d.result,u=RuleSerializer.deserialize(d.updateRule,true),t=this;if(r==="success"){var a=this.model.getProperty("/editRuleSource"),b=this.model.getProperty('/treeModel'),l=this.model.getProperty('/libraries');l.forEach(function(c,e){if(c.title===Constants.TEMP_RULESETS_NAME){c.rules.forEach(function(f,g){if(f.id===a.id){c.rules[g]=u;if(t.model.getProperty("/persistingSettings")){Storage.setRules(c.rules);}}});t._syncTreeTableVieModelTempRule(u,b);}});this.oJsonModel.setData(b);this.model.checkUpdate(true);this.model.setProperty('/selectedRule',u);SelectionUtils.getSelectedRules();this.treeTable.updateSelectionFromModel();this.goToRuleProperties();}else{MessageToast.show("Update rule failed because: "+r);}},this);CommunicationBus.subscribe(channelNames.POST_AVAILABLE_LIBRARIES,function(d){this.bAdditionalRulesetsLoaded=true;this.model.setProperty("/availableLibrariesSet",d.libNames);this.rulesViewContainer.setBusy(false);},this);CommunicationBus.subscribe(channelNames.POST_APPLICATION_INFORMATION,function(d){this.oApplicationinfo=d;},this);CommunicationBus.subscribe(channelNames.POST_AVAILABLE_COMPONENTS,function(d){var e=[],m=this.model.getProperty("/executionScopeComponents"),s=Storage.getSelectedScopeComponents(),i;for(var c=0;c<d.length;c+=1){e.push({text:d[c]});}if(m&&m.length>0){for(i=0;i<e.length;i++){e[i].selected=this.checkIfComponentIsSelected(e[i],m);}}else if(s&&s.length>0){for(i=0;i<e.length;i++){e[i].selected=this.checkIfComponentIsSelected(e[i],s);}}this.model.setProperty("/executionScopeComponents",e);},this);CommunicationBus.subscribe(channelNames.GET_RULES_MODEL,function(t){this.oJsonModel=new JSONModel();this.treeTable.setModel(this.oJsonModel,"treeModel");this.oJsonModel.setData(t);var p=Storage.readPersistenceCookie(Constants.COOKIE_NAME),l=this.model.getProperty("/loadingAdditionalRuleSets");if(l){t=SelectionUtils._syncSelectionAdditionalRuleSetsMainModel(t,this.model.getProperty("/treeModel"));t=SelectionUtils._deselectAdditionalRuleSets(t,this.model.getProperty("/namesOfLoadedAdditionalRuleSets"));}if(p){this.model.setProperty('/treeModel',t);this.initializeTempRules();var u=SelectionUtils.updateSelectedRulesFromLocalStorage(t);if(u){t=u;}PresetsUtils.loadCustomPresets();}if(p||l){this.oJsonModel.setData(t);this.treeTable.updateSelectionFromModel();}else{this.treeTable.selectAll();}this.model.setProperty('/treeModel',t);this.model.setProperty("/selectedRulesCount",SelectionUtils.getSelectedRules().length);PresetsUtils.initializeSelectionPresets(SelectionUtils.getSelectedRules());},this);CommunicationBus.subscribe(channelNames.POST_MESSAGE,function(d){MessageToast.show(d.message);},this);CommunicationBus.subscribe(channelNames.ON_ANALYZE_STARTED,function(d){this.model.setProperty("/showProgressIndicator",true);},this);},checkIfComponentIsSelected:function(c,s){for(var i=0;i<s.length;i+=1){if(s[i].text==c.text&&s[i].selected){return true;}}return false;},onAnalyze:function(){var c=this.model.getProperty("/selectionPresetsCurrent"),e=this._getExecutionContext();if(!c.selections.length>0){MessageToast.show("Select some rules to be analyzed.");return;}if(e.type==="components"&&e.components.length===0){MessageToast.show("Please select some components to be analyzed.");return;}CommunicationBus.publish(channelNames.ON_ANALYZE_REQUEST,{rulePreset:c,executionContext:e});},_getExecutionContext:function(){var c={type:this.model.getProperty("/analyzeContext/key")};if(c.type==="subtree"){c.parentId=this.model.getProperty("/subtreeExecutionContextId");}if(c.type==="components"){var s=sap.ui.getCore().byId("componentsSelectionContainer"),a=s.getContent();c.components=[];a.forEach(function(b){if(b.getSelected()){c.components.push(b.getText());}});}return c;},onSelectedRuleSets:function(e){var s=true,S=this.model.getProperty("/selectedRule"),a=e.getParameter("selectedKey")==="additionalRulesets";if(a||!S){s=false;}if(!this.bAdditionalRulesetsLoaded&&a){this.rulesViewContainer.setBusyIndicatorDelay(0);this.rulesViewContainer.setBusy(true);CommunicationBus.publish(channelNames.GET_NON_LOADED_RULE_SETS,{loadedRulesets:this._getLoadedRulesets()});}this.getView().getModel().setProperty("/showRuleProperties",s);},_getLoadedRulesets:function(){var r=this.treeTable.getModel("treeModel").getData(),l=[];Object.keys(r).forEach(function(k){var L=r[k].name;if(L&&L!=="temporary"){l.push(L);}});return l;},_syncTreeTableVieModelTempRulesLib:function(t,a){var l,r,T,s,R,I,f=function(o){return o.id===r.id;};for(var i in a){l=a[i];T=a[i].nodes;if(l.name!==Constants.TEMP_RULESETS_NAME){continue;}a[i].nodes=[];for(var b in t.rules){r=t.rules[b];s=T[b]!==undefined?T[b].selected:true;if(this.tempRulesFromStorage){R=this.tempRulesFromStorage.filter(f);if(R.length>0){s=R[0].selected;I=this.tempRulesFromStorage.indexOf(R[0]);this.tempRulesFromStorage.splice(I,1);if(s===false){l.selected=false;}}if(this.tempRulesFromStorage.length===0){this.tempRulesFromStorage.length=null;}}l.nodes.push({name:r.title,description:r.description,id:r.id,audiences:r.audiences.toString(),categories:r.categories.toString(),minversion:r.minversion,resolution:r.resolution,title:r.title,selected:s,libName:l.name,check:r.check});}this.model.setProperty("/treeModel",a);return l;}},_syncTreeTableVieModelTempRule:function(t,a){var r=this.model.getProperty("/editRuleSource");for(var i in a){if(a[i].name===Constants.TEMP_RULESETS_NAME){for(var b in a[i].nodes){if(a[i].nodes[b].id===r.id){a[i].nodes[b]={name:t.title,description:t.description,id:t.id,audiences:t.audiences,categories:t.categories,minversion:t.minversion,resolution:t.resolution,selected:a[i].nodes[b].selected,title:t.title,libName:a[i].name,check:t.check};}}}}},_hasSelectedComponent:function(){var a=sap.ui.getCore().byId("componentsSelectionContainer").getContent();function i(c){return c.getSelected();}return a.some(i);},onAnalyzeSettings:function(e){CommunicationBus.publish(channelNames.GET_AVAILABLE_COMPONENTS);if(!this._settingsPopover){this._settingsPopover=sap.ui.xmlfragment("sap.ui.support.supportRules.ui.views.AnalyzeSettings",this);this.getView().addDependent(this._settingsPopover);}this._settingsPopover.openBy(e.getSource());},onContextSelect:function(e){if(e.getParameter("selected")){var s=e.getSource(),r=s.getCustomData()[0].getValue(),a=this.model.getProperty("/executionScopes")[r];if(r==="components"&&!this._hasSelectedComponent()){var c=sap.ui.getCore().byId("componentsSelectionContainer").getContent();if(c.length>0){c[0].setSelected(true);this.onScopeComponentSelect(null);}}this.model.setProperty("/analyzeContext",a);}if(Storage.readPersistenceCookie(Constants.COOKIE_NAME)){this.persistExecutionScope();}},onExecutionContextChange:function(e){var v=e.getSource().getValue();if(v){this.model.setProperty("/subtreeExecutionContextId",v);}if(Storage.readPersistenceCookie(Constants.COOKIE_NAME)){this.persistExecutionScope();}},onScopeComponentSelect:function(e){var s=this.model.getProperty("/executionScopeComponents");if(Storage.readPersistenceCookie(Constants.COOKIE_NAME)){Storage.setSelectedScopeComponents(s);}},onBeforePopoverOpen:function(){if(this.model.getProperty("/executionScopeComponents").length===0){CommunicationBus.publish(channelNames.GET_AVAILABLE_COMPONENTS);}},createNewRulePress:function(e){var a=this.model.getProperty("/newEmptyRule");this.model.setProperty("/selectedSetPreviewKey","availableRules");this.model.setProperty("/newRule",jQuery.extend(true,{},a));this.model.setProperty("/tempLink",{href:"",text:""});this.goToCreateRule();},goToRuleProperties:function(){var n=this.byId("rulesNavContainer");n.to(this.byId("rulesDisplayPage"),"show");},createRuleString:function(r){if(!r){return'';}var s="{\n",c=0,k=Object.keys(r).length;for(var a in r){var v=r[a];c++;s+="\t";s+=a+": ";if(a==="check"){s+=v.split("\n").join("\n\t");}else{s+=JSON.stringify(v);}if(c<k){s+=",";}s+="\n";}s+="}";return s;},updateRule:function(){var o=this.model.getProperty("/editRuleSource/id"),u=this.model.getProperty("/editRule");if(this.checkFunctionString(u.check)){CommunicationBus.publish(channelNames.VERIFY_UPDATE_RULE,{oldId:o,updateObj:RuleSerializer.serialize(u)});}},updatesupportRules:function(d){d=RuleSerializer.deserialize(d.sRuleSet);CommunicationBus.publish(channelNames.REQUEST_RULES_MODEL,d);var l=[],t=this;for(var i in d){var r=[],a=d[i].ruleset._mRules;for(var j in a){var b=a[j];b.libName=i;b.selected=true;r.push(b);}l.push({title:i,type:"library",rules:r,selected:true});}var f;if(l[0].rules[0]){f=l[0].rules[0];}else{f=l[1].rules[0];}t.placeTemporaryRulesetAtStart(l);t.model.setProperty("/selectedRuleStringify","");t.model.setProperty("/selectedRule",f);t.model.setProperty("/selectedRuleStringify",t.createRuleString(f));t.model.setProperty("/libraries",l);var c=t.model.getProperty("/loadingAdditionalRuleSets");if(c){MessageToast.show("Additional rule set(s) loaded!");this.ruleSetView.setSelectedKey("availableRules");}},initializeTempRules:function(){var t=Storage.getRules(),l=this.model.getProperty("/loadingAdditionalRuleSets");if(t&&!l&&!this.tempRulesLoaded){this.tempRulesFromStorage=t;this.tempRulesLoaded=true;t.forEach(function(a){CommunicationBus.publish(channelNames.VERIFY_CREATE_RULE,RuleSerializer.serialize(a));});this.persistedTempRulesCount=t.length;}},placeTemporaryRulesetAtStart:function(l){for(var i=0;i<l.length;i++){var r=l[i];if(r.title===Constants.TEMP_RULESETS_NAME){var t=r;l.splice(i,1);l.unshift(t);return;}}},addLinkToRule:function(e){var t=this.model.getProperty("/tempLink"),c=jQuery.extend(true,{},t),a=e.getSource().getProperty("text"),r=a==='Add'?"/newRule":"/editRule",u=this.model.getProperty(r+"/resolutionurls");if(u){u.push(c);}else{this.model.setProperty(r+"/resolutionurls","");u.push(c);}this.model.setProperty("/tempLink",{href:"",text:""});this.model.checkUpdate(true,true);},goToCreateRule:function(){var n=this.byId("rulesNavContainer");n.to(sap.ui.getCore().byId("rulesCreatePage"),"show");},checkFunctionString:function(functionString){try{eval("var testAsignedVar = "+functionString);}catch(err){MessageToast.show("Your check function contains errors, and can't be evaluated:"+err);return false;}return true;},addNewRule:function(){var n=this.model.getProperty("/newRule");if(this.checkFunctionString(n.check)){this.showRuleCreatedToast=true;CommunicationBus.publish(channelNames.VERIFY_CREATE_RULE,RuleSerializer.serialize(n));}},rulesToolbarITHSelect:function(e){if(e.getParameter("key")==="jsonOutput"){var n=this.model.getProperty("/newRule"),s=this.createRuleString(n);this.model.setProperty("/newRuleStringified",s);}},rulesToolbarEditITHSelect:function(e){if(e.getParameter("key")==="jsonOutput"){var n=this.model.getProperty("/editRule"),s=this.createRuleString(n);this.model.setProperty("/updateRuleStringified",s);}},loadMarkedSupportLibraries:function(){var l=this.byId("availableLibrariesSet"),L=[],a=this.model.getProperty("/availableLibrariesSet");L=l.getSelectedItems().map(function(i){return i.getTitle();});l.getItems().forEach(function(i){i.setSelected(false);});if(L.length>0){a=a.filter(function(s){return L.indexOf(s)<0;});this.model.setProperty("/availableLibrariesSet",a);this.model.setProperty("/namesOfLoadedAdditionalRuleSets",L);CommunicationBus.publish(channelNames.LOAD_RULESETS,{aLibNames:{publicRules:L,internalRules:L}});this.model.setProperty("/loadingAdditionalRuleSets",true);this.model.setProperty("/showRuleProperties",true);}else{MessageToast.show("Select additional RuleSet to be loaded.");}},onCellClick:function(e){if(e.getParameter("rowBindingContext")){var s=e.getParameter("rowBindingContext").getObject(),S,r="",b=false;if(s.id&&s.type!=="lib"){S=this.getMainModelFromTreeViewModel(s);r=this.createRuleString(S);b=true;}this.model.setProperty("/selectedRuleStringify",r);this.model.setProperty("/selectedRule",S);this.model.setProperty("/showRuleProperties",b);}},getMainModelFromTreeViewModel:function(s){var a=this.model.getProperty("/libraries"),m=null;a.forEach(function(l,i){a[i].rules.forEach(function(e){if(s.id===e.id){m=e;}});});return m;},_generateRuleId:function(r){var i=0,t=this.getTemporaryLib(),T=t.rules,e,c=function(R){return R.id===r+i;};while(++i){e=T.some(c);if(!e){return r+i;}}},duplicateRule:function(e){var p=e.getSource().getBindingContext("treeModel").getPath(),s=this.treeTable.getBinding().getModel().getProperty(p),a=this.getMainModelFromTreeViewModel(s),b=jQuery.extend(true,{},a);b.id=this._generateRuleId(b.id);this.model.setProperty("/newRule",b);this.model.checkUpdate(true,false);this.goToCreateRule();},editRule:function(e){var p=e.getSource().getBindingContext("treeModel").getPath(),s=this.treeTable.getBinding().getModel().getProperty(p),a=this.getMainModelFromTreeViewModel(s);this.model.setProperty("/editRuleSource",a);this.model.setProperty("/editRule",jQuery.extend(true,{},a));this.model.checkUpdate(true,true);var n=this.byId("rulesNavContainer");n.to(sap.ui.getCore().byId("ruleUpdatePage"),"show");},deleteTemporaryRule:function(e){var s=this.getObjectOnTreeRow(e),t=this.treeTable.getBinding().getModel().getData(),l=this.model.getProperty("/libraries"),r;l.forEach(function(L){if(L.title===Constants.TEMP_RULESETS_NAME){r=L.rules.filter(function(o){return o.id!==s.id;});L.rules=r;}});for(var L in t){if(t[L].name===Constants.TEMP_RULESETS_NAME){for(var R in t[L].nodes){if(t[L].nodes[R].id===s.id){t[L].nodes.splice(R,1);}}}}this.oJsonModel.setData(t);CommunicationBus.publish(channelNames.DELETE_RULE,RuleSerializer.serialize(s));this._updateRuleList();PresetsUtils.syncCurrentSelectionPreset(SelectionUtils.getSelectedRules());if(Storage.readPersistenceCookie(Constants.COOKIE_NAME)){Storage.removeSelectedRules(r);SelectionUtils.persistSelection();}},getObjectOnTreeRow:function(e){var p=e.getSource().getBindingContext("treeModel").getPath(),s=this.treeTable.getBinding().getModel().getProperty(p),l=this.model.getProperty("/libraries");l.forEach(function(a,b){a.rules.forEach(function(r){if(r.id===s.id){s.check=r.check;}});});return s;},_updateRuleList:function(){var r=this.getView().byId("ruleList"),t=this.getTemporaryLib()["rules"];if(!t.length){r.setRowActionCount(1);}else{r.setRowActionCount(2);}},setColumnVisibility:function(c,v){var C=this.treeTable.getColumns();C.forEach(function(o){o.setVisible(!v);c.forEach(function(r){if(o.sId.includes(r)){o.setVisible(v);}});});},onColumnVisibilityChange:function(e){var c=e.getParameter("column"),n=e.getParameter("newVisible");if(!this.model.getProperty("/persistingSettings")){return;}c.setVisible(n);this.persistVisibleColumns();},onPresetVariantClick:function(){if(!this._PresetsController){this._PresetsController=new PresetsController(this.model,this.getView());}this._PresetsController.openPresetVariant();}});});
