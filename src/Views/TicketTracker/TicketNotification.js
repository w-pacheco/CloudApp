/**
 * TicketNotification.js
 * @author Wilfredo Pacheco
 */

import { DEVELOPER, service, web } from "../../Biome.js";
import Email from "../../Classes/Email.js"
import Toast from "../../Classes/Toast.js";
import getUsersByRole from "../../Views/Users/getUsersByRole.js";
import { Title } from "./List.js";

// export function getMarketEmailsById(id){
//     const list = web.getListDetails(LocationsTitle);
//     return service.Get(`${list.__metadata.uri}/items(${id})`)
//     .then(data => data.d);
// }

function getSendToEmails(marketId){
    return Promise.all([

        /** FIXME: This is for testing and internal UAT ONLY and should be update to admin for production; */
        // getUsersByRole(ADMINISTRATOR).then(users => users.map(u => u.Email)),
        getUsersByRole(DEVELOPER).then(users => users.map(u => u.Email)),

        // getMarketEmailsById(marketId)
        // .then(market => market.EmailAddresses)
        // .then(arrayString => {
        //     if (arrayString) return JSON.parse(arrayString)
        //     else return [];
        // })
        // .then(emailArray => {
        //     /** FIXME: This is for testing only and should be updated for production; */
        //     console.info(emailArray);
        //     return ["wilfredo.pacheco@saic.com", "logan.a.bunker@saic.com"];
        // }),

    ])
    .then(function(emails){
        /** Prevent duplicate emails strings from showing up; */
        return Array.from(new Set(emails.flat()));
    });
}

export default async function NotifyTicketSubmitted(ticketData){

    /** This comes from the tickett that was submitted; */
    const {
        TicketTitle,
        Description,
        Priority,
        Id,
    } = ticketData

    //FIXME: url seems to not format after switch to sp-rest-proxy
    const url = new URL(location);
    url.hash = Title;
    url.searchParams.set('Id', Id);

    /** Send the notification email via the REST API; */
    // Since we are using the REST API we are getting the login names or email strings;
    const To = await getSendToEmails();

    /** FIXME: If this call is used to POST on the EmailNotification list, it requires a from value... right? */
    const email = new Email({
        To,
        Subject: `Ticket Submitted for DCIR Tool`,
        Body: /*html*/`
            <div style="text-align: center;font-weight: bold;" data-header>
                <h2>DCIR Ticket Submission Notification</h2>
            </div>
            <hr>
            <br>
            <div data-content>
                <p>A new ticket has been entered into the DCIR Notification Portal.</p>
                <p>Title: ${TicketTitle}</p>
                <p>Priority: ${Priority}</p>
                <p>Description: ${Description}</p>
                <p>Use the link below to access this ticket.</p>
                <br>
                <div>
                    <span>URL: </span><a href="${url.href}">${url.href}</a>
                </div>
            </div>`,
    });

    return email.send()
    .then(function(data, statusText, xhr){
        if (xhr.status >= 200 && xhr.status < 300) new Toast({
            type: 'success',
            message: `Success! Notifications for your submitted ticket have been sent to the DCIR Developers.`,
            // parent: Layout.ToastContainer,
        })
        .render()
        .show();
    });

}