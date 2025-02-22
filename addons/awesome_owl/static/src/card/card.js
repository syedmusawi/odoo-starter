/** @odoo-module **/

import { Component, useState } from "@odoo/owl";

export class Card extends Component {
    static props = {
        title: {type: String},
        slots: {
            type: Object,
            shape: { default: true }
        },
    }

    static template = "awesome_owl.card";

    setup() {
        this.state = useState({ open: true });
    }

    toggleContent() {
        this.state.open = !this.state.open;
    }
}
