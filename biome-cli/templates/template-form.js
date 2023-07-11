/**
 * Form.js
 * @description <<TITLE>> Form
 */

import { DEVELOPER, user as User } from "../../src/Biome.js";
import Form from "../../src/Classes/Form.js";
import Modal from "../../src/Classes/Modal.js";
import { List, table } from "./View.js"
import Post from "./Post.js";
import Patch from "./Patch.js";
import Delete from "../../src/Actions/Item.Delete.js";
import AuthorsAndModifiers from "../../src/Classes/AuthorsAndModifiers.js";

export let modal;
export let form;

export default async function ShowForm(data){

    const isEvent = data instanceof Event;
    const Title = List.Title;
    const title = !isEvent ?
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
        customProperties: [{
            prop: 'callback',
            value() {
                return callback();
            }
        }],
    });

    /** The toast handles an undo method based on the item deleted; */
    if (data
    && !isEvent
    && User.hasRole(DEVELOPER)) buttons.push({
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
            value() {
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
        attributes: [
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
        classList: 'needs-validation',
        parent: modal.body,
        innerHTML: /*html*/`<!-- ${List.Title} Form -->
        <div class="row g-3 my-2">
            <div class="col-xl-5 col-lg-6 col-sm-12">
                <label for="input<<TITLE>>Title" class="form-label"><<TITLE>> Title</label>
                <input type="text" name="<<TITLE>>Title" class="form-control form-control-sm" id="input<<TITLE>>Title" required />
                <div class="invalid-feedback"></div>
            </div>
        </div>
        <div class="row g-3 my-2">
            <div class="col-lg-12">
                <label for="inputDescription" class="form-label">Description</label>
                <textarea class="form-control" rows="4" id="inputDescription" name="Description" required></textarea>
            </div>
        </div>`,
    }).render();

    /** Set for values if data is passed; */
    if (data && !isEvent) form.Values.set(data);

    if (data && !isEvent) new AuthorsAndModifiers({
        parent: modal.body,
        data,
    }).render();

    modal.show();
    form.Fields.focus();
}