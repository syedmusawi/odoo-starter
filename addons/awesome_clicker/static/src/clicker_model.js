/** @odoo-module */

import {Reactive} from "@web/core/utils/reactive";
import {EventBus} from "@odoo/owl";

export class ClickerModel extends Reactive {
    constructor() {
        super();

        this.clicks = 0;
        this.level = 1;
        this.clickBots = 1;
        this.milestone_1k = false;

        this.bus = new EventBus();

        document.addEventListener("click", (event) => {
            if (event.target.id !== "clicker") {
                this.increment(1);
            }
        }, true)
        setInterval(() => {
            this.clicks += this.clickBots*10;
        }, 10000);
    }

    increment(inc) {
        this.clicks += inc;

        if (this.clicks >= 1000 && !this.milestone_1k) {
            this.bus.trigger("MILESTONE_1k");
            this.milestone_1k = true
        }
    }

    incrementClickBot(inc) {
        this.clickBots += inc;
    }
}
