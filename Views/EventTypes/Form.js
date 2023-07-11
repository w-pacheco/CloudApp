/**
 * Form.js
 * @description EventTypes Form
 * @author Wilfredo Pacheco
 */

import Form from "../../src/Classes/Form.js";
import Modal from "../../src/Classes/Modal.js";
import { List, table } from "./View.js"
import Post from "./Post.js";
import Patch from "./Patch.js";
import Delete from "../../src/Actions/Item.Delete.js";
import { User, Web } from "../../app.js";
import AuthorsAndModifiers from "../../src/Classes/AuthorsAndModifiers.js";
import { Title as OfficesListTitle } from '../Offices/List.js'
import { Title as NotificationTypesListTitle } from '../NotificationTypes/List.js'
import Component from "../../src/Classes/Component.js";
import { GetAllItems } from "../../src/Actions/List.GetAllItems.js";

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

    /** FIXME: This should pull from the local store; */
    // const OfficesListObject = Web.getListDetails(OfficesListTitle)
    // const NotificationTypesListObject = Web.getListDetails(NotificationTypesListTitle)
    const [
        Offices,
        NotificationTypes,
    ] = await Promise.all([
        GetAllItems(OfficesListTitle),
        // Route.Get(OfficesListObject?.__metadata.uri + '/Items', { $top: OfficesListObject.ItemCount })
            // .then(data => data.d)
            // .then(data => data.results),
        GetAllItems(NotificationTypesListTitle)
        // Route.Get(NotificationTypesListObject?.__metadata.uri + '/Items', { $top: NotificationTypesListObject.ItemCount })
        //     .then(data => data.d)
        //     .then(data => data.results),
    ]);
    // console.info(Offices)
    // console.info(NotificationTypes)

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
                <label for="inputCategory" class="form-label">Category</label>
                <select class="form-select" id="inputCategory" name="Category" required>
                    <option value="">Choose...</option>
                    <option value="COOP">COOP</option>
                    <option value="Emergency Management">Emergency Management</option>
                    <option value="Health Care Delivery">Health Care Delivery</option>
                    <option value="Infrastructure & Logistics">Infrastructure & Logistics</option>
                    <option value="Operations">Operations</option>
                    <option value="Personnel & Legal">Personnel & Legal</option>
                    <option value="Public Affairs">Public Affairs</option>
                    <option value="Safety & Security">Safety & Security</option>
                </select>
            </div>
            <div class="col-lg-6 col-md-12">
                <label for="inputEventNumber" class="form-label">Event Number</label>
                <input type="number" name="EventNumber" class="form-control form-control-sm" id="inputEventNumber" min='0' required>
                <div class="invalid-feedback"></div>
            </div>
        </div>
        <div class="row my-2">
            <div class="col-lg-12">
                <label for="inputDescription" class="form-label">Description: <small class="text-muted">Detailed explanation of the incident type</small></label>
                <textarea class="bg-light border rounded form-control" rows="2" id="inputDescription" name="Description" required></textarea>
            </div>
        </div>
        <div class="row my-2" hidden>  
            <div class="col-lg-12">
                <p class="form-label">NotificationMatrix<small class="text-muted"></small></p>
                <textarea class="border rounded form-control" rows="2" id="inputNotificationMatrix" name="NotificationMatrix" disabled></textarea>
            </div>
        </div>`,
    }).render();

    const NotificationMatrixInput = form.get('textarea[name="NotificationMatrix"]');
    const NotificationTypeDescriptions = ['Offices', NotificationTypes.map(item => item.Description)].flat();
    // const NotificationTypeDescriptions = ['Offices', NotificationTypes.map(item => item.Value)].flat();
    const notificationMatrix = new Component({
        /** Since this is a form constructor, we will always set this for the user; */
        tag: 'table',
        classList: 'table f-12',
        // classList: 'table',
        parent: modal.body,
        attributes: [{ name: 'style', value: 'width: 100% !important;' }],
        events: [{
            name: 'click',
            action(event) {
                if (event.target.tagName === 'INPUT')
                {
                    const tr = event.target.parentNode.parentNode;
                    Array.from(tr.querySelectorAll('input')).forEach(function (input) {
                        if (input !== event.target) input.checked = false
                    });

                    const checkboxes = Array.from(notificationMatrix.querySelectorAll('input'));
                    const checked = checkboxes
                    .filter(input => !!input.checked)
                    .map(input => {
                        const { name, value, office, emails } = input.dataset;
                        return {
                            name,
                            value,
                            office,
                            emails,
                        }
                    });

                    NotificationMatrixInput.value = JSON.stringify(checked);
                    // console.info(checked);

                }
            }
        }],
        innerHTML: /*html*/`
        <thead>
            <tr>${
                NotificationTypeDescriptions
                .map(thString => /*html*/`<th class="text-center">${thString}</th>`)
                .join('')
            }</tr>
        </thead>
        <tbody></tbody>`,
    }).render();

    Offices.forEach(function ({ OfficeName, Emails }) {

        const notifications = NotificationTypes
        .map(function ({ Value, Description }) {
            return /*html*/`
            <td class="text-center">
                <input class="form-check-input" 
                type="checkbox" 
                data-matrix="true" 
                data-value="${Value}" 
                data-office="${encodeURIComponent(OfficeName)}" 
                data-name="checkbox-${encodeURIComponent(Description)}" 
                data-emails="${encodeURIComponent(Emails)}" />
            </td>`
        }).join(``)

        new Component({
            tag: `tr`,
            parent: notificationMatrix.get(`tbody`),
            innerHTML: /*html*/ `
            <td>${OfficeName}</td>
            ${notifications}`,
        }).render();

    });

    /** Set for values if data is passed; */
    if (data && data.constructor.name !== 'PointerEvent') {
        form.Values.set(data);
        if (NotificationMatrixInput.value)
        {
            const matrix = JSON.parse(NotificationMatrixInput.value);
            const inputs = Array.from(notificationMatrix.querySelectorAll(`input`));
            // console.info(inputs)
            inputs.forEach(input => {
                const { value, name, office } = input.dataset;
                const found = matrix.find(m => {
                    if (m.value === value && m.name === name && m.office === office) return m;
                });
                if (found) input.checked = true;
            });
        }
    }

    if (data && !isPointerEvent) new AuthorsAndModifiers({
        parent: modal.body,
        data,
    }).render();

    modal.show();
    form.Fields.focus();
}