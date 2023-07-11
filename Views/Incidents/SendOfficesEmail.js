import { DEVELOPER, service, web, user } from "../../src/Biome.js";
import App, { Route, User, Layout, store, ADMINISTRATOR, Web } from "../../app.js";
import Email from "../../src/Classes/Email.js";
import Toast from "../../src/Classes/Toast.js";
import { Title } from './List.js';
import Modal from "../../src/Classes/Modal.js";
import { Title as OfficesTitle } from "../Offices/List.js";
import Form from "../../src/Classes/Form.js";
import Component from "../../src/Classes/Component.js";
import addBusinessDays from "./addBusinessDays.js";

/** TODO: Make these global within the application; */
const contact_title = 'DHA Operations Center';
const contact_email = 'dha.ncr.operations-j-3.mbx.dha-ops-center@health.mil';
const contact_phone = '(703) 681-4600';

let emailForm;
let data;

export function SendOfficesEmail(event) {
    // console.info(event)
    data = JSON.parse(event.target.dataset.stringifiedObject)
    let type = event.target.dataset.emailType
    console.info(data)
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
    const info = notificationMatrix.filter(n => {
        if (n.value === 3 || n.value === '3') return n;
    });
    const wue = notificationMatrix.filter(n=>{
        if (n.value === 'WUE') return n;
    })
    const officesToNotify = [wue, opr, ocr, info].flat()

    console.info(officesToNotify)
    const url = new URL(location);
    url.hash = Title;
    url.searchParams.set('Id', data.Id);

    const To = [wue.filter(office => office.Emails).map(office => office.Emails), opr.filter(office => office.Emails).map(office => office.Emails), ocr.filter(office => office.Emails).map(office => office.Emails)].flat();
    const CC = [info.filter(office => office.Emails).map(office => office.Emails)].flat();

    function FinalizeEmailNotification(event) {
        const {
            // Id,
            DCIRNumber,
            Status,
            // Details,
            // EventTypeId,
            EventTypeNumber,
            EventTypeCategory,
            EventTypeDescription,
            // EventTypeNotificationMatrix,
            MarketName,
            FacilityName,
            // MarketId,
            // FacilityId,
            Date,
            Time,
            // MarketAcknowledgement,
            // DOCAcknowledgement,
            // IndicationOfDegradation,
            // Latitude,
            // Longitude,
            ReportType,
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
        } = data;

        let emailData = emailForm.Values.get()
        let { SubjectTitle, ATTN, SuspenseDate, Signature } = emailData

        const email = new Email({
            To,
            CC,
            Subject: `[${type.toUpperCase()}] ${DCIRNumber}: ${SubjectTitle? SubjectTitle: '' }`,
            // Body: /*html*/`
            // <div data-content>
            //     <p><b>ATTN: </b>${ATTN ? ATTN : ''}</p>
            //     <p><b>OPR: </b>${opr.map(office => office.OfficeName).join(', ')}</p>
            //     <p><b>OCR: </b>${ocr.map(office => office.OfficeName).join(', ')}</p>
            //     <p><b>1. PURPOSE:</b> For Action</p>
            //     <p><b>2. INSTRUCTIONS:</b>Please see below DCIR for review/action.</p>
            //     <p><b>3. SUMMARY:</b></p>
            //     <p>${ReportType === "Initial" ? 'An ' + ReportType : 'A ' + ReportType} Report has been submitted for ${Status} Incident: <strong>${DCIRNumber}</strong>.</p>
            //     <p>Please <u>click</u> the link below to visit the DCIR Notification Portal to 
            //         ${ReportType === 'Initial' ? 'review and acknowledge the incident' : 'review the incident updates'}.<br>
            //             <a href="${url.href}">${url.href}</a>
            //     </p><hr>
            //     <p>
            //         <b><u>Report Details</u></b><br>
            //         <strong>Event Type Number: </strong>${EventTypeNumber}<br>
            //         <strong>Category: </strong>${EventTypeCategory}<br>
            //         <strong>Description: </strong>${EventTypeDescription}
            //     </p>
            //     <p>
            //         <strong>Date: </strong>${Date} <br>
            //         <strong>Time: </strong>${Time}
            //     </p>
            //     <p>
            //         <strong>Market Name: </strong>${MarketName}<br>
            //         <strong>Facility Name: </strong>${FacilityName}
            //     </p>
            //     <p>
            //         <strong>Personnel Involved: </strong>
            //         ${JSON.parse(PersonnelInvolved).map(personObject=>{
            //             let {Service, Component, Rank, Grade, PersonnelDetails} = personObject
            //             return /*html*/`
            //                 <strong>Service: </strong>${Service}
            //                 <strong>Component: </strong>${Component}
            //                 <strong>Rank: </strong>${Rank}
            //                 <strong>Grade: </strong>${Grade}<br>
            //                 <strong>Personnel Details: </strong>
            //                 ${PersonnelDetails}<br>
            //             `
            //         })}
            //     </p>
            //     <p>
            //         <strong>Statement of Incident: </strong>
            //         ${IncidentStatement}
            //     </p>
            //     <p>
            //         <strong>Mission Impact: </strong>
            //         ${MissionImpact}
            //     </p>
            //     <p>
            //         <strong>Corrective Action Taken/Required: </strong>
            //         ${CorrectiveAction}
            //     </p>
            //     <p>
            //         <strong>DHA Headquarters Assistance Required: </strong>
            //         ${HQAssistance}
            //     </p>
            //     <p>
            //         <strong>Media Interest: </strong>${MediaInterest}<br>
            //         <strong>Law Enforcement Involved: </strong>${LawEnforcementInvolved}<br>
            //         <strong>Drug/Alcohol Use: </strong>${DrugAlcoholUse}
            //     </p>
            //     <p>
            //         <strong>Contact Information: </strong><br>
            //         <strong>Primary</strong><br>
            //         <strong>Name: </strong>${SubmitterName}<br>
            //         <strong>Phone: </strong>${SubmitterPhone}<br>
            //         <strong>Email: </strong>${SubmitterEmail}
            //     </p>
            //     <p>
            //         <strong>Alternate</strong><br>
            //         <strong>Name: </strong>${AdditionalPOCName}<br>
            //         <strong>Phone: </strong>${AdditionalPOCPhone}<br>
            //         <strong>Email: </strong>${AdditionalPOCEmail}
            //     </p>
            //     <br>
            //     <p><b>SUSPENSE: </b>${suspenseDateStr? suspenseDateStr: ""}</p>
            // </div>
            
            // <p>If you have any questions regarding this transmittal, or the information contained within, please contact the ${contact_title} via email at ${contact_email} or please call ${contact_phone}.</p>

            // <p>
            // ${Signature}<br>
            // DHA Operations Center<br>
            // Defense Health Agency J-33<br>
            // 7700 Arlington Blvd<br>
            // Falls Church VA 22042<br>
            // Phone: ${contact_phone}<br>
            // </p>
            // `,
        });
        if(type === 'Action'){
        email.Body = /*html*/`
        <div data-content>
            <div><b>ATTN: </b>${ATTN ? ATTN : ''}</div>
            <div><b>OPR: </b>${opr.map(office => office.OfficeName).join(', ')}</div>
            <div><b>OCR: </b>${ocr.map(office => office.OfficeName).join(', ')}</div>
            <div><b>1. PURPOSE:</b> For Action</div>
            <div><b>2. INSTRUCTIONS:</b>Please see below DCIR for review/action.</div>
            <div><b>3. SUMMARY:</b></div>
            <div>${ReportType === "Initial" ? 'An ' + ReportType : 'A ' + ReportType} Report has been submitted for ${Status} Incident: <strong>${DCIRNumber}</strong>.</div>
            <div>Please <u>click</u> the link below to visit the DCIR Notification Portal to 
                ${ReportType === 'Initial' ? 'review and acknowledge the incident' : 'review the incident updates'}.<br>
                    <a href="${url.href}">${url.href}</a>
            </div><hr>
            <div>
                <b><u>Report Details</u></b><br>
                <strong>Event Type Number: </strong>${EventTypeNumber}<br>
                <strong>Category: </strong>${EventTypeCategory}<br>
                <strong>Description: </strong>${EventTypeDescription}
            </div>
            <div>
                <strong>Date: </strong>${Date} <br>
                <strong>Time: </strong>${Time}
            </div>
            <div>
                <strong>Market Name: </strong>${MarketName}<br>
                <strong>Facility Name: </strong>${FacilityName}
            </div>
            <div>
                <strong>Personnel Involved: </strong>
                ${JSON.parse(PersonnelInvolved).map(personObject=>{
                    let {Service, Component, Rank, Grade, PersonnelDetails} = personObject
                    return /*html*/`
                        <strong>Service: </strong>${Service}
                        <strong>Component: </strong>${Component}
                        <strong>Rank: </strong>${Rank}
                        <strong>Grade: </strong>${Grade}<br>
                        <strong>Personnel Details: </strong>
                        ${PersonnelDetails}<br>
                    `
                })}
            </div>
            <div>
                <strong>Statement of Incident: </strong>
                ${IncidentStatement}
            </div>
            <div>
                <strong>Mission Impact: </strong>
                ${MissionImpact}
            </div>
            <div>
                <strong>Corrective Action Taken/Required: </strong>
                ${CorrectiveAction}
            </div>
            <div>
                <strong>DHA Headquarters Assistance Required: </strong>
                ${HQAssistance}
            </div>
            <div>
                <strong>Media Interest: </strong>${MediaInterest}<br>
                <strong>Law Enforcement Involved: </strong>${LawEnforcementInvolved}<br>
                <strong>Drug/Alcohol Use: </strong>${DrugAlcoholUse}
            </div>
            <div>
                <strong>Contact Information: </strong><br>
                <strong>Primary</strong><br>
                <strong>Name: </strong>${SubmitterName}<br>
                <strong>Phone: </strong>${SubmitterPhone}<br>
                <strong>Email: </strong>${SubmitterEmail}
            </div>
            <div>
                <strong>Alternate</strong><br>
                <strong>Name: </strong>${AdditionalPOCName}<br>
                <strong>Phone: </strong>${AdditionalPOCPhone}<br>
                <strong>Email: </strong>${AdditionalPOCEmail}
            </div>
            <br>
            <div><b>SUSPENSE: </b>${suspenseDateStr? suspenseDateStr: ""}</div>
        </div>
        
        <div>If you have any questions regarding this transmittal, or the information contained within, please contact the ${contact_title} via email at ${contact_email} or please call ${contact_phone}.</div>

        <div>
        ${Signature}<br>
        DHA Operations Center<br>
        Defense Health Agency J-33<br>
        7700 Arlington Blvd<br>
        Falls Church VA 22042<br>
        Phone: ${contact_phone}<br>
        </div>
        `
        } else if (type === 'Info') {
            email.Body = /*html*/
            `
            <div data-content>
                <div><b>ATTN: </b>${ATTN ? ATTN : ''}</div>
                <div><b>1. PURPOSE:</b> For Information Only</div>
                <div><b>2. INSTRUCTIONS:</b>Please see below DCIR for review</div>
                <div><b>3. SUMMARY:</b></div>
                <div>${ReportType === "Initial" ? 'An ' + ReportType : 'A ' + ReportType} Report has been submitted for ${Status} Incident: <strong>${DCIRNumber}</strong>.</div>
                <div>Please <u>click</u> the link below to visit the DCIR Notification Portal to 
                    ${ReportType === 'Initial' ? 'review and acknowledge the incident' : 'review the incident updates'}.<br>
                        <a href="${url.href}">${url.href}</a>
                </div><hr>
                <div>
                    <b><u>Report Details</u></b><br>
                    <strong>Event Type Number: </strong>${EventTypeNumber}<br>
                    <strong>Category: </strong>${EventTypeCategory}<br>
                    <strong>Description: </strong>${EventTypeDescription}
                </div>
                <div>
                    <strong>Date: </strong>${Date} <br>
                    <strong>Time: </strong>${Time}
                </div>
                <div>
                    <strong>Market Name: </strong>${MarketName}<br>
                    <strong>Facility Name: </strong>${FacilityName}
                </div>
                <div>
                    <strong>Personnel Involved: </strong>
                    ${JSON.parse(PersonnelInvolved).map(personObject=>{
                        let {Service, Component, Rank, Grade, PersonnelDetails} = personObject
                        return /*html*/`
                            <strong>Service: </strong>${Service}
                            <strong>Component: </strong>${Component}
                            <strong>Rank: </strong>${Rank}
                            <strong>Grade: </strong>${Grade}<br>
                            <strong>Personnel Details: </strong>
                            ${PersonnelDetails}<br>
                        `
                    })}
                </div>
                <div>
                    <strong>Statement of Incident: </strong>
                    ${IncidentStatement}
                </div>
                <div>
                    <strong>Mission Impact: </strong>
                    ${MissionImpact}
                </div>
                <div>
                    <strong>Corrective Action Taken/Required: </strong>
                    ${CorrectiveAction}
                </div>
                <div>
                    <strong>DHA Headquarters Assistance Required: </strong>
                    ${HQAssistance}
                </div>
                <div>
                    <strong>Media Interest: </strong>${MediaInterest}<br>
                    <strong>Law Enforcement Involved: </strong>${LawEnforcementInvolved}<br>
                    <strong>Drug/Alcohol Use: </strong>${DrugAlcoholUse}
                </div>
                <div>
                    <strong>Contact Information: </strong><br>
                    <strong>Primary</strong><br>
                    <strong>Name: </strong>${SubmitterName}<br>
                    <strong>Phone: </strong>${SubmitterPhone}<br>
                    <strong>Email: </strong>${SubmitterEmail}
                </div>
                <div>
                    <strong>Alternate</strong><br>
                    <strong>Name: </strong>${AdditionalPOCName}<br>
                    <strong>Phone: </strong>${AdditionalPOCPhone}<br>
                    <strong>Email: </strong>${AdditionalPOCEmail}
                </div>
                <br>
                <div><b>SUSPENSE: </b>${suspenseDateStr? suspenseDateStr: ""}</div>
            </div>
            
            <div>If you have any questions regarding this transmittal, or the information contained within, please contact the ${contact_title} via email at ${contact_email} or please call ${contact_phone}.</div>
    
            <div>
            ${Signature}<br>
            DHA Operations Center<br>
            Defense Health Agency J-33<br>
            7700 Arlington Blvd<br>
            Falls Church VA 22042<br>
            Phone: ${contact_phone}<br>
            </div>
            `
        }

        return email;
    }

    const emailModal = new Modal({
        title: `Create [${type.toUpperCase()}] Email`,
        draggable: true,
        size: 'modal-xl',
        classes: 'modal-dialog-scrollable',
        buttons: [{
            tag: 'button',
            // type: 'patch',
            classList: 'btn btn-primary btn-sm',
            innerText: 'Preview Email',
            // attributes: [{ name: 'src', value: data?.__metadata?.uri }],
            events: [{
                name: 'click', action(event) {
                    const email = FinalizeEmailNotification()
                    email.preview()
                }
            }]
        }, {
            tag: 'button',
            // type: 'patch',
            classList: 'btn btn-success btn-sm',
            innerText: 'Send Email',
            // attributes: [{ name: 'src', value: data?.__metadata?.uri }],
            events: [{
                name: 'click', action(event) {
                    const email = FinalizeEmailNotification()
                    email.send()
                    .then(function (data, statusText, xhr) {
                        if (xhr.status >= 200 && xhr.status < 300) new Toast({
                            type: 'success',
                            message: `Success! Notifications for this DCIR have been sent to the Offices`,
                        })
                            .render()
                            .show();
                    });
                    emailModal.hide()
                }
            }]
        }],
    }).render();
    emailModal.show()

    let suspenseDate = addBusinessDays(3)

    let suspenseDateStr = suspenseDate.format("YYYY-MM-DD")
    // console.info(suspenseDate)
    // console.info(suspenseDateStr)
    emailForm = new Form({
        classList: 'row needs-validation',
        parent: emailModal.body,
        innerHTML: /*html*/`
        <div class="col-6">
            <div class="row my-2">
                <div class="col">
                    <label for="inputSubjectTitle" class="form-label">Title:</label>
                    <input type="text" id="inputSubjectTitle" name="SubjectTitle" class="form-control form-control-sm" value="">
                </div>
            </div>
            <div class="row my-2">
                <div class="col">
                    <label for="inputATTN" class="form-label">ATTN:</label>
                    <input type="text" id="inputATTN" name="ATTN" class="form-control form-control-sm">
                </div>
            </div>
            <div class="row my-2">
                <div class="col">
                    <label for="inputSuspenseDate" class="form-label">Suspense Date:</label>
                    <input type="date" id="inputSuspenseDate" name="SuspenseDate" class="form-control form-control-sm" value="${suspenseDateStr}">
                </div>
            </div>
            <div class="row my-2">
                <div class="col">
                    <label for="inputSignature" class="form-label">Name in Signature:</label>
                    <input type="text" id="inputSignature" name="Signature" class="form-control form-control-sm" value="${User.DisplayText}">
                </div>
            </div>
        </div>
        <div class="col-6">
            <div class="row my-2">
                <div class="col">
                    <label for="inputSuspenseDate" class="form-label">This email will be sent to the addresses saved for the following Offices:</label>
                    <div data-office-container></div>
                </div>
            </div>
        </div>
        `,
    }).render();
    let officeContainer = emailForm.get().querySelector('[data-office-container]')
    let officeHeader;
    officesToNotify.forEach(office => {
        let currentOfficeNotificationHeader = decodeURIComponent(office.name).split('checkbox-')[1]
        // console.info(officeHeader, currentOfficeNotificationHeader)
        if(type === 'Action'){
            if(officeHeader !== currentOfficeNotificationHeader){
                new Component({
                    tag: 'p',
                    classList: 'mb-0 fw-bold',
                    parent: officeContainer,
                    innerText: currentOfficeNotificationHeader,
                }).render();
            }
            officeHeader = currentOfficeNotificationHeader;
        }
        
        new Component({
            tag: 'p',
            classList: 'mb-0 fst-italic',
            parent: officeContainer,
            innerText: office.OfficeName,
        }).render();
    })

    const {
        // Id,
        DCIRNumber,
        Status,
        // Details,
        // EventTypeId,
        EventTypeNumber,
        EventTypeCategory,
        EventTypeDescription,
        // EventTypeNotificationMatrix,
        MarketName,
        FacilityName,
        // MarketId,
        // FacilityId,
        Date,
        Time,
        // MarketAcknowledgement,
        // DOCAcknowledgement,
        // IndicationOfDegradation,
        // Latitude,
        // Longitude,
        ReportType,
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
    } = data;

    // let emailData = emailForm.Values.get()

    // // function PreviewEmail(event){ //Create a preview modal with a textarea where they can review and make final edits
    // //     // console.info(event.target.parentElement.parentElement.querySelector('form').component.Values.get())
    // //     console.info(emailForm.Values.get())
    // //     const previewModal = new Modal({
    // //         title: 'Preview/Send [ACTION] Email',
    // //         draggable: true,
    // //         size: 'modal-xl modal-dialog-scrollable',
    // //         classes: '',
    // //         buttons: [{
    // //             tag: 'button',
    // //             // type: 'patch',
    // //             classList: 'btn btn-secondary btn-sm',
    // //             innerText: 'Send Email',
    // //             // attributes: [{ name: 'src', value: data?.__metadata?.uri }],
    // //             events: [{ name: 'click', action(event){console.info(event)} }]
    // //         }],
    // //     }).render();
    // //     // let {Subject, ATTN, SuspenseDate, Signature } = emailData
    // //     const previewForm =
    // //     new Form({
    // //         classList: 'row needs-validation',
    // //         parent: previewModal.body,
    // //         innerHTML: /*html*/`
    // //             <div class="row my-2">
    // //                 <div class="col-6">
    // //                     <label for="inputSubject" class="form-label">Title:</label>
    // //                     <input type="text" id="inputSubject" name="Subject" class="form-control form-control-sm" value="${Subject ? Subject : ''}" required>
    // //                 </div>
    // //             </div>
    // //             <div class="row my-2">
    // //                 <div class="col">
    // //                     <label for="inputTo" class="form-label">To:</label>
    // //                     <input type="text" id="inputTo" name="To" class="form-control form-control-sm" value="${To.join('; ')}" required>
    // //                 </div>
    // //             </div>
    // //             <div class="row my-2">
    // //                 <div class="col">
    // //                     <label for="inputCC" class="form-label">CC:</label>
    // //                     <input type="text" id="inputCC" name="CC" class="form-control form-control-sm" value="${CC.join('; ')}" required>
    // //                 </div>
    // //             </div>
    // //             <div class="row my-2">
    // //                 <div class="col">
    // //                     <label for="inputEmailBody" class="form-label">Email Body:</label>
    // //                     <div id="inputEmailBody" class="form-control" rows='12' name="EmailBody">
    // //                     ${email.Body}
    // //                     </div>
    // //                 </div>
    // //             </div>
    // //         `,
    // //     }).render();

    // //     emailModal.hide()
    // //     previewModal.show()
    // // }



    // //FIXME: update to use email workflow list
    // /** Send the notification email via the REST API; */
    // // Since we are using the REST API we are getting the login names or email strings;
    // // const To = await getSendToEmails(MarketId);
    // let {SubjectTitle, ATTN, SuspenseDate, Signature } = emailData

    // /** FIXME: If this call is used to POST on the EmailNotification list, it requires a from value... right? */
    // const email = new Email({
    //     To,
    //     CC,
    //     // Subject: `${ReportType} Report submitted for ${Status} Incident: ${DCIRNumber}`,
    //     // TODO: Make sure INFO is dynamically set;
    //     Subject: `[ACTION] ${DCIRNumber}: ${SubjectTitle}`,
    //     Body: /*html*/`
    //     <div data-content>
    //         <p><b>ATTN: </b>${ATTN}</p>
    //         <p><b>OPR: </b>${opr.map(office=>office.OfficeName).join(', ')}</p>
    //         <p><b>OCR: </b>${ocr.map(office=>office.OfficeName).join(', ')}</p>
    //         <p><b>1. PURPOSE:</b> For Action</p>
    //         <p><b>2. INSTRUCTIONS:</b>Please see below DCIR for review/action.</p>
    //         <p><b>3. SUMMARY:</b></p>
    //         <p>${ReportType === "Initial" ? 'An ' + ReportType : 'A ' + ReportType} Report has been submitted for ${Status} Incident: <strong>${DCIRNumber}</strong>.</p>
    //         <p>Please <u>click</u> the link below to visit the DCIR Notification Portal to 
    //             ${ReportType === 'Initial' ? 'review and acknowledge the incident' : 'review the incident updates'}.<br>
    //                 <a href="${url.href}">${url.href}</a>
    //         </p><hr>
    //         <p>
    //             <b><u>Report Details</u></b><br>
    //             <strong>Event Type Number: </strong>${EventTypeNumber}<br>
    //             <strong>Category: </strong>${EventTypeCategory}<br>
    //             <strong>Description: </strong>${EventTypeDescription}
    //         </p>
    //         <p>
    //             <strong>Date: </strong>${Date} <br>
    //             <strong>Time: </strong>${Time}
    //         </p>
    //         <p>
    //             <strong>Market Name: </strong>${MarketName}<br>
    //             <strong>Facility Name: </strong>${FacilityName}
    //         </p>
    //         <p>
    //             <strong>Personnel Involved: </strong>
    //             ${PersonnelInvolved}
    //         </p>
    //         <p>
    //             <strong>Statement of Incident: </strong>
    //             ${IncidentStatement}
    //         </p>
    //         <p>
    //             <strong>Mission Impact: </strong>
    //             ${MissionImpact}
    //         </p>
    //         <p>
    //             <strong>Corrective Action Taken/Required: </strong>
    //             ${CorrectiveAction}
    //         </p>
    //         <p>
    //             <strong>DHA Headquarters Assistance Required: </strong>
    //             ${HQAssistance}
    //         </p>
    //         <p>
    //             <strong>Media Interest: </strong>${MediaInterest}<br>
    //             <strong>Law Enforcement Involved: </strong>${LawEnforcementInvolved}<br>
    //             <strong>Drug/Alcohol Use: </strong>${DrugAlcoholUse}
    //         </p>
    //         <p>
    //             <strong>Contact Information: </strong><br>
    //             <strong>Primary</strong><br>
    //             <strong>Name: </strong>${SubmitterName}<br>
    //             <strong>Phone: </strong>${SubmitterPhone}<br>
    //             <strong>Email: </strong>${SubmitterEmail}
    //         </p>
    //         <p>
    //             <strong>Alternate</strong><br>
    //             <strong>Name: </strong>${AdditionalPOCName}<br>
    //             <strong>Phone: </strong>${AdditionalPOCPhone}<br>
    //             <strong>Email: </strong>${AdditionalPOCEmail}
    //         </p>
    //         <br>
    //         <p><b>SUSPENSE: </b>${suspenseDateStr}</p>
    //     </div>

    //     <p>If you have any questions regarding this transmittal, or the information contined within, please contact the ${contact_title} via email at ${contact_email} or please call ${contact_phone}.</p>
    //     `,
    // });
    // console.info(email.Body)
    
    //TODO: ENABLE THIS FOR PRODUCTION
    return
    return email.send()
        .then(function (data, statusText, xhr) {
            if (xhr.status >= 200 && xhr.status < 300) new Toast({
                type: 'success',
                message: `Success! Notifications for your submitted report have been sent to the DHA Operations Center & ${MarketName
                    } Market organizational email boxes.`,
            })
                .render()
                .show();
        });

}