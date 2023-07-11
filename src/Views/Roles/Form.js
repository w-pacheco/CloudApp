/**
 * Form.js
 * @description Shows form element for the Roles list.
 * @author Wilfredo Pacheco
 */

import Form from "../../Classes/Form.js";
import Modal from "../../Classes/Modal.js";
import { user as User, DEVELOPER } from "../../Biome.js";
import { List, table } from "./View.js"
import Post from "./Post.js";
import Patch from "./Patch.js";
import Delete from "../../Actions/Item.Delete.js";
import AuthorsAndModifiers from "../../Classes/AuthorsAndModifiers.js";

export let modal;
export let form;

export default async function ShowForm(data){

    const isEvent = data instanceof Event;
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

    /** TODO: Make the toast handle an undo method based on the item deleted; */
    if (data 
    && !isEvent) buttons.push({
        tag: 'button',
        type: 'delete',
        classList: 'btn btn-danger btn-sm',
        innerText: 'Delete',
        attributes: [
            { name: 'src', value: data?.__metadata.uri },
            { name: 'data-recycle', value: true },
            { name: 'data-undo', value: true },
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
            { name: 'href', value: `${Web.Url}/Lists/${List.Title}/DispForm.aspx?ID=${data.Id}` },
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
        <div class="row g-3 my-2">
            <div class="col-lg-6 col-md-12">
                <label for="inputUsers" class="form-label">Role</label>
                <input type="text" 
                       name="RoleTitle" 
                       class="form-control form-control-sm"                        
                       id="inputRole" required />
                <div class="invalid-feedback"></div>
            </div>
        </div>
        <div class="row g-3 my-2">
            <div class="col-12">
                <label for="inputDescription" class="form-label">Description</label>
                <textarea name="Description" 
                    class="form-control form-control-sm" 
                    id="inputDescription"></textarea>
                <div class="invalid-feedback"></div>
            </div>
        </div>`,
        innerHTML: /*html*/`<!-- ${List.Title} Form -->
        <div class="row g-3 my-2">
            <div class="col-lg-6 col-md-12">
                <label for="inputUsers" class="form-label">Role</label>
                <input type="text" 
                       name="RoleTitle" 
                       class="form-control form-control-sm" 

                       pattern="(?!User$).*" 
                       data-invalid-custom="The entered value already exists on this list, please enter a different value"
                       
                       id="inputRole" required />
                <div class="invalid-feedback"></div>
            </div>
        </div>
        <div class="row g-3 my-2">
            <div class="col-12">
                <label for="inputDescription" class="form-label">Description</label>
                <textarea name="Description" 
                          cols="30" 
                          rows="10"
                          class="form-control form-control-sm" 
                          id="inputDescription"></textarea>
                <div class="invalid-feedback"></div>
            </div>
        </div>`,
    }).render();

    /** Set for values if data is passed; */
    if (data && !isEvent) form.Values.set(data);

    if (data && !isEvent) new AuthorsAndModifiers({
        parent: modal.body,
        data,
    }).render();
    
    form.Fields.focus();

    return modal.show();
}