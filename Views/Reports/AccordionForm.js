/**
 * Form.js
 * @description Reports Form
 * @author Wilfredo Pacheco
 */

import Form from "../../src/Classes/Form.js";
import Modal from "../../src/Classes/Modal.js";
import { List, table } from "./View.js"
import Post from "./Post.js";
import PostDraft from "./PostDraft.js";
import Patch from "./Patch.js";
import PatchDraft from "./PatchDraft.js";
import Delete from "../../src/Actions/Item.Delete.js";
import App, { Route, Web, User, ADMINISTRATOR, DEVELOPER, store } from "../../app.js";
import AuthorsAndModifiers from "../../src/Classes/AuthorsAndModifiers.js";
import { Title as IncidentsListTitle } from '../Incidents/List.js'

import { GetAllItems } from "../../src/Actions/List.GetAllItems.js";
import { formHTML, setFormLogic, setResources } from "./AccordionForm.logic.js";

export let modal;
export let form;

export default async function ShowForm(data, formValues) {

    const isEvent = data instanceof Event;
    const title = isEvent ? //if no data was passed into the call, it's a new item
    `New DCIR Report` :
    data?.Status == 'Draft' ? //if data is passed, it is then either a draft report or a completed report
        `Edit Draft DCIR Report` :
        `View DCIR Report` //since the only fields that can change on a completed report are for the POCs, we opt to say view instead of edit like the other form pages. 

    /** Modal Buttons; */
    const buttons = []; //We create buttons selectively based on the status of the data. Drafts have different validation rules than completed items, so use different methods

    /** Check to see if the form will render data from a list item; */
    if (data && !isEvent)
    {
        /** This means the status is Draft, and you get the the PATCH and modified PATCH buttons; */
        if (data.Status === 'Draft') buttons.push({
            tag: 'button',
            type: 'patch',
            classList: 'btn btn-secondary btn-sm',
            innerText: 'Save Draft',
            attributes: [{ name: 'src', value: data?.__metadata?.uri }],
            events: [{ name: 'click', action: PatchDraft }]
        }, {// TODO: check that the report status is being set appropriately both when submitting an item that was previously a draft and updating POC info on a completed item
            tag: 'button',
            type: 'patch',
            classList: 'btn btn-success btn-sm',
            innerText: 'Submit Report',
            attributes: [
                { name: 'src', value: data?.__metadata?.uri },
                { name: 'data-status', value: 'Draft' },
            ],
            events: [{ name: 'click', action: Patch }],
        },);

        // This should only render for admins and the item author;
        /** Handle existing reports where the status is 'Submitted'; */
        else if (data.AuthorId === User.Id 
        || User.hasRole(ADMINISTRATOR) 
        || User.hasRole(DEVELOPER)) buttons.push({
            tag: 'button',
            type: 'patch',
            classList: 'btn btn-success btn-sm',
            //Note: If you update the innerText for this button, update the correspodning if statement in Patch.js
            innerText: 'Update POC Info',
            attributes: [{ name: 'src', value: data?.__metadata?.uri }],
            events: [{ name: 'click', action: Patch }],
        });

    }

    /** Handle creating list item; */
    /** Handle new items created, to save as a draft or create; */
    else buttons.push({
        tag: 'button',
        type: 'post',
        classList: 'btn btn-secondary btn-sm',
        innerText: 'Save Draft',
        events: [{ name: 'click', action: PostDraft }],
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
        innerText: 'Submit Report',
        events: [{ name: 'click', action: Post }],
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
        && !isEvent
        && data.Status === 'Draft'
        //Only drafts can be deleted. Once a complete report is submitted, it becomes a part of the record. 
        && data.AuthorId === User.Id
        /** TODO: Should we allow admins or developers to delete drafts? */
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
    });

    // const BranchesListId = Web.getListDetails(BranchesListTitle).Id;
    // const RanksListId = Web.getListDetails(RanksListTitle).Id;
    // const EventTypeListId = Web.getListDetails(EventTypesListTitle).Id;
    // const LocationsListId = Web.getListDetails(LocationsListTitle).Id;
    const IncidentsListObject = Web.getListDetails(IncidentsListTitle);

    // const Branches = App.store.lists[BranchesListId].data;
    // const Ranks = App.store.lists[RanksListId].data;
    // const EventTypes = App.store.lists[EventTypeListId].data;
    // const Locations = App.store.lists[LocationsListId].data;
    const Incidents = await GetAllItems(IncidentsListTitle, {
        $filter: `Status ne 'Closed' and Status ne 'Legacy'`,
    });

    let ParentIncident
    if (data.DCIRNumber)  ParentIncident = await Route.Get(IncidentsListObject?.__metadata.uri + '/Items', {
        $top: IncidentsListObject.ItemCount,
        $filter: `DCIRNumber eq '${data.DCIRNumber}'`,
    })
    .then(data => data.d)
    .then(data => data.results[0]);

    //If we are looking at an existing item that isn't a draft, add a button to navigate to the parent Incident item
    if (data.DCIRNumber && !isEvent) {
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
        size: 'modal-xl',
        buttons,
    }).render();

    // if (User.hasRole('Administrator') && !isEvent) {
    //     const {
    //         Status,
    //     } = data
    //     if (Status === 'Submitted') {
    //         //TODO: This is where the Admin would handle items
    //         //Options here are 'Open', 'Open for Action', 'Closed'
    //         function callBack() {
    //             modal.hide()
    //             table.refresh()
    //         }
    //         CreateAdminToolbar(data, modal.body, callBack)
    //     }
    // }

    form = new Form({
        classList: 'g-3 needs-validation',
        parent: modal.body,
        // This innerHTML has the large event type select element
        innerHTML: /*html*/`
        <!-- ${List.Title} Form -->
        <div class="accordion" id="formAccordion">
            
            <!-- Section 1 - Initial Information -->
            <div class="accordion-item">
                <h2 class="accordion-header" id="initialInformationHeader">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#initialInformation" aria-expanded="true" aria-controls="initialInformation">
                        <strong>Initial Information</strong>
                    </button>
                </h2>
                <div id="initialInformation" class="accordion-collapse collapse show" aria-labelledby="initialInformationHeader">
                    <div class="accordion-body">
                        <div class="row">
                            <div class="col-xl-2 col-lg-4 col-md-12">
                                <div class="mb-2">
                                    <label for="inputReportType" class="form-label">Report Type</label>
                                    <select class="form-select" title="This is a test" id="inputReportType" name="ReportType" data-edit-locked required>
                                        <option value="">Choose...</option>
                                        <option value="Initial" title="Initial reports will create a new DCIR Incident in the system. A DCIR Number will be automatically assigned when the completed report is submitted.">Initial</option>
                                        <option value="Follow Up" title="Follow Up reports provide additional relevant information as ongoing incidents unfold.">Follow Up</option>
                                        <option value="Corrective" title="Corrective incidents are used to address any incorrect information that was entered in previous reports">Corrective</option>
                                        <option value="Final" title="Final reports should provide a summary of the corrective action and resolution of the incident. Final reports are required to move an incident from 'Open' or 'Open for Action' to 'Closed'">Final</option>
                                    </select>
                                </div>
                                <div class="my-2" id="DCIRNumberElement">
                                    <label for="inputDCIRNumber" class="form-label">DCIR Number</label>
                                    <select class="form-select" id="inputDCIRNumber" name="DCIRNumber" data-edit-locked></select>
                                </div>
                                <div class="my-2">
                                    <label for="inputDate" class="form-label">Date of Incident</label>
                                    <input type="date" id="inputDate" name="Date" class="form-control" aria-label="Date Input" value="${new Date().toISOString().split('T')[0]}" max="${new Date().toISOString().split('T')[0]}" data-edit-locked required>
                                </div>
                                <div class="my-2">
                                    <label for="inputTime" class="form-label">Time of Incident</label>
                                    <input type="time" id="inputTime" name="Time" class="form-control" aria-label="Time Input" data-edit-locked required>
                                </div>
                            </div>
                            <div class="col">
                                <div class="w-100">
                                    <label for="inputEventTypeNumber" class="form-label">Event Type</label>
                                    <select class="form-select" size="12" id="inputEventTypeNumber" name="EventTypeNumber" data-edit-locked required></select>
                                </div>
                            </div>
                            <div class="col-12 mt-1">
                                <button type="button" id="ViewMatrix" class="btn btn-sm btn-secondary mt-2 float-end" data-view-matrix>View DCIR Event Types</button>
                            </div>
                        </div>

                        <div class="row mb-2">
                            <div class="col" hidden>
                                <label for="inputEventTypeCategory" class="form-label">Event Category</label>
                                <input type="text" id="inputEventTypeCategory" name="EventTypeCategory" class="form-control" aria-label="Input" data-edit-locked required>
                                <p class="form-label">Event Description<small class="text-muted"></small></p>
                                <textarea class="border rounded form-control" rows="2" id="inputEventTypeDescription" name="EventTypeDescription" data-edit-locked required></textarea>
                                <p class="form-label">Notification Matrix<small class="text-muted"></small></p>
                                <textarea class="border rounded form-control" rows="2" id="inputEventTypeNotificationMatrix" name="EventTypeNotificationMatrix" data-edit-locked required></textarea>
                            </div>
                        </div>

                        <div class="row my-2">
                            <div class="col-lg-4 col-md-12">
                                <label for="inputMarketId" class="form-label">Market</label>
                                <select id="inputMarketId" name="MarketId" class="form-select" aria-label="Market Select" data-edit-locked required></select>
                            </div>
                            <div class="col-xl-4 col-lg-3">
                                <label for="inputFacilityName" class="form-label">Facility</label>
                                <input type="search" id="inputFacilityName" name="FacilityName" class="form-control" aria-label="Input" data-edit-locked required>
                            </div>
                        </div>    

                        <div class="row my-2" hidden>
                            <div class="col-lg-4 col-md-12">
                                <label for="inputMarketName" class="form-label">Market Name</label>
                                <input type="text" id="inputMarketName" name="MarketName" class="form-control" aria-label="Input" data-edit-locked>
                            </div>
                            <div class="col-lg-4 col-md-12">
                                <label for="inputFacilityId" class="form-label">Facility Id</label>
                                <select id="inputFacilityId" name="FacilityId" class="form-select" aria-label="Market Select" data-edit-locked></select>
                            </div>
                            <div class="col">
                                <label for="inputLatitude" class="form-label">Latitude</label>
                                <input type="text" id="inputLatitude" name="Latitude" class="form-control" aria-label="Input" data-edit-locked>
                            </div>
                            <div class="col">
                                <label for="inputLongitude" class="form-label">Longitude</label>
                                <input type="text" id="inputLongitude" name="Longitude" class="form-control" aria-label="Input" data-edit-locked>
                            </div>                                 
                        </div>
                        
                        <div class="row my-2"> 
                            <div class="col-lg-4 col-md-12">
                                <label for="inputIndicationOfDegradation" class="form-label">Indication Of Degradation</label>
                                <input type="text" id="inputIndicationOfDegradation" name="IndicationOfDegradation" class="form-control" data-edit-locked required>
                            </div>
                        </div>  

                    </div>
                </div>
            </div>

            <!-- Section 2 - Personnel Invlovled -->
            <div class="accordion-item">
                <h2 class="accordion-header" id="personnelInvolvedHeader">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#personnelInvolved" aria-expanded="true" aria-controls="personnelInvolved">
                        <strong>Personnel Involved</strong>
                    </button>
                </h2>
                <div id="personnelInvolved" class="accordion-collapse collapse" aria-labelledby="personnelInvolvedHeader">
                    <div class="accordion-body">
                        <div class="col-lg-12" hidden>
                            <p class="form-label"><small class="text-muted"></small></p>
                            <textarea class="border rounded form-control" rows="2" id="inputPersonnelInvolved" name="PersonnelInvolved" data-edit-locked></textarea>
                        </div>
                        <div data-personnel-container>
                            <!-- Here is where we insert the Personnel Info Sections with our function -->
                        </div>
                        <div class="px-3 py-4" id="PersonnelButton" data-member-btn-container="">
                            <span class="badge rounded-pill bg-primary text-white point px-2 float-end mx-1 my-2" data-add-member>Add Additional Personnel</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Section 3 - Report Details -->
            <div class="accordion-item">
                <h2 class="accordion-header" id="reportDetailsHeader">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#reportDetails" aria-expanded="true" aria-controls="reportDetails">
                        <strong>Report Details</strong>
                    </button>
                </h2>
                <div id="reportDetails" class="accordion-collapse collapse" aria-labelledby="reportDetailsHeader">
                    <div class="accordion-body">
                        <div class="row mb-2">  
                            <div class="col-lg-12">
                                <p class="form-label">Statement of Incident: <small class="text-muted">Detailed explanation of the incident</small></p>
                                <textarea class="border rounded form-control" rows="2" id="inputIncidentStatement" name="IncidentStatement" data-edit-locked required></textarea>
                            </div>
                        </div>
                        <div class="row my-2">  
                            <div class="col-lg-12">
                                <p class="form-label">Mission Impact: <small class="text-muted">Detailed statement of mission impact known at the time of submission and potential future impact</small></p>
                                <textarea class="border rounded form-control" rows="2" id="inputMissionImpact" name="MissionImpact" data-edit-locked required></textarea>
                            </div>
                        </div>
                        <div class="row my-2">  
                            <div class="col-lg-12">
                                <p class="form-label">Corrective Action Required or Taken: <small class="text-muted">Report mitigation/corrective actions taken or planned</small></p>
                                <textarea class="border rounded form-control" rows="2" id="inputCorrectiveAction" name="CorrectiveAction" data-edit-locked required></textarea>
                            </div>
                        </div>
                        <div class="row my-2">  
                            <div class="col-lg-12">
                                <p class="form-label">DHA HQ Assistance Required: <small class="text-muted">Explain required assistance</small></p>
                                <textarea class="border rounded form-control" rows="2" id="inputHQAssistance" name="HQAssistance" data-edit-locked required></textarea>
                            </div>
                        </div>
                        <div class="row my-2">
                            <div class="col-lg-4 col-md-12">
                                <label for="inputMediaInterest" class="form-label">Media Interest</label>
                                <select id="inputMediaInterest" name="MediaInterest" class="form-select" aria-label="MediaInterest Select" data-edit-locked required>
                                    <option value="">Choose...</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>
                            <div class="col-lg-4 col-md-12">
                                <label for="inputLawEnforcementInvolved" class="form-label">Law Enforcement Involved</label>
                                <select id="inputLawEnforcementInvolved" name="LawEnforcementInvolved" class="form-select" aria-label="LawEnforcementInvolved Select" data-edit-locked required>
                                    <option value="">Choose...</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>   
                            <div class="col-lg-4 col-md-12">
                                <label for="inputDrugAlcoholUse" class="form-label">Drug/Alcohol Use</label>
                                <select id="inputDrugAlcoholUse" name="DrugAlcoholUse" class="form-select" aria-label="DrugAlcoholUse Select" data-edit-locked required>
                                    <option value="">Choose...</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Section 4 - Points of Contact -->
            <div class="accordion-item">
                <h2 class="accordion-header" id="pointsOfContactHeader">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#pointsOfContact" aria-expanded="true" aria-controls="pointsOfContact">
                        <strong>Points of Contact</strong>                    
                    </button>
                </h2>
                <div id="pointsOfContact" class="accordion-collapse collapse" aria-labelledby="pointsOfContactHeader">
                    <div class="accordion-body">
                        <div class="row mb-2">
                            <div class="col-lg-4 col-md-12">
                                <label for="inputSubmitterName" class="form-label">Submitter Name</label>
                                <input type="text" id="inputSubmitterName" name="SubmitterName" class="form-control" aria-label="Input" value="${User.DisplayText}" required>
                            </div>
                            <div class="col-lg-4 col-md-12">
                                <label for="inputSubmitterEmail" class="form-label">Submitter Email</label>
                                <input type="email" id="inputSubmitterEmail" name="SubmitterEmail" class="form-control" aria-label="Input" value="${User.Email}" required>
                            </div>
                            <div class="col-lg-4 col-md-12">
                                <label for="inputSubmitterPhone" class="form-label">Submitter Phone</label>
                                <input type="tel" id="inputSubmitterPhone" name="SubmitterPhone" class="form-control" aria-label="Input" maxlength="10" minlength="10" required>
                            </div>
                        </div>
                        <div class="row my-2">
                            <div class="col-lg-4 col-md-12">
                                <label for="inputAdditionalPOCName" class="form-label">Alternate Name</label>
                                <input type="text" id="inputAdditionalPOCName" name="AdditionalPOCName" class="form-control" aria-label="Input" required>
                            </div>
                            <div class="col-lg-4 col-md-12">
                                <label for="inputAdditionalPOCEmail" class="form-label">Alternate Email</label>
                                <input type="email" id="inputAdditionalPOCEmail" name="AdditionalPOCEmail" class="form-control" aria-label="Input" required>
                            </div>
                            <div class="col-lg-4 col-md-12">
                                <label for="inputAdditionalPOCPhone" class="form-label">Alternate Phone</label>
                                <input type="tel" id="inputAdditionalPOCPhone" name="AdditionalPOCPhone" class="form-control" aria-label="Input" maxlength="10" minlength="10" required>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="px-3" id="reviewButton" data-review-container="">
            <span class="badge rounded-pill bg-secondary text-white point px-2 float-end mx-1 my-2" data-review>Review</span>
        </div>`,
        // This innerHTML is the basic event type select
        innerHTML: formHTML(User),
    }).render();

    form.setAttribute('data-form-tag', '');

    /** Bootstrap Tooltip; *****************************************/
    // Array.from(form.querySelectorAll('[title]'))
    // .map(el => {
    //     new bootstrap.Tooltip(el);
    // });
    /** jQuery Tooltip; - This is the same as the array above; */
    // Array.from(form.querySelectorAll('[title]'))
    //     .map(el => {
    //         $(el).tooltip();
    //     });
    /** NOTE: This doesn't work in an option element; **************/

    if (formValues) form.Values.set(formValues);

    /** Set for logic resouces; */
    setResources({
        Web,
        Route,
        store,
        modal,
        form,
    });
    
    setFormLogic({
        // Web,
        // store,
        // form,
        // modal,
        isEvent: true,
        Incidents,
        data,
    });

    /** Set form values if data is passed; */
    if (data && data.constructor.name !== 'PointerEvent') {
        form.Values.set(data);
        $('#PersonnelButton').hide();
    }

    if (data.Id && !isEvent) new AuthorsAndModifiers({
        parent: modal.body,
        data,
    }).render();

    modal.show();
    form.Fields.focus();
}