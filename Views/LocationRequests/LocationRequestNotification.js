/**
 * FacilityRequestNotification.js
 * @author Wilfredo Pacheco
 */

import Email from "../../src/Classes/Email.js";
import Toast from "../../src/Classes/Toast.js";
import getUsersByRole from "../../src/Views/Users/getUsersByRole.js";
import { Title } from '../LocationRequests/List.js';

/*
To Test this method:

await NotifyAdminOfLocationRequest({
    Id: 1,
    DCIRNumber: 'DCIR 2023 - 001',
    MarketName: 'ALASKA',
    LocationName: 'DEVELOPER INSTALLATION',
})


This is what you would put on your post request;

if (!locationIsListed) NotifyAdminOfFacilityRequest(data);

*/

export default async function NotifyAdminOfLocationRequest(data){

    /** This comes from the report that was submitted; */
    const {
        Id,
        DCIRNumber,
        MarketName,
        LocationName,
    } = data;

    /** Since we might be under the reports tab, we have to create the url for the email; */
    const url = new URL(location);
    url.hash = Title;
    url.searchParams.set('Id', Id);

    /** Send the notification email via the REST API; */
    // Since we are using the REST API we are getting the login names;
    const To = await getUsersByRole('Developer')
    /** FIXME: This needs to be updated to administrator when deployed to production; */
    // await getUsersByRole('Administrator')
    .then(users => users.map(u => u.Key));

    /** FIXME: If this call is used to POST on the EmailNotification list, it requires a from value... right? */
    const email = new Email({
        To,
        Subject: 'DCIR Notification - Location Request',
        Body: /*html*/`
        <div style="text-align: center;font-weight: bold;" data-header>
            <h2>DCIR Location Request</h2>
        </div>
        <hr>
        <br>
        <div data-content>
            <p>The following location:</p>
            <div style="text-align: center;font-weight: bold;">
                <h3>${LocationName}</h3>
            </div>
            <p>has reported an incident (${DCIRNumber}). Currently <strong>${LocationName}</strong> 
                is not an option from the list of locations on the DCIR report form.</p>
            <p>The location: <strong>${LocationName}</strong> was reported to fall under the 
                <strong>${MarketName}</strong> Market. Please follow the link below to edit and/or approve this location 
                is listed correctly. Approving this request will update the locations list allowing others to select 
                this location for future reports. The title of the facility and market will also be updated on ${DCIRNumber}.
            </p>
            <br>
            <p>Please <u>click</u> on the link below to visit DCIR and review the facility request.</p>
            <br>
            <div>
                <a href="${url.href}">${url.href}</a>
            </div>
        </div>`,
    });

    // return console.info({ email });
    return email.send()
    .then(function(data, statusText, xhr){
        // console.info(data, statusText, xhr);
        if (xhr.status >= 200 && xhr.status < 300) new Toast({
            type: 'success',
            message: 'Success! A notification for the location request has been sent.',
            // parent: Layout.ToastContainer,
        })
        .render()
        .show();
    });

}