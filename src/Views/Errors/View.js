/**
 * View.js
 * Errors View;
 * @author Wilfredo Pacheco
 */

import App, { Layout } from "../../../app.js";
import { web, user as User, service, DEVELOPER } from "../../Biome.js";
import AdministratorView from "../../Classes/AdministratorView.js";
import Table from "../../Classes/Table.js";
import Toast from "../../Classes/Toast.js";
import View from "../../Classes/View.js";
import { setLocationHash } from "../Administrator.js";
import ShowForm from "./Form.js";
import { Title } from "./List.js";

export const Icon = 'exclamation-triangle';
export const th = [{
    thead: 'Id',
    col: {
        data: 'Id',
        type: 'text',
        visible: false,
        render: function(data, type, row){
            return !data ? '' : data;
        },
    },
},{
    thead: 'File Name',
    col: {
        data: 'FileUrl',
        type: 'text',
        render: function(data, type, row){
            return !data ? 
            'N/A' : 
            data.split('/').pop();
        },
    },
},{
    thead: 'Error',
    col: {
        data: 'ErrorType',
        type: 'text',
        render: function(data, type, row){
            return !data ? '' : data;
        },
    },
// },{
//     thead: 'Message',
//     col: {
//         data: 'ErrorMessage',
//         type: 'text',
//         render: function(data, type, row){
//             return !data ? '' : data;
//         }
//     }
},{
    thead: 'Session Id',
    col: {
        data: 'SessionId',
        type: 'text',
        render: function(data, type, row){
            return !data ? '' : data;
        },
    },
},{
    thead: 'View',
    col: {
        data: 'LocationHash',
        type: 'text',
        render: function(data, type, row){
            return !data ? '' : data;
        },
    },
},{
    thead: 'Date Reported',
    col: {
        data: 'Created',
        type: 'date',
        render: function(data, type, row){
            return !data ? 
            '' : 
            new Date(data).toLocaleString();
        },
    },
},{
    thead: 'Reported By',
    col: {
        data: 'Author.Title',
        type: 'text',
        render: function(data, type, row){
            return !data ? '' : data;
        },
    },
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
export const order = [[0, 'desc']];
export const tableOptions = {
    processing,
    responsive,
    pageLength,
    columns,
    order,
};

export function getErrorBySessionId(sessionid){
    const { Url, ItemCount } = web;
    return service.get(`${Url}/_api/Web/Lists/getByTitle('${Title}')/Items`, {
        $select: '*',
        $filter: `SessionId eq '${sessionid}'`,
        $top: ItemCount,
    })
    .then(data => data.d)
    .then(data => data.results);
}

export function ErrorsTab(menu, tabcontent){

    if (!User.hasRole(DEVELOPER)) return;

    view = new AdministratorView({
        Title,
        Icon,
        Menu: menu,
        tabContent: tabcontent,
        content: /*html*/`
        <h1 class="mb-4">${Title}</h1>`,
    });

    List = web?.getListDetails ? web.getListDetails(Title) : {};
    tableElementId = `tableid-${List?.Id}`;

    button = view.getButton();
    container = view.getContainer();

    /** Bootstrap 5 removes the default hash set by this element - this manually adds the hash; */
    button.get('a').addEventListener('click', setLocationHash);
    
    table = new Table({
        List,
        th,
        tableElementId,
        tableOptions,
        parent: container.get(),
        colvis: true,
        extentions: {
            buttons: {
                excel: true,
                pdf: true,
            },
        },
        $select: 'Author/Title,Editor/Title',
        $expand: 'Author/Id,Editor/Id',
        $orderby: 'Id desc',
        $top: 1000,
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
        },{
            tag: 'a',
            classList: 'btn btn-sm btn-outline-secondary',
            attributes:  [
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
        },{
            tag: 'a',
            classList: 'btn btn-sm btn-outline-secondary',
            attributes:  [
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

    container.addEventListener('show', function(event){
        table.watcher();
    });

    App.Views[Title] = {
        Title,
        view,
        button,
        container,
        table,
        tableOptions,
    }

    if (List.ItemCount >= 10000 
    && (User.hasRole('Developer') || User.hasRole('Administrator')))
    {
        /** Make sure to alert the user this about Information Management Policy Settings; */
        // Retention Policy;
        const href = `${web.Url}/_layouts/15/policycts.aspx?List={${List.Id}}`;

        new Toast({
            type: 'danger',
            message: /*html*/`
            <p>Warning! The list <b>${List.Title}</b> can reach a high ItemCount very quickly, the currrent ItemCount is: </p>
            <p class="text-center">${List.ItemCount}</p>
            <p>It is recommended to create a 6 month retention policy to avoid issues loading list data. Please 
                <a class="text-white" href="${href}" target="_blank">click here</a> to visit list settings to get started, make sure the site collection 
                has the Information Management Policy Settings service enabled. Click on item, check Enable Retention, add retention stage, & set to +6 months
            </p>`,
        })
        .render()
        .show();
    }

}

export default function Errors(){

    const { Menu, tabContent } = Layout;

    List = web?.getListDetails ? web.getListDetails(Title) : {};
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
        parent: container.get(),
        colvis: true,
        extentions: {
            buttons: {
                excel: true,
                pdf: true,
            },
        },
        $select: 'Author/Title,Editor/Title',
        $expand: 'Author/Id,Editor/Id',
        $orderby: 'Id desc',
        $top: 1000,
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
        },{
            tag: 'a',
            classList: 'btn btn-sm btn-outline-secondary',
            attributes:  [
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
        },{
            tag: 'a',
            classList: 'btn btn-sm btn-outline-secondary',
            attributes:  [
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

    container.addEventListener('show', function(event){
        table.watcher();
    });

    App.Views[Title] = {
        Title,
        view,
        button,
        container,
        table,
        tableOptions,
    }

    if (List.ItemCount >= 10000 
    && (User.hasRole('Developer') || User.hasRole('Administrator')))
    {
        /** Make sure to alert the user this about Information Management Policy Settings; */
        // Retention Policy;
        const href = `${web.Url}/_layouts/15/policycts.aspx?List={${List.Id}}`;

        new Toast({
            type: 'danger',
            message: /*html*/`
            <p>Warning! The list <b>${List.Title}</b> can reach a high ItemCount very quickly, the currrent ItemCount is: </p>
            <p class="text-center">${List.ItemCount}</p>
            <p>It is recommended to create a 6 month retention policy to avoid issues loading list data. Please 
                <a class="text-white" href="${href}" target="_blank">click here</a> to visit list settings to get started, make sure the site collection 
                has the Information Management Policy Settings service enabled. Click on item, check Enable Retention, add retention stage, & set to +6 months
            </p>`,
        })
        .render()
        .show();
    }
}

window.addEventListener('popstate', function (event){
    /** Parse the url & display the tab and/or data based on the url parameters; */
    if (location.hash === `#${Title}`)
    {
        /** Manually call the tab without replacing the rest of the history; */
        view.show();
        
        const url = new URL(location);
        const Id = url.searchParams.get('Id');
        if (Id) table.edit(`${List.__metadata.uri}/Items(${Id})`);
    }
});