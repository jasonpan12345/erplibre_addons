odoo.define('erplibre_website_snippets_jitsi.dialog', function (require) {
    "use strict";

    var ajax = require("web.ajax");
    var core = require('web.core');
    var widget = require("web_editor.widget");
    var _t = core._t;
    var weContext = require("web_editor.context");
    var Dialog = widget.Dialog;
    var options = require('web_editor.snippets.options');

    let _models_asked = false;
    let _models_def = $.Deferred();

    var result = $.Deferred(),
        _templates_loaded = ajax.loadXML(
            "/erplibre_website_snippets_jitsi/static/src/xml/widgets.xml",
            core.qweb
        );

    /**
     * Lazily ask just once for models.
     *
     * @param {Object} servicesMixin
     * @returns {$.Deferred} Indicates models were loaded.
     */
    function available_models (servicesMixin) {
        if (!_models_asked) {
            servicesMixin._rpc({
                model: 'ir.model',
                method: 'search_read',
                kwargs: {domain: [
                    ["website_form_access", "=", true],
                ],
                fields: [
                    "name",
                    "model",
                    "website_form_label",
                ],
                order: [{name: 'website_form_label', asc: true}],
                context: weContext.get()},
            }).done(function (models_list) {
                _models_def.resolve(_.indexBy(models_list, "model"));
            });
            _models_asked = true;
        }
        return _models_def;
    }

    var ParamsForm = Dialog.extend({
        template: "erplibre_website_snippets_jitsi.ParamsForm",

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

    var dialog = new ParamsForm(
        $(".website_jitsi"), {}, "test", "test"
    );

    _templates_loaded.done(function () {
        result.resolve({
            ParamsForm: ParamsForm,
        });
    });

    var Form = options.Class.extend({
        init: function () {
            this._super.apply(this, arguments);
            //this.$form = this.$(".website_jitsi");
        },

        /**
         * Ask for a model or remove snippet.
         */
        onBuilt: function () {
            //this.ask_model();
            this._super.apply(this, arguments);
            //this.ensure_section_send();
            dialog.open();
        },

        /**
         * Fetch available models and let user choose one.
         *
         * @param {String} type Event type
         * @returns {$.Deferred} Resolves with the open form
         */
        ask_model: function (type) {
            if (type === "reset") {
                // Nothing to reset here
                return;
            }
            return available_models(this).done($.proxy(this._ask_model, this));
        },
        /**
         * Create and process form widget for asking the model.
         *
         * @param {Object} models ORM records of ir.model objects
         * @returns {Dialog} Open dialog
         */
        _ask_model: function (models) {
            var form = new widgets.ParamsForm(
                this, {}, models, this.controller_data().model_name
            );
            form.on("save cancel", this);
            return form.open();
        },

        /**
         * Get current form's controller data.
         *
         * @returns {Object} Form-attached data that is used by the
         * `website_form.animation` JS module. Check its source code to know
         * what they do.
         */
        controller_data: function () {
            var hidden_data = {},
                attributes = Array.prototype.slice.call(
                    this.$form[0].attributes);
            for (var attr in attributes) {
                attr = attributes[attr];
                if (_.str.startsWith(attr.name, 'data-form_field_')) {
                    hidden_data[attr.name.substr(16)] = attr.value;
                }
            }
            return {
                force_action: this.$form.attr("data-force_action"),
                hidden_data: hidden_data,
                model_name: this.$form.attr("data-model_name"),
                success_page: this.$form.attr("data-success_page"),
            };
        },

    });
    options.registry.erplibre_website_snippets_jitsi_form = Form;

});
