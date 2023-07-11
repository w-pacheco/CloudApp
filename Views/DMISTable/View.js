/**
 * View.js
 * DMISTable View;
 * @author Wilfredo Pacheco
 */

import App, { Layout, Web, User, Route } from "../../app.js";
import Attachments from "../../src/Classes/Attachments.js";
import Component from "../../src/Classes/Component.js";
import Modal from "../../src/Classes/Modal.js";
import Table from "../../src/Classes/Table.js";
import Toast from "../../src/Classes/Toast.js";
import View from "../../src/Classes/View.js";
import ShowForm from "./Form.js";
import { Title, Fields } from "./List.js";
// import { getActiveProcessTask, parseTemplate } from "../TaskTemplates/View.js";
// import { Title as RequestedTasksTitle } from "../RequestedTasks/List.js";
import { encrypt } from "../../src/Actions/Crypto.js";
import ProgressBar from "../../src/Classes/ProgressBar.js";

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
export const Icon = 'card-checklist';
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
    thead: 'DMISID',
    col: {
        data: 'DMISID',
        type: 'text',
        render: function(data, type, row){
            return !data ? '' : data;
        },
    },
},{
    thead: 'DMISFacilityName',
    col: {
        data: 'DMISFacilityName',
        type: 'text',
        render: function(data, type, row){
            return !data ? '' : data;
        },
    },
},{
    thead: 'DMISParentID',
    col: {
        data: 'DMISParentID',
        type: 'text',
        render: function(data, type, row){
            return !data ? '' : data;
        },
    },
},{
    thead: 'UnitIDCode',
    col: {
        data: 'UnitIDCode',
        type: 'text',
        render: function(data, type, row){
            return !data ? '' : data;
        },
    },
},{
    thead: 'NPI Number',
    col: {
        data: 'NPINumber',
        type: 'text',
        render: function(data, type, row){
            return !data ? '' : data;
        },
    },
},{
    thead: 'NPI HIPAA Taxonomy',
    col: {
        data: 'NPIHIPAATaxonomy',
        type: 'text',
        render: function(data, type, row){
            return !data ? '' : data;
        },
    },
},{
    thead: 'MarketCode',
    col: {
        data: 'MarketCode',
        type: 'text',
        render: function(data, type, row){
            return !data ? '' : data;
        },
    },
},{
    thead: 'ExpandedMarketCode',
    col: {
        data: 'ExpandedMarketCode',
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

async function CreateImportWidget({
    modal,
    headers,
    excel_data,
    sheet_data,
}){

    const exclamationCircle = document.getIcon('exclamation-circle-fill');
    exclamationCircle.classList.add('text-danger');
    exclamationCircle.classList.add('ms-2');

    const HEADERS = new Array();
    const IGNORE_FIELD = 'Ignore Field';
    /** Check the headers and make sure they match the list fields; */
    for (let header of headers)
    {
        const found = List.Fields.results.find(f => f.Title === header);
        const title = `Column (${header}) Title Editor`;
        const text = /*html*/`The excel column titled ${header} is not available on the ${List.Title} list.`;
        // const html = /*html*/`The excel column titled <strong>${header}</strong> is not available on the ${List.Title} list.`;

        const selectOptions = [
            IGNORE_FIELD,
            List.Fields.results
            .filter(f => !!f.CanBeDeleted)
            .map(f => f.Title),
        ].flat();

        const select = new Component({
            tag: 'select',
            innerHTML: selectOptions
            .map(title => /*html*/`
            <option value="${title}">${title}</option>`),
        }).get();

        if (!found || header === 'Title') await swal({
            icon: 'warning',
            title,
            text,
            content: {
                element: select,
            },
        }).then((response) => {

            console.info(header);
            console.info(response);

            const newHeader = select.value;
            const oldHeader = header;

            header = newHeader;
            // for (const item of excel_data)
            // {
            //     const value = item[header];
            //     delete item[header];
            //     item[selectedvalue] = value;
            //     // return item;
            // }
            
            return excel_data.map(item => {
                const value = item[oldHeader];
                delete item[oldHeader];
                if (newHeader !== IGNORE_FIELD) item[newHeader] = value;
                return item;
            });

        });

        if (header !== IGNORE_FIELD) HEADERS.push(header);
        
    }

    /** FIXME: When methods complete, revise the legend; */
    const legend = new Component({
        tag: 'div',
        classList: 'mt-2 mb-3 col-md-6 col-xl-3',
        parent: modal.body,
        innerHTML: /*html*/`
        <h3>Instructions:</h3>
        <div>After the excel file loads, please select the table rows to import.</div>
        <div class="bg-success text-white text-center">Selected table rows will be highlighted green.</div>`,
    }).render();

    const table = new Component({
        tag: 'table',
        classList: 'table f-12',
        parent: modal.body,
        attributes: [{ name: 'style', value: 'width: 100% !important;'}],
        innerHTML: /*html*/`
        <thead>
            <tr>${
                HEADERS
                .map(thString => {
                    const found = List.Fields.results.find(f => f.Title === thString);
                    /** NOTE: Normally we try to not use the Title field; */
                    if (found && thString !== 'Title') return /*html*/`
                    <th>${thString}</th>`;

                    else return /*html*/`
                    <th>${thString}${exclamationCircle.outerHTML}</th>`;
                })
                .join('')
            }</tr>
        </thead>
        <tbody></tbody>`,
    }).render();

    table.Store.set('import', new Array());     // Placeholder for data to import;
    table.Store.set('excel_data', excel_data);  // Excel data array;
    table.Store.set('sheet_data', sheet_data);  // Sheet data array;

    excel_data.forEach(function(dataset, index){
        new Component({
            tag: 'tr',
            classList: 'pointer',
            /** FIXME: This won't work if the excel has more than 5 items, users will not want to click more than five; */
            events: [{
                name: 'click',
                action(){
                    
                    if (this.classList.contains('active'))
                    {
                        this.classList.remove('active');
                        this.classList.remove('bg-success');
                        this.classList.remove('text-white');
                    }
                    
                    else
                    {
                        this.classList.add('active');
                        this.classList.add('bg-success');
                        this.classList.add('text-white');
                    }

                }
            }],
            customProperties: [{
                prop: 'getData',
                value: function(){
                    return dataset;
                }
            }],
            parent: table.get('tbody'),
            innerHTML: HEADERS.map(function(key){
                return /*html*/`
                <td>${dataset[key] || ''}</td>`;
            }).join(''),
        }).render();
    });

}

function searchDMIS(searchParam){
    const site = 'https://icenter.saic.com/sites/peess/main/Wil/DMISPlayGround';
    const apiWeb = '/_api/Web';
    return Route.Get(`${site + apiWeb}/Lists/getByTitle('DMIS')/Items`, {
        $select: '*',
        $filter: searchParam,
    }).then(data => data.d.results);
}

// let markets = await Route.Get(App.Views.Markets.table.List.Items.__deferred.uri).then(data => data.d.results)
// App.Views.Facilities.table.data.map(f => {
//     const { MarketId, FacilityName } = f;
//     const m = markets.find(m => m.Id === Number(MarketId))
//     // console.info(m)
//     if (!!m)
//     {
//         const { MarketName, MarketEmails } = m;
//         return {
//             FacilityName,
//             MarketName,
//             MarketEmails,
//         };
//     }
//     // f.m = m;
//     // f.MarketName = m.MarketName;
//     // f.MarketEmails = m.MarketEmails;
//     else console.warn(f);
    
// })

export function getMarkets(){
    return Route.Get(Web.getListDetails(Title).__metadata.uri + '/Items', {
        $select: '*',
        $filter: `TypeCode eq 'NONCAT' and InstallationName ne null`,
    })
    .then(data => data.d.results)
}


export default function DMISTable(){

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

    /** This is an event listener, used to track the when the view is called and call for any changes; */
    container.get().addEventListener('show', function(event){
        return table?.watcher();
    });
    
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
            icon: 'box-arrow-in-down',
            events: [{ 
                name: 'click', 
                action(event){

                    if (!User.hasRole('Developer') 
                    && !User.hasRole('Administrator')) return swal({
                        icon: 'warning',
                        title: 'Ooops!',
                        text: 'You don\'t have permission to import tasks!',
                    });
                    
                    // Import method to dynamically create list items from an excel spreadsheet;
                    const modal = new Modal({
                        title: 'Import Microsoft Excel Data',
                        size: 'modal-fullscreen',
                        buttons: [{
                            tag: 'button',
                            type: 'post',
                            classList: 'btn btn-success btn-sm',
                            innerText: 'Import',
                            events: [{
                                name: 'click',
                                async action(event){

                                    const isPointerEvent = event?.constructor?.name === 'PointerEvent';
                                    let Element, OriginalHTML;

                                    Element = event.target.tagName === 'BUTTON' ? 
                                    event.target : 
                                    event.target.closest('button');

                                    OriginalHTML = Element.innerHTML;
                                    
                                    const ExcelDataTableEl = modal.get('table');
                                    if (!ExcelDataTableEl) return new Toast({
                                        type: 'warning',
                                        message: 'Please select an excel document before clicking import.',
                                        parent: Layout.ToastContainer,
                                    })
                                    .render()
                                    .show();

                                    if (isPointerEvent) $(Element)
                                    .attr('disabled', '') /** Disable button; */
                                    .html(/*html*/`<!-- Spinner Element -->
                                    <span class="spinner-border spinner-border-sm" 
                                        role="status" 
                                        aria-hidden="true">
                                    </span> Sending Request...`);

                                    $(modal.get('table')).fadeOut('', function(){
                                        $(modal.get('table')).hide();
                                    });

                                    const progressbar = new ProgressBar({
                                        parent: modal.body,
                                        text: 'Starting Progress',
                                    }).render();
                                    
                                    const component = ExcelDataTableEl.component;
                                    const DIGEST_INTERVAL = 6e5; // 10 minutes
                                    let timestamp = new Date().getTime();
                                    let ReqDigest;
                                    let uploadAll;

                                    let Selected = Array.from(component.querySelectorAll('tbody tr'))
                                    .filter(tr => tr.classList.contains('active'))
                                    .map(tr => tr.getData());

                                    if (!Selected.length) uploadAll = await swal({
                                        icon: 'warning',
                                        title: 'Warning',
                                        text: 'You did not select items from the list, would you like to import all of the data?',
                                        buttons: {
                                            cancel: {
                                                text: 'Close',
                                                visible: true,
                                                closeModal: true,
                                            },
                                            ok: {
                                                text: 'Ok',
                                                visible: true,
                                                closeModal: true,
                                            }
                                        },
                                    });

                                    if (!uploadAll) return new Toast({
                                        type: 'warning',
                                        message: 'Please click and highlight the tasks before trying to import.',
                                        parent: Layout.ToastContainer,
                                    })
                                    .render()
                                    .show();

                                    else Selected = Array.from(component.querySelectorAll('tbody tr'))
                                    .map(tr => tr.getData());

                                    let count = 0;
                                    let total = Selected.length;
                                    for (const item of Selected)
                                    {
                                        count++;
                                        /** Handle field encryption; */
                                        // Object.keys(item).forEach(key => {
                                        //     const found = Fields.find(def => def.Title === key);
                                        //     if (found && found?.encrypted)
                                        //     {
                                        //         const value = item[key];
                                        //         item[key] = encrypt(value).toString();
                                        //     }
                                        // });

                                        const current_timestap = new Date().getTime();
                                        if (!ReqDigest 
                                        || (current_timestap - timestamp) > DIGEST_INTERVAL) await Route.GetRequestDigest()
                                        .then(reqDigest => {
                                            timestamp = new Date().getTime();
                                            ReqDigest = reqDigest;
                                        });

                                        const text = `${count} of ${total} | ${Object.keys(item)[0]} | ${Object.values(item)[0]}`;
                                        const progress = count *(100/total);
                                        progressbar.text(text);
                                        
                                        // const newItem = 
                                        await Route.Post(`${List.__metadata.uri}/Items`, Object.assign(item, {
                                            __metadata: {
                                                type: List.ListItemEntityTypeFullName,
                                            },
                                        }), ReqDigest)
                                        .then(data => data.d);
                                        progressbar.progress(progress);
                                        
                                    }

                                    $(Element).text('Success!');

                                    modal.hide();
                                    table.refresh();
                                },
                            }],
                        }],
                    }).render();
                    
                    const attachments = new Attachments({
                        parent: modal.body,
                    }).render();

                    attachments.get().classList.add('container');
                    attachments.get().addEventListener('updated', function(event){

                        /** Always get the last file in the files array; */
                        const files = attachments.getStore();
                        const file = files.reverse().pop();

                        const tableFound = modal.get('table');
                        if (tableFound) modal.get('table').remove();
                        if (!file) throw new Error('There was an error with displaying file data!');

                        if(![
                            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                            'application/vnd.ms-excel',
                        ].includes(file.type))
                        {
                            // document.getElementById('excel_data').innerHTML = '<div class="alert alert-danger">Only .xlsx or .xls file format are allowed</div>';
                            console.info('%cOnly .xlsx or .xls file format are allowed!', 'color: firebrick;');
                            return swal({
                                icon: 'error',
                                text: 'Only .xlsx or .xls file format are allowed!',
                                buttons: {
                                    cancel: {
                                        text: 'Close',
                                        visible: true,
                                        closeModal: true,
                                    },
                                },
                            });
                        }

                        const reader = new FileReader();
                        reader.readAsArrayBuffer(file);
                        reader.onload = function(event){

                            var data = new Uint8Array(reader.result);
                            var work_book = XLSX.read(data, {type:'array'});
                            var sheet_name = work_book.SheetNames;
                            var sheet_data = XLSX.utils.sheet_to_json(work_book.Sheets[sheet_name[0]], {header:1, raw: false, dateNF: 14});
                            var excel_data = [];

                            sheet_data.forEach(function(dataset, index){
                                if (index > 0)
                                {
                                    const Obj = new Object();
                                    sheet_data[0].map((key, key_index) => {
                                        Obj[key] = dataset[key_index];
                                    });
                                    excel_data.push(Obj);
                                }
                            });

                            const headers = sheet_data[0];

                            return CreateImportWidget({
                                modal,
                                headers,
                                excel_data,
                                sheet_data,
                            });

                        }
                    });

                    modal.show();
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
        List,
        tableElementId,
        view,
        button,
        container,
        table,
        tableOptions,
        // getMarkets,
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