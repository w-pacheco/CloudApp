/**
 * Form.js
 * @description Shows form element for the Users list.
 * @author Wilfredo Pacheco
 */

import Component from "../../Classes/Component.js";
import Form from "../../Classes/Form.js";
import Modal from "../../Classes/Modal.js";
import { List, table } from "./View.js"
import { Title as RolesListTitle } from '../Roles/List.js'
import UserSearch from "../../Classes/UserSearch.js";
import Hash from "../../Actions/Hash.js";
import Post from "./Post.js";
import Patch from "./Patch.js";
import Delete from "../../Actions/Item.Delete.js";
import AuthorsAndModifiers from "../../Classes/AuthorsAndModifiers.js";
import { DEVELOPER, service, user as User, web } from "../../Biome.js";

export let modal;
export let form;

export default async function ShowForm(data){

    const isEvent = data instanceof Event;
    const ClipboardIcon = document.getIcon('clipboard');
    const Title = List.Title;
    const title = data && !isEvent ? 
    `Edit ${Title}` : 
    `New ${Title}`;

    /** Modal Buttons; */
    const buttons = [];
    (data && !isEvent) ? 
    buttons.push({
        tag: 'button',
        type: 'patch',
        classList: 'btn btn-success btn-sm',
        innerText: 'Save',
        attributes: [{ name: 'src', value: data?.__metadata?.uri }],
        events: [{ name: 'click', action: Patch }],
    }) : 
    buttons.push({
        tag: 'button',
        type: 'post',
        classList: 'btn btn-success btn-sm',
        innerText: 'Save',
        events: [{ name: 'click', action: Post }],
    });

    if (data 
    && !isEvent) buttons.push({
        tag: 'button',
        type: 'delete',
        classList: 'btn btn-danger btn-sm',
        innerText: 'Delete',
        attributes: [
            { name: 'src', value: data?.__metadata.uri },
            { name: 'data-recycle', value: true },

            /** NOTE: If they item was set to recycle true, this would allow the undo method; */
            // { name: 'data-undo', value: true },

            /** NOTE: If they item was set to delete true, this would delete the item and bypass recycle; */
            // { name: 'data-delete', value: true },
        ],
        events: [{ name: 'click', action: Delete }],
        customProperties: [{
            prop: 'callback',
            value(){
                modal?.hide();
                table.watcher();
            },
        }],
    });

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
        classList: 'needs-validation',
        parent: modal.body,
        innerHTML: /*html*/`<!-- ${List.Title} Form -->
        <div class="row g-3">
            <!-- used to render search results in modal -->
            <style>
                ul.ui-menu.ui-widget.ui-widget-content { z-index:2147483647 !important; }
            </style>
            <!-- Seach Field -->
            <div class="col-lg-6 col-md-12">
                <label for="inputUsers" class="form-label">Active Directory Search</label>
                <input type="search" 
                       name="" 
                       class="form-control form-control-sm" 
                       id="inputUsers" 
                       placeholder="Search by name or email..." />
                <div class="py-2" id="inputUsers-display"></div>
            </div>
        </div>
        
        <div class="row g-3">
            <div class="col-lg-6 col-md-12"><!-- Display Name -->
                <label for="inputTitle" class="form-label">Display Title</label>
                <input type="text" 
                       name="DisplayText" 
                       class="form-control form-control-sm" 
                       id="inputTitle" 
                       placeholder="User Title" 
                       disabled />
            </div>
            <div class="col-lg-5 col-md-12"><!-- Hash Input -->
                <label for="inputHash" class="form-label">Hash</label>
                <input type="text" 
                        name="Hash" 
                        class="form-control form-control-sm" 
                        id="inputHash" 
                        placeholder="Hash" 
                        disabled />
            </div>
            <div class="col pt-4">
                <button type="button" 
                        class="btn btn-sm btn-outline-primary mt-2 d-flex justify-content-center p-2" 
                        data-copy="inputHash">${
                    ClipboardIcon.outerHTML
                }</button>
            </div>
        </div>
        
        <div class="row g-3">
            <div class="col-lg-4 col-md-12"><!-- Email Input -->
                <label for="inputEmail" class="form-label">Email</label>
                <input type="email" 
                    name="Email" 
                    class="form-control form-control-sm" 
                    id="inputEmail" 
                    placeholder="User Email" 
                    disabled />
            </div>
            <div class="col-lg-4 col-md-12"><!-- Key Input -->
                <label for="inputKey" class="form-label">Key</label>
                <input type="text" 
                       name="Key" 
                       class="form-control form-control-sm" 
                       id="inputKey" 
                       placeholder="Key" 
                       disabled />
            </div>
            <div class="col-lg-4 col-md-12"><!-- Role Select -->
                <label for="inputRole" class="form-label">Role</label>
                <select class="form-select form-select-sm" id="inputRole" name="Role" required></select>
                <div class="invalid-feedback"></div>
                <div class="ml-1 float-right" id="role-spinner">
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Loading options...
                </div>
            </div>
        </div>
        
        <div class="row g-3" hidden>
            <div class="col-12">
                <label for="inputAccount" class="form-label">Account</label>
                <textarea name="Account" 
                          class="form-control" 
                          id="inputAccount" 
                          cols="30" 
                          rows="10" 
                          disabled
                ></textarea>
            </div>
        </div>`,
    }).render();

    /** NOTE: The following is specific to the Users list; */
    /** Select Role Options; */
    const RoleSelectEl = form.get('select[name="Role"]');
    await service.Get(web.getListDetails(RolesListTitle)?.__metadata.uri + '/Items')
    .then(data => data.d)
    .then(data => data.results)
    .then(data => {
        
        new Component({
            tag: 'option',
            attributes: [{ name: 'value', value: '' }],
            parent: RoleSelectEl,
            innerText: 'Choose...'
        }).render();

        data.forEach(option => {
            const { RoleTitle } = option;
            new Component({
                tag: 'option',
                attributes: [{ name: 'value', value: RoleTitle }],
                parent: RoleSelectEl,
                innerText: RoleTitle
            }).render();
        });

        $(form.querySelector('div#role-spinner')).fadeOut();
    })
    .catch(response => {
        console.info(response);
    });

    const UsersInput = form.querySelector('input[type="search"]');
    const UsersDisplay = form.querySelector('div#inputUsers-display');
    const UsersSearchManager = new UserSearch({

        type: 'user',
        modal: true,
        showDisplay: false,

        /** These are the elements used in the search; */
        input: UsersInput, 
        display: UsersDisplay,

        /** 
         * NOTE: 
         * Example of custom Active Directory search; 
         * This replaces the existing liAction method, exposing the values to set the form;
         */
        select(event, li){

            const user = li.item.data;
            user.Email = user.EntityData.Email;
            user.Hash = Hash(user.Key);
            user.Account = JSON.stringify(user);

            /** Set the form with the user data, and clear the input element; */
            form.Values.set(user);

            UsersSearchManager.clear();
            
        },

    });

    /** Set for values if data is passed; */
    if (data && !isEvent) form.Values.set(data);
    
    if (data && !isEvent) new AuthorsAndModifiers({
        parent: modal.body,
        data,
    }).render();

    form.Fields.focus();

    return modal.show();
}