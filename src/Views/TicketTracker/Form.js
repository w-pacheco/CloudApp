/**
 * Form.js
 * @description Shows form element for the TicketTracker list.
 * @author Wilfredo Pacheco
 */

import Form from "../../Classes/Form.js";
import Modal from "../../Classes/Modal.js";
import { List, table } from "./View.js"
import Post from "./Post.js";
import Patch from "./Patch.js";
import Delete from "../../Actions/Item.Delete.js";
import CommentSection from "../../Classes/CommentSection.js";
import AuthorsAndModifiers from "../../Classes/AuthorsAndModifiers.js";
import { user as User, DEVELOPER } from "../../Biome.js";

export let modal;
export let form;

export default async function ShowForm(data) {

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

    /** The toast handles an undo method based on the item deleted; */
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
        innerHTML: /*html*/`<!-- ${Title} Form -->

        <div class="col-lg-6 col-md-12">
            <label for="inputTicketTitle" class="form-label">Title</label>
            <input type="text" 
                   class="form-control form-control-sm" 
                   name="TicketTitle" 
                   id="inputTicketTitle" 
                   placeholder="Title" />
        </div>

        <div class="row my-2">
            <div class="col-4">
                <label for="inputStatus" class="form-label">Status</label>
                <select class="form-select form-select-sm" id="inputStatus" name="Status" required disabled>
                    <option value="Submitted">Submitted</option>
                    <option value="Awaiting Feedback">Awaiting Feedback</option>
                    <option value="On Hold">On Hold</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Complete">Complete</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
                <div class="invalid-feedback f12"></div>
            </div>
            <div class="col-4" hidden>
                <label for="inputClassification" class="form-label">Classification</label>
                <select id="inputClassification" name="Classification" class="form-select form-select-sm">
                <option value='Home'>Home</option>
                    <option value='Reports'>Reports</option>
                    <option value='Incidents'>Incidents</option>
                    <option value='Administration'>Administration</option>
                    <option value="New Feature">New Feature</option>
                    <option value="Permissions">Permissions</option>
                    <option value="Training">Training</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div class="col-4">
                <label for="inputPriority" class="form-label">Priority</label>
                <select id="inputPriority" name="Priority" class="form-select form-select-sm">
                    <option value='Low'>Low</option>
                    <option value='Normal'>Normal</option>
                    <option value='Critical'>Critical</option>
                </select>
                <div class="invalid-feedback"></div>
            </div>
        </div>

        <div class="col-12">
            <div class="">
                <label for="inputDescription" class="form-label">Description</label>
                <textarea name="Description" 
                        class="form-control" 
                        id="inputDescription" 
                        cols="30" 
                        rows="10" 
                        placeholder="Please include a detailed description of the issue. List the date and time when the issue happened, which user(s) are experiencing the issue, and the portion of the tool or step in the process where the issue occurred." 
                ></textarea>
            </div>
        </div>
        
        <div class="col-12" hidden>
            <div class="w-100">
                <label for="inputNotes" class="form-label">Developer Notes</label>
                <div name="Notes" 
                     contenteditable="true"
                     class="form-control" 
                     id="inputNotes" 
                     rows="3" 
                ></div>
            </div>
        </div>
        <div class="col-4" hidden>
            <label for="inputCompletedDate" class="form-label">Completed Date</label>
            <input type="date" 
                name="CompletedDate" 
                class="form-control form-control-sm" 
                id="inputCompletedDate" />
            <div class="invalid-feedback"></div>
        </div>
        <div class="col-4" hidden>
            <label for="inputLOE" class="form-label">Level of Effort <span class='text-muted'>(Hours)</span></label>
            <input type="number" name="LOE" class="form-control form-control-sm" id="inputLOE" min="0" step="0.5"/>
            <div class="invalid-feedback"></div>
        </div>
        `,
    }).render();


    /** Set for values if data is passed; */
    if (data && !isEvent) form.Values.set(data);

    /** Start adding the comment section - Locked to developer role; */
    /** FIXME: Might fail if hosted locally; */
    if (data
    && data.GUID
    && data.constructor.name !== 'PointerEvent'
    && User.hasRole(DEVELOPER)) {
        // const { GUID } = data;
        // new CommentSection({
        //     list: 'Comments',
        //     parent: modal.body,
        //     // This should be the GUID for this item;
        //     // FK: '241261ee-857d-4038-a9f3-78351a13dd86',
        //     FK: GUID,
        // }).render();
        /** Render the hidden divs for Developers */
        form.querySelectorAll('div[hidden]').forEach(div => div.removeAttribute('hidden'));
        form.querySelector('#inputStatus').removeAttribute('disabled');
        // console.info(form)
    }

    if (data && !isEvent) new AuthorsAndModifiers({
        parent: modal.body,
        data,
    }).render();

    form.Fields.focus();

    return modal.show();
}