/* Copyright 2017 Tecnativa - Jairo Llopis
 * License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl). */

odoo.define('website_form_builder.snippets', function (require) {
    "use strict";

    var core = require('web.core');
    var options = require('web_editor.snippets.options');
    var widgets = require("website_jitsi.widgets");


    var Form = options.Class.extend({
        init: function () {
            this._super.apply(this, arguments);
            this.$form = this.$("form.s_jitsi");
        },

        /**
         * Ask for a model or remove snippet.
         */
        onBuilt: function () {
            this._ask_model();
            this._super.apply(this, arguments);
            this.ensure_section_send();
        },
        _ask_model: function () {
            var form = new widgets.ParamsForm(
                this, {}
            );
            //form.on("save cancel", this, this.set_model);
            return form.open();
        },
    });

    // Add options to registry
    options.registry.website_form_builder_form = Form;

    return {
        Form: Form,
    };
});
