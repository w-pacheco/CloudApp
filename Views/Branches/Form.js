/**
 * Form.js
 * @description Branches Form
 * @author Wilfredo Pacheco
 */

import Form from "../../src/Classes/Form.js";
import Modal from "../../src/Classes/Modal.js";
import { List, table } from "./View.js"
import Post from "./Post.js";
import Patch from "./Patch.js";
import Delete from "../../src/Actions/Item.Delete.js";
import { DEVELOPER, User } from "../../app.js";
import AuthorsAndModifiers from "../../src/Classes/AuthorsAndModifiers.js";

export let modal;
export let form;

export default async function ShowForm(data){

    const isPointerEvent = data?.constructor?.name === 'PointerEvent';
    const Title = List.Title;
    const title = !isPointerEvent ? 
    `Edit ${Title}` : 
    `New ${Title}`;

    /** Modal Buttons; */
    const buttons = [];
    (data && !isPointerEvent) ? 
    buttons.push({
        tag: 'button',
        type: 'patch',
        classList: 'btn btn-success btn-sm',
        innerText: 'Save',
        attributes: [
            { name: 'src', value: data?.__metadata?.uri },
            { name: 'type', value: 'button' },
        ],
        events: [{ name: 'click', action: Patch }],
    }) : 
    buttons.push({
        tag: 'button',
        type: 'post',
        classList: 'btn btn-success btn-sm',
        innerText: 'Save',
        events: [{ name: 'click', action: Post }],
        attributes: [{ name: 'type', value: 'button' }],
        customProperties: [{
            prop: 'callback',
            value(){
                return callback();
            }
        }],
    });

    /** The toast handles an undo method based on the item deleted; */
    if (data 
    && !isPointerEvent) buttons.push({
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
    && !isPointerEvent 
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
        role: 'Developer',
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
        innerHTML: /*html*/`<!-- ${List.Title} Form -->
        <div class="row my-2">
            <div class="col-lg-6 col-md-12">
                <label for="inputBranch" class="form-label">Branch Name</label>
                <input type="text" name="Branch" class="form-control form-control-sm" id="inputBranch" required />
                <div class="invalid-feedback"></div>
            </div>
        </div>`,
    }).render();

    /** Set for values if data is passed; */
    if (data && data.constructor.name !== 'PointerEvent') form.Values.set(data);

    if (data && !isPointerEvent) new AuthorsAndModifiers({
        parent: modal.body,
        data,
    }).render();

    modal.show();
    form.Fields.focus();
}