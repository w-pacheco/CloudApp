/**
 * View.js
 * Series View;
 * @author Wilfredo Pacheco
 */

import App, { Layout, Web, store } from "../../app.js";
import Table from "../../src/Classes/Table.js";
import View from "../../src/Classes/View.js";
import ShowAdminForm from "./Form.admin.js";
// import ShowForm from "./Form.admin.js";
import ShowForm from "./Form.js";
import { Title } from "./List.js";

import AdministratorView from "../../src/Classes/AdministratorView.js";
import { setLocationHash } from "../../src/Views/Administrator.js";
import { Title as ProjectsTitle } from '../Projects/List.js';

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

export const Icon = 'journal-bookmark';
export const th = [{
    thead: 'Id',
    col: {
        data: 'Id',
        type: 'text',
        visible: false,
        render: function (data, type, row) {
            return !data ? '' : Number(data);
        },
    },
},{
    thead: 'Series',
    col: {
        data: 'SeriesTitle',
        type: 'text',
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
},{
    thead: 'Project',
    col: {
        data: 'Project_FK',
        type: 'text',
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
},{
    thead: 'Status',
    col: {
        data: 'Status',
        type: 'text',
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
},{
    thead: 'Created',
    col: {
        data: 'Created',
        type: 'date',
        render: function(data, type, row){
            return !data ? 
            '' : 
            new Date(data).toLocaleString();
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

function getTableHeaderIndex(tableHeaderString){
    return columns
    .map(col => col.data)
    .indexOf(tableHeaderString);
}

function correctProjectTitles(event){

    const index = getTableHeaderIndex('Project_FK');
    const List = Web.getListDetails(ProjectsTitle);
    const Projects = store.listObserver.getListDataById(List.Id);

    return $(this).DataTable()
    .data()
    .rows()
    .context[0]
    .aoData
    .map(el => {
        if (el.anCells[index].innerText)
        {
            try
            {
                const project_fk = el.anCells[index].innerText;
                const result = Projects.find(p => p.GUID === project_fk);
                el.anCells[index].innerText = result.Project;
            }
            catch(e){ }
        }
    });

}

/** Admin View Method; */
export function SeriesTab(menu, tabcontent){

    view = new AdministratorView({
        Title,
        Icon,
        Menu: menu,
        tabContent: tabcontent,
        content: /*html*/`
        <h1 class="mb-4">${Title}</h1>`,
    });

    List = Web?.getListDetails ? Web.getListDetails(Title) : {};
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
        buttons: [{
            icon: 'plus',
            events: [{ 
                name: 'click',
                attributes:  [
                    { name: 'type', value: 'button' },
                    { name: 'data-create', value: '' },
                ],
                action(event){
                    // return ShowAdminForm(event);
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

export default function Series() {

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
        parent: container,
        colvis: true,
        extentions: {
            buttons: {
                excel: true,
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
                    return ShowAdminForm(event);
                    // return table.ShowForm(event);
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
        },{
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

    // table.addEventListener('update', function(event){
    //     console.info(event);
    //     console.info(table.$table);
    // });
    table.$table.on('draw', correctProjectTitles);

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
    if (location.hash === `#${Title}`) {
        /** Manually call the tab without replacing the rest of the history; */
        view?.show();

        const url = new URL(location);
        const Id = url.searchParams.get('Id');
        if (Id) table?.edit(`${List.__metadata.uri}/Items(${Id})`);
    }
});