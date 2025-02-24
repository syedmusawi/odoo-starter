/** @odoo-module **/

import {registry} from "@web/core/registry";
import {memoize} from "@web/core/utils/functions";
import {reactive} from "@odoo/owl";

const statisticsService = {
    dependencies: ["rpc"],
    start(env, { rpc }) {
        //const stat = reactive({ data: [] });
        const stat = reactive({});

        async function loadData() {
            const result = await rpc("/awesome_dashboard/statistics");
            // Object.assign(stat, {
            //     data: [
            //     {
            //         title: 'Average amount of t-shirt by order this month',
            //         quantity: result["average_quantity"],
            //     },
            //     {
            //         title: 'Average time for an order to go from ‘new’ to ‘sent’ or ‘cancelled’',
            //         quantity: result["average_time"],
            //     },
            //     {
            //         title: 'Number of new orders this month',
            //         quantity: result["nb_new_orders"],
            //     },
            //     {
            //         title: 'Number of cancelled orders this month',
            //         quantity: result["nb_cancelled_orders"],
            //     },
            //     {
            //         title: 'Total amount of new orders this month',
            //         quantity: result["total_amount"],
            //     },
            //     {
            //         title: 'Shirt orders by size',
            //         quantity: result["orders_by_size"],
            //     },
            // ]});
            Object.assign(stat, result);
        }

        setInterval(loadData, 10*60*1000);
        loadData();

        return stat;

        // memoize implementation
        // return {
        //     loadStatistics: memoize(async () => {
        //         return await rpc("/awesome_dashboard/statistics");
        //     }),
        // };
    },
};

registry.category("services").add("awesome_dashboard.statistics", statisticsService);
