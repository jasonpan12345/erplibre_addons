/* Copyright 2017 Tecnativa - Jairo Llopis
 * License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl). */

odoo.define('website_jitsi.widgets', function (require) {
    "use strict";

    var ajax = require("web.ajax");
    var core = require('web.core');
    var widget = require("web_editor.widget");
    var _t = core._t;
    var Dialog = widget.Dialog;

    var result = $.Deferred(),
        _templates_loaded = ajax.loadXML(
            "/erplibre_website_snippets_jitsi/static/src/xml/widgets.xml",
            core.qweb
        );

    var ParamsForm = Dialog.extend({
        template: "website_jitsi.ParamsForm",

        init: function (parent, options) {
            var _options = $.extend({}, {
                title: _t("Form Settings"),
                size: "small",
            }, options);
            return this._super(parent, _options);
        },
        /*
        save: function () {
            this.final_data = this.$("#model").val();
            this._super.apply(this, arguments);
        },*/
    });

    // Resolve when finished loading templates
    _templates_loaded.done(function () {
        result.resolve({
            ParamsForm: ParamsForm,
        });
    });

    return result;
});
