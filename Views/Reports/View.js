/**
 * View.js
 * Reports View;
 * @author Wilfredo Pacheco
 */

import App, { Layout, Web, User, Route, DEVELOPER, ADMINISTRATOR } from "../../app.js";
import { ReplaceLocation } from "../../src/Actions/History.Set.js";
import Table from "../../src/Classes/Table.js";
import View from "../../src/Classes/View.js";
import ShowForm from "./AccordionForm.js";
// import ShowForm from "./Form.js";
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

export const Icon = 'file-plus';
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
    thead: 'Status',
    col: {
        data: 'Status',
        type: 'text',
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
},{
    thead: 'Report Type',
    col: {
        data: 'ReportType',
        type: 'text',
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
},{
    thead: 'Event Type',
    col: {
        data: 'EventTypeNumber',
        type: 'text',
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
},{
    thead: 'Market',
    col: {
        data: 'MarketName',
        type: 'text',
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
},{
    thead: 'Facility',
    col: {
        data: 'FacilityName',
        type: 'text',
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
},{
    thead: 'Date',
    col: {
        data: 'Date',
        type: 'text',
        render: function (data, type, row) {
            return !data ? '' : data.split('T')[0];
        }
    }
},{
    thead: 'Time',
    col: {
        data: 'Time',
        type: 'text',
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
},{
    //     thead: 'Personnel Involved',
    //     col: {
    //         data: 'PersonnelInvolved',
    //         type: 'text',
    //         //TODO: update this render function to handle array data
    //         render: function (data, type, row) {

    //             let returnString = ``;
    //             JSON.parse(data).forEach((person, index) => {
    //                 let personString = `
    //                 Person #${index + 1}\n
    //                 -Service: "${person.Service}"\n
    //                 -Component: "${person.Component}"\n
    //                 -Rank: "${person.Rank}"\n
    //                 -Grade: "${person.Grade}"\n
    //                 -Details: "${person.PersonnelDetails}"\n`;

    //                 returnString += personString;
    //             });

    //             return !data ? '' : returnString;
    //         }
    //     }
    // }, {
    //     thead: 'Statement',
    //     col: {
    //         data: 'Statement',
    //         type: 'text',
    //         render: function (data, type, row) {
    //             return !data ? '' : data;
    //         }
    //     }
    // }, {
    //     thead: 'Mission Impact',
    //     col: {
    //         data: 'MissionImpact',
    //         type: 'text',
    //         render: function (data, type, row) {
    //             return !data ? '' : data;
    //         }
    //     }
    // }, {
    //     thead: 'Corrective Action',
    //     col: {
    //         data: 'CorrectiveAction',
    //         type: 'text',
    //         render: function (data, type, row) {
    //             return !data ? '' : data;
    //         }
    //     }
    // }, {
    //     thead: 'DHA HQ Assistance Required',
    //     col: {
    //         data: 'HQAssistance',
    //         type: 'text',
    //         render: function (data, type, row) {
    //             return !data ? '' : data;
    //         }
    //     }
    // }, {
    //     thead: 'Media Interest',
    //     col: {
    //         data: 'MediaInterest',
    //         type: 'text',
    //         render: function (data, type, row) {
    //             return !data ? '' : data;
    //         }
    //     }
    // }, {
    //     thead: 'Law Enforcement Involved',
    //     col: {
    //         data: 'LawEnforcementInvolved',
    //         type: 'text',
    //         render: function (data, type, row) {
    //             return !data ? '' : data;
    //         }
    //     }
    // }, {
    //     thead: 'Drug/Alcohol Use',
    //     col: {
    //         data: 'DrugAlcoholUse',
    //         type: 'text',
    //         render: function (data, type, row) {
    //             return !data ? '' : data;
    //         }
    //     }
    // }, {
    thead: 'Submitter Name',
    col: {
        data: 'SubmitterName',
        type: 'text',
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
},{
    thead: 'Submitter Email',
    col: {
        data: 'SubmitterEmail',
        type: 'text',
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
},{
    thead: 'Submitter Phone',
    col: {
        data: 'SubmitterPhone',
        type: 'text',
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
},{
    thead: 'AuthorId',
    col: {
        data: 'AuthorId',
        type: 'number',
        visible: false,
        render: function (data, type, row) {
            return !data ? '' : data;
        },
    },
    // }, {
    //     thead: 'Additional POC Name',
    //     col: {
    //         data: 'AdditionalPOCName',
    //         type: 'text',
    //         render: function (data, type, row) {
    //             return !data ? '' : data;
    //         }
    //     }
    // }, {
    //     thead: 'Additional POC Email',
    //     col: {
    //         data: 'AdditionalPOCEmail',
    //         type: 'text',
    //         render: function (data, type, row) {
    //             return !data ? '' : data;
    //         }
    //     }
    // }, {
    //     thead: 'Additional POC Submitter Phone',
    //     col: {
    //         data: 'AdditionalPOCSubmitterPhone',
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
export const colReorder = true;
export const tableOptions = {
    processing,
    responsive,
    pageLength,
    columns,
    colReorder,
};

export function getReportsByDCIR(DCIRNumber){
    return Route.Get(`${List.__metadata.uri}/Items`, {
        $select: '*',
        $filter: `DCIRNumber eq '${DCIRNumber}'`,
    })
    .then(data => data.d)
    .then(data => data.results);
}

export default function Reports(){

    const { Menu, tabContent } = Layout;
    const UserId = Web.CurrentUser.Id
    const displayTitle = 'DCIR Reports';
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

    /** Handle views based on role; */
    let $filter = new Array();
    // if ((!User.hasRole(DEVELOPER) || !User.hasRole(ADMINISTRATOR))) $filter.push(`AuthorId eq ${User.Id}`);
    // if (isMarketPOC) $filter.push(`AuthorId eq ${User.Id}`);

    // let $filter = [`AuthorId eq ${User.Id}`];
    // if (User.hasRole(DEVELOPER) || User.hasRole(ADMINISTRATOR)) $filter = new Array();

    /** Turn the $filter array to a string; */
    $filter = $filter.join(',');

    table = new Table({
        List,
        th,
        tableElementId,
        tableOptions,
        $filter,
        parent: container.get(),
        colvis: true,
        extentions: {
            buttons: {
                // excel: true,
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
                    text: /*html*/`${document.getIcon('file-earmark-ruled').outerHTML}&#160;All Reports`,
                    action: function (e, dt, node, config) {
                        return dt.search('').columns().search('').draw();
                    },
                },{
                    text: /*html*/`${document.getIcon('file-earmark-person').outerHTML}&#160;My Reports`,
                    action: function (e, dt, node, config) {
                        dt.search('').columns().search('').draw();
                        // console.info(UserId)
                        dt.columns(12).search(`${UserId}`).draw();
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
            attributes:  [
                { name: 'type', value: 'button' },
                { name: 'data-create', value: '' },
            ],
            events: [{
                name: 'click',
                action(event) {
                    return table.ShowForm(event);
                },
            }],
        }, {
            icon: 'arrow-repeat',
            events: [{
                name: 'click',
                attributes:  [
                    { name: 'type', value: 'button' },
                    { name: 'data-refresh', value: '' },
                ],
                action(event) {
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

    const url = new URL(location);
    const show = url.searchParams.get('show');
    if (show === 'form')
    {
        table?.ShowForm(new Event('show'));
        url.searchParams.delete('show');
        ReplaceLocation(url);
    }

}

window.addEventListener('popstate', function (event) {
    /** Parse the url & display the tab and/or data based on the url parameters; */
    if (location.hash === `#${Title}`) {
        /** Manually call the tab without replacing the rest of the history; */
        view?.show();

        const url = new URL(location);
        const Id = url.searchParams.get('Id');
        const dcir = url.searchParams.get('DCIR');

        if (Id) table?.edit(`${List.__metadata.uri}/Items(${Id})`);
        if (dcir) console.info(dcir);
    }
});