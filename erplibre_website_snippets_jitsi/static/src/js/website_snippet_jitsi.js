odoo.define('website_snippet_jitsi', function (require) {
    'use strict';
    const domain = 'meet.jit.si';
    var options = {
        roomName: "", // 'PickAnAppropriateMeetingNameHere',
        width: '100%', // 700,
        height: 700,
        parentNode: document.querySelector('#meet'),
        userInfo: {},
        invitees_X: [ /* {
          email: 'nick.freear@open.ac.uk',
          name: 'Nick 2'
        } */ ],
        onload: ev => {
          const URL = ev.target.src;

          console.warn('> Jitsi loaded:', URL, ev);

          document.getElementById("jitsi-loading").classList.add('jitsi-loaded');
        }
    };
    var sAnimation = require('website.content.snippets.animation');
    sAnimation.registry.jitsi = sAnimation.Class.extend({
        selector: '.website_jitsi',
        xmlDependencies: [],
        events: {},
        read_events: {
        },

        /**
         * @override
         */
        start: function () {
            var def = this._rpc({route: '/website_snippet_jitsi/get_api_key/'}).then(function (data) {
                if (data.error) {
                    return;
                }

                if (_.isEmpty(data)) {
                    return;
                }
                options.roomName=data.roomName;
                options.userInfo=data.userInfo;


            });
            const jitsi = new JitsiMeetExternalAPI(domain, options);
            jitsi.addEventListener('incomingMessage', ev => console.warn('> Incoming:', ev));
            jitsi.addEventListener('outgoingMessage', ev => console.warn('> Outgoing:', ev));
            return $.when(this._super.apply(this, arguments), def);
        },
    });
});







