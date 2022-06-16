from urllib.parse import urlparse

from odoo import http
from odoo.http import request


class WebsiteJitsi(http.Controller):
    @http.route(
        ["/website_jitsi/get_info/"], type="json", auth="public", website=True
    )
    def get_info(self):
        meetings = (
            request.env["sinerkia_jitsi_meet.jitsi_meet"]
            .sudo()
            .search([("name", "!=", "null")], offset=0, limit=100)
        )
        meetingsInfo = []
        for meeting in meetings:
            meetingsInfo.append(
                {
                    "meetingName": meeting.name,
                    "roomName": urlparse(meeting.url).path.replace("/", ""),
                }
            )
        email = request.env.user.email
        username = request.env.user.name
        return {
            "userInfo": {"email": email, "displayName": username},
            "meetings": meetingsInfo,
        }
