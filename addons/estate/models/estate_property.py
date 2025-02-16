from odoo import fields, models, api
from odoo.exceptions import UserError, ValidationError
from odoo.tools import float_is_zero, float_compare


class EstateProperty(models.Model):
    _name = 'estate.property'
    _description = 'Housing Estate'
    _sql_constraints = [
        (
            'check_expected_price',
            'CHECK (expected_price > 0)',
            'The expected price of a property should be strictly positive.'
        ),
        (
            'check_selling_price',
            'CHECK (selling_price > 0)',
            'The selling price of a property should be strictly positive.'
        ),
    ]

    _order = "id desc"

    active = fields.Boolean(default=True)

    name = fields.Char('Title', required=True)
    description = fields.Text('Description', required=True)
    postcode = fields.Char('Postcode')
    date_availability = fields.Date('Available from', copy=False,
                                    default=lambda self: fields.Datetime.add(fields.Datetime.today(), months=+3))

    expected_price = fields.Float()
    selling_price = fields.Float(readonly=True, copy=False)

    bedrooms = fields.Integer(default=2)
    living_area = fields.Integer('Living Area(sqm)')
    facades = fields.Integer()

    garage = fields.Boolean()
    garden = fields.Boolean()
    garden_area = fields.Integer('Garden Area(sqm)')
    garden_orientation = fields.Selection(selection=[('north', 'North'), ('south', 'South'),
                                                     ('east', 'East'), ('west', 'West')])

    state = fields.Selection(selection=[('new', 'New'), ('offer received', 'Offer Received'),
                                        ('offer accepted', 'Offer Accepted'), ('sold', 'Sold'),
                                        ('cancelled', 'Cancelled')],
                             required=True, copy=False, default='new')

    property_type_id = fields.Many2one("estate.property.type", string="Property Type")
    property_tag_ids = fields.Many2many("estate.property.tag", string="Property Tags")

    # Buyer
    partner_id = fields.Many2one('res.partner', string="Buyer", copy=False,
                                 default=lambda self: self.env['res.partner'])

    # Salesperson
    user_id = fields.Many2one('res.users', string="Salesman", default=lambda self: self.env.user)

    # Associated Company
    company_id = fields.Many2one('res.company', string="Company", required=True,
                                 default=lambda self: self.env.user.company_id)

    # Offers
    offer_ids = fields.One2many('estate.property.offer', "property_id", string="Offers")

    total_area = fields.Float(compute='_compute_total_area', string="Total Area(sqm)")
    best_price = fields.Float(compute='_compute_best_price', string="Best Offer")

    # -------------------------------------------------------------------------
    # COMPUTE METHODS
    # -------------------------------------------------------------------------

    @api.depends('living_area', 'garden_area')
    def _compute_total_area(self):
        for prop in self:
            prop.total_area = prop.living_area + prop.garden_area

    @api.depends('offer_ids')
    def _compute_best_price(self):
        for prop in self:
            prop.best_price = 0.0 if not prop.offer_ids else max(prop.offer_ids.mapped('price'))

    # -------------------------------------------------------------------------
    # CONSTRAIN AND ONCHANGE METHODS
    # -------------------------------------------------------------------------

    @api.onchange('garden')
    def _onchange_garden(self):
        self.garden_area = 10 if self.garden is True else 0
        self.garden_orientation = 'north' if self.garden is True else ''

    @api.constrains('expected_price', 'selling_price')
    def _check_selling_price(self):
        for prop in self:
            if not float_is_zero(prop.selling_price, 0):
                if float_compare(prop.selling_price, (0.9 * prop.expected_price), 2) < 0:
                    raise ValidationError("The selling price cannot be lower than 90% of expected price")

    # -------------------------------------------------------------------------
    # CRUD METHODS
    # -------------------------------------------------------------------------

    @api.ondelete(at_uninstall=False)
    def _unlink_if_property_new_or_cancelled(self):
        for prop in self:
            if prop.state not in ['new', 'cancelled']:
                raise UserError("Only New and Cancelled properties can be deleted")

    # -------------------------------------------------------------------------
    # ACTION METHODS
    # -------------------------------------------------------------------------

    def action_sold(self):
        for prop in self:
            if prop.state == 'cancelled':
                raise UserError('A cancelled property cannot be sold.')
            else:
                prop.state = 'sold'
            return True

    def action_cancelled(self):
        for prop in self:
            if prop.state == 'sold':
                raise UserError("A sold property cannot be cancelled.")
            else:
                prop.state = 'cancelled'
            return True
