/** @odoo-module **/

import {Component, useExternalListener} from "@odoo/owl";
import {registry} from "@web/core/registry";
import {useService} from "@web/core/utils/hooks";
import {useClicker} from "../clicker_hook";
import {ClickerValue} from "../clicker_value/clicker_value";

export class ClickerSystray extends Component {
    static template = "awesome_clicker.clicker_systray_item";
    static components = { ClickerValue };

    setup() {
        this.action = useService("action");

        this.clicker = useClicker();

        //useExternalListener(document.body, "click", this.increment, { capture: true });
    }

    // increment(event) {
    //     if (event.target.id !== "clicker") {
    //         this.clicker.increment(1);
    //     }
    // }

    openClientAction() {
        this.action.doAction({
            type: "ir.actions.client",
            tag: "awesome_clicker.client_action",
            target: "new",
            name: "Clicker Game"
        });
    }
}

registry.category("systray").add("awesome_clicker.clicker_systray_item", { Component: ClickerSystray }, { sequence: 100 });
