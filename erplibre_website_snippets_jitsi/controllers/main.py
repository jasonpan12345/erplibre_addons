from odoo import http


class WebsiteJitsi(http.Controller):
    @http.route(['/website_snippet_jitsi/get_api_key/'], type="json",
                auth="public", website=True)
    def get_api_key(self):
        return {"roomName": "nick-X",
                "userInfo":
                    {
                        "email": "nfreear@yahoo.XXX",
                        "displayName": "Nick X."
                    }
                }

