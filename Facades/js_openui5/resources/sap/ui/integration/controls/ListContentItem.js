/*!
* OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
*/
sap.ui.define(["./ListContentItemRenderer","sap/m/Avatar","sap/m/AvatarShape","sap/m/AvatarSize","sap/m/StandardListItem"],function(L,A,a,b,S){"use strict";var c=S.extend("sap.ui.integration.controls.ListContentItem",{metadata:{library:"sap.ui.integration",properties:{iconAlt:{type:"string",defaultValue:""},iconDisplayShape:{type:"sap.m.AvatarShape",defaultValue:a.Square},iconInitials:{type:"string",defaultValue:""},iconSize:{type:"sap.m.AvatarSize",defaultValue:b.XS}},aggregations:{microchart:{type:"sap.ui.integration.controls.Microchart",multiple:false},_avatar:{type:"sap.m.Avatar",multiple:false,visibility:"hidden"}}},renderer:L});c.prototype._getAvatar=function(){var o=this.getAggregation("_avatar");if(!o){o=new A().addStyleClass("sapFCardIcon");this.setAggregation("_avatar",o);}o.setSrc(this.getIcon());o.setDisplayShape(this.getIconDisplayShape());o.setTooltip(this.getIconAlt());o.setInitials(this.getIconInitials());o.setDisplaySize(this.getIconSize());return o;};return c;});
