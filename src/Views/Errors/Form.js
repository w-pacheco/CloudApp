/**
 * Form.js
 * @description Shows form element for the Errors list.
 * @author Wilfredo Pacheco
 */

import { web, user as User, DEVELOPER } from "../../Biome.js";
import Form from "../../Classes/Form.js";
import Modal from "../../Classes/Modal.js";
import { List, table } from "./View.js"
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
        ErrorType, 
        Author, 
        Line, 
        Column, 
        ErrorMessage, 
        FileUrl, 
        SessionId,
        Created,
    } = data;

    const Title = List.Title;
    const title = ErrorType;
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
        classList: 'g-3 needs-validation',
        parent: modal.body,
        innerHTML: /*html*/`<!-- Display Contianer -->
        <div>
            <b>Reported By:</b>&#160;${Author.Title}
        </div>
        <div>
            <b>Date Reported:</b>&#160;${new Date(Created).toLocaleString()}
        </div>
        <div class="d-none">
            <input class="d-none" value="${SessionId}" id="inputSessionId" hidden />
        </div>
        <div class="d-flex flex-row">
            <div><b>Session Id:</b>&#160;${SessionId}</div>
            <div>
                <button type="button" 
                        class="btn btn-sm d-flex justify-content-center px-2" 
                        data-copy="inputSessionId">${
                    ClipboardIcon.outerHTML
                }</button>
            </div>
        </div>

        <div ${Line ? '' : 'hidden'}>
            <b>Line:</b>&#160;${Line}
        </div>

        <div ${Column ? '' : 'hidden'}>
            <b>Column:</b>&#160;${Column}
        </div>

        <div>
            <b>Message:</b>&#160;${ErrorMessage}
        </div>

        <div ${FileUrl ? '' : 'hidden'}>
            <a href="${FileUrl}" target="_blank">${FileUrl}</a>
        </div>`,
    }).render();

    /** Set for values if data is passed; */
    if (data && !isEvent) form.Values.set(data);

    form.Fields.focus();

    return modal.show();
}