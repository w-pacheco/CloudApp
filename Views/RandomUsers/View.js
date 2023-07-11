/**
 * View.js
 * RandomUsers View;
 */

import App, { Layout, Web, store } from "../../app.js";
import Table from "../../src/Classes/Table.js";
import View from "../../src/Classes/View.js";
import ShowForm from "./Form.js";
import { Title } from "./List.js";

import AdministratorView from "../../src/Classes/AdministratorView.js";
import { setLocationHash } from "../../src/Views/Administrator.js";
import Component from "../../src/Classes/Component.js";
import Modal from "../../src/Classes/Modal.js";

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
    thead: 'uuid',
    col: {
        data: 'uuid',
        type: 'text',
        visible: false,
        render: function (data, type, row) {
            return !data ? '' : Number(data);
        },
    },
},{
    thead: 'thumbnail',
    col: {
        data: 'thumbnail',
        type: 'text',
        render: function (data, type, row) {
            return !data ? '' : /*html*/`
            <img src="${data}" />`;
        },
    },
},{
    thead: 'username',
    col: {
        data: 'username',
        type: 'text',
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
},{
    thead: 'email',
    col: {
        data: 'email',
        type: 'text',
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
},{
    thead: 'first',
    col: {
        data: 'first',
        type: 'text',
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
},{
    thead: 'last',
    col: {
        data: 'last',
        type: 'text',
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
},{
    thead: 'date',
    col: {
        data: 'date',
        type: 'text',
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
},{
    thead: 'age',
    col: {
        data: 'age',
        type: 'text',
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
},{
    thead: 'gender',
    col: {
        data: 'gender',
        type: 'text',
        render: function (data, type, row) {
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

function getTableHeaderIndex(tableHeaderString){
    return columns
    .map(col => col.data)
    .indexOf(tableHeaderString);
}

/** Admin View Method; */
export function RandomUsersTab(menu, tabcontent){

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

export default async function RandomUsers(){

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

    console.info(new Date().toLocaleString())
    const data = await App.localDB.getAllStoreData(Title);
    console.info(new Date().toLocaleString())
    
    const custom_table = new Component({
        tag: 'table',
        classList: 'table',
        parent: container,
        attributes: [
            // { name: 'id', value: tableElementId },
            { name: 'style', value: 'width: 100% !important;'},
        ],
        innerHTML: /*html*/`
        <thead>
            <tr>${
                th
                .map(item => item.thead)
                .map(thString => /*html*/`<th>${thString}</th>`)
                .join('')
            }</tr>
        </thead>
        <tbody></tbody>`,
    }).render();

    const $table = $(custom_table.get()).DataTable(Object.assign(tableOptions, {
        data,
    }));

    async function display(data){
        const {
            first,
            last,
            large,
        } = data;
        const modal = new Modal({
            title: `${first} ${last}`,
            draggable: true,
            size: 'modal-xl',
            // buttons,
        }).render();

        new Component({
            tag: 'div',
            parent: modal.body,
            innerHTML: /*html*/`
            <img src="${large}" />`
        }).render();

        modal.show();
    }

    $table.on('click', 'tr', function(rowData){
        /** Datatable columns collapse with small viewport, this prevents the modal from rendering; */
        /** @reference https://stackoverflow.com/questions/58001666/how-to-determine-if-before-is-applied-to-an-element */
        if (getComputedStyle(rowData.target, 'before').getPropertyValue('content') !== 'none') return;
        
        /** Adjusts the site theme for modal display for now; */
        rowData = $(custom_table.get()).DataTable().row(this).data();

        /** Send information to render in modal; */
        if (rowData) display(rowData);
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