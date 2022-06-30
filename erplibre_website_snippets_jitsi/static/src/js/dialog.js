odoo.define('erplibre_website_snippets_jitsi.dialog', function (require) {
    "use strict";

    var ajax = require("web.ajax");
    var core = require('web.core');
    var widget = require("web_editor.widget");
    var _t = core._t;
    var Dialog = widget.Dialog;
    var options = require('web_editor.snippets.options');


    var result = $.Deferred(),
        _templates_loaded = ajax.loadXML(
            "/erplibre_website_snippets_jitsi/static/src/xml/widgets.xml",
            core.qweb
        );


    var ParamsForm = Dialog.extend({
        template: "erplibre_website_snippets_jitsi.ParamsForm",

        /**
         * Store models info before creating widget
         *
         * @param {Object} parent Widget where this dialog is attached
         * @param {Object} options Dialog creation options
         * @param {String} chosen Prechosen model
         * @returns {Dialog} New Dialog object
         */
        init: function (parent, options, chosen) {
            this.chosen = chosen;
            var _options = $.extend({}, {
                title: _t("Form Settings"),
                size: "small",
            }, options);
            return this._super(parent, _options);
        },

        /**
         * Save data
         */
        save: function () {
            this.final_data = this.$("#model").val();
            console.log(this.final_data);

            this._super.apply(this, arguments);

            if(this.final_data == "Canal existant") {
                var dialog = new ChannelsForm(
                    $(".website_jitsi"), {}, "test", "test"
                );
                dialog.open();
            }
        },
    });
    var ChannelsForm = Dialog.extend({
        template: "erplibre_website_snippets_jitsi.ChannelsForm",

        /**
         * @param {Object} parent Widget where this dialog is attached
         * @param {Object} options Dialog creation options
         * @param {String} chosen Prechosen model
         * @returns {Dialog} New Dialog object
         */
        init: function (parent, options, chosen) {
            this.chosen = chosen;
            var _options = $.extend({}, {
                title: _t("Form Settings"),
                size: "small",
            }, options);
            return this._super(parent, _options);
        },

        /**
         * Save data
         */
        save: function () {
            this.final_data = this.$("#model").val();
            this._super.apply(this, arguments);

            let new_record = false;
            let jitsi_id = 1;

            var def = this._rpc({
                route: '/website_jitsi/get_info/', params: {
                    new_record: new_record,
                    jitsi_id:jitsi_id,
                },
            }).then(function (data) {
                if (data.error) {
                    return;
                }

                if (_.isEmpty(data)) {
                    return;
                }
                options.roomName = data.meetings.roomName;
                options.userInfo = data.userInfo;
                console.log("Jitsi url: " + data.meetings.url);
                console.log("room name: " + options.roomName);
            });
        },
    });


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
            var dialog = new ParamsForm(
                $(".website_jitsi"), {}, "test", "test"
            );
            this._super.apply(this, arguments);
            dialog.open();


        },
    });

    $(document).on("click", '#channel', function (ev) {
        let optionsDialog = new ParamsForm(
            $(".website_jitsi"), {}, "test", "test"
        );
        optionsDialog.open();
    })

    options.registry.erplibre_website_snippets_jitsi_form = Form;

});
