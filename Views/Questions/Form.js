/**
 * Form.js
 * @description Questions Form
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
import { ADMINISTRATOR, DEVELOPER } from "../../src/Biome.js";
import CommentSection from "../../src/Classes/CommentSection.js";

export let modal;
export let form;

export default async function ShowForm(data) {

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
    if ((User.hasRole(DEVELOPER) || User.hasRole(ADMINISTRATOR)) 
    && data
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
            <div class="col-12">
                <label for="inpuQuestion" class="form-label">Question</label>
                <!-- <input type="text" name="Question" class="form-control form-control-sm" id="inputQuestion" required /> -->
                <textarea class="form-control" rows="5" id="inpuQuestion" name="Question" disabled required></textarea>
                <div class="invalid-feedback"></div>
            </div>
        </div>
        <div class="row g-3 my-2" hidden>
            <div class="col-lg-4 col-md-12">
                <label for="inputProject_FK" class="form-label">Project_FK</label>
                <input type="text" name="Project_FK" class="form-control form-control-sm" id="inputProject_FK" disabled />
                <div class="invalid-feedback"></div>
            </div>
            <div class="col-lg-4 col-md-12">
                <label for="inputSeries_FK" class="form-label">Series_FK</label>
                <input type="text" name="Series_FK" class="form-control form-control-sm" id="inputSeries_FK" disabled />
                <div class="invalid-feedback"></div>
            </div>
        </div>
        <div class="row g-3 my-2">
            <div class="col-12">
                <label for="inputResponse" class="form-label">Response</label>
                <textarea class="form-control" rows="4" id="inputResponse" name="Response" disabled></textarea>
            </div>
        </div>`,
    }).render();

    /** ONLY Admins and Developers can edit questions; */
    const QuestionEl = form.get('textarea[name=Question]');
    if (!User.hasRole(DEVELOPER)) QuestionEl.removeAttribute('disabled', '');
    if (!User.hasRole(ADMINISTRATOR)) QuestionEl.removeAttribute('disabled', '');

    /** Set for values if data is passed; */
    if (data && !isEvent)
    {
        form.Values.set(data);

        const { Project_FK, Series_FK } = data;

        console.info({ Project_FK, Series_FK });

        /** 
         * TODO: Check the series and project status, 
         * if its marked as complete or closed then this should prevent all data from changing, 
         * including the delete right?
         */
    }

    if (data && !isEvent) new CommentSection({
        parent: modal.body,
        FK: data.GUID,
        list: 'Comments',
    }).render();

    if (data && !isEvent) new AuthorsAndModifiers({
        parent: modal.body,
        data,
    }).render();

    modal.show();
    form.Fields.focus();
}