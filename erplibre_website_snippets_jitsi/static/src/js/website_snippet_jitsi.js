odoo.define('website_jitsi', function (require) {
    'use strict';
    var sAnimation = require('website.content.snippets.animation');
    sAnimation.registry.website_jitsi = sAnimation.Class.extend({
        selector: '.website_jitsi',
        xmlDependencies: [],
        events: {},
        read_events: {
        },

        /**
         * @override
         */
        start: function () {
            const domain = 'meet.jit.si';
            var options = {
                roomName: "Default", // 'PickAnAppropriateMeetingNameHere',
                width: '100%', // 700,
                height: 700,
                parentNode: document.querySelector('#meet'),
                userInfo: {},
                invitees_X: [],
                onload: ev => {
                  const URL = ev.target.src;

                  console.warn('> Jitsi loaded:', URL, ev);

                  //document.body.classList.add('jitsi-loaded');
                }
            };
            var def = this._rpc({route: '/website_jitsi/get_info/'}).then(function (data) {
                if (data.error) {
                    return;
                }

                if (_.isEmpty(data)) {
                    return;
                }
                options.roomName = data.meetings[0].roomName;
                options.userInfo = data.userInfo;
                document.getElementById("message").innerHTML = data.meetings[0].roomName;
                const jitsi = new JitsiMeetExternalAPI(domain, options);
            });
            jitsi.addEventListener('incomingMessage', ev => console.warn('> Incoming:', ev));
            jitsi.addEventListener('outgoingMessage', ev => console.warn('> Outgoing:', ev));
            return $.when(this._super.apply(this, arguments), def);
        },
    });
});







