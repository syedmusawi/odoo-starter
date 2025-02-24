/** @odoo-module **/

import {Component, useState } from "@odoo/owl";
import {registry} from "@web/core/registry";
import {Layout} from "@web/search/layout";
import {useService} from "@web/core/utils/hooks";
import {_t} from "@web/core/l10n/translation";
import {DashboardItem} from "./dashboard_item/dashboard_item";

class AwesomeDashboard extends Component {
    static template = "awesome_dashboard.AwesomeDashboard";
    static components = { Layout, DashboardItem };

    setup() {
        this.items = registry.category("awesome_dashboard").getAll();
        this.action = useService("action");
        //this.statisticsService = useService("awesome_dashboard.statistics");
        this.dashboardStatistics = useState(useService("awesome_dashboard.statistics"));

        // memoize implementation
        // this.dashboardStatistics = useState([]);
        // onWillStart(async () => {
        //     const result = await this.statisticsService.loadStatistics();
        //     this.dashboardStatistics = [
        //         {
        //             title: 'Average amount of t-shirt by order this month',
        //             quantity: result["average_quantity"],
        //         },
        //         {
        //             title: 'Average time for an order to go from ‘new’ to ‘sent’ or ‘cancelled’',
        //             quantity: result["average_time"],
        //         },
        //         {
        //             title: 'Number of new orders this month',
        //             quantity: result["nb_new_orders"],
        //         },
        //         {
        //             title: 'Number of cancelled orders this month',
        //             quantity: result["nb_cancelled_orders"],
        //         },
        //         {
        //             title: 'Total amount of new orders this month',
        //             quantity: result["total_amount"],
        //         },
        //         {
        //             title: 'Shirt orders by size',
        //             quantity: result["orders_by_size"],
        //         },
        //     ];
        // })
    }

    openCustomerKanbanView() {
        this.action.doAction("base.action_partner_form");
    }

    openCRM() {
        this.action.doAction({
            type: 'ir.actions.act_window',
            name: _t('CRM Lead'),
            target: 'current',
            res_model: 'crm.lead',
            views: [[false, 'list'], [false, 'form']],
        });
    }
}

//registry.category("actions").add("awesome_dashboard.dashboard", AwesomeDashboard);
registry.category("lazy_components").add("AwesomeDashboard", AwesomeDashboard);
