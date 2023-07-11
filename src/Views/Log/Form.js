/**
 * Form.js
 * @description Shows form element for the Log list.
 * @author Wilfredo Pacheco
 */

import { web, user as User, DEVELOPER } from "../../Biome.js";
import Component from "../../Classes/Component.js";
import Form from "../../Classes/Form.js";
import Modal from "../../Classes/Modal.js";
import { getErrorBySessionId } from "../Errors/View.js";
import { List, table } from "./View.js";
// import { Title as RolesListTitle } from '../Roles/List.js'
// import UserSearch from "../../Classes/UserSearch.js";
// import Hash from "../../Actions/Hash.js";
// import Post from "./Post.js";
// import Patch from "./Patch.js";
// import Delete from "../../Actions/Item.Delete.js";

export let modal;
export let form;

export default async function ShowForm(data){

    const isEvent = data instanceof Event;
    const ClipboardIcon = document.getIcon('clipboard');
    
    const { 
        Author, 
        SessionId,
        Message,
    } = data;

    const Title = List.Title;
    const title = Message.replace(web.Url, '');
    // ? 
    // `Edit ${Title}` : 
    // `New ${Title}`;


    /** Modal Buttons; */
    const buttons = [];
    // (data && !isEvent) ? 
    // buttons.push({
    //     tag: 'button',
    //     type: 'patch',
    //     classList: 'btn btn-success btn-sm',
    //     innerText: 'Save',
    //     attributes: [{ name: 'src', value: data?.__metadata?.uri }],
    //     // events: [{
    //     //     name: 'click',
    //     //     action: Patch,
    //     // }],
    // }) : 
    // buttons.push({
    //     tag: 'button',
    //     type: 'post',
    //     classList: 'btn btn-success btn-sm',
    //     innerText: 'Save',
    //     // events: [{
    //     //     name: 'click',
    //     //     action: Post,
    //     // }],
    // });

    // if (data 
    // && !isEvent) buttons.push({
    //     tag: 'button',
    //     type: 'delete',
    //     classList: 'btn btn-danger btn-sm',
    //     innerText: 'Delete',
    //     attributes: [
    //         { name: 'src', value: data?.__metadata.uri },
    //         { name: 'data-recycle', value: true },

    //         /** NOTE: If they item was set to recycle true, this would allow the undo method; */
    //         // { name: 'data-undo', value: true },

    //         /** NOTE: If they item was set to delete true, this would delete the item and bypass recycle; */
    //         // { name: 'data-delete', value: true },
    //     ],
    //     // events: [{ name: 'click', action: Delete }],
    //     customProperties: [{
    //         prop: 'callback',
    //         value(){
    //             modal?.hide();
    //             table.watcher();
    //         },
    //     }],
    // });

    /** Link to SharePoint list item; */
    if (data 
    && !isEvent 
    && User.hasRole(DEVELOPER)) buttons.push({
        tag: 'a',
        classList: 'btn btn-sm',
        attributes:  [
            { name: 'type', value: 'button' },
            { name: 'href', value: `${web.Url}/Lists/${List.Title}/DispForm.aspx?ID=${data.Id}` },
            { name: 'title', value: 'Visit SharePoint' },
            { name: 'target', value: '_blank' },
        ],
        innerHTML: /*html*/ `
        <div class="pt-1">
            <img style="width: 26px;" src="/_layouts/15/images/favicon.ico?rev=23">&#160;<span>View</span>
        </div>`,
        role: DEVELOPER,
    });

    modal = new Modal({
        title,
        draggable: true,
        size: 'modal-xl',
        buttons,
    }).render();

    form = new Form({
        classList: 'row g-3 needs-validation',
        classList: 'row needs-validation',
        parent: modal.body,
        innerHTML: /*html*/`<!-- Display Contianer -->
        <div>
            <b>Log By:</b> ${Author.Title}
        </div>
        <div>
            <b>View:</b> ${Message.replace(web.Url, '')}
        </div>
        <div>
            <b>Session Id:</b> ${SessionId}
        </div>
        <br>`,
    }).render();

    /** Add the errors for this session to the view; */
    getErrorBySessionId(SessionId)
    .then(data => {
        if (data.length)
        {
            const tableContainer = new Component({
                tag: 'div',
                classList: 'mt-4 px-3',
                parent: form,
                innerHTML: /*html*/`
                <table class="table table-sm hover f-12">
                    <thead>
                        <tr>
                            <th>View</th>
                            <th>Error</th>
                            <th>Description</th>
                            <th>Submitted</th>
                            <th>Line</th>
                            <th>Script</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>`,
            }).render();

            /** Iterate over the errors for this session id & list them in the table; */
            data
            .forEach(error => {
                const {
                    Created,
                    ErrorType,
                    ErrorMessage,
                    LocationHash,
                    FileUrl,
                    Line,
                } = error;
                return new Component({
                    tag: 'tr',
                    parent: tableContainer.get('tbody'),
                    innerHTML: /*html*/`
                    <td>${LocationHash || ''}</td>
                    <td>${ErrorType}</td>
                    <td>${ErrorMessage}</td>
                    <td>${new Date(Created).toLocaleString()}</td>
                    <td>${Line || ''}</td>
                    <td>
                        <a href="${FileUrl}" target="_blank">${FileUrl?.replace(web.Url, '') || ''}</a>
                    </td>`,
                }).render();
            });
        }
    });

    /** Set for values if data is passed; */
    if (data && !isEvent) form.Values.set(data);
    
    form.Fields.focus();

    return modal.show();
}