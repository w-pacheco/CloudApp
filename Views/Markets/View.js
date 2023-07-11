/**
 * View.js
 * Markets View;
 * @author Wilfredo Pacheco
 */

import App, { Layout, Web, User } from "../../app.js";
import Table from "../../src/Classes/Table.js";
import View from "../../src/Classes/View.js";
import ShowForm from "./Form.js";
import { Title } from "./List.js";

/** 
 * NOTE: 
 * When creating new views that include lists and editing list items,
 * the following items should be updated:
 * 
 * Icon - With the icon that the sidebar nav will display.
 * th - With the fields the table will display.
 * Form.js - innerHTML with the template of the form for the list.
 * 
 * Then add the view in app.Render.js
 */
export const Icon = 'asterisk';
export const th = [{
    thead: 'Name',
    col: {
        data: 'MarketName',
        type: 'text',
        render: function (data, type, row) {
            return !data ? '' : data;
        }
    }
}, {
    thead: 'Market Emails',
    col: {
        data: 'MarketEmails',
        type: 'text',
        render: function (data, type, row) {
            return !data ? '' : data;
        }
    }
// }, {
//     thead: 'Continent',
//     col: {
//         data: 'Continent',
//         type: 'text',
//         render: function (data, type, row) {
//             return !data ? '' : data;
//         }
//     }
// }, {
//     thead: 'MarketEmail',
//     col: {
//         data: 'MarketEmail',
//         type: 'text',
//         render: function (data, type, row) {
//             return !data ? '' : data;
//         }
//     }
// }, {
//     thead: 'Region',
//     col: {
//         data: 'Region',
//         type: 'text',
//         render: function (data, type, row) {
//             return !data ? '' : data;
//         }
//     }
// }, {
//     thead: 'Archived',
//     col: {
//         data: 'Archived',
//         type: 'text',
//         render: function (data, type, row) {
//             return !data ? '' : data;
//         }
//     }
// }, {
//     thead: 'Notes',
//     col: {
//         data: 'Notes',
//         type: 'text',
//         render: function (data, type, row) {
//             return !data ? '' : data;
//         }
//     }
}];

export let view;
export let button;
export let container;
export let List;
export let table;
export let tableElementId;

export const columns = th.map(item => item.col);
export const processing = true;
export const responsive = true;
export const pageLength = 10;
export const tableOptions = {
    processing,
    responsive,
    pageLength,
    columns,
};

export default function Markets() {

    const { Menu, tabContent } = Layout;

    List = Web?.getListDetails ? Web.getListDetails(Title) : {};
    tableElementId = `tableid-${List?.Id}`;

    view = new View({
        Title,
        Icon,
        Menu,
        tabContent,
        content: /*html*/`
        <h1 class="mb-4">${Title}</h1>`,
    });

    button = view.getButton();
    container = view.getContainer();

    table = new Table({
        List,
        th,
        tableElementId,
        tableOptions,
        // $filter: `Archived eq 'false'`,
        parent: container.get(),
        buttons: [{
            icon: 'plus',
            events: [{ 
                name: 'click',
                attributes:  [
                    { name: 'type', value: 'button' },
                    { name: 'data-create', value: '' },
                ],
                action(event){
                    return table.ShowForm(event);
                },
            }],
        },{
            icon: 'arrow-repeat',
            events: [{ 
                name: 'click',
                attributes:  [
                    { name: 'type', value: 'button' },
                    { name: 'data-refresh', value: '' },
                ],
                action(event){
                    return table.refresh(event);
                },
            }],
        }, {
            tag: 'a',
            classList: 'btn btn-sm btn-outline-secondary',
            attributes: [
                { name: 'type', value: 'button' },
                { name: 'href', value: List?.DefaultView?.ServerRelativeUrl },
                { name: 'title', value: 'Visit SharePoint' },
                { name: 'target', value: '_blank' },
            ],
            innerHTML: /*html*/ `
            <div class="pt-1">
                <img style="width: 26px;" src="/_layouts/15/images/favicon.ico?rev=23">&#160;<span>Items</span>
            </div>`,
            role: 'Developer',
        }, {
            tag: 'a',
            classList: 'btn btn-sm btn-outline-secondary',
            attributes: [
                { name: 'type', value: 'button' },
                { name: 'href', value: `${List?.ParentWebUrl}/_layouts/15/listedit.aspx?List={${List?.Id}}` },
                { name: 'title', value: 'Visit SharePoint' },
                { name: 'target', value: '_blank' },
            ],
            innerHTML: /*html*/ `
            <div class="pt-1">
                <img style="width: 26px;" src="/_layouts/15/images/favicon.ico?rev=23">&#160;<span>Settings</span>
            </div>`,
            role: 'Developer',
        }],
        ShowForm,
    }).init();

    App.Views[Title] = {
        Title,
        view,
        button,
        container,
        table,
        tableOptions,
    }

}

window.addEventListener('popstate', function (event) {
    /** Parse the url & display the tab and/or data based on the url parameters; */
    if (location.hash === `#${Title}`) {
        /** Manually call the tab without replacing the rest of the history; */
        view?.show();

        const url = new URL(location);
        const Id = url.searchParams.get('Id');
        if (Id) table?.edit(`${List.__metadata.uri}/Items(${Id})`);
    }
});