from odoo import http


class WebsiteJitsi(http.Controller):
    @http.route(['/website_jitsi/get_info/'], type="json",
                auth="public", website=True)
    def get_info(self):
        return {"roomName": "nick-X",
                "userInfo":
                    {
                        "email": "nfreear@yahoo.XXX",
                        "displayName": "Nick X."
                    }
                }


