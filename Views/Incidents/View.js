/**
 * View.js
 * Incidents View;
 * @author Wilfredo Pacheco
 */

import App, { Layout, Web, User } from "../../app.js";
import Table from "../../src/Classes/Table.js";
import View from "../../src/Classes/View.js";
import ShowForm from "./Form.js";
import { default as ShowReportForm, form as ReportsForm } from "../Reports/AccordionForm.js";
import { Title } from "./List.js";
import addBusinessDays from "./addBusinessDays.js";

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
export const Icon = 'file-ruled';
export const th = [{
    thead: 'ID',
    col: {
        data: 'Id',
        type: 'text',
        visible: false,
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
}, {
    thead: 'DCIR Number',
    col: {
        data: 'DCIRNumber',
        type: 'text',
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
}, {
    thead: 'Status',
    col: {
        data: 'Status',
        type: 'text',
        // visible: false,
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
}, {
    thead: 'Event Type #',
    col: {
        data: 'EventTypeNumber',
        type: 'text',
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
}, {
    thead: 'Event Type Category',
    col: {
        data: 'EventTypeCategory',
        // visible: false,
        type: 'text',
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
}, {
    thead: 'Event Type Description',
    col: {
        data: 'EventTypeDescription',
        visible: false,
        type: 'text',
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
}, {
    thead: 'Market',
    col: {
        data: 'MarketName',
        type: 'text',
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
}, {
    thead: 'Market ID',
    col: {
        data: 'MarketId',
        type: 'text',
        visible: false,
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
}, {
    thead: 'Facility',
    col: {
        data: 'FacilityName',
        type: 'text',
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
}, {
    thead: 'Facility Id',
    col: {
        data: 'FacilityId',
        type: 'text',
        visible: false,
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
}, {
    thead: 'Date',
    col: {
        data: 'Date',
        type: 'text',
        render: function (data, type, row) {
            return !data ? '' : data.split('T')[0];
        },
    },
}, {
    thead: 'Time',
    col: {
        data: 'Time',
        type: 'text',
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
}, {
    thead: 'Indication Of Degradation',
    col: {
        data: 'IndicationOfDegradation',
        type: 'text',
        visible: false,
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
}, {
    thead: 'Latitude',
    col: {
        data: 'Latitude',
        type: 'text',
        visible: false,
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
}, {
    thead: 'Longitude',
    col: {
        data: 'Longitude',
        type: 'text',
        visible: false,
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
}, {
    thead: 'Most Recent Report Type',
    col: {
        data: 'ReportType',
        type: 'text',
        visible: false,
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
}, {
    thead: 'Personnel Involved',
    col: {
        data: 'PersonnelInvolved',
        type: 'text',
        visible: false,
        render: function (data, type, row) {
            if (data)
            {
                const array = JSON.parse(data);
                return array.map(obj => {
                    const { Service, Component, Rank, Grade } = obj;
                    return `${Service}/${Component}/${Rank}/${Grade}`;
                }).join('; ');
            }
            else return '';
        },
    },
}, {
    thead: 'Statement of Incident',
    col: {
        data: 'IncidentStatement',
        type: 'text',
        visible: false,
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
}, {
    thead: 'Mission Impact',
    col: {
        data: 'MissionImpact',
        type: 'text',
        visible: false,
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
}, {
    thead: 'Corrective Action Required/Taken',
    col: {
        data: 'CorrectiveAction',
        type: 'text',
        visible: false,
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
}, {
    thead: 'DHA HQ Assistance Requested',
    col: {
        data: 'HQAssistance',
        type: 'text',
        visible: false,
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
}, {
    thead: 'Media Interest?',
    col: {
        data: 'MediaInterest',
        type: 'text',
        visible: false,
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
}, {
    thead: 'Law Enforcement Involved?',
    col: {
        data: 'LawEnforcementInvolved',
        type: 'text',
        visible: false,
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
}, {
    thead: 'Drug/Alcohol Use?',
    col: {
        data: 'DrugAlcoholUse',
        type: 'text',
        visible: false,
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
}, {
    thead: 'Submitter Name',
    col: {
        data: 'SubmitterName',
        type: 'text',
        visible: false,
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
}, {
    thead: 'Submitter Email',
    col: {
        data: 'SubmitterEmail',
        type: 'text',
        visible: false,
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
}, {
    thead: 'Submitter Phone',
    col: {
        data: 'SubmitterPhone',
        type: 'text',
        visible: false,
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
}, {
    thead: 'Additional POC Name',
    col: {
        data: 'AdditionalPOCName',
        type: 'text',
        visible: false,
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
}, {
    thead: 'Additional POC Email',
    col: {
        data: 'AdditionalPOCEmail',
        type: 'text',
        visible: false,
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
}, {
    thead: 'Additional POC Phone',
    col: {
        data: 'AdditionalPOCPhone',
        type: 'text',
        visible: false,
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
}, {
    thead: 'AuthorId',
    col: {
        data: 'AuthorId',
        type: 'number',
        visible: false,
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
}, {
    thead: 'Modified',
    col: {
        data: 'Modified',
        type: 'number',
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
export const colReorder = true;
export const tableOptions = {
    processing,
    responsive,
    pageLength,
    columns,
    colReorder,
};

function getTableHeaderIndex(tableHeaderString){
    return columns
    .map(col => col.data)
    .indexOf(tableHeaderString);
}

const red = '#ff9999';
const yellow = '#ffff99';
const green = '#99ffa9';

export function highlightActiveIncidents(event){

    const index = getTableHeaderIndex('Status');
    const highlightRed = `background-color: ${red} !important; color: black !important;`;
    const highlightYellow = `background-color: ${yellow} !important; color: black !important;`;
    const highlightGreen = `background-color: ${green} !important; color: black !important;`;

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
                const today = moment();

                // /** Set the modified date with moment; */
                const momentModified = moment(el._aData.Modified);

                /** Set the due date to three days from the modified date; */
                let DUEDATE = addBusinessDays(3, momentModified);

                const anCells = el.anCells[index];
                const isActive = anCells.innerText === 'New' || anCells.innerText === 'Open' || anCells.innerText === 'Open for Action';
                const pastDue = DUEDATE < today;

                if (isActive && !pastDue) $(anCells)
                .hide()
                .attr('style', highlightGreen)
                .fadeIn();

                else if (isActive && pastDue) $(anCells)
                .hide()
                .attr('style', highlightRed)
                .fadeIn();
            }
            catch(e){ }
        }
    });

}

/** NOTE: Not used, pending use of DCIR parameter in URL; */
export function getIncidentByDCIR(dcir){
    const list = Web.getListDetails(Title);
    return Route.Get(`${list.__metadata.uri}/Items`, {
        $select: '*',
        $filter: `DCIRNumber eq '${dcir}'`,
    }).then(data => data.d);
}

export default function Incidents(){

    const { Menu, tabContent } = Layout;
    const UserId = Web.CurrentUser.Id
    const displayTitle = 'DCIR Incidents'

    List = Web?.getListDetails ? Web.getListDetails(Title) : {};
    tableElementId = `tableid-${List?.Id}`;

    view = new View({
        Title,
        Icon,
        Menu,
        tabContent,
        displayTitle,
        // content: /*html*/`
        // <h1 class="mb-4">${Title}</h1>`,
        content: /*html*/`
        <h1 class="mb-4">${displayTitle}</h1>`,
    });

    button = view.getButton();
    container = view.getContainer();

    /** highlight legend; */
    const CircleIcon = document.getIcon('circle-fill');
    $(container.get()).append(/*html*/ `<!-- Legend Container -->
    <div class="col my-2 bg-dark text-white rounded d-inline-flex">
        <h5 class="ms-3 mt-2">Legend</h5>
        <div class="d-inline-flex py-2">
            <div class="mx-3" style="color: ${green} !important;">${CircleIcon.outerHTML}&#160;&#160;Active</div>
            <div class="mx-3" style="color: ${red} !important;">${CircleIcon.outerHTML}&#160;&#160;Past Due (3 days)</div>
            <!-- <div class="mx-3" style="color: ${yellow} !important;">${CircleIcon.outerHTML}&#160;&#160;7 Days within Suspense</div> -->
        </div>
    </div>`);

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
                // pdf: true,
                custom: [{
                    //     text: /*html*/`
                    //     ${document.getIcon('person-check-fill').outerHTML}&#160;<span>MyTasks</span>`,
                    //     action: function (e, dt, node, config) {

                    //         /** Clear the filter so the filters don't overlap; */
                    //         dt.search('').columns().search('').draw();
                    //         console.info(User.Roles.join('|'))
                    //         return dt.column(4)
                    //         .search(User.Roles.join('|'), true, false)
                    //         .draw();
                    //     },
                    // },{
                    text: /*html*/`${document.getIcon('file-earmark-ruled').outerHTML}&#160;All Incidents`,
                    action: function (e, dt, node, config) {
                        return dt.search('').columns().search('').draw();
                    },
                },{
                    text: /*html*/`${document.getIcon('file-earmark-person').outerHTML}&#160;My Incidents`,
                    action: function (e, dt, node, config) {
                        dt.search('').columns().search('').draw();
                        console.info(UserId)
                        dt.columns(30).search(`${UserId}`).draw();
                    },
                }],
            },
        },
        buttons: [{
            // icon: 'plus',
            innerHTML: /*html*/ `
            <div class="pt-1">
            <svg class="bi bi-plus" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="font-size: 1.25em;"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path></svg><span>Create Report</span>
            </div>`,
            attributes: [
                { name: 'title', value: 'Incidents are only created when a new Initial Report is submitted. Click here to create a New Report.' },
            ],
            events: [{
                name: 'click',
                attributes:  [
                    { name: 'type', value: 'button' },
                    { name: 'data-create', value: '' },
                ],
                action(event) {
                    return ShowReportForm(event).then(()=>{
                        ReportsForm.Values.set({
                            ReportType: 'Initial',
                        })
                    });
                }
            }],
        }, {
            icon: 'arrow-repeat',
            attributes:  [
                { name: 'type', value: 'button' },
                { name: 'data-refresh', value: '' },
            ],
            events: [{
                name: 'click',
                action(event) {
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

    /** Highlight the active incidents for the user; */
    // table.addEventListener('update', highlightActiveIncidents);
    // This one will get triggered everytime the table draw event fires;
    table.$table.on('draw', highlightActiveIncidents);

    App.Views[Title] = {
        Title,
        List,
        view,
        button,
        container,
        columns,
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
        const dcir = url.searchParams.get('DCIR');

        if (Id) table?.edit(`${List.__metadata.uri}/Items(${Id})`);
        if (dcir) console.warn(dcir);

    }
});