from odoo import fields, models, api


class SalesPerson(models.Model):
    _inherit = 'res.users'

    property_ids = fields.One2many('estate.property', "user_id", string="Properties",
                                   domain="['|', ('state', '=', 'new'), ('state', '=', 'offer received')]")
