from odoo import http
from odoo.http import request


class WebsiteJitsi(http.Controller):
    @http.route(['/website_jitsi/get_info/'], type="json",
                auth="public", website=True)
    def get_info(self):
        meeting = request.env['sinerkia_jitsi_meet.jitsi_meet'].sudo().open()
        email = http.request.env.user.email
        name = http.request.env.user.name
        return {"roomName": "Nick X",
                "userInfo":
                    {
                        "email": email,
                        "displayName": name
                    },
                "meeting": meeting,

                }


