/** 
 * Post.logic.js
 * @author Wilfredo Pacheco
 */

import Toast from '../../src/Classes/Toast.js';
import { createDOCAcknowledgement, createMarketAcknowledgement } from '../Acknowledgements/setAcknowledgements.js';
import { Title as IncidentsTitle } from '../Incidents/List.js';

/** Resources used to run form logic; */
// export let Web;
// export let Route;
// export let form;
// export let modal;
// export let store;

// export function setResources(arg){
//     Web = arg.Web;
//     Route = arg.Route;
//     form = arg.form;
//     modal = arg.modal;
//     store = arg.store;
// }

export function CreateDCIRNumber(date, ID){
    if (ID <= 999) return `DCIR ${date.split('-')[0]} - ${(ID / 1000).toFixed(3).split('.')[1]}`;
    else return `DCIR ${date.split('-')[0]} - ${ID}`;
}

export function Acknowledgement(title, timestamp, user){
    this.title = title || null;
    this.timestamp = timestamp || null;
    this.user = user || null;
    return this;
}

export function CreateIncident({ request, Route, IncidentList }){
    return Route.Post(`${IncidentList.__metadata.uri}/Items`, request)
    .then(data => data.d);
}

export function UpdateIncident({ url, request, Route }){
    return Route.Patch(url, request);
}

export function getPersonnelRowElements(form){

    const PersonnelInvolved = [];
    const PersonnelRowElements = Array.from(form.get(`div[data-personnel-container]`).querySelectorAll(`div.row`));
    
    if (PersonnelRowElements.length) PersonnelRowElements.forEach(row => {
            
        const obj = {};
        
        Array.from(row.querySelectorAll(`[data-personnel]`))
        .map(el => {
            const name = el.getAttribute('name');
            const value = el.value;
            obj[name] = value;
        });

        PersonnelInvolved.push(obj);

    });

    return PersonnelInvolved;

}

export function createReportsPOSTRequest(List, form){

    const { ListItemEntityTypeFullName } = List;

    const request = form.Values.get();      // This is the Reports request Object;
    request.__metadata = {
        type: ListItemEntityTypeFullName,
    }

    /** Handle Personnel Involved; */
    const PersonnelInvolved = getPersonnelRowElements(form);

    /** Reassign personel involved; */
    request.PersonnelInvolved = JSON.stringify(PersonnelInvolved, null, 2);

    /** Set the Status of the report; */
    request.Status = 'Submitted';

    /** Set the date of the report; */
    request.Date = request.Date.split('T')[0];

    /** Handle fields that don't really exist on the Reports list; */
    delete request.Service;
    delete request.Component;
    delete request.Rank;
    delete request.Grade;
    delete request.PersonnelDetails;

    return request;

}

// Should this be exported and called over in Patch to handle Draft items when they get submitted?
export async function CreateUpdateIncident({ request, Web, Route, Layout }){

    const IncidentList = Web.getListDetails(IncidentsTitle);

    /** Handle Incident list items; */
    let incidentUrl = `${IncidentList.__metadata.uri}/Items`;

    /** FIXME: This needs to be reviewed, request might get new fields and might break here with this logic; */
    const incidentRequest = Object.assign({}, request);

    // Report and Incident statuses are set separately from each other, we do not want to mark any Incidents 'Submitted' by accident
    delete incidentRequest.Status;
    delete incidentRequest.__metadata;

    Object.assign(incidentRequest, {
        __metadata: {
            type: IncidentList.ListItemEntityTypeFullName,
        },
    });
    
    let returnData;

    /* TODO: 
    
    Keep track of the event type:
    
        How are event type (matrix) notifications sent? 
            Create 'a' tag elements used to create an outlook template for the user with the information of the report.

        Where in the logic would we create the matrix acknowledgement list items?
            Should we automate it or is that an admin interaction step?

        What happens when the event type is changed when the report is a corrective?
            There are no business rules currently that prevent them from changing them on a follow-up report.

        What do we do if a change is made for the event type on a report?
            Option 1: Alert the user of the change, delete the old acknowledgement list items, then create new ones.
            Option 2: Create new Acknowledgement items and have all of them listed.

    */

    // Create a new Incident item when an Initial Report is submitted
    if (request.ReportType === 'Initial')
    {
        incidentRequest.Status = 'New';

        // These values should be stringified and saved to the request, they should get referenced again when the form renders
        // This object is what is going to get saved in the MarketAcknowledgement column
        // incidentRequest.MarketAcknowledgement = JSON.stringify(new Acknowledgement(request.MarketName));
        
        // This object is what is going to get saved in the DOCAcknowledgement column
        // incidentRequest.DOCAcknowledgement = JSON.stringify(new Acknowledgement('DHA Operations Center'));
        
        /** Create an incident; */
        const newIncident = await CreateIncident({
            request: incidentRequest, 
            Route,
            IncidentList,
        });

        /** Create a DCIR number based on the incident list Id; */
        const DCIRNumber = CreateDCIRNumber(newIncident.Date, newIncident.Id);

        createMarketAcknowledgement({
            group: request.MarketName,
            DCIR: DCIRNumber,
            EventTypeId: request.EventTypeId,
        });

        createDOCAcknowledgement({
            group: 'DHA Operations Center',
            DCIR: DCIRNumber,
            EventTypeId: request.EventTypeId,
        });

        /** TODO: Create Office matrix acknowledgements; */

        /** Update the incident list item; */
        await UpdateIncident({
            url: newIncident.__metadata.uri, 
            request: {
                DCIRNumber,
                __metadata: {
                    type: newIncident.__metadata.type,
                },
            },
            Route,
        });


        /** After a successful incident update, we need to set the returnData value; */
        returnData = Object.assign(newIncident, {
            DCIRNumber,
        });

        /** Alert; */
        new Toast({
            type: 'success',
            message: `Success! ${DCIRNumber} has been created in the portal.`,
            parent: Layout.ToastContainer,
        })
        .render()
        .show();

    }

    /** Handle Follow Up, Corrective, or Final Report; */
    else if (!!request.ReportType)
    {
        // TODO: When creating a Follow Up, Corrective, or Final Report, we need to Patch our Incident item.
        // need to update the incidentURL to specifically target our existing Incident
        
        let existingIncident = await Route.Get(incidentUrl, {
            $filter: `DCIRNumber eq '${request.DCIRNumber}'`,
        }).then(data => data.d.results[0]);

        let { Id, Status, DCIRNumber, } = existingIncident;

        UpdateIncident({
            url: existingIncident.__metadata.uri, 
            request: incidentRequest,
            Route,
        });

        /** Handle notification emails; */
        returnData = Object.assign(incidentRequest, {
            Id,
            Status,
            DCIRNumber,
        });

    }

    return returnData;

}

export async function createIncidentItemAndReportPOSTRequest({
    List,
    form,
    Web,
    Route,
    Layout,
}){

    const request = createReportsPOSTRequest(List, form);
    let incidentData = await CreateUpdateIncident({
        request,
        Web,
        Route,
        Layout,
    });

    request.DCIRNumber = incidentData.DCIRNumber;

    return {
        request,
        incidentData,
    };

}