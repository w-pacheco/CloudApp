/**
 * Form.js
 * @description Shows form element for the DMISTable list.
 * @author Wilfredo Pacheco
 */

import Form from "../../src/Classes/Form.js";
import Modal from "../../src/Classes/Modal.js";
import { List, getMarkets, table } from "./View.js"
import Post from "./Post.js";
import Patch from "./Patch.js";
import Delete from "../../src/Actions/Item.Delete.js";
// import { getActiveProcessTask, parseTemplate } from "../TaskTemplates/View.js";
// import { getStepByFK } from '../Steps/View.js';
import { Route, User, Web } from "../../app.js";
import Component from "../../src/Classes/Component.js";
import AuthorsAndModifiers from "../../src/Classes/AuthorsAndModifiers.js";
// import { getTaskProgressByGovId, TaskProgressItem } from "../RequestedTasks/View.js";
// import { Title as RequestedTasksTitle } from "../RequestedTasks/List.js";
// import UpdateProgressElement from '../../Actions/ProgressElement.Update.js';
import EmailWidget from "../../Components/EmailWidget.js";

export let modal;
export let form;

function bySortOrder(a, b){
    if (a.Sort < b.Sort) return -1;
    if (a.Sort > b.Sort) return 1;
    return 0;
}


export default async function ShowForm(data){

    const isPointerEvent = data?.constructor?.name === 'PointerEvent';
    const Title = List.Title;
    const title = data && !isPointerEvent ? 
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
    });

    /** The toast handles an undo method based on the item deleted; */
    if (data 
    && !isPointerEvent 
    && User.hasRole('Administrator') 
    || User.hasRole('Developer')) buttons.push({
        tag: 'button',
        type: 'delete',
        classList: 'btn btn-danger btn-sm',
        innerText: 'Delete',
        attributes: [
            { name: 'src', value: data?.__metadata?.uri },
            // { name: 'data-recycle', value: true },
            // { name: 'data-undo', value: true },
        ],
        /** FIXME: This needs to get the progress item and delete it; */
        /** Especially if we are going to allow undos; */
        events: [{ name: 'click', action: Delete }],
        customProperties: [{
            prop: 'callback',
            value(){
                modal?.hide();
                table.refresh();
            },
        }],
    });
    
    /** Link to SharePoint list item; */
    if (data 
    && !isPointerEvent 
    && User.hasRole('Developer')) buttons.push({
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

    // TODO: Make sure to import the file from MHS functionality is included;

    form = new Form({
        classList: 'g-3 needs-validation',
        parent: modal.body,
        innerHTML: /*html*/`<!-- ${List.Title} Form -->
        <div class="row my-2">
            <div class="col-lg-1">
                <label for="inputDMISID" class="form-label">DMIS ID</label>
                <input type="text" name="DMISID" class="form-control form-control-sm" id="inputDMISID" required />
                <div class="invalid-feedback"></div>
            </div>
            <div class="col-lg-5">
                <label for="inputDMISFacilityName" class="form-label">DMIS Name</label>
                <input type="text" name="DMISFacilityName" class="form-control form-control-sm" id="inputDMISFacilityName" required />
                <div class="invalid-feedback"></div>
            </div>
        </div>

        <div class="row my-2">
            <div class="col-lg-2">
                <label for="inputLocationType" class="form-label">Location Type</label>
                <select name="LocationType" class="form-control form-control-sm" id="inputLocationType" required>
                    <option value="Facility">Facility</option>
                    <option value="Market">Market</option>
                </select>
                <div class="invalid-feedback"></div>
            </div>
            <div class="col-lg-4">
                <label for="inputLocation" class="form-label">Location</label>
                <input type="text" name="Location" class="form-control form-control-sm" id="inputLocation" required />
                <div class="invalid-feedback"></div>
            </div>
        </div>

        <div class="row my-2">
            <div class="col-lg-4">
                <label for="inputAssignedMarket" class="form-label">Assigned Market</label>
                <select name="AssignedMarket" class="form-control form-control-sm" id="inputAssignedMarket" required>
                    <option value="">Choose...</option>
                </select>
                <div class="invalid-feedback"></div>
        </div>

        <div class="row my-2">
            <div class="col-lg-4 col-md-12">
                    <label for="inputLatitude" class="form-label">Latitude</label>
                    <input type="number" name="Latitude" class="form-control form-control-sm" id="inputLatitude" min='-90' max='90' step='0.00001'>
                <div class="invalid-feedback"></div>
            </div>
            <div class="col-lg-4 col-md-12">
                    <label for="inputLongitude" class="form-label">Longitude</label>
                    <input type="number" name="Longitude" class="form-control form-control-sm" id="inputLongitude" min='-180' max='180' step='0.00001'>
                <div class="invalid-feedback"></div>
            </div>
        </div>
        
        <div class="row my-2" hidden>  
            <div class="col-lg-12">
                <p class="form-label">Email Addresses<small class="text-muted"></small></p>
                <textarea class="border rounded form-control" rows="2" id="inputEmailAddresses" name="EmailAddresses"></textarea>
            </div>
        </div>
        `,
        store: true,
    }).render();

    const AssignedMarketsEl = form.get('select[name="AssignedMarket"]');
    const markets = await getMarkets();
    console.info(markets)
    markets.forEach(market => {
        const { FacilityName, DMISID } = market;
        new Component({
            tag: 'option',
            attributes: [{ name: 'value', value: DMISID }],
            parent: AssignedMarketsEl,
            innerText: FacilityName,
        }).render();
    })

    /** Set for values if data is passed; */
    if (data && data.constructor.name !== 'PointerEvent') form.Values.set(data);

    const email_widget = new EmailWidget({
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
                    <input type="email" name="Email" class="form-control form-control-sm" id="inputEmail" required />
                    <div class="invalid-feedback"></div>
                </div>
                <div class="col mt-4 pt-2 px-0">
                    <button data-add type="button" class="btn btn-sm btn-success mx-2">Add</button>
                </div>
            </div>`,
        },
        action_element: 'button[data-add]',
        source: form.get('textarea[name="EmailAddresses"]'),
        question: 'Are you sure you want to remove this email address?',
    }).render();

    if (data && !isPointerEvent) new AuthorsAndModifiers({
        parent: modal.body,
        data,
    }).render();

    modal.show();
    form.Fields.focus();

}