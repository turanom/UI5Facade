// Toggle online/offlie icon
window.addEventListener('online', function(){
	exfLauncher.toggleOnlineIndicator();
	exfLauncher.contextBar.getComponent().getPreloader().updateErrorCount();
	if(!navigator.serviceWorker){
		exfPreloader.getActionQueueIds('offline')
		.then(function(ids) {
			var count = ids.length;
			if (count > 0){
				var shell = exfLauncher.getShell();
				shell.setBusy(true);				
				exfPreloader.syncActionAll(ids)
				.then(function(){
					exfLauncher.contextBar.getComponent().getPreloader().updateQueueCount();
					exfLauncher.contextBar.getComponent().getPreloader().updateErrorCount();
					return;
				})
				.then(function(){
					shell.setBusy(false);
					var text = exfLauncher.contextBar.getComponent().getModel('i18n').getProperty("WEBAPP.SHELL.NETWORK.SYNC_COMPLETE");
					exfLauncher.showMessageToast(text);
					return;
				})
			}
		})
		.catch(function(error){
			shell.setBusy(false);
			exfLauncher.showMessageToast("Cannot synchronize offline actions: " + error);
		})
	}
});
window.addEventListener('offline', function(){
	exfLauncher.toggleOnlineIndicator();
});

if (navigator.serviceWorker) {
	navigator.serviceWorker.addEventListener('message', function(event) {
		exfLauncher.contextBar.getComponent().getPreloader().updateQueueCount()
		.then(function(){
			exfLauncher.contextBar.getComponent().getPreloader().updateErrorCount();
			exfLauncher.showMessageToast(event.data);
		})
	});
}

const exfLauncher = {};
(function() {
	
	exfPreloader.setTopics(['offline', 'ui5']);
	
	var _oShell = {};
	var _oAppMenu;
	var _oLauncher = this;
	
	this.getShell = function() {
		return _oShell;
	};
	
	this.initShell = function() {
		_oShell = new sap.ui.unified.Shell({
			header: [
				new sap.m.OverflowToolbar({
		            design: "Transparent",
					content: [
						new sap.m.Button({
		                    icon: "sap-icon://menu2",
		                    layoutData: new sap.m.OverflowToolbarLayoutData({priority: "NeverOverflow"}),
		                    press: function() {
		                    	_oShell.setShowPane(! _oShell.getShowPane());
		            		}
		                }),
		                new sap.m.OverflowToolbarButton("exf-home", {
		                	text: "{i18n>WEBAPP.SHELL.HOME.TITLE}",
							icon: "sap-icon://home",
		                	press: function(oEvent){
		                		oBtn = oEvent.getSource();
		                		sap.ui.core.BusyIndicator.show(0); 
		                		window.location.href = oBtn.getModel().getProperty('/_app/home_url');
                			}
		                }),
		                new sap.m.ToolbarSpacer(),
		                new sap.m.Button("exf-pagetitle", {
		                    text: "{/_app/home_title}",
		                    //icon: "sap-icon://navigation-down-arrow",
		                    iconFirst: false,
		                    layoutData: new sap.m.OverflowToolbarLayoutData({priority: "NeverOverflow"}),
		                    press: function(oEvent) {
		                    	oBtn = oEvent.getSource();
		                		sap.ui.core.BusyIndicator.show(0); 
		                		window.location.href = oBtn.getModel().getProperty('/_app/app_url');
		                		/*
		                		if (_oAppMenu !== undefined) {
		                			var oButton = oEvent.getSource();
			                		var eDock = sap.ui.core.Popup.Dock;
			                		_oAppMenu.open(this._bKeyboard, oButton, eDock.BeginTop, eDock.BeginBottom, oButton);
		                		}*/
		                	}
		                }),
		                new sap.m.ToolbarSpacer(),
		                new sap.m.Button("exf-network-indicator", {
		                    icon: function(){return navigator.onLine ? "sap-icon://connected" : "sap-icon://disconnected"}(),
		                    text: "{/_network/queueCnt} / {/_network/syncErrorCnt}",
		                    layoutData: new sap.m.OverflowToolbarLayoutData({priority: "NeverOverflow"}),
		                    press: function(oEvent){
		                    	_oLauncher.contextBar.getComponent().getPreloader().updateQueueCount();
		                    	_oLauncher.contextBar.getComponent().getPreloader().updateErrorCount();
								var oButton = oEvent.getSource();
								var oPopover = sap.ui.getCore().byId('exf-network-menu');
								if (oPopover === undefined) {
									oPopover = new sap.m.Popover("exf-network-menu", {
										title: "{= ${/_network/online} > 0 ? ${i18n>WEBAPP.SHELL.NETWORK.ONLINE} : ${i18n>WEBAPP.SHELL.NETWORK.OFFLINE} }",
										placement: "Bottom",
										content: [
											new sap.m.List({
												items: [
													new sap.m.GroupHeaderListItem({
														title: '{i18n>WEBAPP.SHELL.NETWORK.SYNC_MENU}',
														upperCase: false
													}),
													new sap.m.StandardListItem({
														title: "{i18n>WEBAPP.SHELL.NETWORK.SYNC_MENU_QUEUE} ({/_network/queueCnt})",
														type: "Active",
														icon: "sap-icon://time-entry-request",
														press: function(oEvent){
															var oTable = new sap.m.Table({
																fixedLayout: false,
																mode: sap.m.ListMode.MultiSelect,
																headerToolbar: [
																	new sap.m.OverflowToolbar({
																		design: "Transparent",
																		content: [
																			new sap.m.Label({
																				text: "{i18n>WEBAPP.SHELL.NETWORK.QUEUE_TABLE_WAITING_ACTIONS}"
																			}),
																			new sap.m.ToolbarSpacer(),
																			new sap.m.Button('exf-queue-sync', {
																				text: "{i18n>WEBAPP.SHELL.NETWORK.QUEUE_TABLE_SYNC}",
																				icon: "sap-icon://synchronize",
																				enabled: "{= ${/_network/online} > 0 ? true : false }",
																				press: function(oEvent){
																					var oButton = oEvent.getSource();
																					var table = oButton.getParent().getParent()
																					var selectedItems = table.getSelectedItems();
																					if (selectedItems.length ===0) {
																						var text = exfLauncher.contextBar.getComponent().getModel('i18n').getProperty("WEBAPP.SHELL.NETWORK.NO_SELECTION");
																						_oLauncher.showMessageToast(text);
																						return;
																					}
																					oButton.setBusyIndicatorDelay(0).setBusy(true);
																					var selectedIds = [];
																					selectedItems.forEach(function(item){
																						var bindingObj = item.getBindingContext('queueModel').getObject()
																						selectedIds.push(bindingObj.id);
																					})																					
																					exfPreloader.syncActionAll(selectedIds)
																					.then(function(){
																						_oLauncher.contextBar.getComponent().getPreloader().updateQueueCount();
																						_oLauncher.contextBar.getComponent().getPreloader().updateErrorCount();
																					})
																					.then(function(){
																						oButton.setBusy(false);
																						var text = exfLauncher.contextBar.getComponent().getModel('i18n').getProperty("WEBAPP.SHELL.NETWORK.SYNC_COMPLETE");
																						_oLauncher.showMessageToast(text);
																						return exfPreloader.getActionQueueData('offline')
																					})
																					.then(function(data){
																						var oData = {};
																						oData.data = data;
																						oTable.setModel(function(){return new sap.ui.model.json.JSONModel(oData)}(), 'queueModel');
																						return;
																					})
																					.catch(function(error){
																						console.error('Offline action sync error: ', error);
																						_oLauncher.contextBar.getComponent().getPreloader().updateQueueCount()
																						.then(function(){
																							_oLauncher.contextBar.getComponent().getPreloader().updateErrorCount();
																							oButton.setBusy(false);
																							_oLauncher.contextBar.getComponent().showErrorDialog(error, '{i18n>WEBAPP.SHELL.NETWORK.QUEUE_TABLE_HEADER}');
																							return exfPreloader.getActionQueueData('offline')
																						})
																						.then(function(data){
																							var oData = {};
																							oData.data = data;
																							oTable.setModel(function(){return new sap.ui.model.json.JSONModel(oData)}(), 'queueModel');
																							return;
																						})
																						return;
																					})
																				},
																			}),
																			new sap.m.Button({
																				text: "{i18n>WEBAPP.SHELL.NETWORK.QUEUE_TABLE_DELETE}",
																				icon: "sap-icon://cancel",
																				press: function(oEvent){
																					var oButton = oEvent.getSource();																					
																					var table = oButton.getParent().getParent()
																					var selectedItems = table.getSelectedItems();																					
																					if (selectedItems.length ===0) {
																						var text = exfLauncher.contextBar.getComponent().getModel('i18n').getProperty("WEBAPP.SHELL.NETWORK.NO_SELECTION");
																						_oLauncher.showMessageToast(text);
																						return;
																					}
																					oButton.setBusyIndicatorDelay(0).setBusy(true);
																					var selectedIds = [];
																					selectedItems.forEach(function(item){
																						var bindingObj = item.getBindingContext('queueModel').getObject()
																						selectedIds.push(bindingObj.id);
																					})
																					
																					var confirmDialog = new sap.m.Dialog({
																						title: "{i18n>WEBAPP.SHELL.NETWORK.CONFIRM_HEADER}",
																						stretch: false,
																						type: sap.m.DialogType.Message,
																						content: [
																							new sap.m.Text({
																								text: '{i18n>WEBAPP.SHELL.NETWORK.CONFIRM_TEXT}'
																							})
																						],
																						beginButton: new sap.m.Button({
																							text: "{i18n>WEBAPP.SHELL.NETWORK.CONFIRM_YES}",
																							type: sap.m.ButtonType.Emphasized,
																							press: function(oEvent){
																								exfPreloader.deleteActionAll(selectedIds)
																								.then(function(){
																									_oLauncher.contextBar.getComponent().getPreloader().updateQueueCount()
																								})
																								.then(function(){
																									confirmDialog.close();
																									oButton.setBusy(false);
																									var text = exfLauncher.contextBar.getComponent().getModel('i18n').getProperty("WEBAPP.SHELL.NETWORK.ENTRIES_DELETED");
																									_oLauncher.showMessageToast(text);
																									return exfPreloader.getActionQueueData('offline')
																								})
																								.then(function(data){
																									var oData = {};
																									oData.data = data;
																									oTable.setModel(function(){return new sap.ui.model.json.JSONModel(oData)}(), 'queueModel');
																									return;
																								})
																							}
																						}),
																						endButton: new sap.m.Button({
																							text: "{i18n>WEBAPP.SHELL.NETWORK.CONFIRM_NO}",
																							type: sap.m.ButtonType.Default,
																							press: function(oEvent){
																								oButton.setBusy(false);
																								confirmDialog.close();
																							}
																						})
																					})
																					.setModel(oButton.getModel('i18n'), 'i18n');
																					
																					confirmDialog.open();
																				}
																			}),
																			new sap.m.Button({
																				text: "{i18n>WEBAPP.SHELL.NETWORK.QUEUE_TABLE_EXPORT}",
																				icon: "sap-icon://download",
																				press: function(oEvent){
																					var oButton = oEvent.getSource();																					
																					var table = oButton.getParent().getParent()
																					var selectedItems = table.getSelectedItems();																					
																					if (selectedItems.length ===0) {
																						var text = exfLauncher.contextBar.getComponent().getModel('i18n').getProperty("WEBAPP.SHELL.NETWORK.NO_SELECTION");
																						_oLauncher.showMessageToast(text);
																						return;
																					}
																					oButton.setBusyIndicatorDelay(0).setBusy(true);
																					var selectedIds = [];
																					selectedItems.forEach(function(item){
																						var bindingObj = item.getBindingContext('queueModel').getObject()
																						selectedIds.push(bindingObj.id);
																					})
																					exfPreloader.getActionsData(selectedIds)
																					.then(function(data) {
																						data = JSON.stringify(data);
																						var date = new Date();
																						var dateString = date.toISOString();
																						dateString = dateString.substr(0,16);
																						dateString = dateString.replace(/-/gi,"");
																						dateString = dateString.replace("T","_");
																						dateString = dateString.replace(":","");
																						oButton.setBusyIndicatorDelay(0).setBusy(false);
																						exfPreloader.download(data,'offlineActions_'+ dateString, 'application/json')
																						var text = exfLauncher.contextBar.getComponent().getModel('i18n').getProperty("WEBAPP.SHELL.NETWORK.ENTRIES_EXPORTED");
																						_oLauncher.showMessageToast(text);
																						return;
																					})
																					.catch(function(error) {
																						console.error(error);
																						oButton.setBusyIndicatorDelay(0).setBusy(false);
																						_oLauncher.contextBar.getComponent().showErrorDialog('{i18n>WEBAPP.SHELL.NETWORK.CONSOLE}', '{i18n>WEBAPP.SHELL.NETWORK.ENTRIES_EXPORTED_FAILED}');
																						return;
																					})
																				}
																			})																			
																		]
																	})
																],
																footerText: '{i18n>WEBAPP.SHELL.NETWORK.QUEUE_TABLE_DEVICE}: {/_network/deviceId}',
																columns: [
																	new sap.m.Column({
																		header: [
																			new sap.m.Label({
																				text: '{i18n>WEBAPP.SHELL.NETWORK.QUEUE_TABLE_ID}'
																			})
																		]
																	}),
																	new sap.m.Column({
																		header: [
																			new sap.m.Label({
																				text: "{i18n>WEBAPP.SHELL.NETWORK.QUEUE_TABLE_OBJECT}"
																			})
																		]
																	}),
																	new sap.m.Column({
																		header: [
																			new sap.m.Label({
																				text: "{i18n>WEBAPP.SHELL.NETWORK.QUEUE_TABLE_ACTION}"
																			})
																		]
																	}),
																	new sap.m.Column({
																		header: [
																			new sap.m.Label({
																				text: '{i18n>WEBAPP.SHELL.NETWORK.QUEUE_TABLE_TRIGGERED}'
																			})
																		]
																	}),
																	new sap.m.Column({
																		header: [
																			new sap.m.Label({
																				text: '{i18n>WEBAPP.SHELL.NETWORK.QUEUE_TABLE_STATUS}'
																			})
																		]
																	}),
																	new sap.m.Column({
																		header: [
																			new sap.m.Label({
																				text: '{i18n>WEBAPP.SHELL.NETWORK.QUEUE_TABLE_TRIES}'
																			})
																		]
																	})
																],
																items: {
																	path: "queueModel>/data",
																	template: new sap.m.ColumnListItem({
																		cells: [
																			new sap.m.Text({
																				text: "{queueModel>id}"
																			}),
																			new sap.m.Text({
																				text: "{queueModel>object_name}"
																			}),
																			new sap.m.Text({
																				text: "{queueModel>action_name}"
																			}),
																			new sap.m.Text({
																				text: "{queueModel>triggered}"
																			}),
																			new sap.m.Text({
																				text: "{queueModel>status}"
																			}),
																			new sap.m.Text({
																				text: "{queueModel>tries}"
																			})
																		]
																	})
																}
															})
															.setModel(oButton.getModel())
															.setModel(oButton.getModel('i18n'), 'i18n');
															
															exfPreloader.getActionQueueData('offline')
															.then(function(data){
																var oData = {};
																oData.data = data;
																oTable.setModel(function(){return new sap.ui.model.json.JSONModel(oData)}(), 'queueModel');
																_oLauncher.contextBar.getComponent().showDialog('{i18n>WEBAPP.SHELL.NETWORK.QUEUE_TABLE_HEADER}', oTable, undefined, undefined, true);
															})
															.catch(function(data){
																var oData = {};
																oData.data = data;
																oTable.setModel(function(){return new sap.ui.model.json.JSONModel(oData)}());
																_oLauncher.contextBar.getComponent().showDialog('{i18n>WEBAPP.SHELL.NETWORK.QUEUE_TABLE_HEADER}', oTable, undefined, undefined, true);
															})
															
															
														},
													}),
													new sap.m.StandardListItem({
														title: "{i18n>WEBAPP.SHELL.NETWORK.SYNC_MENU_ERRORS} ({/_network/syncErrorCnt})",
														type: "{= ${/_network/online} > 0 ? 'Active' : 'Inactive' }",
														icon: "sap-icon://alert",
														//blocked: "{= ${/_network/online} > 0 ? false : true }", //Deprecated as of version 1.69.
														press: function(){
															var oTable = new sap.m.Table({
																fixedLayout: false,
																/*headerToolbar: [
																	new sap.m.OverflowToolbar({
																		design: "Transparent",
																		content: [
																			new sap.m.Label({
																				text: "{i18n>WEBAPP.SHELL.NETWORK.ERROR_TABLE_ERRORS}"
																			})
																		]
																	})
																],*/
																footerText: '{i18n>WEBAPP.SHELL.NETWORK.QUEUE_TABLE_DEVICE}: {/_network/deviceId}',
																columns: [
																	new sap.m.Column({
																		header: [
																			new sap.m.Label({
																				text: '{i18n>WEBAPP.SHELL.NETWORK.QUEUE_TABLE_ID}'
																			})
																		]
																	}),
																	new sap.m.Column({
																		header: [
																			new sap.m.Label({
																				text: "{i18n>WEBAPP.SHELL.NETWORK.QUEUE_TABLE_OBJECT}"
																			})
																		]
																	}),
																	new sap.m.Column({
																		header: [
																			new sap.m.Label({
																				text: "{i18n>WEBAPP.SHELL.NETWORK.QUEUE_TABLE_ACTION}"
																			})
																		]
																	}),
																	new sap.m.Column({
																		header: [
																			new sap.m.Label({
																				text: '{i18n>WEBAPP.SHELL.NETWORK.QUEUE_TABLE_TRIGGERED}'
																			})
																		]
																	}),
																	new sap.m.Column({
																		header: [
																			new sap.m.Label({
																				text: '{i18n>WEBAPP.SHELL.NETWORK.ERROR_TABLE_LOGID}'
																			})
																		]
																	}),
																	new sap.m.Column({
																		header: [
																			new sap.m.Label({
																				text: '{i18n>WEBAPP.SHELL.NETWORK.ERROR_MESSAGE}'
																			})
																		]
																	})
																],
																items: {
																	path: "errorModel>/data",
																	template: new sap.m.ColumnListItem({
																		cells: [
																			new sap.m.Text({
																				text: "{errorModel>MESSAGE_ID}"
																			}),
																			new sap.m.Text({
																				text: "{errorModel>OBJECT_ALIAS}"
																			}),
																			new sap.m.Text({
																				text: "{errorModel>ACTION_ALIAS}"
																			}),
																			new sap.m.Text({
																				text: "{errorModel>TASK_ASSIGNED_ON}"
																			}),
																			new sap.m.Text({
																				text: "{errorModel>ERROR_LOGID}"
																			}),
																			new sap.m.Text({
																				text: "{errorModel>ERROR_MESSAGE}"
																			})
																		]
																	})
																}
															})
															.setModel(oButton.getModel())
															.setModel(oButton.getModel('i18n'), 'i18n');
															
															exfPreloader.loadErrorData()
															.then(function(data){
																var oData = {};
																if (data.rows !== undefined) {
																	var rows = data.rows;
																	for (var i = 0; i < rows.length; i++) {
																		if (rows[i].TASK_ASSIGNED_ON !== undefined) {
																			rows[i].TASK_ASSIGNED_ON = new Date(rows[i].TASK_ASSIGNED_ON).toLocaleString();
																		}
																	}
																	oData.data = rows;
																}
																oTable.setModel(function(){return new sap.ui.model.json.JSONModel(oData)}(), 'errorModel');
																_oLauncher.contextBar.getComponent().showDialog('{i18n>WEBAPP.SHELL.NETWORK.ERROR_TABLE_ERRORS}', oTable, undefined, undefined, true);
															})
														}
													}),
													new sap.m.GroupHeaderListItem({
														title: '{i18n>WEBAPP.SHELL.PRELOAD.MENU}',
														upperCase: false
													}),
													new sap.m.StandardListItem({
														title: "{i18n>WEBAPP.SHELL.PRELOAD.MENU_SYNC}",
														tooltip: "{i18n>WEBAPP.SHELL.PRELOAD.MENU_SYNC_TOOLTIP}",
														icon: "sap-icon://synchronize",
														type: "{= ${/_network/online} > 0 ? 'Active' : 'Inactive' }",
														press: function(oEvent){
															oButton = oEvent.getSource();
															oButton.setBusyIndicatorDelay(0).setBusy(true);
															exfPreloader.syncAll()
															.then(function(){
																oButton.setBusy(false)
															})
															.catch(error => {
																console.error(error);
																_oLauncher.contextBar.getComponent().showErrorDialog('{i18n>WEBAPP.SHELL.NETWORK.CONSOLE}', '{i18n>WEBAPP.SHELL.NETWORK.SYNC_FAILED}');
																oButton.setBusy(false)
															});
														},
													}),
													new sap.m.StandardListItem({
														title: "{i18n>WEBAPP.SHELL.NETWORK.STORAGE_HEADER}",
														icon: "sap-icon://unwired",
														type: "Active",
														press: function(oEvent){
															_oLauncher.showStorage(oEvent);
														},
													}),
													new sap.m.StandardListItem({
														title: "{i18n>WEBAPP.SHELL.PRELOAD.MENU_RESET}",
														tooltip: "{i18n>WEBAPP.SHELL.PRELOAD.MENU_RESET_TOOLTIP}",
														icon: "sap-icon://sys-cancel",
														type: "Active",
														press: function(oEvent){
															oButton = oEvent.getSource();
															oButton.setBusyIndicatorDelay(0).setBusy(true);
															exfPreloader
															.reset()
															.then(() => {
																oButton.setBusy(false);
																_oLauncher.contextBar.getComponent().showDialog('{i18n>WEBAPP.SHELL.PRELOAD.MENU}', '{i18n>WEBAPP.SHELL.PRELOAD.CLEARED}', 'Success');
															}).catch(() => {
																oButton.setBusy(false);
																_oLauncher.contextBar.getComponent().showErrorDialog('{i18n>WEBAPP.SHELL.PRELOAD.CLEARED_ERROR}', '{i18n>WEBAPP.SHELL.PRELOAD.MENU}');
															})
														},
													})
												]
											})
										]
									})
									.setModel(oButton.getModel())
									.setModel(oButton.getModel('i18n'), 'i18n');
								}
								
								jQuery.sap.delayedCall(0, this, function () {
									oPopover.openBy(oButton);
								});
							}
		                }),		                
					]
				})
			],
			content: [
		
			]
		})
		.setModel(new sap.ui.model.json.JSONModel({
			_network: {
				online: navigator.onLine,
				queueCnt: 0,
				syncErrorCnt: 0,
				deviceId: exfPreloader.getDeviceId()
			}
		}));
		
		return _oShell;
	};
	
	this.setAppMenu = function (oControl) {
		_oAppMenu = oControl;
	};
	
	this.contextBar = function(){
		var _oComponent = {};
		var _oContextBar = {
			init : function (oComponent) {
				_oComponent = oComponent;
				
				// Give the shell the translation model of the component
				_oShell.setModel(oComponent.getModel('i18n'), 'i18n');
				
				oComponent.getRouter().attachRouteMatched(function (oEvent){
					_oContextBar.load();
				});
				
				$(document).ajaxSuccess(function(event, jqXHR, ajaxOptions, data){
					var extras = {};
					if (jqXHR.responseJSON){
						extras = jqXHR.responseJSON.extras;
					} else {
						try {
							extras = $.parseJSON(jqXHR.responseText).extras;
						} catch (err) {
							extras = {};
						}
					}
					if (extras && extras.ContextBar){
						_oContextBar.refresh(extras.ContextBar);
					}
				});
				oComponent.getPreloader().updateQueueCount();
				oComponent.getPreloader().updateErrorCount();
			},
		
			getComponent : function() {
				return _oComponent;
			},

			load : function(delay){
				if (delay == undefined) delay = 100;
				setTimeout(function(){
					// IDEA had to disable adding context bar extras to every request due to
					// performance issues. This will be needed for asynchronous contexts like
					// user messaging, external task management, etc. So put the line back in
					// place to fetch context data with every request instead of a dedicated one.
					// if ($.active == 0 && $('#contextBar .context-bar-spinner').length > 0){
					//if ($('#contextBar .context-bar-spinner').length > 0){
						$.ajax({
							type: 'POST',
							url: 'api/ui5/' + _oLauncher.getPageId() + '/context',
							dataType: 'json',
							success: function(data, textStatus, jqXHR) {
								_oContextBar.refresh(data);
							},
							error: function(jqXHR, textStatus, errorThrown){
								_oContextBar.refresh({});
							}
						});
					/*} else {
						_oContextBar.load(delay*3);
					}*/
				}, delay);
			},

			refresh : function(data){
				var oToolbar = _oShell.getHeader();
				var aItemsOld = _oShell.getHeader().getContent();
				var iItemsIndex = 5;
				var oControl = {};
				oToolbar.removeAllContent();
				
				for (var i=0; i<aItemsOld.length; i++) {
					oControl = aItemsOld[i];
					if (i < iItemsIndex || oControl.getId() == 'exf-network-indicator' || oControl.getId() == 'exf-pagetitle' || oControl.getId() == 'exf-user-icon') {
						oToolbar.addContent(oControl);
					} else {
						oControl.destroy();
					}
				}
				
				for (var id in data){
					var sColor = data[id].color ? 'background-color:'+data[id].color+' !important;' : '';
					oToolbar.insertContent(
							new sap.m.Button(id, { 
								icon: data[id].icon,
								tooltip: data[id].hint,
								text: data[id].indicator,
								press: function(oEvent) {
									var oButton = oEvent.getSource();
									_oContextBar.showMenu(oButton);
								}
							}).data('widget', data[id].bar_widget_id, true), 
							iItemsIndex);
				}
				_oLauncher.contextBar.getComponent().getPreloader().updateQueueCount();
				_oLauncher.contextBar.getComponent().getPreloader().updateErrorCount();
			},

			showMenu : function (oButton){
				var sPopoverId = oButton.data('widget')+"_popover";
				var iPopoverWidth = "350px";
				var iPopoverHeight = "300px";
				var oPopover = sap.ui.getCore().byId(sPopoverId);
				if (oPopover) {
					return;
				} else {
					oPopover = new sap.m.Popover(sPopoverId, {
						title: oButton.getTooltip(),
						placement: "Bottom",
						busy: true,
						contentWidth: iPopoverWidth,
						contentHeight: iPopoverHeight,
						horizontalScrolling: false,
						afterClose: function(oEvent) {
							oEvent.getSource().destroy();
						},
						content: [
							new sap.m.NavContainer({
								pages: [
									new sap.m.Page({
										showHeader: false,
										content: [
											
										]
									})
								]
							})
						]
					}).setBusyIndicatorDelay(0);
					oPopover.addStyleClass('exf-context-popup');
					
					jQuery.sap.delayedCall(0, this, function () {
						oPopover.openBy(oButton);
					});
				}
				
				$.ajax({
					type: 'POST',
					url: 'api/ui5',
					dataType: 'script',
					data: {
						action: 'exface.Core.ShowContextPopup',
						resource: _oLauncher.getPageId(),
						element: oButton.data('widget')
					},
					success: function(data, textStatus, jqXHR) {			
						var viewMatch = data.match(/sap.ui.jsview\("(.*)"/i);
			            if (viewMatch !== null) {
			                var view = viewMatch[1];
			                //$('body').append(data);
			            } else {
			            	_oComponent.showAjaxErrorDialog(jqXHR);
			            }
			            
			            var oPopoverPage = oPopover.getContent()[0].getPages()[0];
			            oPopoverPage.removeAllContent();
			            
			            var oView = _oComponent.runAsOwner(function() {
		            		return sap.ui.view({type:sap.ui.core.mvc.ViewType.JS, viewName:view});
	            		}); 
		            	oPopoverPage.addContent(oView);
			        	oPopover.setBusy(false);
						
					},
					error: function(jqXHR, textStatus, errorThrown){
						oButton.setBusy(false);
						_oComponent.showAjaxErrorDialog(jqXHR);
					}
				});
			}
		};
		return _oContextBar;
	}();

	this.getPageId = function(){
		return $("meta[name='page_id']").attr("content");
	};

	this.toggleOnlineIndicator = function() {
		sap.ui.getCore().byId('exf-network-indicator').setIcon(navigator.onLine ? 'sap-icon://connected' : 'sap-icon://disconnected');
		_oShell.getModel().setProperty("/_network/online", navigator.onLine);
		if (navigator.onLine) {
			_oLauncher.contextBar.load();
		}
	};
	
	this.showMessageToast = function(message){
			sap.m.MessageToast.show(message);
			return;
	};
	
	this.showStorage = async function(oEvent) {
		
		var dialog = new sap.m.Dialog({title: "{i18n>WEBAPP.SHELL.NETWORK.STORAGE_HEADER}", icon: "sap-icon://unwired"});
		var oButton = oEvent.getSource();
		var button = new sap.m.Button({
			icon: 'sap-icon://font-awesome/close',
            text: "Close",
            press: function() {dialog.close();},
        });
		dialog.addButton(button);
		list = new sap.m.List({});
		//check if possible to acces storage (means https connection)
		if (navigator.storage) {
			var promise = navigator.storage.estimate()
			.then(function(estimate) {
				list = new sap.m.List({
					items: [
						new sap.m.GroupHeaderListItem({
							title: "{i18n>WEBAPP.SHELL.NETWORK.STORAGE_OVERVIEW}",
							upperCase: false
						}),
						new sap.m.DisplayListItem({
							label: "{i18n>WEBAPP.SHELL.NETWORK.STORAGE_TOTAL}",
							value: Number.parseFloat(estimate.quota/1024/1024).toFixed(2) + ' MB'
						}),
						new sap.m.DisplayListItem({
							label: "{i18n>WEBAPP.SHELL.NETWORK.STORAGE_USED}",
							value: Number.parseFloat(estimate.usage/1024/1024).toFixed(2) + ' MB'
						}),
						new sap.m.DisplayListItem({
							label: "{i18n>WEBAPP.SHELL.NETWORK.STORAGE_PERCENTAGE}",
							value: Number.parseFloat(100/estimate.quota*estimate.usage).toFixed(2) + ' %'
						})
					]
				});
				if (estimate.usageDetails) {
					list.addItem(new sap.m.GroupHeaderListItem({
							title: "{i18n>WEBAPP.SHELL.NETWORK.STORAGE_DETAILS}",
							upperCase: false
					}));
					Object.keys(estimate.usageDetails).forEach(function(key) {
						list.addItem(new sap.m.DisplayListItem({
								label: key,
								value: Number.parseFloat(estimate.usageDetails[key]/1024/1024).toFixed(2) + ' MB'
							})
						);
					});
				}				
			})
			.catch(function(error) {
				console.error(error);
				list.addItem(new sap.m.GroupHeaderListItem({
					title: "{i18n>WEBAPP.SHELL.NETWORK.STORAGE_ERROR}",
					upperCase: false
				}))
			});
			//wait for the promise to resolve
			await promise;
		} else {
			list.addItem(new sap.m.GroupHeaderListItem({
				title: "{i18n>WEBAPP.SHELL.NETWORK.STORAGE_OVERVIEW_ERROR}",
				upperCase: false
			}))
		}
		promise = exfPreloader.getPreloadTable().toArray()
		.then(function(dbContent){
			list.addItem(new sap.m.GroupHeaderListItem({
				title: "{i18n>WEBAPP.SHELL.NETWORK.STORAGE_SYNCED}",
				upperCase: false
			}));
			var oTable = new sap.m.Table({
				fixedLayout: false,
				columns: [
		            new sap.m.Column({
		                header: new sap.m.Label({
		                    text: "{i18n>WEBAPP.SHELL.NETWORK.STORAGE_ID}"
		                })
		            }),
		            new sap.m.Column({
		                header: new sap.m.Label({
		                    text: "{i18n>WEBAPP.SHELL.NETWORK.STORAGE_OBJECT}"
		                })
		            }),
		            new sap.m.Column({
		                header: new sap.m.Label({
		                    text: "{i18n>WEBAPP.SHELL.NETWORK.STORAGE_WIDGET}"
		                })
		            }),
		            new sap.m.Column({
		                header: new sap.m.Label({
		                    text: "{i18n>WEBAPP.SHELL.NETWORK.STORAGE_DATASETS}"
		                })
		            }),
		            ,
		            new sap.m.Column({
		                header: new sap.m.Label({
		                    text: "{i18n>WEBAPP.SHELL.NETWORK.STORAGE_LAST_SYNC}"
		                })
		            })
		        ]
			});
			dbContent.forEach(function(element) {
				oRow = new sap.m.ColumnListItem();
				oRow.addCell(new sap.m.Text({text: element.id}));
				oRow.addCell(new sap.m.Text({text: element.object}));
				oRow.addCell(new sap.m.Text({text: element.widget}));
				if (element.response && element.response.rows) {
					oRow.addCell(new sap.m.Text({text: element.response.rows.length}));
					oRow.addCell(new sap.m.Text({text: new Date(element.lastSync).toLocaleString()}));
				} else {
					oRow.addCell(new sap.m.Text({text: '0'}));

					oRow.addCell(new sap.m.Text({text: '{i18n>WEBAPP.SHELL.NETWORK.STORAGE_NOT_SYNCED}'}));
				}
				oTable.addItem(oRow);						
			});
			dialog.addContent(list);
			dialog.addContent(oTable);	
		})
		.catch(function(error) {
			console.error(error);
			list.addItem(new sap.m.GroupHeaderListItem({
				title: "{i18n>WEBAPP.SHELL.NETWORK.STORAGE_ERROR}",
				upperCase: false
			}))
			dialog.addContent(list);				
		})
		//wait for the promise to resolve
		await promise;
		dialog.setModel(oButton.getModel())
		dialog.setModel(oButton.getModel('i18n'), 'i18n');
		dialog.open();
		return;
	}	
	
	this.showOfflineQueuePopoverForItem = function(sObjectAlias, sUidColumn, sUidValue, oTrigger) {	
		var oPopover = new sap.m.Popover({
			title: "{i18n>WEBAPP.SHELL.NETWORK.QUEUE_TABLE_WAITING_ACTIONS}",
			placement: "Left",
			afterClose: function(oEvent) {
				oEvent.getSource().destroy();
			},
			content: [
				new sap.m.Table({
					fixedLayout: false,
					columns: [
						new sap.m.Column({
							header: [
								new sap.m.Label({
									text: "{i18n>WEBAPP.SHELL.NETWORK.QUEUE_TABLE_ACTION}"
								})
							]
						}),
						new sap.m.Column({
							header: [
								new sap.m.Label({
									text: '{i18n>WEBAPP.SHELL.NETWORK.QUEUE_TABLE_TRIGGERED}'
								})
							]
						}),
						new sap.m.Column({
							header: [
								new sap.m.Label({
									text: '{i18n>WEBAPP.SHELL.NETWORK.QUEUE_TABLE_STATUS}'
								})
							]
						}),
						new sap.m.Column({
							header: [
								new sap.m.Label({
									text: '{i18n>WEBAPP.SHELL.NETWORK.QUEUE_TABLE_TRIES}'
								})
							]
						})
					],
					items: {
						path: "queueModel>/data",
						template: new sap.m.ColumnListItem({
							cells: [new sap.m.Text({
									text: "{queueModel>action_name}"
								}),
								new sap.m.Text({
									text: "{queueModel>triggered}"
								}),
								new sap.m.Text({
									text: "{queueModel>status}"
								}),
								new sap.m.Text({
									text: "{queueModel>tries}"
								})
							]
						})
					}
				})
			]
		})
		.setModel(oTrigger.getModel())
		.setModel(oTrigger.getModel('i18n'), 'i18n');
		
		exfPreloader.getActionQueueData(null, sObjectAlias, function(oRow){
			return oRow[sUidColumn] == sUidValue;
		})
		.then(function(aQueueItems){
			var oData = {
				data: aQueueItems
			};
			oPopover.setModel(function(){return new sap.ui.model.json.JSONModel(oData)}(), 'queueModel');
		})
		.catch(function(data){
			var oData = {
				data: data
			};
			oPopover.setModel(function(){return new sap.ui.model.json.JSONModel(oData)}());
		});
	
		jQuery.sap.delayedCall(0, this, function () {
			oPopover.openBy(oTrigger);
		});
		
		return;
	}
}).apply(exfLauncher);