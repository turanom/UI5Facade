/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/model/TreeBinding','sap/ui/model/odata/CountMode','sap/ui/model/ChangeReason','sap/ui/model/Filter','sap/ui/model/Sorter','sap/ui/model/odata/ODataUtils','sap/ui/model/TreeBindingUtils','sap/ui/model/odata/OperationMode','sap/ui/model/SorterProcessor','sap/ui/model/FilterProcessor','sap/ui/model/FilterType','sap/ui/model/Context',"sap/base/Log","sap/base/assert","sap/ui/thirdparty/jquery","sap/base/util/isEmptyObject"],function(T,C,a,F,S,O,b,c,d,e,f,g,L,h,q,l){"use strict";var m=T.extend("sap.ui.model.odata.v2.ODataTreeBinding",{constructor:function(M,p,o,A,P,s){T.apply(this,arguments);this.mParameters=this.mParameters||P||{};this.sGroupId;this.sRefreshGroupId;this.oFinalLengths={};this.oLengths={};this.oKeys={};this.bNeedsUpdate=false;this._bRootMissing=false;this.aSorters=s||[];this.sFilterParams="";if(A instanceof F){A=[A];}this.aApplicationFilters=A;this.oModel.checkFilterOperation(this.aApplicationFilters);this.mRequestHandles={};this.oRootContext=null;this.iNumberOfExpandedLevels=(P&&P.numberOfExpandedLevels)||0;this.iRootLevel=(P&&P.rootLevel)||0;this.sCountMode=(P&&P.countMode)||this.oModel.sDefaultCountMode;if(this.sCountMode==C.None){L.fatal("To use an ODataTreeBinding at least one CountMode must be supported by the service!");}if(P){this.sGroupId=P.groupId||P.batchGroupId;}this.bInitial=true;this._mLoadedSections={};this._iPageSize=0;this.sOperationMode=(P&&P.operationMode)||this.oModel.sDefaultOperationMode;if(this.sOperationMode===c.Default){this.sOperationMode=c.Server;}this.bClientOperation=false;switch(this.sOperationMode){case c.Server:this.bClientOperation=false;break;case c.Client:this.bClientOperation=true;break;case c.Auto:this.bClientOperation=false;break;}this.iThreshold=(P&&P.threshold)||0;this.bThresholdRejected=false;this.iTotalCollectionCount=null;this.bUseServersideApplicationFilters=(P&&P.useServersideApplicationFilters)||false;this.oAllKeys=null;this.oAllLengths=null;this.oAllFinalLengths=null;}});m.DRILLSTATES={Collapsed:"collapsed",Expanded:"expanded",Leaf:"leaf"};m.prototype._getNodeFilterParams=function(p){var P=p.isRoot?this.oTreeProperties["hierarchy-node-for"]:this.oTreeProperties["hierarchy-parent-node-for"];var E=this._getEntityType();return O._createFilterParams(new F(P,"EQ",p.id),this.oModel.oMetadata,E);};m.prototype._getLevelFilterParams=function(o,i){var E=this._getEntityType();return O._createFilterParams(new F(this.oTreeProperties["hierarchy-level-for"],o,i),this.oModel.oMetadata,E);};m.prototype._loadSingleRootNodeByNavigationProperties=function(n,r){var t=this,G;if(this.mRequestHandles[r]){this.mRequestHandles[r].abort();}G=this.sRefreshGroupId?this.sRefreshGroupId:this.sGroupId;var A=this.oModel.resolve(this.getPath(),this.getContext());if(A){this.mRequestHandles[r]=this.oModel.read(A,{groupId:G,success:function(D){var N=t._getNavPath(t.getPath());if(D){var E=D;var k=t.oModel._getKey(E);var o=t.oModel.getContext('/'+k);t.oRootContext=o;t._processODataObject(o.getObject(),n,N);}else{t._bRootMissing=true;}t.bNeedsUpdate=true;delete t.mRequestHandles[r];t.oModel.callAfterUpdate(function(){t.fireDataReceived({data:D});});},error:function(E){if(E&&E.statusCode!=0&&E.statusText!="abort"){t.bNeedsUpdate=true;t._bRootMissing=true;delete t.mRequestHandles[r];t.fireDataReceived();}}});}};m.prototype.getRootContexts=function(s,i,t){var n=null,r={numberOfExpandedLevels:this.iNumberOfExpandedLevels},R=[];if(this.isInitial()){return R;}s=s||0;i=i||this.oModel.sizeLimit;t=t||0;var j=""+n+"-"+s+"-"+this._iPageSize+"-"+t;if(this.bHasTreeAnnotations){this.bDisplayRootNode=true;R=this._getContextsForNodeId(null,s,i,t);}else{n=this.oModel.resolve(this.getPath(),this.getContext());var I=this.oModel.isList(this.sPath,this.getContext());if(I){this.bDisplayRootNode=true;}if(this.bDisplayRootNode&&!I){if(this.oRootContext){return[this.oRootContext];}else if(this._bRootMissing){return[];}else{this._loadSingleRootNodeByNavigationProperties(n,j);}}else{r.navPath=this._getNavPath(this.getPath());if(!this.bDisplayRootNode){n+="/"+r.navPath;}R=this._getContextsForNodeId(n,s,i,t,r);}}return R;};m.prototype.getNodeContexts=function(o,s,i,t){var n,r={};if(this.isInitial()){return[];}if(this.bHasTreeAnnotations){n=this.oModel.getKey(o);r.level=parseInt(o.getProperty(this.oTreeProperties["hierarchy-level-for"]))+1;}else{var N=this._getNavPath(o.getPath());if(!N){return[];}n=this.oModel.resolve(N,o);r.navPath=this.oNavigationPaths[N];}return this._getContextsForNodeId(n,s,i,t,r);};m.prototype.hasChildren=function(o){if(this.bHasTreeAnnotations){if(!o){return false;}var D=o.getProperty(this.oTreeProperties["hierarchy-drill-state-for"]);var n=this.oModel.getKey(o);var i=this.oLengths[n];if(i===0&&this.oFinalLengths[n]){return false;}if(D==="expanded"||D==="collapsed"){return true;}else if(D==="leaf"){return false;}else{L.warning("The entity '"+o.getPath()+"' has not specified Drilldown State property value.");if(D===undefined||D===""){return true;}return false;}}else{if(!o){return this.oLengths[this.getPath()]>0;}var i=this.oLengths[o.getPath()+"/"+this._getNavPath(o.getPath())];return i!==0;}};m.prototype.getChildCount=function(o){if(this.bHasTreeAnnotations){var H;if(!o){H=null;}else{H=this.oModel.getKey(o);}return this.oLengths[H];}else{if(!o){if(!this.bDisplayRootNode){return this.oLengths[this.getPath()+"/"+this._getNavPath(this.getPath())];}else{return this.oLengths[this.getPath()];}}return this.oLengths[o.getPath()+"/"+this._getNavPath(o.getPath())];}};m.prototype._getContextsForNodeId=function(n,s,j,t,r){var k=[],K;if(this.sOperationMode==c.Auto){if(this.iTotalCollectionCount==null){if(!this.bCollectionCountRequested){this._getCountForCollection();this.bCollectionCountRequested=true;}return[];}}s=s||0;j=j||this.oModel.iSizeLimit;t=t||0;if(this.sOperationMode==c.Auto){if(this.iThreshold>=0){t=Math.max(this.iThreshold,t);}}if(!this._mLoadedSections[n]){this._mLoadedSections[n]=[];}if(this.oFinalLengths[n]&&this.oLengths[n]<s+j){j=Math.max(this.oLengths[n]-s,0);}var o=this;var p=function(s){for(var i=0;i<o._mLoadedSections[n].length;i++){var I=o._mLoadedSections[n][i];if(s>=I.startIndex&&s<I.startIndex+I.length){return true;}}};var M=[];var i=Math.max((s-t-this._iPageSize),0);if(this.oKeys[n]){var u=s+j+(t);if(this.oLengths[n]){u=Math.min(u,this.oLengths[n]);}for(i;i<u;i++){K=this.oKeys[n][i];if(!K){if(!this.bClientOperation&&!p(i)){M=b.mergeSections(M,{startIndex:i,length:1});}}if(i>=s&&i<s+j){if(K){k.push(this.oModel.getContext('/'+K));}else{k.push(undefined);}}}var B=Math.max((s-t-this._iPageSize),0);var E=s+j+(t);var v=M[0]&&M[0].startIndex===B&&M[0].startIndex+M[0].length===E;if(M.length>0&&!v){i=Math.max((M[0].startIndex-t-this._iPageSize),0);var w=M[0].startIndex;for(i;i<w;i++){var K=this.oKeys[n][i];if(!K){if(!p(i)){M=b.mergeSections(M,{startIndex:i,length:1});}}}i=M[M.length-1].startIndex+M[M.length-1].length;var x=i+t+this._iPageSize;if(this.oLengths[n]){x=Math.min(x,this.oLengths[n]);}for(i;i<x;i++){var K=this.oKeys[n][i];if(!K){if(!p(i)){M=b.mergeSections(M,{startIndex:i,length:1});}}}}}else{if(!p(s)){var y=s-i;M=b.mergeSections(M,{startIndex:i,length:j+y+t});}}if(this.oModel.getServiceMetadata()){if(M.length>0){var P=[];var z="";if(this.bHasTreeAnnotations){if(this.sOperationMode=="Server"||this.bUseServersideApplicationFilters){z=this.getFilterParams();}if(n){z=z?"%20and%20"+z:"";var N=this.oModel.getContext("/"+n);var A=N.getProperty(this.oTreeProperties["hierarchy-node-for"]);var D=this._getNodeFilterParams({id:A});P.push("$filter="+D+z);}else if(n==null){var G="";if(!this.bClientOperation||this.iRootLevel>0){var H=this.bClientOperation?"GE":"EQ";G=this._getLevelFilterParams(H,this.iRootLevel);}if(G||z){if(z&&G){z="%20and%20"+z;}P.push("$filter="+G+z);}}}else{z=this.getFilterParams();if(z){P.push("$filter="+z);}}if(this.sCustomParams){P.push(this.sCustomParams);}if(!this.bClientOperation){for(i=0;i<M.length;i++){var R=M[i];this._mLoadedSections[n]=b.mergeSections(this._mLoadedSections[n],{startIndex:R.startIndex,length:R.length});this._loadSubNodes(n,R.startIndex,R.length,0,P,r,R);}}else{if(!this.oAllKeys&&!this.mRequestHandles[m.REQUEST_KEY_CLIENT]){this._loadCompleteTreeWithAnnotations(P);}}}}return k;};m.prototype._getCountForCollection=function(){if(!this.bHasTreeAnnotations||this.sOperationMode!=c.Auto){L.error("The Count for the collection can only be retrieved with Hierarchy Annotations and in OperationMode.Auto.");return;}var p=[];function _(D){var n=D.__count?parseInt(D.__count):parseInt(D);this.iTotalCollectionCount=n;if(this.sOperationMode==c.Auto){if(this.iTotalCollectionCount<=this.iThreshold){this.bClientOperation=true;this.bThresholdRejected=false;}else{this.bClientOperation=false;this.bThresholdRejected=true;}this._fireChange({reason:a.Change});}}function i(E){if(E&&E.statusCode===0&&E.statusText==="abort"){return;}var n="Request for $count failed: "+E.message;if(E.response){n+=", "+E.response.statusCode+", "+E.response.statusText+", "+E.response.body;}L.warning(n);}var A=this.oModel.resolve(this.getPath(),this.getContext());var s="";if(this.iRootLevel>0){s=this._getLevelFilterParams("GE",this.getRootLevel());}var j="";if(this.bUseServersideApplicationFilters){var j=this.getFilterParams();}if(s||j){if(j&&s){j="%20and%20"+j;}p.push("$filter="+s+j);}var k="";if(this.sCountMode==C.Request||this.sCountMode==C.Both){k="/$count";}else if(this.sCountMode==C.Inline||this.sCountMode==C.InlineRepeat){p.push("$top=0");p.push("$inlinecount=allpages");}if(A){this.oModel.read(A+k,{urlParameters:p,success:_.bind(this),error:i.bind(this),groupId:this.sRefreshGroupId?this.sRefreshGroupId:this.sGroupId});}};m.prototype._getCountForNodeId=function(n,s,i,t,p){var j=this,G;var P=[];function _(D){j.oFinalLengths[n]=true;j.oLengths[n]=parseInt(D);}function k(E){if(E&&E.statusCode===0&&E.statusText==="abort"){return;}var v="Request for $count failed: "+E.message;if(E.response){v+=", "+E.response.statusCode+", "+E.response.statusText+", "+E.response.body;}L.warning(v);}var A;var o=this.getFilterParams()||"";var N="";if(this.bHasTreeAnnotations){var r=this.oModel.getContext("/"+n);var H=r.getProperty(this.oTreeProperties["hierarchy-node-for"]);A=this.oModel.resolve(this.getPath(),this.getContext());if(n!=null){N=this._getNodeFilterParams({id:H});}else{N=this._getLevelFilterParams("EQ",this.getRootLevel());}}else{A=n;}if(N||o){var u="";if(N&&o){u="%20and%20";}o="$filter="+o+u+N;P.push(o);}if(A){G=this.sRefreshGroupId?this.sRefreshGroupId:this.sGroupId;this.oModel.read(A+"/$count",{urlParameters:P,success:_,error:k,sorters:this.aSorters,groupId:G});}};m.prototype._getParentMap=function(D){var p={};for(var i=0;i<D.length;i++){var I=D[i][this.oTreeProperties["hierarchy-node-for"]];if(p[I]){L.warning("ODataTreeBinding: Duplicate key: "+I+"!");}p[I]=this.oModel._getKey(D[i]);}return p;};m.prototype._createKeyMap=function(D,s){if(D&&D.length>0){var p=this._getParentMap(D),k={};for(var i=s?1:0;i<D.length;i++){var P=D[i][this.oTreeProperties["hierarchy-parent-node-for"]],j=p[P];if(parseInt(D[i][this.oTreeProperties["hierarchy-level-for"]])===this.iRootLevel){j="null";}if(!k[j]){k[j]=[];}k[j].push(this.oModel._getKey(D[i]));}return k;}};m.prototype._importCompleteKeysHierarchy=function(k){var i,K;for(K in k){i=k[K].length||0;this.oKeys[K]=k[K];this.oLengths[K]=i;this.oFinalLengths[K]=true;this._mLoadedSections[K]=[{startIndex:0,length:i}];}};m.prototype._updateNodeKey=function(n,N){var o=this.oModel.getKey(n.context),p,i;if(parseInt(n.context.getProperty(this.oTreeProperties["hierarchy-level-for"]))===this.iRootLevel){p="null";}else{p=this.oModel.getKey(n.parent.context);}i=this.oKeys[p].indexOf(o);if(i!==-1){this.oKeys[p][i]=N;}else{this.oKeys[p].push(N);}};m.prototype._loadSubTree=function(n,p){return new Promise(function(r,i){var R,G,A;if(!this.bHasTreeAnnotations){i(new Error("_loadSubTree: doesn't support hierarchies without tree annotations"));return;}R="loadSubTree-"+p.join("-");if(this.mRequestHandles[R]){this.mRequestHandles[R].abort();}var s=function(D){if(D.results.length>0){var P=this.oModel.getKey(D.results[0]);this._updateNodeKey(n,P);var k=this._createKeyMap(D.results);this._importCompleteKeysHierarchy(k);}delete this.mRequestHandles[R];this.bNeedsUpdate=true;this.oModel.callAfterUpdate(function(){this.fireDataReceived({data:D});}.bind(this));r(D);}.bind(this);var E=function(o){this.fireDataReceived();if(o&&o.statusCode===0&&o.statusText==="abort"){return;}delete this.mRequestHandles[R];i();}.bind(this);this.fireDataRequested();A=this.oModel.resolve(this.getPath(),this.getContext());if(A){G=this.sRefreshGroupId?this.sRefreshGroupId:this.sGroupId;this.mRequestHandles[R]=this.oModel.read(A,{urlParameters:p,success:s,error:E,sorters:this.aSorters,groupId:G});}}.bind(this));};m.prototype._loadSubNodes=function(n,s,j,t,p,P,r){var k=this,G,I=false;if((s||j)&&!this.bClientOperation){p.push("$skip="+s+"&$top="+(j+t));}if(!this.oFinalLengths[n]||this.sCountMode==C.InlineRepeat){if(this.sCountMode==C.Inline||this.sCountMode==C.InlineRepeat||this.sCountMode==C.Both){p.push("$inlinecount=allpages");I=true;}else if(this.sCountMode==C.Request){k._getCountForNodeId(n);}}var R=""+n+"-"+s+"-"+this._iPageSize+"-"+t;function o(D){if(D){k.oKeys[n]=k.oKeys[n]||[];if(I&&D.__count>=0){k.oLengths[n]=parseInt(D.__count);k.oFinalLengths[n]=true;}}if(Array.isArray(D.results)&&D.results.length>0){if(k.bHasTreeAnnotations){var u={};for(var i=0;i<D.results.length;i++){var v=D.results[i];if(i==0){u[n]=s;}else if(u[n]==undefined){u[n]=0;}k.oKeys[n][u[n]]=k.oModel._getKey(v);u[n]++;}}else{for(var i=0;i<D.results.length;i++){var v=D.results[i];var K=k.oModel._getKey(v);k._processODataObject(v,"/"+K,P.navPath);k.oKeys[n][i+s]=K;}}}else if(D&&!Array.isArray(D.results)){k.oKeys[null]=k.oModel._getKey(D);if(!k.bHasTreeAnnotations){k._processODataObject(D,n,P.navPath);}}delete k.mRequestHandles[R];k.bNeedsUpdate=true;k.oModel.callAfterUpdate(function(){k.fireDataReceived({data:D});});}function E(u){k.fireDataReceived();if(u&&u.statusCode===0&&u.statusText==="abort"){return;}delete k.mRequestHandles[R];if(r){var v=[];for(var i=0;i<k._mLoadedSections[n].length;i++){var w=k._mLoadedSections[n][i];if(r.startIndex>=w.startIndex&&r.startIndex+r.length<=w.startIndex+w.length){if(r.startIndex!==w.startIndex&&r.length!==w.length){v=b.mergeSections(v,{startIndex:w.startIndex,length:r.startIndex-w.startIndex});v=b.mergeSections(v,{startIndex:r.startIndex+r.length,length:(w.startIndex+w.length)-(r.startIndex+r.length)});}}else{v.push(w);}}k._mLoadedSections[n]=v;}}if(n!==undefined){this.fireDataRequested();var A;if(this.bHasTreeAnnotations){A=this.oModel.resolve(this.getPath(),this.getContext());}else{A=n;}if(this.mRequestHandles[R]){this.mRequestHandles[R].abort();}if(A){G=this.sRefreshGroupId?this.sRefreshGroupId:this.sGroupId;this.mRequestHandles[R]=this.oModel.read(A,{urlParameters:p,success:o,error:E,sorters:this.aSorters,groupId:G});}}};m.REQUEST_KEY_CLIENT="_OPERATIONMODE_CLIENT_TREE_LOADING";m.prototype._loadCompleteTreeWithAnnotations=function(u){var t=this;var r=m.REQUEST_KEY_CLIENT;var s=function(D){if(D.results&&D.results.length>0){var p={};var o;for(var k=0;k<D.results.length;k++){o=D.results[k];var j=o[t.oTreeProperties["hierarchy-node-for"]];if(p[j]){L.warning("ODataTreeBinding - Duplicate data entry for key: "+j+"!");}p[j]=t.oModel._getKey(o);}for(var i=0;i<D.results.length;i++){o=D.results[i];var P=o[t.oTreeProperties["hierarchy-parent-node-for"]];var n=p[P];if(parseInt(o[t.oTreeProperties["hierarchy-level-for"]])===t.iRootLevel){n="null";}t.oKeys[n]=t.oKeys[n]||[];var K=t.oModel._getKey(o);t.oKeys[n].push(K);t.oLengths[n]=t.oLengths[n]||0;t.oLengths[n]++;t.oFinalLengths[n]=true;t._mLoadedSections[n]=t._mLoadedSections[n]||[];t._mLoadedSections[n][0]=t._mLoadedSections[n][0]||{startIndex:0,length:0};t._mLoadedSections[n][0].length++;}}else{t.oKeys["null"]=[];t.oLengths["null"]=0;t.oFinalLengths["null"]=true;}t.oAllKeys=q.extend(true,{},t.oKeys);t.oAllLengths=q.extend(true,{},t.oLengths);t.oAllFinalLengths=q.extend(true,{},t.oFinalLengths);delete t.mRequestHandles[r];t.bNeedsUpdate=true;if((t.aApplicationFilters&&t.aApplicationFilters.length>0)||(t.aFilters&&t.aFilters.length>0)){t._applyFilter();}if(t.aSorters&&t.aSorters.length>0){t._applySort();}t.oModel.callAfterUpdate(function(){t.fireDataReceived({data:D});});};var E=function(o){delete t.mRequestHandles[r];var i=o.statusCode==0;if(!i){t.oKeys={};t.oLengths={};t.oFinalLengths={};t.oAllKeys={};t.oAllLengths={};t.oAllFinalLengths={};t._fireChange({reason:a.Change});}t.fireDataReceived();};this.fireDataRequested();if(this.mRequestHandles[r]){this.mRequestHandles[r].abort();}var A=this.oModel.resolve(this.getPath(),this.getContext());if(A){this.mRequestHandles[r]=this.oModel.read(A,{urlParameters:u,success:s,error:E,sorters:this.aSorters,groupId:this.sRefreshGroupId?this.sRefreshGroupId:this.sGroupId});}};m.prototype.resetData=function(v){var o,D=false;if(typeof v==="boolean"){D=v;}else{o=v;}if(o){var p=o.getPath();delete this.oKeys[p];delete this.oLengths[p];delete this.oFinalLengths[p];delete this._mLoadedSections[p];}else{this.oKeys={};this.bClientOperation=false;switch(this.sOperationMode){case c.Server:this.bClientOperation=false;break;case c.Client:this.bClientOperation=true;break;case c.Auto:this.bClientOperation=false;break;}this.bThresholdRejected=false;this.iTotalCollectionCount=null;this.bCollectionCountRequested=false;this.oAllKeys=null;this.oAllLengths=null;this.oAllFinalLengths=null;this.oLengths={};this.oFinalLengths={};this.oRootContext=null;this._bRootMissing=false;if(!D){this._abortPendingRequest();}this._mLoadedSections={};this._iPageSize=0;this.sFilterParams="";}};m.prototype.refresh=function(i,G){if(typeof i==="string"){G=i;}this.sRefreshGroupId=G;this._refresh(i);this.sRefreshGroupId=undefined;};m.prototype._refresh=function(j,k,E){var n=false;if(!j){if(E){var r=this.oModel.resolve(this.sPath,this.oContext);if(r){if(r.indexOf("?")!==-1){r=r.split("?")[0];}var o=this.oModel.oMetadata._getEntityTypeByPath(r);if(o&&(o.entityType in E)){n=true;}}}if(k&&!n){q.each(this.oKeys,function(i,N){q.each(N,function(i,K){if(K in k){n=true;return false;}});if(n){return false;}});}if(!k&&!E){n=true;}}if(j||n){this.resetData();this.bNeedsUpdate=false;this.bRefresh=true;this._fireRefresh({reason:a.Refresh});}};m.prototype.filter=function(i,s,r){var j=false;s=s||f.Control;this.oModel.checkFilterOperation(i);if(s==f.Control&&(!this.bClientOperation||this.sOperationMode==c.Server)){L.warning("Filtering with ControlFilters is ONLY possible if the ODataTreeBinding is running in OperationMode.Client or "+"OperationMode.Auto, in case the given threshold is lower than the total number of tree nodes.");return;}if(!i){i=[];}if(i instanceof F){i=[i];}if(s===f.Control){this.aFilters=i;}else{this.aApplicationFilters=i;}if(!this.bInitial){if(this.bClientOperation&&(s===f.Control||(s===f.Application&&!this.bUseServersideApplicationFilters))){if(this.oAllKeys){this.oKeys=q.extend(true,{},this.oAllKeys);this.oLengths=q.extend(true,{},this.oAllLengths);this.oFinalLengths=q.extend(true,{},this.oAllFinalLengths);this._applyFilter();this._applySort();this._fireChange({reason:a.Filter});}else{this.sChangeReason=a.Filter;}}else{this.resetData();this.sChangeReason=a.Filter;this._fireRefresh({reason:this.sChangeReason});}j=true;}if(r){return j;}else{return this;}};m.prototype._applyFilter=function(){var t=this;var o;if(this.bUseServersideApplicationFilters){o=e.groupFilters(this.aFilters);}else{o=e.combineFilters(this.aFilters,this.aApplicationFilters);}var i=function(k){var n=e.apply([k],o,function(r,p){var s=t.oModel.getContext('/'+r);return t.oModel.getProperty(p,s);});return n.length>0;};var j={};this._filterRecursive({id:"null"},j,i);this.oKeys=j;if(!this.oKeys["null"]){L.warning("Clientside filter did not match on any node!");}else{this.oLengths["null"]=this.oKeys["null"].length;this.oFinalLengths["null"]=true;}};m.prototype._filterRecursive=function(n,k,j){var o=this.oKeys[n.id];if(o){n.children=n.children||[];for(var i=0;i<o.length;i++){var p=this._filterRecursive({id:o[i]},k,j);if(p.isFiltered){k[n.id]=k[n.id]||[];k[n.id].push(p.id);n.children.push(p);}}if(n.children.length>0){n.isFiltered=true;}else{n.isFiltered=j(n.id);}if(n.isFiltered){this.oLengths[n.id]=n.children.length;this.oFinalLengths[n.id]=true;}return n;}else{n.isFiltered=j(n.id);return n;}};m.prototype.sort=function(s,r){var i=false;if(s instanceof S){s=[s];}this.aSorters=s||[];if(!this.bInitial){this._abortPendingRequest();if(this.bClientOperation){this.addSortComparators(s,this.oEntityType);if(this.oAllKeys){this._applySort();this._fireChange({reason:a.Sort});}else{this.sChangeReason=a.Sort;}}else{this.resetData(undefined,{reason:a.Sort});this.sChangeReason=a.Sort;this._fireRefresh({reason:this.sChangeReason});}i=true;}if(r){return i;}else{return this;}};m.prototype.addSortComparators=function(s,E){var p,t;if(!E){L.warning("Cannot determine sort comparators, as entitytype of the collection is unkown!");return;}q.each(s,function(i,o){if(!o.fnCompare){p=this.oModel.oMetadata._getPropertyMetadata(E,o.sPath);t=p&&p.type;h(p,"PropertyType for property "+o.sPath+" of EntityType "+E.name+" not found!");o.fnCompare=O.getComparator(t);}}.bind(this));};m.prototype._applySort=function(){var t=this,o;var G=function(k,p){o=t.oModel.getContext('/'+k);return t.oModel.getProperty(p,o);};for(var n in this.oKeys){d.apply(this.oKeys[n],this.aSorters,G);}};m.prototype.checkUpdate=function(j,k){var s=this.sChangeReason?this.sChangeReason:a.Change;var n=false;if(!j){if(this.bNeedsUpdate||!k){n=true;}else{q.each(this.oKeys,function(i,N){q.each(N,function(i,K){if(K in k){n=true;return false;}});if(n){return false;}});}}if(j||n){this.bNeedsUpdate=false;this._fireChange({reason:s});}this.sChangeReason=undefined;};m.prototype._getNavPath=function(p){var A=this.oModel.resolve(p,this.getContext());if(!A){return;}var P=A.split("/"),E=P[P.length-1],n;var s=E.split("(")[0];if(s&&this.oNavigationPaths[s]){n=this.oNavigationPaths[s];}return n;};m.prototype._processODataObject=function(o,p,n){var N=[],t=this;if(n&&n.indexOf("/")>-1){N=n.split("/");n=N[0];N.splice(0,1);}var r=this.oModel._getObject(p);if(Array.isArray(r)){this.oKeys[p]=r;this.oLengths[p]=r.length;this.oFinalLengths[p]=true;}else if(r){this.oLengths[p]=1;this.oFinalLengths[p]=true;}if(n&&o[n]){if(Array.isArray(r)){r.forEach(function(R){var o=t.getModel().getData("/"+R);t._processODataObject(o,"/"+R+"/"+n,N.join("/"));});}else if(typeof r==="object"){t._processODataObject(o,p+"/"+n,N.join("/"));}}};m.prototype._hasTreeAnnotations=function(){var M=this.oModel,o=M.oMetadata,A=M.resolve(this.getPath(),this.getContext()),E,t=o.mNamespaces["sap"],i=this;this.oTreeProperties={"hierarchy-level-for":false,"hierarchy-parent-node-for":false,"hierarchy-node-for":false,"hierarchy-drill-state-for":false};var s=function(){var j=0;var k=0;q.each(i.oTreeProperties,function(p,P){k++;if(P){j+=1;}});if(j===k){return true;}else if(j>0&&j<k){L.warning("Incomplete hierarchy tree annotations. Please check your service metadata definition!");}return false;};if(this.mParameters&&this.mParameters.treeAnnotationProperties){this.oTreeProperties["hierarchy-level-for"]=this.mParameters.treeAnnotationProperties.hierarchyLevelFor;this.oTreeProperties["hierarchy-parent-node-for"]=this.mParameters.treeAnnotationProperties.hierarchyParentNodeFor;this.oTreeProperties["hierarchy-node-for"]=this.mParameters.treeAnnotationProperties.hierarchyNodeFor;this.oTreeProperties["hierarchy-drill-state-for"]=this.mParameters.treeAnnotationProperties.hierarchyDrillStateFor;return s();}if(A.indexOf("?")!==-1){A=A.split("?")[0];}E=o._getEntityTypeByPath(A);if(!E){L.fatal("EntityType for path "+A+" could not be found.");return false;}q.each(E.property,function(I,p){if(!p.extensions){return true;}q.each(p.extensions,function(I,j){var n=j.name;if(j.namespace===t&&n in i.oTreeProperties&&!i.oTreeProperties[n]){i.oTreeProperties[n]=p.name;}});});return s();};m.prototype.initialize=function(){if(this.oModel.oMetadata&&this.oModel.oMetadata.isLoaded()&&this.bInitial){var i=this.isRelative();if(!i||(i&&this.oContext)){this._initialize();}this._fireRefresh({reason:a.Refresh});}return this;};m.prototype._initialize=function(){this.bInitial=false;this.bHasTreeAnnotations=this._hasTreeAnnotations();this.oEntityType=this._getEntityType();this._processSelectParameters();this._applyAdapter();return this;};m.prototype.setContext=function(o){if(g.hasChanged(this.oContext,o)){this.oContext=o;if(!this.isRelative()){return;}var r=this.oModel.resolve(this.sPath,this.oContext);if(r){this.resetData();this._initialize();this._fireChange({reason:a.Context});}else{if(!l(this.oAllKeys)||!l(this.oKeys)||!l(this._aNodes)){this.resetData();this._fireChange({reason:a.Context});}}}};m.prototype.applyAdapterInterface=function(){this.getContexts=this.getContexts||function(){return[];};this.getNodes=this.getNodes||function(){return[];};this.getLength=this.getLength||function(){return 0;};this.isLengthFinal=this.isLengthFinal||function(){return false;};this.getContextByIndex=this.getContextByIndex||function(){return;};this.attachSelectionChanged=this.attachSelectionChanged||function(D,i,o){this.attachEvent("selectionChanged",D,i,o);return this;};this.detachSelectionChanged=this.detachSelectionChanged||function(i,o){this.detachEvent("selectionChanged",i,o);return this;};this.fireSelectionChanged=this.fireSelectionChanged||function(p){this.fireEvent("selectionChanged",p);return this;};return this;};m.prototype._applyAdapter=function(){var M="hierarchy-node-descendant-count-for";var s="hierarchy-sibling-rank-for";var p="hierarchy-preorder-rank-for";if(this.bHasTreeAnnotations){var A=this.oModel.resolve(this.getPath(),this.getContext());if(A.indexOf("?")!==-1){A=A.split("?")[0];}var E=this.oModel.oMetadata._getEntityTypeByPath(A);var t=this;q.each(E.property,function(I,P){if(!P.extensions){return true;}q.each(P.extensions,function(I,r){var N=r.name;if(r.namespace===t.oModel.oMetadata.mNamespaces["sap"]&&(N==M||N==s||N==p)){t.oTreeProperties[N]=P.name;}});});this.oTreeProperties[M]=this.oTreeProperties[M]||(this.mParameters.treeAnnotationProperties&&this.mParameters.treeAnnotationProperties.hierarchyNodeDescendantCountFor);if(this.oTreeProperties[M]&&this.sOperationMode==c.Server){var i,j,k;this.oTreeProperties[s]=this.oTreeProperties[s]||(this.mParameters.treeAnnotationProperties&&this.mParameters.treeAnnotationProperties.hierarchySiblingRankFor);this.oTreeProperties[p]=this.oTreeProperties[p]||(this.mParameters.treeAnnotationProperties&&this.mParameters.treeAnnotationProperties.hierarchyPreorderRankFor);if(this.mParameters.restoreTreeStateAfterChange){if(this.oTreeProperties[s]&&this.oTreeProperties[p]){this._bRestoreTreeStateAfterChange=true;this._aTreeKeyProperties=[];for(i=E.key.propertyRef.length-1;i>=0;i--){this._aTreeKeyProperties.push(E.key.propertyRef[i].name);}}else{L.warning("Tree state restoration not possible: Missing annotation \"hierarchy-sibling-rank-for\" and/or \"hierarchy-preorder-rank-for\"");this._bRestoreTreeStateAfterChange=false;}}else{this._bRestoreTreeStateAfterChange=false;}if(this.mParameters&&this.mParameters.select){if(this.mParameters.select.indexOf(this.oTreeProperties[M])===-1){this.mParameters.select+=","+this.oTreeProperties[M];}if(this._bRestoreTreeStateAfterChange){for(j=this._aTreeKeyProperties.length-1;j>=0;j--){k=this._aTreeKeyProperties[j];if(this.mParameters.select.indexOf(k)===-1){this.mParameters.select+=","+k;}}}this.sCustomParams=this.oModel.createCustomParams(this.mParameters);}var n=sap.ui.requireSync("sap/ui/model/odata/ODataTreeBindingFlat");n.apply(this);}else{var o=sap.ui.requireSync("sap/ui/model/odata/ODataTreeBindingAdapter");o.apply(this);}}else if(this.oNavigationPaths){var o=sap.ui.requireSync("sap/ui/model/odata/ODataTreeBindingAdapter");o.apply(this);}else{L.error("Neither hierarchy annotations, nor navigation properties are specified to build the tree.",this);}};m.prototype._processSelectParameters=function(){if(this.mParameters){this.oNavigationPaths=this.mParameters.navigation;if(this.mParameters.select){var s=this.mParameters.select.split(",");var n=[];if(this.oNavigationPaths){q.each(this.oNavigationPaths,function(p,P){if(n.indexOf(P)==-1){n.push(P);}});}q.each(n,function(p,P){if(s.indexOf(P)==-1){s.push(P);}});if(this.bHasTreeAnnotations){q.each(this.oTreeProperties,function(A,t){if(t){if(s.indexOf(t)==-1){s.push(t);}}});}this.mParameters.select=s.join(",");}this.sCustomParams=this.oModel.createCustomParams(this.mParameters);}if(!this.bHasTreeAnnotations&&!this.oNavigationPaths){L.error("Neither navigation paths parameters, nor (complete/valid) tree hierarchy annotations where provided to the TreeBinding.");this.oNavigationPaths={};}};m.prototype.getTreeAnnotation=function(A){return this.bHasTreeAnnotations?this.oTreeProperties[A]:undefined;};m.prototype.getDownloadUrl=function(s){var p=[],P;if(s){p.push("$format="+encodeURIComponent(s));}if(this.aSorters&&this.aSorters.length>0){p.push(O.createSortParams(this.aSorters));}if(this.getFilterParams()){p.push("$filter="+this.getFilterParams());}if(this.sCustomParams){p.push(this.sCustomParams);}P=this.oModel.resolve(this.sPath,this.oContext);if(P){return this.oModel._createRequestUrl(P,null,p);}};m.prototype.setNumberOfExpandedLevels=function(i){i=i||0;if(i<0){L.warning("ODataTreeBinding: numberOfExpandedLevels was set to 0. Negative values are prohibited.");i=0;}this.iNumberOfExpandedLevels=i;this._fireChange();};m.prototype.getNumberOfExpandedLevels=function(){return this.iNumberOfExpandedLevels;};m.prototype.setRootLevel=function(r){r=parseInt(r||0);if(r<0){L.warning("ODataTreeBinding: rootLevels was set to 0. Negative values are prohibited.");r=0;}this.iRootLevel=r;this.refresh();};m.prototype.getRootLevel=function(){return parseInt(this.iRootLevel);};m.prototype._getEntityType=function(){var r=this.oModel.resolve(this.sPath,this.oContext);if(r){var E=this.oModel.oMetadata._getEntityTypeByPath(r);h(E,"EntityType for path "+r+" could not be found!");return E;}return undefined;};m.prototype.getFilterParams=function(){var G;if(this.aApplicationFilters){this.aApplicationFilters=Array.isArray(this.aApplicationFilters)?this.aApplicationFilters:[this.aApplicationFilters];if(this.aApplicationFilters.length>0&&!this.sFilterParams){G=e.groupFilters(this.aApplicationFilters);this.sFilterParams=O._createFilterParams(G,this.oModel.oMetadata,this.oEntityType);this.sFilterParams=this.sFilterParams?"("+this.sFilterParams+")":"";}}else{this.sFilterParams="";}return this.sFilterParams;};m.prototype._abortPendingRequest=function(){q.each(this.mRequestHandles,function(r,R){if(R){R.abort();}});this.mRequestHandles={};};return m;});
