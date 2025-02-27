/** @odoo-module **/

import {Component} from "@odoo/owl";
import {registry} from "@web/core/registry";
import {useClicker} from "../clicker_hook";
import {ClickerValue} from "../clicker_value/clicker_value";

export class ClickerClientAction extends Component {
    static template = "awesome_clicker.ClickerClientAction";
    static components = { ClickerValue };

    setup() {
        this.clicker = useClicker();
    }

    increment(event) {
        if (event.target.id === "clicker") {
            this.clicker.increment(10);

            event.stopPropagation();
        }
    }

    incrementClickBot() {
        this.clicker.incrementClickBot(1);
    }
}

registry.category("actions").add("awesome_clicker.client_action", ClickerClientAction);
