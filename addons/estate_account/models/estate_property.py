import logging

from odoo import fields, models, api, Command

_logger = logging.getLogger(__name__)


class EstateProperty(models.Model):
    _inherit = 'estate.property'

    # -------------------------------------------------------------------------
    # ACTION METHODS
    # -------------------------------------------------------------------------

    def action_sold(self):
        _ = self.env['account.move'].create(
            {
                'partner_id': self.partner_id.id,
                'move_type': 'out_invoice',
                'journal_id': self.env['account.journal'].search(domain=[('type', '=', 'sale')], limit=1).id,
                'invoice_line_ids': [
                    Command.create({
                        'name': 'Agent Commission (6% of SP)',
                        'quantity': 1,
                        'price_unit': (self.selling_price * 0.06),
                    }),
                    Command.create({
                        'name': 'Administrative expenses',
                        'quantity': 1,
                        'price_unit': 100.00,
                    }),
                ]
            }
        )
        return super().action_sold()
