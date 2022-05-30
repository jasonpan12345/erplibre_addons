/* Copyright 2017 Tecnativa - Jairo Llopis
 * License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl). */

odoo.define('website_jitsi.snippets', function (require) {
    "use strict";

    var ajax = require("web.ajax");
    var core = require('web.core');
    var Context = require('web.Context');
    var Domain = require('web.Domain');
    var weContext = require("web_editor.context");
    var options = require('web_editor.snippets.options');
    var widgets = require("website_jitsi.widgets");
    var _t = core._t;

    var _fields_asked = {},
        _fields_def = {},
        _models_asked = false,
        _models_def = $.Deferred(),
        _templates_loaded = ajax.loadXML(
            "/erplibre_website_snippets_jitsi/static/views/snippets.xml",
            core.qweb
        );


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


    function authorized_fields (model, servicesMixin) {
        if (!_fields_asked[model]) {
            _fields_def[model] = $.Deferred();
            available_models(servicesMixin).done(function (models) {
                servicesMixin._rpc({
                    model: 'ir.model',
                    method: "get_authorized_fields",
                    args: [models[model].model],
                    kwargs: {
                        context: weContext.get(),
                    },
                }).done($.proxy(
                    _fields_def[model].resolve,
                    _fields_def[model]
                ));
            });
            _fields_asked[model] = true;
        }
        return _fields_def[model];
    }

/*
    var Field = options.Class.extend({

        start: function () {
            this._super.apply(this, arguments);
            this.$inputs = this.$(".o_website_form_input");
            if (this.data.disable) {
                this.disable_buttons(this.data.disable);
            }
            this.$("label").prop("contentEditable", false)
                .children("span").prop("contentEditable", true);
        },

        toggleClass: function (previewMode, value, $li) {
            this._super.apply(this, arguments);
            if (previewMode === "reset" || value === "o_required") {
                this.$inputs.attr(
                    "required",
                    this.$target.hasClass("o_required")
                );
            }
            if (
                previewMode === false &&
                value === "css_non_editable_mode_hidden" &&
                this.$target.hasClass(value) &&
                // Query to know if there's a default value
                !this.$inputs.filter(
                    ":checkbox[selected], :radio[selected]," +
                    "select>option[selected]," +
                    "input[value][value!=''],textarea:parent"
                ).length
            ) {
                this.ask_default_value(previewMode);
            }
        },

        ask_default_value: function (previewMode) {
            if (previewMode === "reset") {
                return;
            }
            var form = new widgets.DefaultValueForm(this, {}, this.$target);
            form.on("save", this, this.set_default_value);
            return form.open();
        },

        set_default_value: function (default_value) {
            var $inputs = this.$inputs;
            if ($inputs.is(":checkbox,:radio")) {
                // Set as checked chosen boxes
                $inputs.each(function () {
                    $(this).attr(
                        "checked",
                        $.inArray($(this).val(), default_value) !== -1
                    );

                });
            } else if ($inputs.is("select")) {
                $inputs.find("option").each(function () {
                    $(this).attr(
                        "selected",
                        $(this).attr("value") === default_value
                    );
                });
            } else {
                $inputs.attr("value", default_value || "");
            }
        },


        disable_buttons: function (selector) {
            var button = this.$overlay.find(selector);
            button.addClass("disabled");
        },
    });
*/
    var Form = options.Class.extend({
        init: function () {
            this._super.apply(this, arguments);
            this.$form = this.$("form.s_website_form");
        },

        cleanForSave: function () {
            var fields = this.present_fields();
            this.ensure_section_send();
            this.$("[data-model-field=false]").each(function () {
                var $el = $(this),
                    $label = $el.children(".control-label"),
                    $input = $el.find(".o_website_form_input");
                if (!$label.length) {
                    return;
                }
                $input.attr("name", _.str.clean($label.text()));
                $input.filter(":checkbox, :radio").each(function () {
                    var $box = $(this);
                    $box.attr(
                        "value",
                        _.str.clean($box.closest("label").text())
                    );
                });
            });
            this.$("#o_website_form_result").removeAttr("class").empty();
            this.$(".o_website_form_send").removeClass("disabled");
            this.$(".has-error").removeClass("has-error");
            if (fields.length) {
                this._rpc({
                    model: 'ir.model.fields',
                    method: 'formbuilder_whitelist',
                    args: [this.controller_data().model_name, fields],
                    kwargs: {
                        context: weContext.get(),
                    },
                    "async": false,
                });
            } else {
                this.$target.remove();
            }
        },


        onBuilt: function () {
            this.ask_model();
            this._super.apply(this, arguments);
            this.ensure_section_send();
        },


        ensure_section_send: function () {
            var send_section = this.$(
                ".form-group:has(.o_website_form_send)" +
                           ":has(#o_website_form_result)"
            );
            if (send_section.is(":visible")) {
                return;
            }
            this.$(".o_website_form_fields+.form-group").remove();
            _templates_loaded.done($.proxy(this, "_add_section_send"));
        },


        _add_section_send: function () {
            this.$("form").append(core.qweb.render(
                "website_form_builder.section.send",
                {option: this}
            ));
        },

        ask_model: function (type) {
            if (type === "reset") {
                // Nothing to reset here
                return;
            }
            return available_models(this).done($.proxy(this._ask_model, this));
        },

        _ask_model: function (models) {
            var form = new widgets.ParamsForm(
                this, {}, models, this.controller_data().model_name
            );
            form.on("save cancel", this, this.set_model);
            return form.open();
        },

        ask_model_field: function (type) {
            if (type === "reset") {
                // Nothing to reset here
                return;
            }
            return authorized_fields(this.controller_data()
                .model_name, this).done(
                $.proxy(this._ask_model_field, this)
            );
        },

        _ask_model_field: function (fields) {
            var form = new widgets.ModelFieldForm(
                this, {}, fields, this.present_fields()
            );
            form.on("save", this, function (infos) {
                _.map(infos, this.add_model_field, this);
            });
            return form.open();
        },

        add_custom_field: function (type, value, $li) {
            if (type === "reset") {
                // Nothing to reset here
                return;
            }
            var name = _.str.sprintf(
                    _t("Custom %s field"),
                    _.str.clean($li.text())
                ),
                option = _t("Option %d"),
                field = {
                    required: false,
                    help: _.str.sprintf(
                        _t("%s help block"),
                        name
                    ),
                    string: name,
                    // Default values for selection fields
                    selection: _.map(_.range(1, 5), function (num) {
                        return [null, _.str.sprintf(option, num)];
                    }),
                    type: value,
                };
            return this._add_field(
                _.str.sprintf("website_form_builder.field.%s", value),
                name,
                field,
                // Default values for many2* fields
                _.map(_.range(1, 5), function (num) {
                    return {
                        id: null,
                        display_name: _.str.sprintf(option, num),
                    };
                }),
                false
            );
        },

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

        present_fields: function () {
            return _.pluck(this.$(":input[name]"), "name");
        },

        set_model: function (model) {
            var previous_model = this.controller_data().model_name;
            if (!model && !previous_model) {
                this.$target.remove();
                return;
            }
            this.$form.attr("data-model_name", model);
            if (previous_model !== model) {
                authorized_fields(model, this)
                    .done($.proxy(this.reset_model_fields, this));
            }
        },

        reset_model_fields: function (fields) {
            this.$(".o_website_form_fields [data-model-field=true]").remove();
            for (var name in fields) {
                if (fields[name].required) {
                    this.add_model_field({
                        name: name,
                        field: fields[name],
                    });
                }
            }
        },

        add_model_field: function (info) {
            var relational_data = [],
                template = _.str.sprintf(
                    "website_form_builder.field.%s",
                    info.field.type
                );
            if (info.field.type.indexOf("many") !== -1) {
                relational_data = this.relational_options(info.field);
            }
            return $.when(template, info.name, info.field, relational_data,
                true, _templates_loaded)
                .done($.proxy(this._add_field, this));
        },

        _add_field: function (template, name, field, relational_data,
            model_field) {
            return this.$(".o_website_form_fields").append(core.qweb.render(
                template, {
                    field: field,
                    model_field: model_field,
                    name: name,
                    relational_data: relational_data,
                    required_att: field.required
                        ? "required"
                        : null,
                    widget: this,
                }
            ));
        },

        relational_options: function (field) {
            var domain = [],
                context = weContext.get();
            try {
                domain = new Domain(
                    field.domain || [], weContext.get()).toArray();
            } catch (error) {
                console.warn("Cannot evaluate field domain, ignoring.");
            }
            try {
                context = new Context(
                    weContext.get(),
                    field.context
                ).eval();
            } catch (error) {
                console.warn("Cannot evaluate field context, using user's.");
            }
            return this._rpc({
                model: field.relation,
                method: 'search_read',
                kwargs: {
                    domain: domain,
                    fields: ["display_name"],
                    order: [{name: "display_name", asc: true}],
                    context: context,
                },
            });
        },
    });

    //options.registry.website_form_builder_field = Field;
    options.registry.website_form_builder_form = Form;

    return {
        authorized_fields: authorized_fields,
        available_models: available_models,
        //Field: Field,
        Form: Form,
    };
});
