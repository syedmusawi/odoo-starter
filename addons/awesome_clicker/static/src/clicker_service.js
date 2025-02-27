/** @odoo-module **/

import {registry} from "@web/core/registry";
import {reactive} from "@odoo/owl";
import {ClickerModel} from "./clicker_model";

const clickerService = {
    dependencies: ["effect"],
    start(env, services) {
        // const state = reactive({ clicks: 0, level: 1, clickBots: 1 });
        //
        // setInterval(() => {
        //     state.clicks += state.clickBots*10;
        // }, 3000);
        //
        // return {
        //     state,
        //     increment(inc) {
        //         state.clicks += inc;
        //     },
        //     incrementClickBot(inc) {
        //         state.clickBots += inc;
        //     },
        // };
        const clickerModel = new ClickerModel();
        const bus = clickerModel.bus;
        bus.addEventListener("MILESTONE_1k", (ev) => {
            services.effect.add({
                message: `Milestone reached! You can now buy clickbots`,
                type: "rainbow_man",
            });
        });

        return new ClickerModel();
    }
};

registry.category("services").add("awesome_clicker.clicker", clickerService);
