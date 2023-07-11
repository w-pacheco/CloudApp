/**
 * Email.js
 * @author Wilfredo Pacheco
 */

import { service, web, name as biome, emailservice, ext } from "../Biome.js";
import { Title } from "../Schema/EmailNotifications.js";

const SPUtilities = '/_api/SP.Utilities.Utility.SendEmail';
const clientSVC = '/_vti_bin/client.svc/sp.utilities.utility.SendEmail';
const metadata = { type: 'SP.Utilities.EmailProperties' };

export default class Email {

    constructor(arg){

        const {
            To,
            CC,
            BCC,
            From,
            Subject,
            Body,
        } = arg;

        /** Array of LoginNames(SiteUser) or Keys (Active Directory), but also accepts email strings; */
        this.To = { results: To };
        this.CC = { results: CC };
        this.BCC = { results: BCC };

        /** Sender Email String (if not set, it will be set by the system); */
        this.From = From;

        /** String; */
        this.Subject = Subject;

        /** String (accepts HTML strings); */
        this.Body = Body;
        this.__metadata = metadata;

    }

    get(){
        
        const {
            To,
            CC,
            BCC,
            From,
            Subject,
            Body,
            __metadata,
        } = this;

        const request = {
            To,
            From,
            Subject,
            Body,
            __metadata,
        }

        if (From?.results?.length) Object.assign(request, {
            From,
        });

        if (CC?.results?.length) Object.assign(request, {
            CC,
        });

        if (BCC?.results?.length) Object.assign(request, {
            BCC,
        });

        return request;
    }

    preview(event){

        const email = this.get();
        const newWindow = window.open(`${web.Url}/src/pages/document.${ext}`);

        newWindow.document.write(/*html*/`
        <style>
            div[data-display]{
                width: 100%;
                padding-right: calc(var(--bs-gutter-x) * 0.5);
                padding-left: calc(var(--bs-gutter-x) * 0.5);
                margin-right: auto;
                margin-left: auto;
            }
        </style>
        <div data-display>
            <div hidden><strong>To:</strong> ${email.To.results}</div>
            <br>
            <div><strong>Subject:</strong> ${email.Subject}</div>
            <br>
            <div><strong>Body:</strong> ${email.Body}</div>
        </div>`);

    }

    send(event){

        if (!web || !service) throw new Error(`${
            biome
        } | resources have not been set! They are set by using the .setResources method.`);

        if (emailservice === 'default') return this.sendViaRESTAPI(event);
        else if (emailservice === 'workflow') return this.sendViaWorkflow(event);

    }

    /** 
     * sendViaRESTAPI
     * @description Method used to send emails via the Microsoft SharePoint REST API
     * @author Wilfredo Pacheco
     * 
     * NOTE: 
     * The following locations hold the service needed to run this method;
     * Both have been tested successfully;
     * 
     * /_vti_bin/client.svc/sp.utilities.utility.SendEmail
     * /_api/SP.Utilities.Utility.SendEmail
     */

    sendViaRESTAPI(event){

        if (!web || !service) throw new Error(`${
            biome
        } | resources have not been set! They are set by using the .setResources method.`);

        const email = this.get();
        const url = web.Url + clientSVC;
        const request = { properties: email };

        return service.post(url, request)
        .fail(error => console.info(error));

    }

    /**
     * sendViaWorkflow
     * @description Method used to send emails via the a Microsoft workflow for the EmailNotifications list
     * @returns SharePoint REST API call to the EmailNotifications list
     */
    sendViaWorkflow(event){

        // NOTE: This method requires the email strings to be joined (ex: '; ')

        /** TODO: 
         * - Make sure there is a workflow set for this list;
         * - get the list title for this post request;
         */

        const list = web.getListDetails(Title);
        const url = `${list.__metadata.uri}/Items`;
        const type = list.ListItemEntityTypeFullName;

        if (!list.WorkflowAssociations.results.length)
        {
            /** FIXME: This needs to create a link to the directions for creating this workflow; */
            // console.info(`For directions creating the workflow required, follow this link:`)
            throw new Error(`${
                biome
            } | Please make sure the workflow for the EmailNotifications list has been created!`);
        }

        const {
            To,
            From,
            Subject,
            Body,
            CC,
        } = this.get();

        const request = {

            /** This is required to be an array of email strings; */
            SendTo: To.results.join('; '),

            /** These are HTML strings; */
            Subject,
            Body,

            /** metadata type of the EmailNotifications list; */
            __metadata: { type },

        };

        if (CC?.results?.length) Object.assign(request, {
            CC: CC.results.join('; '),
        });

        return service.post(url, request)
        .fail(error => console.info(error));
    }

}

window.Email = Email;