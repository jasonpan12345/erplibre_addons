from odoo import http
from odoo.http import request


class WebsiteJitsi(http.Controller):
    @http.route(['/website_jitsi/get_info/'], type="json",
                auth="public", website=True)
    def get_info(self):
        meeting = request.env['sinerkia_jitsi_meet.jitsi_meet'].sudo().search([("name","!=","null")],offset=0,limit=100)[0]
        email = request.env.user.email
        username = request.env.user.name
        meetingName = meeting.name
        url = meeting.url
        roomName = url[20:]
        return {"roomName": roomName,
                "userInfo":
                    {
                        "email": email,
                        "displayName": username
                    },
                "url": url
                }


