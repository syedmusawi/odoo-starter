/** @odoo-module **/

import {Component, useState } from "@odoo/owl";
import {registry} from "@web/core/registry";
import {Layout} from "@web/search/layout";
import {useService} from "@web/core/utils/hooks";
import {_t} from "@web/core/l10n/translation";
import {DashboardItem} from "./dashboard_item/dashboard_item";
import {Dialog} from "@web/core/dialog/dialog";
import {CheckBox} from "@web/core/checkbox/checkbox";
import {browser} from "@web/core/browser/browser";

class AwesomeDashboard extends Component {
    static template = "awesome_dashboard.AwesomeDashboard";
    static components = { Layout, DashboardItem };

    setup() {
        this.items = registry.category("awesome_dashboard").getAll();

        this.action = useService("action");
        this.dialog = useService("dialog");
        //this.statisticsService = useService("awesome_dashboard.statistics");
        this.dashboardStatistics = useState(useService("awesome_dashboard.statistics"));
        this.state = useState({
            disabledItems: browser.localStorage.getItem("disabledDashboardItems")?.split(',') || []
        });

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

    configurationUpdate(newDisabledItems) {
        this.state.disabledItems = newDisabledItems;
    }

    openConfiguration() {
        this.dialog.add(ConfigurationDialog, {
            items: this.items,
            disabledItems: this.state.disabledItems,
            onConfigurationUpdate: this.configurationUpdate.bind(this),
        });
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

class ConfigurationDialog extends Component {
    static props = {
        close: {type: Function},
        items: {type: Array},
        disabledItems: {type: Array},
        onConfigurationUpdate: {type: Function},
    }

    static template = "awesome_dashboard.ConfigurationDialog";
    static components = { Dialog, CheckBox };

    setup() {
        this.items = useState(this.props.items.map((item) => {
            return {
                ...item,
                enabled: !this.props.disabledItems.includes(item.id),
            }
        }));
    }

    done() {
        this.props.close();
    }

    onChange(changedItem) {
        changedItem.enabled = !changedItem.enabled;

        const newDisabledItems = this.items.filter(item => !item.enabled).map(item => item.id);
        browser.localStorage.setItem("disabledDashboardItems", newDisabledItems);

        this.props.onConfigurationUpdate(newDisabledItems);
    }
}

//registry.category("actions").add("awesome_dashboard.dashboard", AwesomeDashboard);
registry.category("lazy_components").add("AwesomeDashboard", AwesomeDashboard);
