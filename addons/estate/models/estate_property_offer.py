from odoo import fields, models, api
from odoo.exceptions import UserError, ValidationError
from odoo.tools import float_compare

import logging

_logger = logging.getLogger(__name__)


class EstatePropertyOffer(models.Model):
    _name = 'estate.property.offer'
    _description = 'Estate Property Offer'
    _sql_constraints = [
        ('check_offer_price', 'CHECK (price > 0)', 'The offer price should be strictly positive'),
    ]

    _order = "price desc"

    price = fields.Float()

    validity = fields.Integer(default=7)
    date_deadline = fields.Date(string="Deadline", compute='_compute_deadline', inverse='_inverse_deadline')
    status = fields.Selection(selection=[('pending', 'Pending'), ('accepted', 'Accepted'), ('refused', 'Refused')],
                              copy=False, default='pending')

    partner_id = fields.Many2one('res.partner', string="Buyer", required=True)
    property_id = fields.Many2one('estate.property', string="Property", required=True)

    property_type_id = fields.Many2one(related="property_id.property_type_id", store=True)

    # -------------------------------------------------------------------------
    # COMPUTE METHODS
    # -------------------------------------------------------------------------

    @api.depends('create_date', 'validity')
    def _compute_deadline(self):
        for offer in self:
            offer.date_deadline = fields.Datetime.add(
                fields.Datetime.today() if offer.create_date is False else offer.create_date, days=+offer.validity)

    def _inverse_deadline(self):
        for offer in self:
            offer.validity = (fields.Datetime.to_datetime(offer.date_deadline) - fields.Datetime.to_datetime(
                fields.Datetime.today() if offer.create_date is False else offer.create_date)).days + 1

    # -------------------------------------------------------------------------
    # CRUD METHODS
    # -------------------------------------------------------------------------

    @api.model
    def create(self, vals):
        prop = self.env['estate.property'].browse(vals['property_id'])
        if float_compare(vals['price'], prop.best_price, 2) < 0:
            raise ValidationError("A new offer cannot have a lower price than an existing offer")
        else:
            prop.state = 'offer received'
            return super().create(vals)

    # -------------------------------------------------------------------------
    # ACTION METHODS
    # -------------------------------------------------------------------------

    def action_accept(self):
        for offer in self:
            if offer.property_id.state == 'offer accepted':
                raise UserError('A property offer can be accepted only once!')
            else:
                offer.status = 'accepted'
                offer.property_id.state = 'offer accepted'
                offer.property_id.selling_price = offer.price
                offer.property_id.partner_id = offer.partner_id
            return True

    def action_refuse(self):
        for offer in self:
            if offer.status == 'accepted':
                offer.property_id.state = 'new'
                offer.property_id.selling_price = 0.0
                offer.property_id.partner_id = None
            offer.status = 'refused'
            return True
