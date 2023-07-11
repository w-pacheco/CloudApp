/**
 * Form.js
 * @description Reports Form
 * @author Wilfredo Pacheco
 */

import Component from "../../src/Classes/Component.js";
import Form from "../../src/Classes/Form.js";
import Modal from "../../src/Classes/Modal.js";
import { List, table } from "./View.js"
import Post from "./Post.js";
import PostDraft from "./PostDraft.js";
import Patch from "./Patch.js";
import PatchDraft from "./PatchDraft.js";
import Delete from "../../src/Actions/Item.Delete.js";
import App, { Route, Web, User } from "../../app.js";
import AuthorsAndModifiers from "../../src/Classes/AuthorsAndModifiers.js";
import { Title as EventTypesListTitle } from '../EventTypes/List.js'
import { Title as BranchesListTitle } from '../Branches/List.js'
import { Title as RanksListTitle } from '../Ranks/List.js'
import { Title as LocationsListTitle } from '../Locations/List.js'
import { Title as IncidentsListTitle } from '../Incidents/List.js'
import { Title as MarketsListTitle } from '../Markets/List.js'
import { Title as FacilitiesListTitle } from '../Facilities/List.js'
import BuildDisplayMatrix from "../BuildDisplayMatrix.js";

export let modal;
export let form;

function CreateAdminToolbar(data, parent, callback) {
    //TODO: Update the toolbar for the Administrator to change the Status of a report
    // console.info(data, parent)
    const btnGroup = new Component({
        tag: 'div',
        classList: `col-12 d-flex justify-content-end pt-2 pb-4`,
        parent,
        innerHTML: /*html*/`
        <div class="btn-group" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-sm btn-outline-primary" data-open data-request="Open">Open</button>
            <button type="button" class="btn btn-sm btn-outline-primary" data-open-for-action data-request="Open for Action">Open for Action</button>
            <button type="button" class="btn btn-sm btn-primary" data-close data-request="Closed">Close</button>
        </div>
      `}).render();

    const openButton = btnGroup.get('button[data-open]')
    const openForActionButton = btnGroup.get('button[data-open-for-action]')
    const closeButton = btnGroup.get('button[data-close]')
    const {
        uri,
        type,
        etag,
    } = data.__metadata
    async function updateItemStatus(event) {
        const requestDigest = await Route.GetRequestDigest();
        return Route.Patch(
            uri,
            {
                Status: this.dataset.request,
                __metadata: {
                    type
                }
            },
            requestDigest,
            etag
        ).catch((error) => {
            //TODO: Alert if item has already been updated
            console.info(error)
        }).then(() => {
            if (callback) {
                callback()
            }
        })
    }
    openButton.addEventListener('click', updateItemStatus)
    openForActionButton.addEventListener('click', updateItemStatus)
    closeButton.addEventListener('click', updateItemStatus)
}

export default async function ShowForm(data) {

    const isPointerEvent = data?.constructor?.name === 'PointerEvent';
    const title = isPointerEvent ? //if no data was passed into the call, it's a new item
        `New Report` :
        data?.Status == 'Draft' ? //if data is passed, it is then either a draft report or a completed report
            `Edit Draft Report` :
            `View Report` //since the only fields that can change on a completed report are for the POCs, we opt to say view instead of edit like the other form pages. 

    /** Modal Buttons; */
    const buttons = []; //We create buttons selectively based on the status of the data. Drafts have different validation rules than completed items, so use different methods

    (data && !isPointerEvent) ?
        data.Status === 'Draft' ?
            buttons.push({
                tag: 'button',
                type: 'patch',
                classList: 'btn btn-secondary btn-sm',
                innerText: 'Save Draft Updates',
                attributes: [{ name: 'src', value: data?.__metadata?.uri }],
                events: [{
                    name: 'click',
                    action: PatchDraft,
                }]
            }, {// TODO: check that the report status is being set appropriately both when submitting an item that was previously a draft and updating POC info on a completed item
                tag: 'button',
                type: 'patch',
                classList: 'btn btn-success btn-sm',
                innerText: 'Submit Completed Report',
                attributes: [{ name: 'src', value: data?.__metadata?.uri }],
                events: [{
                    name: 'click',
                    action: Patch,
                }],
            },)
            :
            buttons.push({
                tag: 'button',
                type: 'patch',
                classList: 'btn btn-success btn-sm',
                innerText: 'Update POC Info',
                attributes: [{ name: 'src', value: data?.__metadata?.uri }],
                events: [{
                    name: 'click',
                    action: Patch,
                }],
            })
        :
        buttons.push({
            tag: 'button',
            type: 'post',
            classList: 'btn btn-secondary btn-sm',
            innerText: 'Save as Draft',
            events: [{
                name: 'click',
                action: PostDraft,
            }],
            customProperties: [{
                prop: 'callback',
                value() {
                    return callback();
                }
            }],
        }, {
            tag: 'button',
            type: 'post',
            classList: 'btn btn-success btn-sm',
            innerText: 'Submit Completed Report',
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
        },);


    /** The toast handles an undo method based on the item deleted; */
    if (
        data
        && !isPointerEvent
        && data.Status === 'Draft'
        //Only drafts can be deleted. Once a complete report is submitted, it becomes a part of the record. 
    )
        buttons.push({
            tag: 'button',
            type: 'delete',
            classList: 'btn btn-danger btn-sm',
            innerText: 'Delete',
            attributes: [,
                { name: 'src', value: data?.__metadata.uri },
                { name: 'data-recycle', value: true },
                { name: 'data-undo', value: true },
            ],
            events: [{ name: 'click', action: Delete }],
            customProperties: [{
                prop: 'callback',
                value() {
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

    const BranchesListObject = Web.getListDetails(BranchesListTitle)
    const RanksListObject = Web.getListDetails(RanksListTitle)
    const EventTypesListObject = Web.getListDetails(EventTypesListTitle)
    const LocationsListObject = Web.getListDetails(LocationsListTitle);
    const IncidentsListObject = Web.getListDetails(IncidentsListTitle);

    const [
        Branches,
        Ranks,
        EventTypes,
        Locations,
        Incidents,
    ] = await Promise.all([
        Route.Get(BranchesListObject?.__metadata.uri + '/Items', { $top: BranchesListObject.ItemCount })
            .then(data => data.d)
            .then(data => data.results),

        Route.Get(RanksListObject?.__metadata.uri + '/Items', { $top: RanksListObject.ItemCount })
            .then(data => data.d)
            .then(data => data.results),

        Route.Get(EventTypesListObject?.__metadata.uri + '/Items', { $top: EventTypesListObject.ItemCount })
            .then(data => data.d)
            .then(data => data.results),

        Route.Get(LocationsListObject?.__metadata.uri + '/Items', { $top: LocationsListObject.ItemCount })
            .then(data => data.d)
            .then(data => data.results),

        Route.Get(IncidentsListObject?.__metadata.uri + '/Items', {
            $top: IncidentsListObject.ItemCount,
            $filter: `Status ne 'Closed'`
        })
            .then(data => data.d)
            .then(data => data.results),
    ]);
    // console.info(Locations)
    // console.info(Incidents)

    let ParentIncident
    if (data.DCIRNumber) {
        ParentIncident = await Route.Get(IncidentsListObject?.__metadata.uri + '/Items', {
            $top: IncidentsListObject.ItemCount,
            $filter: `DCIRNumber eq '${data.DCIRNumber}'`
        })
            .then(data => data.d)
            .then(data => data.results[0])
    }
    // console.info(ParentIncident)


    if (data.DCIRNumber && !isPointerEvent) {
        buttons.unshift({
            tag: 'button',
            type: 'nav',
            classList: 'btn btn-primary btn-sm',
            innerText: 'View Incident Summary',
            // attributes: [{ name: 'src', value: data?.__metadata?.uri }],
            attributes: [{
                name: 'IncidentURL',
                value: `/DCIR/SiteAssets/App/app.aspx?Id=${ParentIncident.Id}#Incidents`
            },],
            events: [{
                name: 'click',
                action: function (event) {
                    //TODO: Navigate to Incident item based off DCIR Number
                    console.info(event)
                    modal.hide()
                    // App.Views.Incidents.show()
                    // const IncidentsList = Web.getListDetails(`Incidents`)
                    App.Views.Incidents.table.edit(`${IncidentsListObject.__metadata.uri}/Items(${ParentIncident.Id})`)
                },
            }]
        })
    }

    modal = new Modal({
        title,
        draggable: true,
        size: 'modal-fullscreen',
        buttons,
    }).render();

    if (User.hasRole('Administrator') && !isPointerEvent) {
        const {
            Status,
        } = data
        if (Status === 'Submitted') {
            //TODO: This is where the Admin would handle items
            //Options here are 'Open', 'Open for Action', 'Closed'
            function callBack() {
                modal.hide()
                table.refresh()
            }
            CreateAdminToolbar(data, modal.body, callBack)
        }
    }

    form = new Form({
        classList: 'row needs-validation',
        parent: modal.body,
        innerHTML: /*html*/`<!-- ${List.Title} Form -->
        <nav>
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
                <button class="nav-link active" id="nav-Initial-tab" data-bs-toggle="tab" data-bs-target="#nav-Initial" type="button" role="tab" style="font-size:1.2em;" title="Fields in this tab collect initial report info">Initial Information</button>
                <button class="nav-link" id="nav-Personnel-tab" data-bs-toggle="tab" data-bs-target="#nav-Personnel" type="button" role="tab" style="font-size:1.2em;">Personnel Involved</button>
                <button class="nav-link" id="nav-Details-tab" data-bs-toggle="tab" data-bs-target="#nav-Details" type="button" role="tab" style="font-size:1.2em;">Report Details</button>
                <button class="nav-link" id="nav-Contact-tab" data-bs-toggle="tab" data-bs-target="#nav-Contact" type="button" role="tab" style="font-size:1.2em;">Points of Contact</button>
            </div>
        </nav>
        <div class="tab-content" id="nav-tabContent">
            <div class="tab-pane fade show active" id="nav-Initial" role="tabpanel" tabindex="0">
                <div class="row my-2">
                    <div class="col-lg-4 col-md-12">
                        <label for="inputReportType" class="form-label">Report Type</label>
                        <select class="form-select" id="inputReportType" name="ReportType" data-nav="nav-Initial" data-bs-toggle="tooltip" data-bs-title="Default tooltip" required>
                            <option value="">Choose...</option>
                            <option title="Initial reports will create a new DCIR Incident in the system. A DCIR Number will be automatically assigned when the completed report is submitted." value="Initial">Initial</option>
                            <option title="Follow Up reports provide additional relevant information as ongoing incidents unfold." value="Follow Up">Follow Up</option>
                            <option title="Corrective incidents are used to address any incorrect information that was entered in previous reports" value="Corrective">Corrective</option>
                            <option title="Final reports should provide a summary of the corrective action and resolution of the incident. Final reports are required to move an incident from 'Open' or 'Open for Action' to 'Closed'" value="Final">Final</option>
                        </select>
                    </div>
                    <div class="col-lg-4 col-md-12" id="DCIRNumberElement">
                        <label for="inputDCIRNumber" class="form-label">DCIR Number</label>
                        <select class="form-select" id="inputDCIRNumber" name="DCIRNumber" data-nav="nav-Initial"></select>
                    </div>
                </div>    
                <div class="row my-2">
                    <div class="col-lg-2 col-md-12">
                        <label for="inputEventTypeNumber" class="form-label">Event Type</label>
                        <select class="form-select" id="inputEventTypeNumber" name="EventTypeNumber" data-nav="nav-Initial" required></select>
                    </div>
                    <div class="col-lg-2 col-md-12 mt-4">
                        <button type="button" id="ViewMatrix" class="btn btn-sm btn-secondary mt-2" data-view-matrix>View DCIR Event Types</button>
                    </div>
                    <div class="col" hidden>
                        <label for="inputEventTypeCategory" class="form-label">Event Category</label>
                        <input type="text" id="inputEventTypeCategory" name="EventTypeCategory" class="form-control" aria-label="Input" data-nav="nav-Initial" required>
                    </div>
                    <div class="col" hidden>
                        <p class="form-label">Event Description<small class="text-muted"></small></p>
                        <textarea class="border rounded form-control" rows="2" id="inputEventTypeDescription" name="EventTypeDescription" required></textarea>
                    </div>
                </div>    
                <div class="row my-2">
                    <div class="col-lg-4 col-md-12">
                        <label for="inputMarketId" class="form-label">Market</label>
                        <select id="inputMarketId" name="MarketId" class="form-select" aria-label="Market Select" data-nav="nav-Initial" required></select>
                    </div>
                    <div class="col-lg-4 col-md-12" hidden>
                        <label for="inputMarketName" class="form-label">Market</label>
                        <input type="text" id="inputMarketName" name="MarketName" class="form-control" aria-label="Input" data-nav="nav-Initial" required>
                    </div>
                    <div class="col-lg-4 col-md-12">
                        <label for="inputFacilityId" class="form-label">Facility</label>
                        <select id="inputFacilityId" name="FacilityId" class="form-select" aria-label="Market Select" data-nav="nav-Initial" required></select>
                    </div>   
                    <div class="col" hidden>
                        <label for="inputFacilityName" class="form-label">Facility</label>
                        <input type="text" id="inputFacilityName" name="FacilityName" class="form-control" aria-label="Input" data-nav="nav-Initial" required>
                    </div>
                </div>    
                <div class="row my-2">        
                    <div class="col-lg-4 col-md-12">
                        <label for="inputDate" class="form-label">Date of Incident</label>
                        <input type="date" id="inputDate" name="Date" class="form-control" aria-label="Date Input" data-nav="nav-Initial" value="${new Date().toISOString().split('T')[0]}" required>
                    </div>
                    <div class="col-lg-4 col-md-12">
                        <label for="inputTime" class="form-label">Time of Incident</label>
                        <input type="time" id="inputTime" name="Time" class="form-control" aria-label="Time Input" data-nav="nav-Initial" required>
                    </div>     
                </div>    
                <div class="row my-2"> 
                    <div class="col-lg-4 col-md-12">
                        <label for="inputIndicationOfDegradation" class="form-label">Indication Of Degradation</label>
                        <input type="text" id="inputIndicationOfDegradation" name="IndicationOfDegradation" class="form-control" data-nav="nav-Initial" required>
                    </div>
                </div>
                <div class="col-lg-12">
                    <p class="form-label"><small class="text-muted"></small></p>
                    <textarea class="border rounded form-control" rows="2" id="inputPersonnelInvolved" name="PersonnelInvolved" hidden></textarea>
                </div>
            </div>

            <div class="tab-pane fade" id="nav-Personnel" role="tabpanel" tabindex="0"> 
                <div data-personnel-container>
                    <!-- Here is where we insert the Personnel Info Sections with our function -->
                </div>
                <div class="px-3" data-member-btn-container="">
                    <span class="badge rounded-pill bg-primary text-white point px-2 float-end mx-1 my-2" data-add-member>Add Additional Personnel</span>
                </div>
            </div>

            <div class="tab-pane fade" id="nav-Details" role="tabpanel" tabindex="0">
                <div class="row my-2">  
                    <div class="col-lg-12">
                        <p class="form-label">Statement of Incident: <small class="text-muted">Detailed explanation of the incident</small></p>
                        <textarea class="border rounded form-control" rows="2" id="inputIncidentStatement" name="IncidentStatement" data-nav="nav-Details" required></textarea>
                    </div>
                </div>
                <div class="row my-2">  
                    <div class="col-lg-12">
                        <p class="form-label">Mission Impact: <small class="text-muted">Detailed statement of mission impact known at the time of submission and potential future impact</small></p>
                        <textarea class="border rounded form-control" rows="2" id="inputMissionImpact" name="MissionImpact" data-nav="nav-Details" required></textarea>
                    </div>
                </div>
                <div class="row my-2">  
                    <div class="col-lg-12">
                        <p class="form-label">Corrective Action Required or Taken: <small class="text-muted">Report mitigation/corrective actions taken or planned</small></p>
                        <textarea class="border rounded form-control" rows="2" id="inputCorrectiveAction" name="CorrectiveAction" data-nav="nav-Details" required></textarea>
                    </div>
                </div>
                <div class="row my-2">  
                    <div class="col-lg-12">
                        <p class="form-label">DHA HQ Assistance Required: <small class="text-muted">Explain required assistance</small></p>
                        <textarea class="border rounded form-control" rows="2" id="inputHQAssistance" name="HQAssistance" data-nav="nav-Details" required></textarea>
                    </div>
                </div>
                <div class="row my-2">
                    <div class="col-lg-4 col-md-12">
                        <label for="inputMediaInterest" class="form-label">Media Interest</label>
                        <select id="inputMediaInterest" name="MediaInterest" class="form-select" aria-label="MediaInterest Select" data-nav="nav-Details" required>
                            <option value="">Choose...</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <div class="col-lg-4 col-md-12">
                        <label for="inputLawEnforcementInvolved" class="form-label">Law Enforcement Involved</label>
                        <select id="inputLawEnforcementInvolved" name="LawEnforcementInvolved" class="form-select" aria-label="LawEnforcementInvolved Select" data-nav="nav-Details" required>
                            <option value="">Choose...</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>   
                    <div class="col-lg-4 col-md-12">
                        <label for="inputDrugAlcoholUse" class="form-label">Drug/Alcohol Use</label>
                        <select id="inputDrugAlcoholUse" name="DrugAlcoholUse" class="form-select" aria-label="DrugAlcoholUse Select" data-nav="nav-Details" required>
                            <option value="">Choose...</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="tab-pane fade" id="nav-Contact" role="tabpanel" tabindex="0">
                <div class="row my-2">
                    <div class="col-lg-4 col-md-12">
                        <label for="inputSubmitterName" class="form-label">Submitter Name</label>
                        <input type="text" id="inputSubmitterName" name="SubmitterName" class="form-control" aria-label="Input" data-nav="nav-Contact" value="${User.DisplayText}" required>
                    </div>
                    <div class="col-lg-4 col-md-12">
                        <label for="inputSubmitterEmail" class="form-label">Submitter Email</label>
                        <input type="email" id="inputSubmitterEmail" name="SubmitterEmail" class="form-control" aria-label="Input" data-nav="nav-Contact" value="${User.Email}" required>
                    </div>
                    <div class="col-lg-4 col-md-12">
                        <label for="inputSubmitterPhone" class="form-label">Submitter Phone</label>
                        <input type="tel" id="inputSubmitterPhone" name="SubmitterPhone" class="form-control" aria-label="Input" maxlength="10" minlength="10" data-nav="nav-Contact" required>
                    </div>
                </div>
                <div class="row my-2">
                    <div class="col-lg-4 col-md-12">
                        <label for="inputAdditionalPOCName" class="form-label">Alternate Name</label>
                        <input type="text" id="inputAdditionalPOCName" name="AdditionalPOCName" class="form-control" aria-label="Input" data-nav="nav-Contact" required>
                    </div>
                    <div class="col-lg-4 col-md-12">
                        <label for="inputAdditionalPOCEmail" class="form-label">Alternate Email</label>
                        <input type="email" id="inputAdditionalPOCEmail" name="AdditionalPOCEmail" class="form-control" aria-label="Input" data-nav="nav-Contact" required>
                    </div>
                    <div class="col-lg-4 col-md-12">
                        <label for="inputAdditionalPOCPhone" class="form-label">Alternate Phone</label>
                        <input type="tel" id="inputAdditionalPOCPhone" name="AdditionalPOCPhone" class="form-control" aria-label="Input" maxlength="10" minlength="10" data-nav="nav-Contact" required>
                    </div>
                </div>
            </div>
        </div>`,
    }).render();
    // console.info($(form.get()).tooltip())
    $('#DCIRNumberElement').hide();
    // $(form.querySelectorAll('[data-bs-toggle="tooltip"]')).tooltip();
    const DCIRButton = form.get(`button[data-view-matrix]`)
    DCIRButton.addEventListener('click', event => {
        BuildDisplayMatrix()
    })

    const PersonnelButton = form.get(`span[data-add-member]`)
    const PersonnelContainer = form.get(`div[data-personnel-container]`)
    PersonnelButton.addEventListener('click', function (event) { GeneratePersonnelInfoSection(PersonnelContainer, { Branches, Ranks }) });

    if (isPointerEvent) {
        PersonnelButton.dispatchEvent(new Event('click'))
    }

    const ReportTypeSelectElement = form.get('select[name="ReportType"]');
    let hiddenSelect = form.get('select[name="DCIRNumber"]')
    new Component({
        tag: 'option',
        attributes: [{ name: 'value', value: '' }],
        parent: hiddenSelect,
        innerText: 'Choose...'
    }).render();
    Incidents.forEach(incident => {
        const { Id, DCIRNumber, Status, Details } = incident;

        new Component({
            tag: 'option',
            attributes: [
                { name: 'value', value: DCIRNumber },
            ],
            parent: hiddenSelect,
            innerText: DCIRNumber
        }).render();
    })


    ReportTypeSelectElement.addEventListener('change', event => {
        let hiddenDiv = form.get('#DCIRNumberElement')
        if ((event.target.value === 'Initial') || (event.target.value === '')) {
            $(hiddenDiv).fadeOut();
            hiddenSelect.removeAttribute('required');
        } else {
            $(hiddenDiv).fadeIn();
            hiddenSelect.setAttribute('required', '');
        }
    })


    const EventTypesSelectElement = form.get('select[name="EventTypeNumber"]');
    new Component({
        tag: 'option',
        attributes: [{ name: 'value', value: '' }],
        parent: EventTypesSelectElement,
        innerText: 'Choose...'
    }).render();
    EventTypes.forEach(option => {
        const { EventNumber, Description, Category } = option;
        new Component({
            tag: 'option',
            attributes: [
                { name: 'value', value: EventNumber },
                { name: 'title', value: Description },
                { name: 'event-number', value: EventNumber },
                { name: 'description', value: Description },
                { name: 'category', value: Category },
            ],
            parent: EventTypesSelectElement,
            innerText: EventNumber
        }).render();
    })
    EventTypesSelectElement.addEventListener('change', event => {
        let descriptionElement = form.get('textarea[name="EventTypeDescription"]')
        let categoryElement = form.get('input[name="EventTypeCategory"]')
        if (event.target.value) {
            let currentSelection = event.target.options[event.target.selectedIndex]
            descriptionElement.value = currentSelection.getAttribute('description')
            categoryElement.value = currentSelection.getAttribute('category')
        } else if (event.target.value === '') {
            descriptionElement.value = ''
            categoryElement.value = ''
        }
    })
    //TODO: Update Market and Facility selects to pull from Locations list
    const Markets = Locations.filter(l => l.LocationType === 'Market')
    const MarketSelectElement = form.get('select[name="MarketId"]');
    new Component({
        tag: 'option',
        attributes: [{ name: 'value', value: '' }],
        parent: MarketSelectElement,
        innerText: 'Choose...'
    }).render();

    Markets.forEach(option => {
        const { Id, LocationName } = option;
        new Component({
            tag: 'option',
            attributes: [
                { name: 'value', value: Id },
                { name: 'name', value: LocationName },
            ],
            parent: MarketSelectElement,
            innerText: LocationName
        }).render();
    })
    // const MarketsListObject = Web.getListDetails(MarketsListTitle)
    // await Route.Get(MarketsListObject?.__metadata.uri + '/Items', {
    //     $top: MarketsListObject.ItemCount,
    //     // $filter: `Archived eq 'false'`
    // })
    //     .then(data => data.d)
    //     .then(data => data.results)
    //     .then(data => {
    //         new Component({
    //             tag: 'option',
    //             attributes: [{ name: 'value', value: '' }],
    //             parent: MarketSelectElement,
    //             innerText: 'Choose...'
    //         }).render();

    //         data.forEach(option => {
    //             const { Id, MarketName } = option;
    //             new Component({
    //                 tag: 'option',
    //                 attributes: [
    //                     { name: 'value', value: Id },
    //                     { name: 'name', value: MarketName },
    //                 ],
    //                 parent: MarketSelectElement,
    //                 innerText: MarketName
    //             }).render();
    //         });
    //     })
    //     .catch(response => {
    //         console.info(response);
    //     });

    MarketSelectElement.addEventListener('change', (event) => { // This will show and hide Facility options based on the selected Market
        let marketNameElement = form.get('input[name="MarketName"]')
        if (event.target.value) {
            $(form.querySelectorAll(`option[data-market]`)).hide()
            $(form.querySelectorAll(`option[data-market="${event.target.value}"]`)).show()
            //Then we set the hidden MarketName field
            let currentSelection = event.target.options[event.target.selectedIndex]
            marketNameElement.value = currentSelection.getAttribute('name')

        } else {
            $(form.querySelectorAll(`option[data-market]`)).show()
            marketNameElement.value = ''
        }
    })

    const FacilitySelectElement = form.get('select[name="FacilityId"]');
    let Facilities = Locations.filter(l => l.LocationType === "Facility")
    // console.info(Markets,Facilities)
    new Component({
        tag: 'option',
        attributes: [{ name: 'value', value: '' }],
        parent: FacilitySelectElement,
        innerText: 'Choose...'
    }).render();

    Facilities.forEach(option => {
        const { Id, LocationName, AssignedMarket } = option;
        new Component({
            tag: 'option',
            attributes: [
                { name: 'value', value: Id },
                { name: 'data-market', value: AssignedMarket},
                { name: 'name', value: LocationName },
            ],
            parent: FacilitySelectElement,
            innerText: LocationName
        }).render();
    })
    // const FacilitiesListObject = Web.getListDetails(FacilitiesListTitle)
    // await Route.Get(FacilitiesListObject?.__metadata.uri + '/Items', {
    //     $top: FacilitiesListObject.ItemCount,
    //     // $filter: `Archived eq 'false'`
    // })
    //     .then(data => data.d)
    //     .then(data => data.results)
    //     .then(data => {

    //         new Component({
    //             tag: 'option',
    //             attributes: [{ name: 'value', value: '' }],
    //             parent: FacilitySelectElement,
    //             innerText: 'Choose...'
    //         }).render();

    //         data.forEach(option => {
    //             const { Id, FacilityName, MarketId } = option;
    //             new Component({
    //                 tag: 'option',
    //                 attributes: [
    //                     { name: 'value', value: Id },
    //                     { name: 'data-market', value: MarketId },
    //                     { name: 'name', value: FacilityName },
    //                 ],
    //                 parent: FacilitySelectElement,
    //                 innerText: FacilityName
    //             }).render();
    //         });
    //     })
    //     .catch(response => {
    //         console.info(response);
    //     });

    FacilitySelectElement.addEventListener('change', event => { // If a facility is chosen first, we set the market. 
        let currentSelection = event.target.options[event.target.selectedIndex]
        if (!MarketSelectElement.value) {
            MarketSelectElement.value = currentSelection.dataset.market
            MarketSelectElement.dispatchEvent(new Event('change'));
        }

        let facilityNameElement = form.get('input[name="FacilityName"]')
        if (event.target.value) {
            //Then we set the hidden MarketName field
            facilityNameElement.value = currentSelection.getAttribute('name')
        } else {
            facilityNameElement.value = ''
        }
    })

    /** Set form values if data is passed; */
    if (data && data.constructor.name !== 'PointerEvent') {
        form.Values.set(data)
        $('#DCIRNumberElement').show();

        const PersonnelArray = JSON.parse(data?.PersonnelInvolved)
        if (PersonnelArray.length) {
            PersonnelArray.forEach(person => {
                GeneratePersonnelInfoSection(PersonnelContainer, { Branches, Ranks }, person)
            })
        }
        // TODO: Set fields as disabled based on overall form status (allow updating of POC info fields only)
        // console.info(form.Fields)
        form.Fields.Element.forEach(field=> {
            if(field.dataset.nav !== 'nav-contact')
            console.info(field)
        })
    }

    if (data && !isPointerEvent) new AuthorsAndModifiers({
        parent: modal.body,
        data,
    }).render();

    modal.show();
    form.Fields.focus();
}

function GeneratePersonnelInfoSection(parent, lookupOptions, data) {
    //This function renders one of the repeating Personnel Info sections. 
    const { Branches, Ranks } = lookupOptions
    const component = new Component({
        tag: 'div',
        classList: "row mt-4",
        parent,
        innerHTML: /*html*/`
            <div class="col-12">
                <span class='float-end pointer' data-remove>X</span>
            </div>
            <div class="col-lg-3 col-md-12">
                <label for="inputService" class="form-label">Service</label>
                <select id="inputService" name="Service" class="form-select" aria-label="Service Select" data-personnel data-nav="nav-Personnel" required></select>
            </div> 
            <div class="col-lg-3 col-md-12">
                <label for="inputComponent" class="form-label">Component</label>
                <select id="inputComponent" name="Component" class="form-select" aria-label="Component Select" data-personnel data-nav="nav-Personnel" required>
                    <option value="">Choose...</option>
                    <option ${data?.Component == "Active Duty" ? 'selected' : ''} value="Active Duty">Active Duty</option>
                    <option ${data?.Component == "Reserve" ? 'selected' : ''} value="Reserve">Reserve</option>
                    <option ${data?.Component == "National Guard" ? 'selected' : ''} value="National Guard">National Guard</option>
                    <option ${data?.Component == "None" ? 'selected' : ''} value="None">None</option>
                </select>
            </div> 
            <div class="col-lg-3 col-md-12">
                <label for="inputRank" class="form-label">Rank</label>
                <select id="inputRank" name="Rank" class="form-select" aria-label="Rank Select" data-personnel data-nav="nav-Personnel" required>
                </select>
            </div> 
            <div class="col-lg-3 col-md-12">
                <label for="inputGrade" class="form-label">Grade</label>
                <input type="text" id="inputGrade" name="Grade" class="form-control" aria-label="Grade Select" data-personnel data-nav="nav-Personnel" required disabled>
            </div>  
            <div class="col-lg-12">
                <p class="form-label"><small class="text-muted">Include duty position, date of last deployment (if applicable) and any other pertinent information about the individual involved.<br> Do not include name, PII, or PHI.</small></p>
                <textarea class="border rounded form-control" rows="2" id="inputPersonnelDetails" name="PersonnelDetails" data-personnel 
                data-nav="nav-Personnel" required>${data?.PersonnelDetails ? data.PersonnelDetails : ''}</textarea>
            </div>`
    })
    $(component.render().get()).hide().fadeIn()

    component.get(`span[data-remove]`).addEventListener('click', () => {
        const PersonnelRowElements = Array.from(form.get(`div[data-personnel-container]`).querySelectorAll(`div.row`))
        if (PersonnelRowElements.length > 1) {
            $(component.get()).fadeOut('', () => { component.remove() })
        } else {
            swal({
                icon: 'info',
                text: 'Each DCIR SITREP requires at least one Personnel Information section.',
            });
        }
    })

    //options for the dropdown selects in this section
    const ServiceSelectElement = component.get(`select[name=Service]`);
    new Component({
        tag: 'option',
        attributes: [{ name: 'value', value: '' }],
        parent: ServiceSelectElement,
        innerText: 'Choose...'
    }).render();
    Branches.forEach(option => {
        const { Branch } = option;
        const attributesArray = [{ name: 'value', value: Branch }];
        if (Branch === data?.Service) attributesArray.push({ name: 'selected', value: '' })
        new Component({
            tag: 'option',
            attributes: attributesArray,
            parent: ServiceSelectElement,
            innerText: Branch
        }).render();
    });

    ServiceSelectElement.addEventListener('change', (event) => { // This will show and hide Facility options based on the selected Market
        let currentSection = event.target.parentElement.parentElement;
        if (event.target.value) {
            $(currentSection.querySelectorAll(`option[data-service]`)).hide()
            $(currentSection.querySelectorAll(`option[data-service="${event.target.value}"]`)).show()
        } else {
            $(currentSection.querySelectorAll(`option[data-service]`)).show()
        }
    })

    const RanksSelectElement = component.get(`select[name=Rank]`);
    new Component({
        tag: 'option',
        attributes: [{ name: 'value', value: '' }],
        parent: RanksSelectElement,
        innerText: 'Choose...'
    }).render();
    Ranks.forEach(option => {
        const { Rank, Grade, Branch } = option;
        const attributesArray = [
            { name: 'value', value: Rank },
            { name: 'data-grade', value: Grade },
            { name: 'data-service', value: Branch }
        ];
        if (Rank === data?.Rank) attributesArray.push({ name: 'selected', value: '' })
        new Component({
            tag: 'option',
            attributes: attributesArray,
            parent: RanksSelectElement,
            innerText: Rank
        }).render();
    });

    if (data?.Grade) {
        component.get('input[name=Grade]').value = data.Grade
    }

    RanksSelectElement.addEventListener('change', event => {
        let GradeInputElement = event.target.parentElement.nextElementSibling.children[1]
        let grade = Array.from(event.target.children).filter(l => l.selected)[0].dataset.grade
        if (grade) {
            GradeInputElement.value = grade;
        } else {
            GradeInputElement.value = ""
        }
        if (!ServiceSelectElement.value) {
            ServiceSelectElement.value = Array.from(event.target.children).filter(l => l.selected)[0].dataset.service;
            ServiceSelectElement.dispatchEvent(new Event('change'));
        }
    })

}