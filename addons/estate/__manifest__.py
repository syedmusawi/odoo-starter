{
    'name': 'Estate',
    'version': '1.0.0',
    'category': 'Real Estate/Brokerage',
    'summary': 'Housing Management',
    'description': "",
    'website': 'https://www.odoo.com/page/estate',
    'depends': [
        'base_setup',
    ],
    'data': [
        'security/estate_security.xml',
        'security/ir.model.access.csv',
        'views/estate_property_views.xml',
        'views/estate_property_offer_views.xml',
        'views/estate_property_type_views.xml',
        'views/estate_property_tag_views.xml',
        'views/estate_menus.xml',
    ],
    'installable': True,
    'application': True,
    'auto_install': False
}
