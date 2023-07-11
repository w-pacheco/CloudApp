/**
 * View.js
 * Roles View;
 * @author Wilfredo Pacheco
 */

import App, { Layout } from "../../../app.js";
import { web, user as User, DEVELOPER } from "../../Biome.js";
import AdministratorView from "../../Classes/AdministratorView.js";
import Table from "../../Classes/Table.js";
import View from "../../Classes/View.js";
import { setLocationHash } from "../Administrator.js";
import ShowForm from "./Form.js";
import { Title } from "./List.js";

/** NOTE: 
 * When creating new views that include lists and editing list items,
 * the following items should be updated:
 * 
 * Icon - With the icon that the sidebar nav will display.
 * th - With the fields the table will display.
 * Form.js - innerHTML with the template of the form for the list.
 */
export const Icon = 'person-lines-fill';
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
    thead: 'Role',
    col: {
        data: 'RoleTitle',
        type: 'text',
        render: function(data, type, row){
            return !data ? '' : data;
        },
    },
},{
    thead: 'Description',
    col: {
        data: 'Description',
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
export const tableOptions = {
    processing,
    responsive,
    pageLength,
    columns,
};

export function getAdminRoleTitle(){

    const { Url } = web;

    return service.Get(`${Url}/_api/Web/Lists/getByTitle('${Title}')/Items`, {
        $filter: `substringof('Administrator',RoleTitle)`,
    })
    .then(data => data.d)
    .then(data => data.results)
    .then(results => results[0])
    .then(data => {
        if (data) return data.RoleTitle;
        else return 'Administrator';
    })
    .catch(e => {
        console.info(e); 
        return [];
    });

}

/** Administrator Tab View; */
export function RolesTab(menu, tabcontent){

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

    container.get().addEventListener('show', function(event){
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

}

export default function Roles(){

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

    App.Views[Title] = {
        Title,
        view,
        button,
        container,
        table,
        tableOptions,
    }

}

window.addEventListener('popstate', function (event){
    /** Parse the url & display the tab and/or data based on the url parameters; */
    if (location.hash === `#${Title}`)
    {
        /** Manually call the tab without replacing the rest of the history; */
        view?.show();
        
        const url = new URL(location);
        const Id = url.searchParams.get('Id');
        if (Id) table?.edit(`${List.__metadata.uri}/Items(${Id})`);
    }
});