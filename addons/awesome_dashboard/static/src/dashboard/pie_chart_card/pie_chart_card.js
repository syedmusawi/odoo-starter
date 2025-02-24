/** @odoo-module **/

import {Component} from "@odoo/owl";
import { PieChart } from "../pie_chart/pie_chart";

export class PieChartCard extends Component {
    static props = {
        title: {type: String},
        value: {
            type: Object,
            shape: { default: true },
        },
    }

    static template = "awesome_dashboard.PieChart";
    static components = { PieChart };
}
