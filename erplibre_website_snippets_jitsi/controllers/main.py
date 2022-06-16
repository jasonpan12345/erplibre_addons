from urllib.parse import urlparse

from odoo import fields, http
from odoo.http import request


class WebsiteJitsi(http.Controller):
    @http.route(
        ["/website_jitsi/get_info/"], type="json", auth="public", website=True
    )
    def get_info(self, new_record=False, jitsi_id=0):
        if new_record:
            meetings = (
                request.env["sinerkia_jitsi_meet.jitsi_meet"]
                .sudo()
                .create(
                    {"name": "new from website", "date": fields.Datetime.now()}
                )
            )
        elif jitsi_id > 0:
            meetings = (
                request.env["sinerkia_jitsi_meet.jitsi_meet"]
                .sudo()
                .browse(jitsi_id)
            )
        else:
            meetings = (
                request.env["sinerkia_jitsi_meet.jitsi_meet"]
                .sudo()
                .search([("name", "!=", "null")], offset=0, limit=1)
            )

        meetingsInfo = {}
        for meeting in meetings:
            meetingsInfo = {
                "meetingName": meeting.name,
                "roomName": urlparse(meeting.url).path.replace("/", ""),
                "domaineName": "meet.jit.si",
                "url": meeting.url,
            }
        email = request.env.user.email
        username = request.env.user.name
        return {
            "userInfo": {"email": email, "displayName": username},
            "meetings": meetingsInfo,
        }
