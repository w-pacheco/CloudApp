/**
 * Form.js
 * @description Offices Form
 * @author Wilfredo Pacheco
 */

import Form from "../../src/Classes/Form.js";
import Modal from "../../src/Classes/Modal.js";
import { List, table } from "./View.js"
import Post from "./Post.js";
import Patch from "./Patch.js";
import Delete from "../../src/Actions/Item.Delete.js";
import { User } from "../../app.js";
import AuthorsAndModifiers from "../../src/Classes/AuthorsAndModifiers.js";
import EmailWidget from "../../Components/EmailWidget.js";

export let modal;
export let form;

export default async function ShowForm(data) {

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
            attributes: [{ name: 'src', value: data?.__metadata?.uri }],
            events: [{
                name: 'click',
                action: Patch,
            }],
        }) :
        buttons.push({
            tag: 'button',
            type: 'post',
            classList: 'btn btn-success btn-sm',
            innerText: 'Save',
            events: [{
                name: 'click',
                action: Post,
            }],
            customProperties: [{
                prop: 'callback',
                value() {
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
                value() {
                    modal?.hide();
                    table.watcher();
                },
            }],
        });

    /** Link to SharePoint list item; */
    if (data
        && !isPointerEvent
        && User.hasRole('Developer')) buttons.push({
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
        classList: 'row needs-validation',
        parent: modal.body,
        innerHTML: /*html*/`<!-- ${List.Title} Form -->
        <div class="row my-2">
            <div class="col-lg-6 col-md-12">
                <label for="inputOfficeName" class="form-label">Office Name</label>
                <input type="text" name="OfficeName" class="form-control form-control-sm" id="inputOfficeName" required />
                <div class="invalid-feedback"></div>
            </div>
        </div>
        <div class="row my-2" hidden>  
            <div class="col-lg-12">
                <p class="form-label">Email Addresses<small class="text-muted"></small></p>
                <textarea class="border rounded form-control" rows="2" id="inputEmails" name="Emails"></textarea>
            </div>
        </div>`,
    }).render();

    /** Set for values if data is passed; */
    if (data && data.constructor.name !== 'PointerEvent') form.Values.set(data);

    new EmailWidget({
        view: {
            tag: 'table',
            classList: 'table table-sm mt-3',
            parent: modal.body,
            innerHTML: /*html*/`
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Remove</th>
                    </tr>
                </thead>
                <tbody></tbody>`,
        },
        form: {
            classList: 'g-3 needs-validation mt-4',
            parent: modal.body,
            innerHTML: /*html*/`<!-- Form -->
            <div class="row my-2">
                <div class="col-lg-5 pe-0">
                    <label for="inputEmail" class="form-label">Notification Emails</label>
                    <input type="email" name="Email" class="form-control form-control-sm" id="inputEmail" />
                    <div class="invalid-feedback"></div>
                </div>
                <div class="col mt-4 pt-2 px-0">
                    <button data-add type="button" class="btn btn-sm btn-success mx-2">Add</button>
                </div>
            </div>`,
        },
        action_element: 'button[data-add]',
        source: form.get('textarea[name="Emails"]'),
        question: 'Are you sure you want to remove this email address?',
    }).render();

    if (data && !isPointerEvent) new AuthorsAndModifiers({
        parent: modal.body,
        data,
    }).render();

    modal.show();
    form.Fields.focus();
}