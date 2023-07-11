/**
 * Form.js
 * @description LocationRequests Form
 * @author Wilfredo Pacheco
 */

import Form from "../../src/Classes/Form.js";
import Modal from "../../src/Classes/Modal.js";
import { List, table } from "./View.js"
import Post from "./Post.js";
// import Patch from "./Patch.js";
// import Delete from "../../src/Actions/Item.Delete.js";
import { Route, User, Web } from "../../app.js";
import AuthorsAndModifiers from "../../src/Classes/AuthorsAndModifiers.js";
import ApproveLocation from "./ApproveNewLocation.js";

import { Title as LocationsTitle } from '../Locations/List.js';
import Component from "../../src/Classes/Component.js";

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
        innerText: 'Approve',
        attributes: [{ name: 'src', value: data?.__metadata?.uri }],
        events: [{ name: 'click', action: ApproveLocation }],
    }) : 
    buttons.push({
        tag: 'button',
        type: 'post',
        classList: 'btn btn-success btn-sm',
        innerText: 'Save',
        events: [{ name: 'click', action: Post }],
        customProperties: [{
            prop: 'callback',
            value(){
                return callback();
            }
        }],
    });

    /** The toast handles an undo method based on the item deleted; */
    // if (data 
    // && !isPointerEvent) buttons.push({
    //     tag: 'button',
    //     type: 'delete',
    //     classList: 'btn btn-danger btn-sm',
    //     innerText: 'Delete',
    //     attributes: [
    //         { name: 'src', value: data?.__metadata.uri },
    //         { name: 'data-recycle', value: true },
    //         { name: 'data-undo', value: true },
    //     ],
    //     events: [{ name: 'click', action: Delete }],
    //     customProperties: [{
    //         prop: 'callback',
    //         value(){
    //             modal?.hide();
    //             table.refresh();
    //         },
    //     }],
    // });

    // if (data 
    // && !isPointerEvent) buttons.push({
    //     tag: 'button',
    //     type: 'delete',
    //     classList: 'btn btn-success btn-sm',
    //     innerText: 'Approve',
    //     attributes: [
    //         { name: 'src', value: data?.__metadata.uri },
    //         // { name: 'data-recycle', value: true },
    //         // { name: 'data-undo', value: true },
    //     ],
    //     events: [{
    //         name: 'click',
    //         async action(event){

    //             /** TODO: Complete the Approve event; */
    //             console.info({
    //                 title: 'Approve Event',
    //                 event,
    //             });

    //         }
    //     }],
    //     // customProperties: [{
    //     //     prop: 'callback',
    //     //     value(){
    //     //         modal?.hide();
    //     //         table.refresh();
    //     //     },
    //     // }],
    // });

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
            <div class="col-lg-4 col-md-12">
                <label for="inputDCIRNumber" class="form-label">DCIRNumber</label>
                <input type="text" name="DCIRNumber" class="form-control form-control-sm" id="inputDCIRNumber" disabled />
            </div>
            <div class="col-lg-6 col-md-12">
                <label for="inputLocationName" class="form-label">Location Name</label>
                <input type="text" name="LocationName" class="form-control form-control-sm" id="inputLocationName" required />
            </div>
        </div>
        <div class="row my-2">
            <div class="col-lg-4 col-md-12">
                <label for="inputMarketName" class="form-label">Market</label>
                <select id="inputMarketName" name="MarketName" class="form-select form-select-sm" aria-label="Market Select" required></select>
            </div>
            <div class="col-lg-4 col-md-12">
                <label for="inputAssignedMarket" class="form-label">Assigned Market</label>
                <input type="text" name="AssignedMarket" class="form-control form-control-sm" id="inputAssignedMarket" disabled />
            </div>
        </div>
        <!-- div class="row my-2">
            <div class="col-lg-4 col-md-12">
                <input type="text" 
                       name="DisplayOnForm" 
                       class="form-control form-control-sm" 
                       value="Yes" 
                       placeholder="Display" 
                       id="inputDisplay" 
                       disabled />
            </div>
            <div class="col-lg-4 col-md-12">
                <input type="text" 
                       name="LocationType" 
                       class="form-control form-control-sm" 
                       value="Facility" 
                       placeholder="LocationType" 
                       id="inputLocationType" 
                       disabled />
            </div-- >
        </div>`,
    }).render();

    const DisplayContainer = new Component({
        tag: 'div',
        classList: 'mt-5',
        parent: form,
        innerHTML: /*html*/`
        <div class="text-center">
            <h3>Market Locations</h3>
        </div>
        <div class="f-12">
            <p>*NOTE: Locations for the selected market will be displayed below. If the location entered is already a location for this market, please 
                click on the item shown in the table to replace the name of the location. Then click approve to update the DCIR Report.
            </p>
        </div>`,
    }).render();

    const DisplayTable = new Component({
        tag: 'table',
        classList: 'table table-hover table-sm mt-3 f-12',
        parent: DisplayContainer,
        attributes: [{ name: 'style', value: 'width: 100% !important;' }],
        innerHTML: /*html*/`
        <thead>
            <tr>
                <th>Location</th>
                <th></th>
            </tr>
        </thead>
        <tbody></tbody>`,
    }).render();

    const MarketInput = form.get('select[name=MarketName]');        // Identify the market select element;
    const LocationsList = Web.getListDetails(LocationsTitle);       // Identify the locations list details;
    const AssignedMarketInput = form.get('input[name="AssignedMarket"]');
    const LocationNameInput = form.get('input[name="LocationName"]');

    /** Get all the current markets from the locations list; */
    const Markets = await Route.Get(`${LocationsList.__metadata.uri}/Items`, {
        $select: '*',
        $filter: `LocationType eq 'Market'`,
    }).then(data => data.d.results);
    
    /** Render the facilities under the selected market; */
    MarketInput.addEventListener('change', function(event){
        const value = this.value;                                   // Get the market value;
        const market = Markets.find(m => m.LocationName === value); // Get the market Object from the Markets array;

        /** Set the elements on the form so location is listed correctly; */
        AssignedMarketInput.value = market.AssignedMarket;

        $(DisplayTable.get(`tbody`)).fadeOut('', function(){        // Fade out the table body;
            $(DisplayTable.get(`tbody`)).hide();
        });
        return Route.Get(`${LocationsList.__metadata.uri}/Items`, { // Call to get all the listed location for the selected market;
            // $select: 'LocationName',
            $select: '*',
            $filter: `(LocationType eq 'Facility') and (AssignedMarket eq '${market.Id}')`,
        })
        .then(data => data.d.results)
        .then(data => {
            $(DisplayTable.get(`tbody`)).empty();                   // Empty the table body;
            data.forEach(function({LocationName}){                  // Create a table row element for each location;
                return new Component({
                    tag: `tr`,
                    classList: 'pointer',
                    events: [{
                        name: 'click',
                        action(event){
                            LocationNameInput.value = LocationName; /** Set the title for the location name; */
                        }
                    }],
                    parent: DisplayTable.get(`tbody`),
                    innerHTML: /*html*/ `
                    <td>${LocationName}</td>
                    <td data-select></td>`,
                }).render();
            });
        })
        .then(function(){
            $(DisplayTable.get(`tbody`)).fadeIn();                  // Fade in the table body element;
        });
    });

    /** Throw a change event for the market input; */
    form.get().addEventListener('set', function(event){
        return MarketInput.dispatchEvent(new Event('change'));
    });

    Markets
    .forEach(function({ Id, LocationName }){
        return new Component({
            tag: 'option',
            attributes: [
                { name: 'value', value: LocationName },
                { name: 'data-id', value: Id },
                { name: 'name', value: LocationName },
            ],
            parent: MarketInput,
            innerText: LocationName,
        }).render();
    });

    /** Set for values if data is passed; */
    if (data && data.constructor.name !== 'PointerEvent') form.Values.set(data);

    if (data && !isPointerEvent) new AuthorsAndModifiers({
        parent: modal.body,
        data,
    }).render();

    modal.show();
    form.Fields.focus();
}