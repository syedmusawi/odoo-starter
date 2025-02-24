/** @odoo-module **/

import {Component} from "@odoo/owl";

export class NumberCard extends Component {
    static props = {
        title: {type: String},
        value: {type: Number},
    }

    static template = "awesome_dashboard.NumberCard";
}
