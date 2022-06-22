odoo.define('erplibre_website_snippets_jitsi.dialog', function (require) {
    "use strict";

    var ajax = require("web.ajax");
    var core = require('web.core');
    var widget = require("web_editor.widget");
    var _t = core._t;
    var Dialog = widget.Dialog;
    var options = require('web_editor.snippets.options');

    var ParamsForm = Dialog.extend({
        //template: "erplibre_website_snippets_jitsi.ParamsForm",

        /**
         * Store models info before creating widget
         *
         * @param {Object} parent Widget where this dialog is attached
         * @param {Object} options Dialog creation options
         * @param {Array} models Available models to choose among
         * @param {String} chosen Prechosen model
         * @returns {Dialog} New Dialog object
         */
        init: function (parent, options, models, chosen) {
            this.models = models;
            this.chosen = chosen;
            var _options = $.extend({}, {
                title: _t("Form Settings"),
                size: "small",
            }, options);
            return this._super(parent, _options);
        },

        /**
         * Save new model
         */
        save: function () {
            //this.final_data = this.$("#model").val();
            this._super.apply(this, arguments);
        },
    });

    var form = new ParamsForm(
        $(".website_jitsi"), {}, "test", "test"
    );

    var Form = options.Class.extend({
        init: function () {
            this._super.apply(this, arguments);
            //this.$form = this.$(".website_jitsi");
        },

        /**
         * Ask for a model or remove snippet.
         */
        onBuilt: function () {
           // this.ask_model();
            this._super.apply(this, arguments);
            //this.ensure_section_send();
            form.open();
        },

    });
    options.registry.erplibre_website_snippets_jitsi_form = Form;

});
