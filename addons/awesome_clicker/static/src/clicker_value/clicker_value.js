/** @odoo-module **/

import {Component} from "@odoo/owl";
import {useClicker} from "../clicker_hook";
import {humanNumber} from "@web/core/utils/numbers";

export class ClickerValue extends Component {
    static template = "awesome_clicker.ClickerValue";

    setup() {
        this.clicker = useClicker();
    }

    get humanizedClicks() {
        return humanNumber(this.clicker.clicks, { decimals: 1});
    }
}
