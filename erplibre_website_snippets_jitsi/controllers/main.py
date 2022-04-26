from odoo import http
from odoo.http import request


class WebsiteJitsi(http.Controller):
    @http.route(['/website_jitsi/get_info/'], type="json",
                auth="public", website=True)
    def get_info(self):
        meeting = request.env['sinerkia_jitsi_meet.jitsi_meet']
        return {"roomName": "Nick X",
                "userInfo":
                    {
                        "email": "nfreear@yahoo.XXX",
                        "displayName": "Nick X."
                    },
                "meeting": meeting
                }


