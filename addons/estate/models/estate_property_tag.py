from odoo import fields, models


class EstatePropertyTag(models.Model):
    _name = 'estate.property.tag'
    _description = 'Estate Property Type'
    _sql_constraints = [
        ('unique_property_tag', 'UNIQUE (name)', 'The property tag should be unique'),
    ]

    _order = "name"

    name = fields.Char(required=True)
    color = fields.Integer("Color Index", default=0)
