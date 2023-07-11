/**
 * View.js
 * LocationRequests View;
 * @author Wilfredo Pacheco
 */

import NotifyAdminOfLocationRequest from "./LocationRequestNotification.js";
import App, { Layout, Web, Route, User } from "../../app.js";
import Table from "../../src/Classes/Table.js";
import View from "../../src/Classes/View.js";
import ShowForm from "./Form.js";
import { Title } from "./List.js";
import { camelcaseToSentenceCaseText } from "../../src/Actions/camelcaseToSentenceCaseText.js";

/**
 * TODO: 
 * - [x] on the report form, change the class for the additional personnel button to: px-3 py-4
 * - [-] change the assigned market to a string value of the market name;
 * - [x] change the title of this list to location request;
 * - [x] create a way to change the icon on the side nav element (save that for biome.js);
 * - [] change facilityid on reports form to locationid;
 * 
 * 
 * temp3.component.Values.set(JSON.parse('{"ReportType":"Initial","EventTypeNumber":"4","EventTypeCategory":"Public Affairs","EventTypeDescription":"Any event that portrays DHA in a negative manner or generates media interest/inquiries that could result in adverse publicity in the national/local press.","MarketId":"1","MarketName":"ALASKA","FacilityId":"46","FacilityName":"AF-C-673rd  TBI CLIN-ELMENDORF","Date":"2023-03-28T00:00:00.000Z","Time":"12:25","IndicationOfDegradation":"test","Service":"Army","Component":"Reserve","Rank":"2LT","Grade":"O-1","PersonnelDetails":"test","IncidentStatement":"test","MissionImpact":"test","CorrectiveAction":"test","HQAssistance":"test","MediaInterest":"Yes","LawEnforcementInvolved":"Yes","DrugAlcoholUse":"Yes","SubmitterName":"Pacheco, Wilfredo [US]","SubmitterEmail":"Wilfredo.Pacheco@saic.com"}'))
 * temp1.component.Values.set(JSON.parse(localStorage.getItem('FakeDCIR')))
 */

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
export const Icon = 'pin-map-fill';
export const th = [{
    thead: 'Id',
    col: {
        data: 'Id',
        type: 'text',
        visible: false,
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
},{
    thead: 'DCIR Number',
    col: {
        data: 'DCIRNumber',
        type: 'text',
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
},{
    thead: 'MarketName',
    col: {
        data: 'MarketName',
        type: 'text',
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
},{
    thead: 'LocationName',
    col: {
        data: 'LocationName',
        type: 'text',
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
},{
    thead: 'Timezone',
    col: {
        data: 'Timezone',
        type: 'text',
        visible: false,
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

export default function LocationRequests() {

    const { Menu, tabContent } = Layout;

    List = Web?.getListDetails ? Web.getListDetails(Title) : {};
    tableElementId = `tableid-${List?.Id}`;

    view = new View({
        Title,
        Icon,
        Menu,
        tabContent,
        content: /*html*/`
        <h1 class="mb-4">${camelcaseToSentenceCaseText(Title)}</h1>`,
    });

    button = view.getButton();
    container = view.getContainer();

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
        Icon,
        th,
        List,
    }

}

// window.NotifyAdminOfLocationRequest = NotifyAdminOfLocationRequest;
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