/**
 * Form.js
 * @description Locations Form
 * @author Wilfredo Pacheco
 */

import Form from "../../src/Classes/Form.js";
import Modal from "../../src/Classes/Modal.js";
import { List, getMarkets, table, view } from "./View.js"
import Post from "./Post.js";
import Patch from "./Patch.js";
import Delete from "../../src/Actions/Item.Delete.js";
import App, { User, store } from "../../app.js";
import AuthorsAndModifiers from "../../src/Classes/AuthorsAndModifiers.js";
import EmailWidget from "../../Components/EmailWidget.js";
import Component from "../../src/Classes/Component.js";

export let modal;
export let form;

function marketForm() {
    return /*html*/`<!-- ${List.Title} Form -->
    <h6 class="text-center mb-2">Market</h6>
    <div class="row my-2">        
        <div class="col-lg-4 col-md-12">
            <label for="inputLocationName" class="form-label">Name</label>
            <input type="text" id="inputLocationName" name="LocationName" class="form-control form-control-sm" required />
        </div>
        <!--div class="col-lg-4 col-md-12">
            <label for="inputAssignedMarket" class="form-label">AssignedMarket</label>
            <select id="inputAssignedMarket" name="AssignedMarket" class="form-select form-select-sm" required></select>
        </div-->
        <div class="col-lg-2 col-md-12" hidden>
            <label for="inputLocationType" class="form-label">Location Type</label>
            <select id="inputLocationType" name="LocationType" class="form-select form-select-sm">
                <option value="Market" selected>Market</option>
            </select>
        </div>
        <div class="col-lg-2 col-md-12">
            <label for="inputDisplayOnForm" class="form-label">Display On Form?</label>
            <select id="inputDisplayOnForm" name="DisplayOnForm" class="form-select form-select-sm" required>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
            </select>
        </div>
    </div>     
    <!--div class="row my-2">   
        <div class="col-lg-2 col-md-12">
            <label for="inputTimezone" class="form-label">Time Zone</label>
            <select id="inputTimezone" name="Timezone" class="form-select form-select-sm"></select>
        </div>
        <div class="col-lg-2 col-md-12">
            <label for="inputLatitude" class="form-label">Latitude</label>
            <input type="number" id="inputLatitude" name="Latitude" class="form-control form-control-sm" min="-90" max="90" step="0.00001" />
        </div>
        <div class="col-lg-2 col-md-12">
            <label for="inputLongitude" class="form-label">Longitude</label>
            <input type="number" id="inputLongitude" name="Longitude" class="form-control form-control-sm" min="-180" max="180" step="0.00001" />
        </div>
    </div-->     
    <div class="row my-2" hidden>  
        <div class="col-lg-12">
            <p class="form-label">Email Addresses<small class="text-muted"></small></p>
            <textarea class="border rounded form-control" rows="2" id="inputEmailAddresses" name="EmailAddresses"></textarea>
        </div>
    </div>`;
}

function facilityForm() {
    return /*html*/`<!-- ${List.Title} Form -->
    <h6 class="text-center mb-2">Facility</h6>
    <div class="row my-2">        
        <div class="col-lg-4 col-md-12">
            <label for="inputLocationName" class="form-label">Name</label>
            <input type="text" id="inputLocationName" name="LocationName" class="form-control form-control-sm" required />
        </div>
        <div class="col-lg-4 col-md-12">
            <label for="inputAssignedMarket" class="form-label">Assigned Market</label>
            <select id="inputAssignedMarket" name="AssignedMarket" class="form-select form-select-sm" required></select>
        </div>
        <div class="col-lg-2 col-md-12" hidden>
            <label for="inputLocationType" class="form-label">Location Type</label>
            <select id="inputLocationType" name="LocationType" class="form-select form-select-sm">
                <option value="Facility" selected>Facility</option>
            </select>
        </div>
        <div class="col-lg-2 col-md-12">
            <label for="inputDisplayOnForm" class="form-label">Display On Form?</label>
            <select id="inputDisplayOnForm" name="DisplayOnForm" class="form-select form-select-sm" required>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
            </select>
        </div>
    </div>     
    <div class="row my-2">   
        <!--div class="col-lg-2 col-md-12">
            <label for="inputTimezone" class="form-label">Time Zone</label>
            <select id="inputTimezone" name="Timezone" class="form-select form-select-sm"></select>
        </div-->
        <div class="col-lg-2 col-md-12">
            <label for="inputLatitude" class="form-label">Latitude</label>
            <input type="number" id="inputLatitude" name="Latitude" class="form-control form-control-sm" min="-90" max="90" step="0.00001" />
        </div>
        <div class="col-lg-2 col-md-12">
            <label for="inputLongitude" class="form-label">Longitude</label>
            <input type="number" id="inputLongitude" name="Longitude" class="form-control form-control-sm" min="-180" max="180" step="0.00001" />
        </div>
    </div>     
    <!--div class="row my-2" hidden>  
        <div class="col-lg-12">
            <p class="form-label">Email Addresses<small class="text-muted"></small></p>
            <textarea class="border rounded form-control" rows="2" id="inputEmailAddresses" name="EmailAddresses"></textarea>
        </div>
    </div-->`;
}

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
        });

    modal = new Modal({
        title,
        draggable: true,
        size: 'modal-xl',
        buttons,
    }).render();

    /**
    DMISID
    AssignedMarket
    DMISName
    DisplayName
    LocationType
    EmailAddresses
     */

    let innerHTML;
    let typeChoice;

    if (data.LocationType === 'Market') {
        typeChoice = 'Market'
        innerHTML = marketForm();
    } else if (data.LocationType === 'Facility') {
        typeChoice = 'Facility'
        innerHTML = facilityForm();
    }
    else {
        typeChoice = await swal({
            icon: 'info',
            text: `
                The Locations list includes both Market and Facility items.\n
                Please select the item type you would like to create.
                `,
            buttons: {
                market: {
                    text: "Market",
                    value: 'Market',
                    visible: true,
                },
                facility: {
                    text: "Facility",
                    value: 'Facility',
                    visible: true,
                }
            },
        })
        switch (typeChoice) {
            case 'Market':
                innerHTML = marketForm();
                break;
            case 'Facility':
                innerHTML = facilityForm();
                break;
            default:
                return;
        }
    }

    form = new Form({
        classList: 'needs-validation',
        parent: modal.body,
        innerHTML,
    }).render();

    const AssignedMarketsEl = form.get('select[name="AssignedMarket"]');
    const markets = store.lists[List.Id].data.filter(loc => loc.LocationType === 'Market' && loc.DisplayOnForm === 'Yes');
    markets.forEach(market => {
        const { LocationName, Id } = market;
        new Component({
            tag: 'option',
            attributes: [{ name: 'value', value: Id }],
            parent: AssignedMarketsEl,
            innerText: LocationName,
        }).render();
    });

    /** Set for values if data is passed; */
    if (data && data.constructor.name !== 'PointerEvent') form.Values.set(data);

    // const email_widget = 
    /**Add the email widget for Market items */
    if (typeChoice === 'Market') new EmailWidget({
    // if (isMarket) new EmailWidget({
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
        source: form.get('textarea[name="EmailAddresses"]'),
        question: 'Are you sure you want to remove this email address?',
    }).render();

    /**Add an Assigned Facilities table to the market items and a View Market buton to the facility items */
    if(data && !isPointerEvent && typeChoice === 'Market') {
        const assignedFacilities = store.lists[List.Id].data.filter(l=> l.LocationType === 'Facility' && l.AssignedMarket === data.Id.toString())
        let assignedFacilitiesTable = new Component({
            tag: 'table',
            classList: 'table table-sm table-striped f-12 mt-3',
            parent: modal.body,
            innerHTML: /*html*/`
                <thead>
                    <tr class="text-center">
                        <th colspan='2'><span>Assigned Facilities</span></th>
                    </tr>
                </thead>
                <tbody></tbody>
            `,
        }).render();
        assignedFacilities.forEach((f, i)=>{
            let viewSpan = new Component({
                tag: 'span',
                classList: 'badge rounded-pill bg-primary text-white point',
                innerText: 'View Facility',
            }).render()
            let tr = new Component({
                tag: 'tr',
                parent: assignedFacilitiesTable.get('tbody'),
                innerHTML: /*html*/`
                <td>${f.LocationName}</td>
                <td>${viewSpan.get().outerHTML}</td>
                `
            }).render();
            tr.querySelector(`span`).addEventListener('click', function(event){
                modal.hide()
                App.Views.Locations.table.edit(`${f.__metadata.uri}`)
            })
        })

    } else if(data && !isPointerEvent && typeChoice === 'Facility'){
        const assignedMarket = store.lists[List.Id].data.filter(l=> l.LocationType === 'Market' && l.Id === Number(data.AssignedMarket))[0]
        let viewMarketSpan = new Component({
            tag: 'span',
            parent: modal.body,
            classList: 'badge rounded-pill bg-primary text-white point',
            innerText: 'View Assigned Market',
        }).render();
        viewMarketSpan.addEventListener('click', function(event){
            modal.hide()
            App.Views.Locations.table.edit(`${assignedMarket.__metadata.uri}`)
            
        })
    }

    if (data && !isPointerEvent) new AuthorsAndModifiers({
        parent: modal.body,
        data,
    }).render();

    modal.show();
    form.Fields.focus();
}