/**
 * FacilityRequestNotification.js
 * @author Wilfredo Pacheco
 */

import { DEVELOPER, service, web, user } from "../../src/Biome.js";
import Email from "../../src/Classes/Email.js";
import Toast from "../../src/Classes/Toast.js";
import getUsersByRole from "../../src/Views/Users/getUsersByRole.js";
import { Title } from '../Incidents/List.js';
import { Title as LocationsTitle } from '../Locations/List.js';

/** TODO: Make these global within the application; */
const contact_title = 'DHA Operations Center';
const contact_email = 'dha.ncr.operations-j-3.mbx.dha-ops-center@health.mil';
const contact_phone = '(703) 681-4600';

export function getMarketEmailsById(id) {
    const list = web.getListDetails(LocationsTitle);
    return service.Get(`${list.__metadata.uri}/items(${id})`)
        .then(data => data.d);
}

function getSendToEmails(marketId) {
    return Promise.all([

        /** FIXME: This is for testing and internal UAT ONLY and should be update to admin for production; */
        // getUsersByRole(ADMINISTRATOR).then(users => users.map(u => u.Email)),
        // getUsersByRole(DEVELOPER).then(users => users.map(u => u.Email)),

        getMarketEmailsById(marketId)
            .then(market => market.EmailAddresses)
            .then(arrayString => {
                if (arrayString) return JSON.parse(arrayString)
                else return [];
            })
            .then(emailArray => {
                /** FIXME: This is for testing only and should be updated for production; */
                console.info('This is where the email will be sent to in production:', emailArray);
                return [
                    "Logan.A.Bunker@saic.com",
                    // "Wilfredo.Pacheco@saic.com",
                ];
            }),

            //TODO: Add current user to email array 
    ])
        .then(function (emails) {
            /** Prevent duplicate emails strings from showing up; */
            return Array.from(new Set(emails.flat()));
        });
}

export async function NewReportSubmitted(incidentData) {
    //This will send the automated email to the DOC and Market when an item is created. 
    // console.info(incidentData)
    const {
        Id,
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
        MarketId,
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
    } = incidentData;

    /** Since we might be under home, reports, or incidents tabs when creating our new report, we have to create the url for the email; */
    const url = new URL(location);
    url.hash = Title;
    url.searchParams.set('Id', Id);

    //FIXME: update to use email workflow list
    /** Send the notification email via the REST API; */
    // Since we are using the REST API we are getting the login names or email strings;
    const To = await getSendToEmails(MarketId);

    /** FIXME: If this call is used to POST on the EmailNotification list, it requires a from value... right? */
    const email = new Email({
        To,
        // Subject: `${ReportType} Report submitted for ${Status} Incident: ${DCIRNumber}`,
        // TODO: Make sure INFO is dynamically set;
        Subject: `${ReportType} Report submitted for ${Status} Incident: ${DCIRNumber}`,
        Body: /*html*/`
        <div style="text-align: center;font-weight: bold;" data-header>
            <h2>DCIR Report Submission Notification</h2>
        </div>
        <hr>
        <br>
        <div data-content>
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
                    <div>
                        <strong>Service: </strong>${Service}
                        <strong>Component: </strong>${Component}
                        <strong>Rank: </strong>${Rank}
                        <strong>Grade: </strong>${Grade}<br>
                        <strong>Personnel Details: </strong>
                        ${PersonnelDetails}
                    </div>
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
        </div>`,
    });

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

export default async function NotifyReportSubmitted(reportData, incidentData){

    /** This comes from the report that was submitted; */
    const {
        MarketName,
        FacilityName,
        ReportType,
        EventTypeNumber,
        Date,
        Time,
        EventTypeCategory,
        EventTypeDescription,
        MarketId,
    } = reportData;

    const {
        Status,
        DCIRNumber,
        Id,
    } = incidentData;

    /** Since we might be under home, reports, or incidents tabs when creating our new report, we have to create the url for the email; */
    const url = new URL(location);
    url.hash = Title;
    url.searchParams.set('Id', Id);

    //FIXME: update to use email workflow list
    /** Send the notification email via the REST API; */
    // Since we are using the REST API we are getting the login names or email strings;
    const To = await getSendToEmails(MarketId);

    /** FIXME: Find a way to make att, purpose, instructions, executive summary, assistance requested dynamic; */
    const attn = [
        'DHA COS',
        'ADs',
        'DADs',
        'STRAT COMM',
        'MO-EASTERN',
        'HCO',
        'GFM',
        'OGC',
        'DHMS',
        'SAFETY',
    ];

    const purpose = 'For Information Only';
    const instructions = 'Please see below OPEN DCIR for information only.';
    const executive_summary = [
        'Statement of Incident: Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus, placeat dolor consequuntur voluptas eius molestias?',
        'Mission Impacet: Lorem ipsum dolor, sit amet consectetur adipisicing elit. In modi ducimus officia ea nostrum repellat.',
        'Corrective Action Required/Taken: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magnam, sed.',
        'DHA Assistance Requested: N/A',
    ];

    // const assistance_requested = 'N/A';
    const contact_sigiature_block = /*html*/`
    ${user.Title}<br>
    ${contact_title}<br>
    Defense Health Agency J-33<br>
    7700 Arlington Blvd<br>
    Falls Church VA 22042<br>
    Phone: ${contact_phone}<br>
    COVID-19: email@mail.com<br>
    OPS: email@mail.com<br>
    DCIR: email@mail.com<br>
    RFI: email@mail.com<br>
    SIPR: email@mail.com<br>
    Personal: ${user.Email}<br>`;

    /** FIXME: If this call is used to POST on the EmailNotification list, it requires a from value... right? */
    const email = new Email({
        To,
        // Subject: `${ReportType} Report submitted for ${Status} Incident: ${DCIRNumber}`,
        // TODO: Make sure INFO is dynamically set;
        Subject: `[INFO] [${Status}] Incident: ${DCIRNumber}`,
        Body: /*html*/`
        <div style="text-align: center;font-weight: bold;" data-header>
            <h2>DCIR Report Submission Notification</h2>
        </div>
        <hr>
        <br>
        <div data-content>
            <p>${ReportType === "Initial" ? 'An ' + ReportType : 'A ' + ReportType} Report has been submitted for ${Status} Incident: <strong>${DCIRNumber}</strong>.</p>
            <p>
                <div>
                    <strong><u>Quick Details</u></strong>
                </div>
                <div>
                    <strong>Market Name: </strong>${MarketName}
                    <strong>Facility Name: </strong>${FacilityName}
                </div>
                <div>
                    <strong>Date: </strong>${Date} 
                    <strong>Time: </strong>${Time}
                </div>
                <div>
                    <strong>Event Type Number: </strong>${EventTypeNumber}
                    <strong>Category: </strong>${EventTypeCategory}
                    <strong>Description: </strong>${EventTypeDescription}
                </div>
            </p>
            <br>
            <p>Please <u>click</u> on the link below to visit the DCIR Notification Portal to 
                ${ReportType === 'Initial' ? 'review and acknowledge the incident' : 'review the incident updates'}.
            </p>
            <div>
                <a href="${url.href}">${url.href}</a>
            </div>
        </div>`,
        Body: /*html*/`
        <div style="text-align: center;font-weight: bold;" data-header>
            <h2>DCIR Report Submission Notification</h2>
        </div>
        <hr>
        <br>
        <div data-content>
            <p>To whom it may concern,</p>
            <p>A new DCIR report has been entered into the DCIR Notification Portal. Use the link below to access this DCIR.</p>
            <br>
            <div>
                <span>URL: </span><a href="${url.href}">${url.href}</a>
            </div>
        </div>`,
        Body: /*html*/`<!-- Template Email -->
        <div style="text-align: center;font-weight: bold;" data-header>
            <h2>DCIR Report Submission Notification</h2>
        </div>
        <hr>
        <br>
        <div data-content>
            <p>Greetings Leaders,</p>
            <p><strong>ATTN:</strong> ${attn.join(',')}</p>
            <ol type="1">
                <li>
                    <p><strong>PURPOSE:</strong> ${purpose}</p>
                </li>
                <li>
                    <p><strong>INSTRUCTIONS:</strong> ${instructions}</p>
                </li>
                <li>
                    <p><strong>EXECUTIVE SUMMARY:</strong></p>
                    <ol type="a">${executive_summary.map(str => /*html*/`<li>${str}</li>`).join('')}</ol>
                </li>
                <li><strong>URL:</strong> <a href="${url.href}">${url.href}</a></li>
            </ol>
            <p>If you have any questions regarding this transmittal, or the information contained within, please contact the ${contact_title
            } via email at ${contact_email
            } or please call ${contact_phone
            }.</p>
            <div>${contact_sigiature_block}</div>
        </div>`,
    });

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