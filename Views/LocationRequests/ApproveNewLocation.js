/**
 * ApproveNewLocation.js
 * @author Wilfredo Pacheco
 */

import { Route, Web } from "../../app.js";
import { Title as LocationsListTitle } from '../Locations/List.js';
import { form, modal } from "../LocationRequests/Form.js";
import { table } from "../LocationRequests/View.js";
import { getReportsByDCIR } from "../Reports/View.js";

/** FIXME: This should be moved to the view.js or a stand alone javascript file; */
export function getIncidentsByDCIRNumber(dcir){
    const list = Web.getListDetails('Incidents');
    return Route.Get(`${list.__metadata.uri}/Items`, {
        $select: '*',
        $filter: `DCIRNumber eq '${dcir}'`,
    })
    .then(data => data.d)
    .then(data => data.results);
}

async function updateDCIRLocationDetails(DCIRNumber, newLocation, MarketName){

    const {
        Id,
        LocationName,
    } = newLocation;

    const [
        reports,
        incidents,
    ] = await Promise.all([
        
        /** Get all the reports for the facility request; */
        getReportsByDCIR(DCIRNumber),

        /** Get all the incidents with that DCIRNumber; */
        getIncidentsByDCIRNumber(DCIRNumber),

    ]);

    let count = 0;
    const total = reports.length + incidents.length;

    /** PATCH the new values to the reports; */
    for (const report of reports)
    {
        count++;
        const { uri, type } = report.__metadata;
        console.info(`${count} of ${total}`);
        await Route.Patch(uri, {
            MarketName,
            FacilityId: Id.toString(),
            FacilityName: LocationName,
            // AssignedMarket,
            __metadata: { type },
        });
    }
    
    /** Get the Incident and update the facility and/or market title; */
    /** PATCH the new values to the incidents; */
    for (const incident of incidents)
    {
        count++;
        const { uri, type } = incident.__metadata;
        console.info(`${count} of ${total}`);
        await Route.Patch(uri, {
            MarketName: MarketName,
            // FacilityId: Id.toString(),
            FacilityName: LocationName,
            // AssignedMarket,
            __metadata: { type },
        });
    }

}

export default async function ApproveLocation(event){

    const Element = event.target.tagName === 'BUTTON' ? 
    event.target : 
    event.target.closest('button');

    if (!form.Fields.validate()) return;

    $(Element)
    .attr('disabled', '') /** Disable button; */
    .html(/*html*/`<!-- Spinner Element -->
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true">
    </span> Sending Request...`);
    
    const request = form.Values.get();

    /** Get the values from the form; */
    const {
        DCIRNumber,
        AssignedMarket,
        MarketName,
        LocationName,
        LocationType,
        DisplayOnForm,
    } = form.Values.get();

    const ItemURL = Element.getAttribute('src');                    // Used to delete the item;
    const LocationsList = Web.getListDetails(LocationsListTitle);   // Used to create the new item on the facilities list;
    // const ReqDigest = await Route.GetRequestDigest();               // Used to send every POST/PATCH/DELETE request;

    /** FIXME: We need to check the name of the location and make sure it does not exist already on the Locations list; */
    console.info(`Making sure a list item doesn't exist for ${MarketName}/${LocationName} in Locations...`);
    // TODO: return an error here if a result is found;

    /** Create an item for this request on the locations list; */
    console.info(`Creating location item for ${MarketName}/${LocationName}...`);
    const newLocation = await Route.Post(`${LocationsList.__metadata.uri}/Items`, {
        AssignedMarket,
        // MarketName,
        LocationName,
        DisplayOnForm,
        LocationType,
        __metadata: {
            type: LocationsList.ListItemEntityTypeFullName,
        },
    })
    .then(data => data.d);

    if (!!request?.DCIRNumber)
    {
        console.info(`Starting Updates for Incidents and reports with ${request?.DCIRNumber}...`);
        await updateDCIRLocationDetails(DCIRNumber, newLocation, MarketName);
        console.info(`Updates for ${request?.DCIRNumber} complete!`);
    }

    /** Delete this item; */
    console.info(`Removing Location Request (${ItemURL}) item from list...`);
    return Route.Recycle(ItemURL)
    .then(data => {
        
        $(Element).text('Success!');
    
        modal.hide();
    
        table?.watcher();
        // console.info(ItemURL, ReqDigest);
        /** TODO: Create a notification toast; */
    });

}