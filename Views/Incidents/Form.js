/**
 * Form.js
 * @description Incidents Form
 * @author Wilfredo Pacheco
 */

import Form from "../../src/Classes/Form.js";
import { form as ReportsForm } from "../Reports/AccordionForm.js";
import Modal from "../../src/Classes/Modal.js";
import { List, table } from "./View.js"
import App, { Route, User, Layout, store, ADMINISTRATOR, DEVELOPER, Web } from "../../app.js";
import AuthorsAndModifiers from "../../src/Classes/AuthorsAndModifiers.js";
import { getReportsByDCIR } from "../Reports/View.js";
import Component from "../../src/Classes/Component.js";
import Toast from "../../src/Classes/Toast.js";
import { createOCRAcknowledgement, createOPRAcknowledgement, getAcknowledgementsByDCIR, resetAcknowledgement, setAcknowledgement } from "../Acknowledgements/setAcknowledgements.js";
import { Title as OfficesTitle } from "../Offices/List.js";
import { SendOfficesEmail } from "./SendOfficesEmail.js";
import ButtonGroup from "../../src/Classes/ButtonGroup.js";
import Dropdown from "../../src/Classes/Dropdown.js";

export let modal;
export let form;

const AcknowledgementTypes = [
    'DOC',
    'Market',
    'OPR',
    'OCR',
];

async function renderIncidentData(data){

    const incidentReports = await getReportsByDCIR(data?.DCIRNumber)
    .then(reports => reports.filter(r => r.Status !== "Draft"));
    // This works because when Draft items are finally submitted, we delete the draft item and create a new item with the same information. This will keep the IDs in order if they use a draft form thats been sitting around for a while. 

    $(modal.body).empty();
    $(modal.body).hide().fadeIn();

    createButtonGroup(data, incidentReports);

    form = new Form({
        classList: 'needs-validation',
        parent: modal.body,
        innerHTML: /*html*/`<!-- ${List.Title} Form -->
        <div class="row my-2">
            <div class="col-lg-2 col-md-12">
                <label for="inputDCIRNumber" class="form-label">DCIR Number</label>
                <input type="text" id="inputDCIRNumber" name="DCIRNumber" class="form-control form-control-sm" disabled>
            </div>
            <div class="col-lg-2 col-md-12">
                <label for="inputStatus" class="form-label">Status</label>
                <input type="text" id="inputStatus" name="Status" class="form-control form-control-sm" disabled>
            </div>
            <div class="col pt-2" data-notification-button-container></div>
        </div>
        <div class="row my-3" data-notification-card-container></div>
        <div class='accordion mt-4' id='IncidentAccordion'></div>`,
    }).render();

    /** Begin Handling Admin Only Wake Up Cards */
    if ((User.hasRole(DEVELOPER) || User.hasRole(ADMINISTRATOR)) && !data.Status.includes('Closed'))
    {
        // This function is used to sort the Notification Types into the order we want for the table
        function sortNotificationTypes(a, b) {
            let valueA = a.value;
            // WUC and WUE strings need to go to the top
            if (valueA === 'WUC') valueA = -100;
            if (valueA === 'WUE') valueA = -99;
            // notificationtype '0' is 'No Immediate Notification', we want these last
            if (valueA === '0') valueA = 100;

            let valueB = b.value;
            if (valueB === 'WUC') valueB = -100;
            if (valueB === 'WUE') valueB = -99;
            if (valueB === '0') valueB = 100;

            if (valueA < valueB) return -1
            if (valueA > valueB) return 1;
            return 0
        }

        const twentyFourSevenWakeUps = JSON.parse(data.EventTypeNotificationMatrix)
        .filter(office => {
            if (decodeURIComponent(office.name).split('checkbox-')[1].includes('24/7')) {
                return office
            }
        })
        .sort(sortNotificationTypes)
        // console.info(twentyFourSevenWakeUps)
        let cardTypes = new Set(twentyFourSevenWakeUps.map(office => decodeURIComponent(office.name).split('checkbox-')[1]))

        // Add table rows for each notification type from our set
        let notificationCardContainer = form.get().querySelector('[data-notification-card-container]')

        cardTypes.forEach(type => {
           
            let header = type
           
            let associatedOfficesString = twentyFourSevenWakeUps
            .filter(o => decodeURIComponent(o.name).split('checkbox-')[1] === type)
            .map(o => decodeURIComponent(o.office))
            .join('<br>')
            
            new Component({
                tag: 'div',
                classList: 'col-4',
                parent: notificationCardContainer,
                innerHTML: /*html*/`
                <div class="card border-warning">
                    <div class="card-header bg-warning text-dark">
                        ${document.getIcon('info-circle').outerHTML}&#160;${header}
                    </div>
                    <div class="card-body">
                        <p class="card-text">${associatedOfficesString}</p>
                    </div>
                </div>`,
            }).render();
        });
    }

    /** Begin Handling Acknowledgements Table */
    // const BGColorClass = 'bg-dark';
    const acknowledgementContainer = new Component({
        tag: 'div',
        classList: 'accordion mt-4',
        parent: modal.body,
        innerHTML: /*html*/`
        <div class="accordion-item">
            <h2 class="accordion-header">
            <button class="accordion-button collapsed" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#acknowledgements" 
                    aria-expanded="true" 
                    aria-controls="acknowledgements">
                <b>Incident Acknowledgements</b>
            </button>
            </h2>
            <div id="acknowledgements" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                <div class="accordion-body" id='notification-table-container'>
                </div>
            </div>
        </div>`,
    }).render();

    let renderAcknowledgements;
    /** Set for values if data is passed; */
    form.Values.set(data);
    form.get().setAttribute('data-etag', data.__metadata.etag);

    let ackTable = new Component({
        tag: 'table',
        classList: "table table-hover table-responsive table-sm mt-4",
        parent: acknowledgementContainer.get().querySelector('.accordion-body'),
        attributes: [{ name: 'style', value: '/* width: 100% !important; */ margin-left: auto; margin-right: auto;' }],
        innerHTML: /*html*/`
        <thead></thead>
        <tbody></tbody>`,
    }).render();

    renderAcknowledgements = async function renderAcknowledgements() {

        const acknowledgeList = await getAcknowledgementsByDCIR(data.DCIRNumber);
        $(ackTable.get('tbody')).fadeOut().hide();
        $(ackTable.get('tbody')).empty();
        $(ackTable.get('thead')).empty();

        AcknowledgementTypes
        .forEach(function (type, index) {

            if (!index) new Component({
                tag: `tr`,
                // classList: `${BGColorClass} text-white`,
                parent: ackTable.get(`thead`),
                innerHTML: /*html*/ `
                <th class="text-">${type} Acknowledgement</th>
                <th></th>
                <th>POC</th>
                <th>Timestamp</th>
                <th></th>
                <th></th>`,
            }).render();

            else new Component({
                tag: `tr`,
                // classList: `${BGColorClass} text-white`,
                parent: ackTable.get(`tbody`),
                innerHTML: /*html*/ `
                <th class="text-">${type} Acknowledgement</th>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>`,
            }).render();

            const sectionPOCs = acknowledgeList.filter(s => s.type === type);
            sectionPOCs.forEach(function (row, index) {

                const tr = new Component({
                    tag: `tr`,
                    parent: ackTable.get(`tbody`),
                    innerHTML: /*html*/ `
                    <td></td>
                    <td>${row.Group}</td>
                    <td data-user>${row.user || 'N/A'}</td>
                    <td data-timestamp>${row.timestamp ? new Date(row.timestamp).toLocaleString() : 'N/A'}</td>
                    <td data-button-container></td>
                    <td data-button-reset></td>`,
                }).render();

                const checkIcon = document.getIcon('check2-circle');
                checkIcon.classList.add('text-success');

                /** Acknowledgement Button; */
                if (!row.timestamp) new Component({
                    tag: 'a',
                    // classList: 'btn btn-sm btn-success',
                    classList: 'badge rounded-pill text-bg-primary',
                    attributes: [
                        { name: 'type', value: 'button' },
                        { name: 'href', value: 'javascript:;' },
                        { name: 'data-url', value: row.__metadata.uri },
                        { name: 'data-type', value: row.__metadata.type },
                        { name: 'data-etag', value: row.__metadata.etag },
                    ],
                    events: [{
                        name: 'click',
                        action(event) {

                            const button = event.target;
                            const url = this.dataset.url;
                            const type = this.dataset.type;
                            const etag = this.dataset.etag;

                            return swal({
                                icon: 'info',
                                text: `Please click 'Confirm' to record your name as the acknowledging representative from ${row.Group}.\n
                                If you do not want to confirm acknowledgement of this incident for ${row.Group} please click 'Cancel'.`,
                                buttons: {
                                    cancel: {
                                        text: "Cancel",
                                        value: null,
                                        visible: true,
                                    },
                                    confirm: {
                                        text: "Confirm",
                                        value: true,
                                        visible: true,
                                    },
                                },
                            }).then(response => {
                                if (response) 
                                {
                                    $(button)
                                    .attr('disabled', '') /** Disable button; */
                                    .html(/*html*/`<!-- Spinner Element -->
                                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true">
                                    </span> Sending Request...`);

                                    return setAcknowledgement(url, type, etag)
                                    .catch(response => {
                                        // console.info(response);
                                        /** Handle etag; */
                                        if (response.status === 412) return swal({
                                            icon: 'info',
                                            text: `An acknowledgement for this item has already been submitted, the table will now reload to reflect the most current data.`,
                                            buttons: {
                                                confirm: {
                                                    text: "Confirm",
                                                    value: true,
                                                    visible: true,
                                                }
                                            },
                                        })
                                            .then(() => renderAcknowledgements());
                                    })
                                    .then(data => {

                                        $(button).text('Success!');
                                        $(button).fadeOut('', function () {
                                            button.remove();
                                        });

                                        return renderAcknowledgements();

                                    });
                                }
                            });
                        },
                    }],
                    parent: tr.get('td[data-button-container]'),
                    innerText: 'Acknowledge',
                }).render();

                else new Component({
                    tag: 'span',
                    parent: tr.get('td[data-button-container]'),
                    innerHTML: checkIcon.outerHTML,
                }).render();

                /** Reset Button */
                if (User.hasRole(DEVELOPER) 
                || User.hasRole(ADMINISTRATOR)) new Component({
                    tag: 'a',
                    // classList: 'btn btn-sm btn-danger',
                    classList: 'badge rounded-pill text-bg-danger',
                    attributes: [
                        { name: 'type', value: 'button' },
                        { name: 'href', value: 'javascript:;' },
                        { name: 'data-url', value: row.__metadata.uri },
                        { name: 'data-type', value: row.__metadata.type },
                        { name: 'data-etag', value: row.__metadata.etag },
                    ],
                    events: [{
                        name: 'click',
                        action(event) {

                            const button = event.target;
                            const url = this.dataset.url;
                            const type = this.dataset.type;

                            return swal({
                                icon: 'info',
                                text: `Are you sure you want to reset this item?'`,
                                buttons: {
                                    cancel: {
                                        text: "Cancel",
                                        value: null,
                                        visible: true,
                                    },
                                    confirm: {
                                        text: "Confirm",
                                        value: true,
                                        visible: true,
                                    },
                                },
                            })
                                .then(response => {
                                    if (response) {
                                        $(button)
                                            .attr('disabled', '') /** Disable button; */
                                            .html(/*html*/`<!-- Spinner Element -->
                                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true">
                                </span> Sending Request...`);

                                        return resetAcknowledgement(url, type)
                                            .then(data => {

                                                $(button).text('Success!');
                                                $(button).fadeOut('', function () {
                                                    button.remove();
                                                });

                                                return renderAcknowledgements();

                                            });
                                    }
                                });
                        },
                    }],
                    parent: tr.get('td[data-button-reset]'),
                    innerText: 'Reset',
                }).render();

            });

        });

        $(ackTable.get('tbody')).fadeIn();

    }

    renderAcknowledgements();

    let accordionDiv = form.get('#IncidentAccordion');
    console.info(incidentReports)
    console.info(data.Details)
    incidentReports.length ?
    incidentReports.forEach(report => generateReportAccordionItem(report, accordionDiv)) :
    JSON.parse(data.Details).forEach(report => generateReportAccordionItem(report, accordionDiv));

    new AuthorsAndModifiers({
        parent: modal.body,
        data,
    }).render();

    if ((User.hasRole(ADMINISTRATOR) || User.hasRole(DEVELOPER)) && data.Status === "Open for Action")
    {
        new Component({
            tag: 'button',
            classList: 'btn btn-sm btn-success mt-4 me-2',
            attributes: [
                { name: 'data-stringified-object', value: JSON.stringify(data) },
                { name: 'data-email-type', value: 'Action' },
            ],
            events: [{ name: 'click', action: SendOfficesEmail }],
            parent: form.get('div[data-notification-button-container]'),
            // innerText: 'Create ACTION Email',
            innerHTML: /*html*/`
            ${document.getIcon('envelope').outerHTML}&#160;Create [ACTION] Email`,
        }).render();
    }

    // Start info template button
    if ((User.hasRole(ADMINISTRATOR) || User.hasRole(DEVELOPER)) && data.Status === "Open") {
        new Component({
            tag: 'button',
            classList: 'btn btn-sm btn-success mt-4 me-2',
            attributes: [
                { name: 'data-stringified-object', value: JSON.stringify(data) }, 
                { name: 'data-email-type', value: 'Info' },
            ],
            events: [{ name: 'click', action: SendOfficesEmail }],
            parent: form.get('div[data-notification-button-container]'),
            innerHTML: /*html*/`
            ${document.getIcon('envelope').outerHTML}&#160;Create [INFO] Email`,
        }).render();
    }

    modal.body.removeAttribute('style');

}

export default async function ShowForm(data){

    const isEvent = data instanceof Event;
    const Title = List.Title;
    const title = `View Incident`;

    /** Modal Buttons; */
    const buttons = [];

    /** Link to SharePoint list item; */
    if (data
    && !isEvent
    && User.hasRole(DEVELOPER)) buttons.push({
        tag: 'a',
        classList: 'btn btn-sm',
        attributes: [
            { name: 'type', value: 'button' },
            { name: 'href', value: `${Web.Url}/Lists/${List.Title}/DispForm.aspx?ID=${data.Id}` },
            { name: 'title', value: 'Visit SharePoint' },
            { name: 'target', value: '_blank' },
        ],
        innerHTML: /*html*/ `
        <div class="pt-1">
            <img style="width: 26px;" src="/_layouts/15/images/favicon.ico?rev=23">&#160;<span>View</span>
        </div>`,
        role: 'Developer',
    });

    modal = new Modal({
        title,
        draggable: true,
        size: 'modal-xl',
        buttons,
    }).render();

    modal.body.setAttribute('style', `width: 1138px;height: 482px;`);
    // width: 1138, height: 482

    new Component({
        tag: 'div',
        classList: 'position-absolute top-50 start-50 translate-middle',
        parent: modal.body,
        innerHTML: /*html*/`
        <div class="spinner-border text-primaryColor" style="width: 9rem; height: 9rem;" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>`,
    }).render();

    renderIncidentData(data);

    modal.show();

}

function createButtonGroup(data, currentReports){
  
    const { DCIRNumber, Status } = data;
    const { uri, type, etag } = data.__metadata;

    const FOLLOW_UP = 'Follow Up';
    const CORRECTIVE = 'Corrective';
    const FINAL = 'Final';

    if (!Status.includes('Closed'))
    {
        const btnGroup = new ButtonGroup({
            parent: modal.body,
        }).render();
    
        if (User.hasRole(ADMINISTRATOR) || User.hasRole(DEVELOPER))
        {
            /**
             * callBack
             * @description closes the modal and calls the watcher method on the table;
             */
            function callBack(Status){

                const width = modal.body.clientWidth;
                const height = modal.body.clientHeight;

                modal.body.setAttribute('style', `width: ${width}px;height: ${height}px;`);
                // width: 1138, height: 482

                $(modal.body).empty();

                new Component({
                    tag: 'div',
                    classList: 'position-absolute top-50 start-50 translate-middle',
                    parent: modal.body,
                    innerHTML: /*html*/`
                    <div class="spinner-border text-primaryColor" style="width: 9rem; height: 9rem;" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>`,
                }).render();
                
                table.watcher();

                return Route.Get(uri, {
                    $select: '*,Author/Title,Editor/Title',
                    $expand: 'Author/Id,Editor/Id',
                })
                .then(data => data.d)
                .then(renderIncidentData);

            }

            async function updateItemStatus(event){
        
                let status = this.dataset.request;
                let etag = form.get().dataset.etag;
        
                let patchRequest = {
                    Status: status,
                    __metadata: {
                        type,
                    },
                }
        
                // const requestDigest = await Route.GetRequestDigest()
                //This is where we will query our reports and save the final array to Details when a report is closed
                if (status === 'Closed')
                {
                    //First we check and see if a Final report is returned when we query all the reports with this Incidents DCIRNumber
                    // console.info(currentReports)
                    // if (!JSON.stringify(currentReports).includes('"ReportType":"Final"')) {
                    if (!currentReports.map(l => l.ReportType).includes('Final')) return swal({
                        icon: 'warning',
                        text: `A Final Report is not available for ${data.DCIRNumber}.\nIncidents may not be Closed in the portal until a Final Report is submitted.\n
                        A Final Report can be generated by clicking the 'Create Final Report' button from the 'Create' dropdown at the top of the form.`,
                        buttons: {
                            confirm: true,
                        },
                    });
        
                    const CloseIncidentAlert = await swal({
                        icon: 'info',
                        text: `You are about to close ${data.DCIRNumber}.\n\nClosed Incidents may no longer be modified, and no additional reports can be filed under this DCIR Number.\n\nThe information from all the reports will be archived to this Incident List Item for historic record keeping, and the items in the current Reports list will be recycled.\n\nClick 'Confirm' to Close this Incident.\n\nClick 'Cancel' to leave this Incident in the ${data.Status} Status`,
                        buttons: {
                            cancel: {
                                text: "Cancel",
                                value: false,
                                // value: null,
                                visible: true,
                            },
                            confirm: {
                                text: "Confirm",
                                value: true,
                                visible: true,
                            }
                        },
                    });
                    // console.info(CloseIncidentAlert)
                    if (CloseIncidentAlert) {
                        let detailString = createDetailsJSONString(currentReports)
                        // console.info(detailString)
                        patchRequest.Details = detailString
                        // console.info(patchRequest)
                        for (let report of currentReports) {
                            await Route.Recycle(report.__metadata.uri)
                                // await Route.Recycle(report.__metadata.uri, requestDigest)
                                .fail(function RequestFailed(xhr, textStatus, errorThrown) {
                                    console.info(xhr, textStatus, errorThrown);
                                    console.warn(`${textStatus} | ${errorThrown}`);
                                    console.info(xhr);
                                    const AlertBodyStr = xhr.responseJSON ?
                                        xhr.responseJSON.error.message.value.split('.').join('</div><div>') :
                                        errorThrown;
                                    // return Alert
                                    console.info({
                                        Title: `Request ${textStatus} - ${errorThrown}`,
                                        TitleTimestamp: '',
                                        Body: '<div>' + AlertBodyStr + '</div>',
                                        AutoHide: false,
                                        Classes: 'bg-danger text-white',
                                        Type: textStatus
                                    });
                                })
                                // .done(function (data, textStatus, xhr) {
                                //     if (xhr.status === 200) {
                                //         // callBack();
                                //     }
                                // })
                                .catch(console.info);
                        }
                        // return
                    } else {
                        return
                    }
                }
        
                if (status === 'Admin Closed')
                {
                    console.info('Admin closing item. Duplicate Report')
                    // //First we check and see if a Final report is returned when we query all the reports with this Incidents DCIRNumber
                    // if (!JSON.stringify(currentReports).includes('"ReportType":"Final"')) {
                    //     await swal({
                    //         icon: 'warning',
                    //         text: `A Final Report is not available for ${data.DCIRNumber}.\nIncidents may not be closed until a completed Final Report is submitted in the portal.`,
                    //         buttons: {
                    //             confirm: true,
                    //         },
                    //     });
                    //     return
                    // }
        
                    const adminCloseIncidentAlert = await swal({
                        icon: 'info',
                        text: `You are about to Admin Close ${data.DCIRNumber}.\n
                        Admin Close status should only be used when a duplicate Initial Report has been submitted, resulting in two DCIR Numbers created in the system for the same Incident. \n
                        Admin Closed Incidents may no longer be modified, and no additional reports can be filed under this DCIR Number.\n
                        The information from the duplicate report will be archived to this Incident List Item for historic record keeping, and the item in the current Reports list will be recycled.\n
                        Click 'Confirm' to Admin Close this Incident.\n
                        Click 'Cancel' to leave this Incident in the ${data.Status} Status`,
                        buttons: {
                            confirm: {
                                text: "Cancel",
                                value: null,
                                visible: true,
                            },
                            cancel: {
                                text: "Confirm",
                                value: true,
                                visible: true,
                            }
                        },
                    });
                    if (adminCloseIncidentAlert) {
                        let detailString = createDetailsJSONString(currentReports);
                        // console.info(detailString)
                        patchRequest.Details = detailString;
                        // console.info(patchRequest)
                        for (let report of currentReports) {
                            await Route.Recycle(report.__metadata.uri)
                                // await Route.Recycle(report.__metadata.uri, requestDigest)
                                .fail(function RequestFailed(xhr, textStatus, errorThrown) {
                                    console.info(xhr, textStatus, errorThrown);
                                    console.warn(`${textStatus} | ${errorThrown}`);
                                    console.info(xhr);
                                    const AlertBodyStr = xhr.responseJSON ?
                                        xhr.responseJSON.error.message.value.split('.').join('</div><div>') :
                                        errorThrown;
                                    // return Alert
                                    console.info({
                                        Title: `Request ${textStatus} - ${errorThrown}`,
                                        TitleTimestamp: '',
                                        Body: '<div>' + AlertBodyStr + '</div>',
                                        AutoHide: false,
                                        Classes: 'bg-danger text-white',
                                        Type: textStatus
                                    });
                                })
                                // .done(function (data, textStatus, xhr) {
                                //     if (xhr.status === 200) {
                                //         /** If the element has a call back, this will run the method; */
                                //         // if (Element?.callback) Element.callback();
                                //         // callBack();
                                //     }
                                // })
                                .catch(console.info);
                        }
                        // return
                    } else {
                        return
                    }
                }

                if (status === 'Open for Action')
                {
                    const officesList = Web.getListDetails(OfficesTitle);
                    const storeData = store.lists[officesList.Id].data;
                    const notificationMatrix = JSON.parse(data.EventTypeNotificationMatrix)
                    .map(function (n) {
                        const decoded = decodeURIComponent(n.office);
                        const result = storeData.find(o => o.OfficeName === decoded) || {};
                        const {
                            Emails,
                            OfficeName,
                        } = result;
                        return Object.assign(n, {
                            Emails: JSON.parse(Emails),
                            OfficeName,
                        });
                    });

                    const opr = notificationMatrix.filter(n => {
                        if (n.value === 1 || n.value === '1') return n;
                    });

                    const ocr = notificationMatrix.filter(n => {
                        if (n.value === 2 || n.value === '2') return n;
                    });

                    let currentAcknowledgements = await getAcknowledgementsByDCIR(data.DCIRNumber)
                    let currentOPR = currentAcknowledgements.filter(ack => ack.type === "OPR")
                    let currentOCR = currentAcknowledgements.filter(ack => ack.type === "OCR")
                    let acknowledgmentsAlreadyCreated = true;
        
                    //If no OPR and OCR acknowledgements exist, we know we need to create them, so we switch our variable to false
                    if (!currentOPR && !currentOCR) {
                        acknowledgmentsAlreadyCreated = false;
                    } else {
                        //Here we compare the current Notification Matrix values from the incident to the existing acknowledgements for this item.
                        //This is necessary to handle any instances where a follow-up, corrective, or final report is submitted with a different event type than the previous report.
                        opr.forEach(office => {
                            //If the joined string of the currentOPR groups doesn't include the opr office name from the matrix, then we know we need to create new acknowledgement items, so we set the variable to false.
                            if (!currentOPR.map(a => a.Group).join().includes(office.OfficeName)) {
                                acknowledgmentsAlreadyCreated = false
                            } else {
                                //This else catches when the event type changes and we need to make new acknowledgements, but the two event types have overlaps in who the OPR is. We remove the office from the opr array that already has an acknowledgement item, then that way we don't create duplicate items 
                                opr.splice(opr.indexOf(office), 1)
                            }
                            // console.info(opr)
                            // console.info(currentOPR.map(a=>a.Group).join().includes(office.OfficeName))
                        })
                        //We do the same with the OCRs
                        ocr.forEach(office => {
                            if (!currentOCR.map(a => a.Group).join().includes(office.OfficeName)) {
                                acknowledgmentsAlreadyCreated = false
                            } else {
                                ocr.splice(ocr.indexOf(office), 1)
                            }
                            // console.info(ocr)
                        })
                    }
                    // console.info(acknowledgmentsAlreadyCreated)
                    // if (acknowledgmentsAlreadyCreated) { //If all needed acknowledgements have already been created, we return
                    //     return
                    // } else {
                    if (!acknowledgmentsAlreadyCreated) {
                        /** otherwise, Create the notifications for the OPR & OCR; */
        
                        for (const n of opr) await createOPRAcknowledgement({
                            // for (const n of opr) console.info({
                            group: n.OfficeName,
                            EventTypeId: data.EventTypeId,
                            DCIR: data.DCIRNumber,
                        });
        
                        for (const n of ocr) await createOCRAcknowledgement({
                            // for (const n of ocr) console.info({
                            group: n.OfficeName,
                            EventTypeId: data.EventTypeId,
                            DCIR: data.DCIRNumber,
                        });
        
                        new Toast({
                            type: 'success',
                            message: `Success! Acknowledgements for OPR & OCR have been created.`,
                        }).render().show();
        
                        // return renderAcknowledgements();
                    }
                }
        
                return Route.Patch(uri, patchRequest, etag)
                .catch((error) => {
                    // TODO: Alert if item has already been updated;
                    console.info(error);
                })
                .then(() => {
                    return Route.Get(uri, { $select: 'Id,DCIRNumber' })
                    .then(function setFormEtag(data){
                        form.get().setAttribute('data-etag', data.d.__metadata.etag);
                        return data;
                    })
                    .then(function runCallbackAndToast(data){
                        // if (callback) 
                        callBack(status);
                        new Toast({
                            type: 'success',
                            message: `The status of ${DCIRNumber} has been set to ${status}`,
                        })
                        .render()
                        .show();
                    });
                });
            }
        
            // const adminDropdown = 
            /** FIXME: If status === Open then we should not show it in the dropdown; */
            new Dropdown({
                title: /*html*/`${document.getIcon('flag').outerHTML}&#160;Update Status`,
                buttonColor: 'primary',
                buttonClassList: 'btn btn-primary btn-sm dropdown-toggle',
                menuOptions: [{
                    tag: 'a',
                    classList: 'dropdown-item rounded-2',
                    attributes: [
                        { name: 'href', value: 'javascript:;' },
                        { name: 'role', value: 'tab' },
                        { name: 'aria-selected', value: false },
                        { name: 'data-open', value: '' },
                        { name: 'data-request', value: 'Open' },
                        { name: 'title', value: 'An Open Incident is one that is currently developing or ongoing but does not require DHA HQ Assistance.' },
                    ],
                    events:[{ name: 'click', action: updateItemStatus}],
                    innerHTML: /*html*/`
                    ${document.getIcon('file-earmark-check').outerHTML}&#160;Open`,
                },{
                    tag: 'a',
                    classList: 'dropdown-item rounded-2',
                    attributes: [
                        { name: 'href', value: 'javascript:;' },
                        { name: 'role', value: 'tab' },
                        { name: 'aria-selected', value: false },
                        { name: 'data-open', value: '' },
                        { name: 'data-request', value: 'Open for Action' },
                        { name: 'title', value: 'An Open for Action Incident is one that is currently developing or ongoing and requires DHA HQ Assistance in some form.' },
                    ],
                    events:[{ name: 'click', action: updateItemStatus}],
                    innerHTML: /*html*/`
                    ${document.getIcon('file-earmark-check').outerHTML}&#160;Open for Action`,
                },{
                    tag: 'a',
                    classList: 'dropdown-item rounded-2',
                    attributes: [
                        { name: 'href', value: 'javascript:;' },
                        { name: 'role', value: 'tab' },
                        { name: 'aria-selected', value: false },
                        { name: 'data-close', value: '' },
                        { name: 'data-request', value: 'Closed' },
                        { name: 'title', value: 'A Closed Incident is one that has been resolved. A Final Report is required to be submitted before an Incident can be closed.' },
                    ],
                    events:[{ name: 'click', action: updateItemStatus}],
                    innerHTML: /*html*/`
                    ${document.getIcon('file-earmark-x').outerHTML}&#160;Closed`,
                },{
                    tag: 'a',
                    classList: 'dropdown-item rounded-2',
                    attributes: [
                        { name: 'href', value: 'javascript:;' },
                        { name: 'role', value: 'tab' },
                        { name: 'aria-selected', value: false },
                        { name: 'data-admin-close', value: '' },
                        { name: 'data-request', value: 'Admin Closed' },
                        { name: 'title', value: 'Admin Closed should only be used in the rare instance that two Initial Reports are entered for the same incident, creating two different Incident items in the tool. Use Admin Closed to close out the duplicate item without requiring a Final Report.' },
                    ],
                    events:[{ name: 'click', action: updateItemStatus}],
                    innerHTML: /*html*/`
                    ${document.getIcon('file-earmark-x').outerHTML}&#160;Admin Closed`,
                }],
                parent: btnGroup,
            }).render();
        }
    
        new Dropdown({
            title: /*html*/`${document.getIcon('plus').outerHTML}&#160;Create`,
            buttonColor: 'primary',
            buttonClassList: 'btn btn-primary btn-sm dropdown-toggle',
            menuOptions: [{
                tag: 'a',
                classList: 'dropdown-item rounded-2',
                attributes: [
                    { name: 'href', value: 'javascript:;' },
                    { name: 'role', value: 'tab' },
                    { name: 'aria-selected', value: false },
                    { name: 'data-dcir', value: DCIRNumber },
                    { name: 'data-report-type', value: FOLLOW_UP },
                ],
                events:[{
                    name: 'click',
                    action(event){
                        const { dcir, reportType } = this.dataset;
                        return getReportsByDCIR(dcir)
                        .then(results => {
                            const mostRecentReport = results.pop();
                            createFollowUpCorrectiveFinalReport(event, mostRecentReport, reportType);
                        });
                    },
                }],
                innerHTML: /*html*/`
                ${document.getIcon('file-earmark-plus').outerHTML}&#160;${FOLLOW_UP} Report`,
            },{
                tag: 'a',
                classList: 'dropdown-item rounded-2',
                attributes: [
                    { name: 'href', value: 'javascript:;' },
                    { name: 'role', value: 'tab' },
                    { name: 'aria-selected', value: false },
                    { name: 'data-dcir', value: DCIRNumber },
                    { name: 'data-report-type', value: CORRECTIVE },
                ],
                events:[{
                    name: 'click',
                    action(event){
                        const { dcir, reportType } = this.dataset;
                        return getReportsByDCIR(dcir)
                        .then(results => {
                            const mostRecentReport = results.pop();
                            createFollowUpCorrectiveFinalReport(event, mostRecentReport, reportType);
                        });
                    },
                }],
                innerHTML: /*html*/`
                ${document.getIcon('file-earmark-plus').outerHTML}&#160;${CORRECTIVE} Report`,
            },{
                tag: 'a',
                classList: 'dropdown-item rounded-2',
                attributes: [
                    { name: 'href', value: 'javascript:;' },
                    { name: 'role', value: 'tab' },
                    { name: 'aria-selected', value: false },
                    { name: 'data-dcir', value: DCIRNumber },
                    { name: 'data-report-type', value: FINAL },
                ],
                events:[{
                    name: 'click',
                    action(event){
                        const { dcir, reportType } = this.dataset;
                        return getReportsByDCIR(dcir)
                        .then(results => {
                            const mostRecentReport = results.pop();
                            createFollowUpCorrectiveFinalReport(event, mostRecentReport, reportType);
                        });
                    },
                }],
                innerHTML: /*html*/`
                ${document.getIcon('file-earmark-plus').outerHTML}&#160;${FINAL} Report`,
            }],
            parent: btnGroup,
        }).render();
    }

}

function createFollowUpCorrectiveFinalReport(event, reportData, newReportType) {
    //This function will be used for the buttons on the incident form to create new reports of the 3 listed types. 
    //reportData should be the fields we are going to copy from the most recent report on the incident
    //newReportType should be a string of the type of report we are creating, "Follow Up", "Corrective", "Final"
    // console.info(reportData, newReportType)
    modal.hide()
    let {
        DCIRNumber,
        EventTypeNumber,
        EventTypeCategory,
        EventTypeDescription,
        EventTypeNotificationMatrix,
        MarketId,
        MarketName,
        FacilityId,
        FacilityName,
        Latitude,
        Longitude,
        Date,
        Time,
        IndicationOfDegradation,
        PersonnelInvolved,
        IncidentStatement,
        MissionImpact,
        CorrectiveAction,
        HQAssistance,
        MediaInterest,
        LawEnforcementInvolved,
        DrugAlcoholUse,
    } = reportData;

    App.Views.Reports.table.ShowForm(event)
    .then(() => {
        ReportsForm.Values.set({
            ReportType: newReportType,
            DCIRNumber,
            EventTypeNumber,
            EventTypeCategory,
            EventTypeDescription,
            EventTypeNotificationMatrix,
            MarketId,
            MarketName,
            FacilityId,
            FacilityName,
            Latitude,
            Longitude,
            Date,
            Time,
            IndicationOfDegradation,
            PersonnelInvolved,
            IncidentStatement,
            MissionImpact,
            CorrectiveAction: newReportType === "Final" ? '' : CorrectiveAction,
            HQAssistance,
            MediaInterest,
            LawEnforcementInvolved,
            DrugAlcoholUse,
        });
    });

}

function generateReportAccordionItem(data, parent) {
    const {
        Id,
        Title,
        ReportType,
        DCIRNumber,
        EventTypeNumber,
        EventTypeCategory,
        EventTypeDescription,
        EventTypeNotificationMatrix,
        MarketId,
        MarketName,
        FacilityId,
        FacilityName,
        Latitude,
        Longitude,
        Date,
        Time,
        IndicationOfDegradation,
        PersonnelInvolved,
        IncidentStatement,
        MissionImpact,
        CorrectiveAction,
        HQAssistance,
        MediaInterest,
        LawEnforcementInvolved,
        DrugAlcoholUse,
        SubmitterName,
        SubmitterEmail,
        SubmitterPhone,
        AdditionalPOCName,
        AdditionalPOCEmail,
        AdditionalPOCPhone,
        Status,
        ID,
        Modified,
        Created,
        AuthorId,
        EditorId,
        GUID,
    } = data
    let personnelArray = JSON.parse(PersonnelInvolved)

    const PersonnelTable = new Component({
        tag: 'table',
        classList: "table table-sm f-12",
        // parent,
        attributes: [{ name: 'style', value: 'width: 100% !important;' }],
        innerHTML: /*html*/`
        <tr>
            <th colspan="4">Personnel Involved</th>
        </tr>
        <!-- tr>
            <th>Service</th>
            <th>Component</th>
            <th>Rank</th>
            <th>Grade</th>
        </tr -->
        `
    })

    personnelArray.forEach(person => {
        new Component({
            tag: `tr`,
            parent: PersonnelTable.get(),
            innerHTML: /*html*/ `
            <td><b>Service</b><br>${person.Service}</td>
            <td><b>Component</b><br>${person.Component}</td>
            <td><b>Rank</b><br>${person.Rank}</td>
            <td><b>Grade</b><br>${person.Grade}</td>
            `,
        }).render()
        new Component({
            tag: `tr`,
            parent: PersonnelTable.get(),
            innerHTML: /*html*/ `
            <td colspan="4"><b>Details</b><br>${person.PersonnelDetails}</td>
            `,
        }).render()
    })
    // console.info(PersonnelTable)
    // TODO: Should Incidents display Draft status reports, or only completed Reports that have been submitted?
    const reportComponent = new Component({
        tag: 'div',
        classList: "accordion-item",
        parent,
        //Original version
        innerHTML: /*html*/`
            <h2 class="accordion-header" id="Header-${GUID}">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#ID-${GUID}" aria-expanded="true" aria-controls="ID-${GUID}">
                    <strong>${ReportType} Report / Created on: ${Created.split('T')[0]}</strong>
                </button>
            </h2>
            <div id="ID-${GUID}" class="accordion-collapse collapse" aria-labelledby="Header-${GUID}">
                <div class="accordion-body">
                    <div>
                        <strong>Date: </strong>${Date}
                    </div>
                    <div>
                        <strong>Time: </strong>${Time}
                    </div>
                    <div>
                        <strong>Event Type Number: </strong>${EventTypeNumber}
                    </div>
                    <div>
                        <strong>Event Type Category: </strong>${EventTypeCategory}
                    </div>
                    <div>
                        <strong>Event Type Description: </strong>${EventTypeDescription}
                    </div>
                    <div>
                        <strong>Market Name: </strong>${MarketName}
                    </div>
                    <div>
                        <strong>Facility Name: </strong>${FacilityName}
                    </div>
                    <div>
                        <strong>Indication Of Degradation: </strong>${IndicationOfDegradation}
                    </div>
                    <div>
                        <strong>Personnel Involved: </strong>
                    </div>
                    <div>
                        ${PersonnelTable.get().outerHTML}
                    </div>
                    <div>
                        <strong>Incident Statement: </strong>${IncidentStatement}
                    </div>
                    <div>
                        <strong>Mission Impact: </strong>${MissionImpact}
                    </div>
                    <div>
                        <strong>Corrective Action: </strong>${CorrectiveAction}
                    </div>
                    <div>
                        <strong>DHA HQ Assistance: </strong>${HQAssistance}
                    </div>
                    <div>
                        <strong>Media Interest?: </strong>${MediaInterest}
                    </div>
                    <div>
                        <strong>Law Enforcement Involved?: </strong>${LawEnforcementInvolved}
                    </div>
                    <div>
                        <strong>Drug/Alcohol Use?: </strong>${DrugAlcoholUse}
                    </div>
                    <div>
                        <strong>Submitter Name: </strong>${SubmitterName}
                    </div>
                    <div>
                        <strong>Submitter Email: </strong>${SubmitterEmail}
                    </div>
                    <div>
                        <strong>Submitter Phone: </strong>${SubmitterPhone}
                    </div>
                    <div>
                        <strong>Additional POC Name: </strong>${AdditionalPOCName}
                    </div>
                    <div>
                        <strong>Additional POC Email: </strong>${AdditionalPOCEmail}
                    </div>
                    <div>
                        <strong>Additional POC Phone: </strong>${AdditionalPOCPhone}
                    </div>
                    
                </div>
            </div>
        `,
        //Table version 1
        innerHTML: /*html*/`
        <h2 class="accordion-header" id="Header-${GUID}">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#ID-${GUID}" aria-expanded="true" aria-controls="ID-${GUID}">
                <strong>${ReportType} Report / Created on: ${Created.split('T')[0]}</strong>
            </button>
        </h2>
        <div id="ID-${GUID}" class="accordion-collapse collapse" aria-labelledby="Header-${GUID}">
            <div class="accordion-body">
                <table class="table table-bordered table-sm text-wrap">
                    <tbody>
                        <tr>
                            <th>Event Type Number</th>
                            <th>Event Type Category</th>
                            <th colspan="2">Event Type Description</th>
                        </tr>
                        <tr>
                            <td>${EventTypeNumber}</td>
                            <td>${EventTypeCategory}</td>
                            <td colspan="2">${EventTypeDescription}</td>
                        </tr>
                        <tr>
                            <th colspan="2">Market Name</th>
                            <th colspan="2">Facility Name</th>
                        </tr>
                        <tr>
                            <td colspan="2">${MarketName}</td>
                            <td colspan="2">${FacilityName}</td>
                        </tr>
                        <tr>
                            <th>Date</th>
                            <th>Time</th>
                            <th colspan="2">Indication of Degradation</th>
                        </tr>
                        <tr>
                            <td>${Date}</td>
                            <td>${Time}</td>
                            <td colspan="2">${IndicationOfDegradation}</td>
                        </tr>
                        <tr data-personnel-row>
                                ${PersonnelTable.get().innerHTML}
                        </tr>
                        <tr>
                            <th colspan="4">Incident Statement</th>
                        </tr>
                        <tr>
                            <td colspan="4">${IncidentStatement}</td>
                        </tr>
                        <tr>
                            <th colspan="4">Mission Impact</th>
                        </tr>
                        <tr>
                            <td colspan="4">${MissionImpact}</td>
                        </tr>
                        <tr>
                            <th colspan="4">Corrective Action</th>
                        </tr>
                        <tr>
                            <td colspan="4">${CorrectiveAction}</td>
                        </tr>
                        <tr>
                            <th colspan="4">DHA HQ Assistance</th>
                        </tr>
                        <tr>
                            <td colspan="4">${HQAssistance}</td>
                        </tr>
                        <tr>
                            <th>Media Interest?</th>
                            <th>Law Enforcement Involved?</th>
                            <th>Drug/Alcohol Use?</th>
                            <th></th>
                        </tr>
                        <tr>
                            <td>${MediaInterest}</td>
                            <td>${LawEnforcementInvolved}</td>
                            <td>${DrugAlcoholUse}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <th>Submitter Name</th>
                            <th>Submitter Email</th>
                            <th>Submitter Phone</th>
                            <th></th>
                        </tr>
                        <tr>
                            <td>${SubmitterName}</td>
                            <td>${SubmitterEmail}</td>
                            <td>${SubmitterPhone}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <th>Additional POC Name</th>
                            <th>Additional POC Email</th>
                            <th>Additional POC Phone</th>
                            <th></th>
                        </tr>
                        <tr>
                            <td>${AdditionalPOCName}</td>
                            <td>${AdditionalPOCEmail}</td>
                            <td>${AdditionalPOCPhone}</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        `,
        //Table version 2
        innerHTML: /*html*/`
        <h2 class="accordion-header" id="Header-${GUID}">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#ID-${GUID}" aria-expanded="true" aria-controls="ID-${GUID}">
                <strong>${ReportType} Report / Created on: ${Created.split('T')[0]}</strong>
            </button>
        </h2>
        <div id="ID-${GUID}" class="accordion-collapse collapse" aria-labelledby="Header-${GUID}">
            <div class="accordion-body">
                <table class="table table-sm f-12">
                    <tbody>
                        <tr>
                            <td><strong>Event Type Number</strong><br>${EventTypeNumber}</td>
                            <td><strong>Event Type Category</strong><br>${EventTypeCategory}</td>
                            <td colspan="2"><strong>Event Type Description</strong><br>${EventTypeDescription}</td>
                        </tr>
                        <tr>
                            <td><strong>Market Name</strong><br>${MarketName}</td>
                            <td colspan="3"><strong>Facility Name</strong><br>${FacilityName}</td>
                        </tr>
                        <tr>
                            <td><strong>Date</strong><br>${Date}</td>
                            <td><strong>Time</strong><br>${Time}</td>
                            <td colspan="2"><strong>Indication Of Degradation</strong><br>${IndicationOfDegradation}</td>
                        </tr>
                        <tr data-personnel-row>
                                ${PersonnelTable.get().innerHTML}
                        </tr>
                        <tr>
                            <td colspan="4"><strong>Incident Statement</strong><br>${IncidentStatement}</td>
                        </tr>
                        <tr>
                            <td colspan="4"><strong>Mission Impact</strong><br>${MissionImpact}</td>
                        </tr>
                        <tr>
                            <td colspan="4"><strong>Corrective Action</strong><br>${CorrectiveAction}</td>
                        </tr>
                        <tr>
                            <td colspan="4"><strong>DHA HQ Assistance</strong><br>${HQAssistance}</td>
                        </tr>
                        <tr>
                            <td><strong>Media Interest?</strong><br>${MediaInterest}</td>
                            <td><strong>Law Enforcement Involved?</strong><br>${LawEnforcementInvolved}</td>
                            <td colspan="2"><strong>Drug/Alcohol Use?</strong><br>${DrugAlcoholUse}</td>
                        </tr>
                        <tr>
                            <td><strong>Submitter Name</strong><br>${SubmitterName}</td>
                            <td><strong>Submitter Email</strong><br>${SubmitterEmail}</td>
                            <td colspan="2"><strong>Submitter Phone</strong><br>${SubmitterPhone}</td>
                        </tr>
                        <tr>
                            <td><strong>Additional POC Name</strong><br>${AdditionalPOCName}</td>
                            <td><strong>Additional POC Email</strong><br>${AdditionalPOCEmail}</td>
                            <td colspan="2"><strong>Additional POC Phone</strong><br>${AdditionalPOCPhone}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        `,
    }).render();
}

function createDetailsJSONString(currentReports) {
    let Details = [];
    for (let report of currentReports) {
        let {
            // __metadata,
            // FirstUniqueAncestorSecurableObject,
            // RoleAssignments,
            // AttachmentFiles,
            // ContentType,
            // GetDlpPolicyTip,
            // FieldValuesAsHtml,
            // FieldValuesAsText,
            // FieldValuesForEdit,
            // File,
            // Folder,
            // ParentList,
            // FileSystemObjectType,
            Id,
            // ContentTypeId,
            // Title,
            ReportType,
            DCIRNumber,
            EventTypeNumber,
            EventTypeCategory,
            EventTypeDescription,
            MarketId,
            MarketName,
            FacilityId,
            FacilityName,
            Date,
            Time,
            IndicationOfDegradation,
            PersonnelInvolved,
            IncidentStatement,
            MissionImpact,
            CorrectiveAction,
            HQAssistance,
            MediaInterest,
            LawEnforcementInvolved,
            DrugAlcoholUse,
            SubmitterName,
            SubmitterEmail,
            SubmitterPhone,
            AdditionalPOCName,
            AdditionalPOCEmail,
            AdditionalPOCPhone,
            // Status,
            MarketAcknowledgement,
            DOCAcknowledgement,
            ID,
            Modified,
            Created,
            AuthorId,
            EditorId,
            // OData__UIVersionString,
            // Attachments,
            GUID,
        } = report
        Details.push({
            Id,
            ReportType,
            DCIRNumber,
            EventTypeNumber,
            EventTypeCategory,
            EventTypeDescription,
            MarketId,
            MarketName,
            FacilityId,
            FacilityName,
            Date,
            Time,
            IndicationOfDegradation,
            PersonnelInvolved,
            IncidentStatement,
            MissionImpact,
            CorrectiveAction,
            HQAssistance,
            MediaInterest,
            LawEnforcementInvolved,
            DrugAlcoholUse,
            SubmitterName,
            SubmitterEmail,
            SubmitterPhone,
            AdditionalPOCName,
            AdditionalPOCEmail,
            AdditionalPOCPhone,
            MarketAcknowledgement,
            DOCAcknowledgement,
            ID,
            Modified,
            Created,
            AuthorId,
            EditorId,
            GUID,
        })
    }
    return JSON.stringify(Details)
}