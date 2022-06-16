# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

{
    "name": "ERPLibre Website Snippets: Jitsi",
    "category": "Website",
    "summary": "Jitsi website snippets that allows videoconferencing",
    "version": "12.0.1.0.0",
    "author": "TechnoLibre",
    "website": "https://technolibre.ca",
    "license": "AGPL-3",
    "application": False,
    "depends": ["website", "sinerkia_jitsi_meet", "website_form"],
    "data": [
        "views/snippets.xml",
        "templates/assets.xml",
        "templates/snippets.xml",
    ],
    "installable": True,
}
