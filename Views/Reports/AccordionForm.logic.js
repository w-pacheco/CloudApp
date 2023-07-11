/**
 * AccordionForm.logic.js
 * @author Logan Bunker
 */

import Component from "../../src/Classes/Component.js";
import { BasicSearch } from "../../src/Classes/Search.js";
import { Title as ReportsListTitle } from '../Reports/List.js';
import { Title as EventTypesListTitle } from '../EventTypes/List.js';
import { Title as BranchesListTitle } from '../Branches/List.js';
import { Title as RanksListTitle } from '../Ranks/List.js';
import { Title as LocationsListTitle } from '../Locations/List.js';
// import { Title as IncidentsListTitle } from '../Incidents/List.js';
import BuildDisplayMatrix from "../BuildDisplayMatrix.js";

/** Resources used to run form logic; */
export let Web;
export let Route;
export let form;
export let modal;
export let store;

export function setResources(arg){
    Web = arg.Web;
    Route = arg.Route;
    form = arg.form;
    modal = arg.modal;
    store = arg.store;
}

export function formHTML(User){
    return /*html*/`
    <!-- {List?.Title} Form -->
    <div class="accordion" id="formAccordion">
        <div class="accordion-item">
            <h2 class="accordion-header" id="initialInformationHeader">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#initialInformation" aria-expanded="true" aria-controls="initialInformation">
                    <strong>Initial Information</strong>
                </button>
            </h2>
            <div id="initialInformation" class="accordion-collapse collapse show" aria-labelledby="initialInformationHeader">
                <div class="accordion-body">
                    <div class="row mb-2">
                        <div class="col-lg-4 col-md-12">
                            <label for="inputReportType" class="form-label">Report Type</label>
                            <select class="form-select form-select-sm" id="inputReportType" name="ReportType" data-edit-locked required>
                                <option value="">Choose...</option>
                                <option title="Initial reports will create a new DCIR Incident in the system. A DCIR Number will be automatically assigned when the completed report is submitted." value="Initial">Initial</option>
                                <option title="Follow Up reports provide additional relevant information as ongoing incidents unfold." value="Follow Up">Follow Up</option>
                                <option title="Corrective incidents are used to address any incorrect information that was entered in previous reports" value="Corrective">Corrective</option>
                                <option title="Final reports should provide a summary of the corrective action and resolution of the incident. Final reports are required to move an incident from 'Open' or 'Open for Action' to 'Closed'" value="Final">Final</option>
                            </select>
                        </div>
                        <div class="col-lg-4 col-md-12" id="DCIRNumberElement">
                            <label for="inputDCIRNumber" class="form-label">DCIR Number</label>
                            <select class="form-select form-select-sm" id="inputDCIRNumber" name="DCIRNumber" data-edit-locked></select>
                        </div>
                    <!-- </div> 
                    <div class="row my-2"> -->
                        <div class="col-lg-2 col-md-12">
                            <label for="inputEventTypeNumber" class="form-label">Event Type</label>
                            <select class="form-select form-select-sm" id="inputEventTypeNumber" name="EventTypeNumber" data-edit-locked required></select>
                        </div>
                        <div class="col mt-4">
                            <button type="button" id="ViewMatrix" class="btn btn-sm btn-secondary mt-2" data-view-matrix>View DCIR Event Types</button>
                        </div>
                        <div class="col" hidden>
                            <label for="inputEventTypeCategory" class="form-label">Event Category</label>
                            <input type="text" id="inputEventTypeCategory" name="EventTypeCategory" class="form-control form-control-sm" aria-label="Input" data-edit-locked required>
                            <input type="number" id="inputEventTypeId" name="EventTypeId" class="form-control form-control-sm" aria-label="Input" data-edit-locked>
                            <p class="form-label">Event Description<small class="text-muted"></small></p>
                            <textarea class="border rounded form-control" rows="2" id="inputEventTypeDescription" name="EventTypeDescription" data-edit-locked required></textarea>
                            <p class="form-label">Notification Matrix<small class="text-muted"></small></p>
                            <textarea class="border rounded form-control" rows="2" id="inputEventTypeNotificationMatrix" name="EventTypeNotificationMatrix" data-edit-locked required></textarea>
                        </div>
                    </div>    
                    <div class="row my-2">
                        <div class="col-lg-4 col-md-12">
                            <label for="inputMarketId" class="form-label">Market</label>
                            <select id="inputMarketId" name="MarketId" class="form-select form-select-sm" aria-label="Market Select" data-edit-locked required></select>
                        </div>
                        <div class="col-xl-4 col-lg-3">
                            <label for="inputFacilityName" class="form-label">Facility</label>
                            <input type="search" id="inputFacilityName" name="FacilityName" class="form-control form-control-sm" aria-label="Input" data-edit-locked required>
                        </div>
                        <!-- <div class="col" hidden>
                            <label for="inputFacilityName" class="form-label">Facility</label>
                            <input type="text" id="inputFacilityName" name="FacilityName" class="form-control" aria-label="Input" data-edit-locked required>
                        </div> -->
                        
                    </div>    
                    <div class="row my-2" hidden>
                        <div class="col-lg-4 col-md-12">
                            <label for="inputMarketName" class="form-label">Market Name</label>
                            <input type="text" id="inputMarketName" name="MarketName" class="form-control form-control-sm" aria-label="Input" data-edit-locked>
                        </div>
                        <div class="col-lg-4 col-md-12">
                            <label for="inputFacilityId" class="form-label">Facility Id</label>
                            <select id="inputFacilityId" name="FacilityId" class="form-select form-select-sm" aria-label="Market Select" data-edit-locked></select>
                        </div>
                        <div class="col">
                            <label for="inputLatitude" class="form-label">Latitude</label>
                            <input type="text" id="inputLatitude" name="Latitude" class="form-control form-control-sm" aria-label="Input" data-edit-locked>
                        </div>
                        <div class="col">
                            <label for="inputLongitude" class="form-label">Longitude</label>
                            <input type="text" id="inputLongitude" name="Longitude" class="form-control form-control-sm" aria-label="Input" data-edit-locked>
                            </div>
                        </div>
                    <div class="row my-2">        
                        <div class="col-lg-4 col-md-12">
                            <label for="inputDate" class="form-label">Date of Incident</label>
                            <input type="date" id="inputDate" name="Date" class="form-control form-control-sm" aria-label="Date Input" value="${new Date().toISOString().split('T')[0]}" max="${new Date().toISOString().split('T')[0]}" data-edit-locked required>
                        </div>
                        <div class="col-lg-4 col-md-12">
                            <label for="inputTime" class="form-label">Time of Incident</label>
                            <input type="time" id="inputTime" name="Time" class="form-control form-control-sm" aria-label="Time Input" data-edit-locked required>
                        </div>     
                    </div>    
                    <div class="row my-2"> 
                        <div class="col-lg-4 col-md-12">
                            <label for="inputIndicationOfDegradation" class="form-label">Indication Of Degradation</label>
                            <input type="text" id="inputIndicationOfDegradation" name="IndicationOfDegradation" class="form-control form-control-sm" data-edit-locked required>
                        </div>
                    </div>    
                </div>
            </div>
        </div>
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
                            <select id="inputMediaInterest" name="MediaInterest" class="form-select form-select-sm" aria-label="MediaInterest Select" data-edit-locked required>
                                <option value="">Choose...</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                        <div class="col-lg-4 col-md-12">
                            <label for="inputLawEnforcementInvolved" class="form-label">Law Enforcement Involved</label>
                            <select id="inputLawEnforcementInvolved" name="LawEnforcementInvolved" class="form-select form-select-sm" aria-label="LawEnforcementInvolved Select" data-edit-locked required>
                                <option value="">Choose...</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>   
                        <div class="col-lg-4 col-md-12">
                            <label for="inputDrugAlcoholUse" class="form-label">Drug/Alcohol Use</label>
                            <select id="inputDrugAlcoholUse" name="DrugAlcoholUse" class="form-select form-select-sm" aria-label="DrugAlcoholUse Select" data-edit-locked required>
                                <option value="">Choose...</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
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
                            <input type="text" id="inputSubmitterName" name="SubmitterName" class="form-control form-control-sm" aria-label="Input" value="${User.DisplayText}" required>
                        </div>
                        <div class="col-lg-4 col-md-12">
                            <label for="inputSubmitterEmail" class="form-label">Submitter Email</label>
                            <input type="email" id="inputSubmitterEmail" name="SubmitterEmail" class="form-control form-control-sm" aria-label="Input" value="${User.Email}" required>
                        </div>
                        <div class="col-lg-4 col-md-12">
                            <label for="inputSubmitterPhone" class="form-label">Submitter Phone</label>
                            <input type="tel" id="inputSubmitterPhone" name="SubmitterPhone" class="form-control form-control-sm" aria-label="Input" maxlength="10" minlength="10" required>
                        </div>
                    </div>
                    <div class="row my-2">
                        <div class="col-lg-4 col-md-12">
                            <label for="inputAdditionalPOCName" class="form-label">Alternate Name</label>
                            <input type="text" id="inputAdditionalPOCName" name="AdditionalPOCName" class="form-control form-control-sm" aria-label="Input" required>
                        </div>
                        <div class="col-lg-4 col-md-12">
                            <label for="inputAdditionalPOCEmail" class="form-label">Alternate Email</label>
                            <input type="email" id="inputAdditionalPOCEmail" name="AdditionalPOCEmail" class="form-control form-control-sm" aria-label="Input" required>
                        </div>
                        <div class="col-lg-4 col-md-12">
                            <label for="inputAdditionalPOCPhone" class="form-label">Alternate Phone</label>
                            <input type="tel" id="inputAdditionalPOCPhone" name="AdditionalPOCPhone" class="form-control form-control-sm" aria-label="Input" maxlength="10" minlength="10" required>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="px-3" id="reviewButton" data-review-container="">
        <span class="badge rounded-pill bg-secondary text-white point px-2 float-end mx-1 my-2" data-review>Review</span>
    </div>`;
}

export function createBlankChooseOption(parent, innerText = 'Choose...'){
    return new Component({
        tag: 'option',
        attributes: [{ name: 'value', value: '' }],
        parent,
        innerText,
    });
}

export function sortByLocationName(a, b){
    const nameA = a.LocationName.toUpperCase();
    const nameB = b.LocationName.toUpperCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
}

export function setFormLogic({ isEvent, Incidents, data }){

    const BranchesListId = Web.getListDetails(BranchesListTitle).Id;
    const RanksListId = Web.getListDetails(RanksListTitle).Id;
    const EventTypeListId = Web.getListDetails(EventTypesListTitle).Id;
    const LocationsListId = Web.getListDetails(LocationsListTitle).Id;
    // const IncidentsListObject = Web.getListDetails(IncidentsListTitle);
    const Branches = store.lists[BranchesListId].data;
    const Ranks = store.lists[RanksListId].data;
    const EventTypes = store.lists[EventTypeListId].data;
    const Locations = store.lists[LocationsListId].data.filter(l=>l.DisplayOnForm === "Yes");

    /** Filter the markets & facilities; */
    const Facilities = Locations.filter(l => l.LocationType === "Facility");
    const Markets = Locations.filter(l => l.LocationType === 'Market')
    .map(function({Id, LocationName}){
        return {
            Id,
            LocationName,
        }
    })
    .sort(sortByLocationName);

    $('#DCIRNumberElement').hide();

    const ReviewButton = form.get('span[data-review]');
    const EventTypesButton = form.get(`button[data-view-matrix]`);
    const PersonnelButton = form.get(`span[data-add-member]`);
    const PersonnelContainer = form.get(`div[data-personnel-container]`);
    const hiddenSelect = form.get('select[name="DCIRNumber"]');
    const ReportTypeSelectElement = form.get('select[name="ReportType"]');
    const MarketSelectElement = form.get('select[name="MarketId"]');
    const FacilitySelectElement = form.get('select[name="FacilityId"]');
    const EventTypesSelectElement = form.get('select[name="EventTypeNumber"]');
    const LocationSearch = form.get('input[name="FacilityName"]');

    ReviewButton.addEventListener('click', ReviewButtonClick);
    ReportTypeSelectElement.addEventListener('change', ReportTypeSelectElementChange);
    hiddenSelect.addEventListener('change', hiddenSelectChange);
    EventTypesSelectElement.addEventListener('change', EventTypesSelectElementChange);
    MarketSelectElement.addEventListener('change', MarketSelectElementChange);
    FacilitySelectElement.addEventListener('change', FacilitySelectElementChange);
    form.get().addEventListener('set', formSetEvent);

    function ReviewButtonClick(event){

        // We expand all collapsed sections of the accordion by sending them a click event, also scrolls to the top of the form and validate the form to highlight any fields that need to be looked at
        let buttons = event.target.parentElement.previousElementSibling.querySelectorAll('.accordion-button');
        
        buttons = Array.from(buttons).filter(button => button.classList.contains('collapsed'));
        buttons.forEach(button => button.dispatchEvent(new Event('click')));
        modal.body.scrollTop = 0;

        if (isEvent) form.Fields.validate();

    }

    // Creates and opens a read-only EventTypes modal;
    EventTypesButton.addEventListener('click',function(event){
        return BuildDisplayMatrix(EventTypes);
    });

    // Generates a new Personnel Info section and adds it to the form;
    PersonnelButton.addEventListener('click', function(event){
        return GeneratePersonnelInfoSection(PersonnelContainer, {
            Branches,
            Ranks,
        }, null, form);
    });

    // Sends a click event to add the first personnel section when a new Report is opened;
    if (isEvent) PersonnelButton.dispatchEvent(new Event('click'));

    /** Handle hiddenSelect; */
    createBlankChooseOption(hiddenSelect).render();
    Incidents.forEach(function({ Id, DCIRNumber, Status, Details }){
        return new Component({
            tag: 'option',
            attributes: [{ name: 'value', value: DCIRNumber }],
            parent: hiddenSelect,
            innerText: DCIRNumber,
        }).render();
    });

    function ReportTypeSelectElementChange(event){
        
        const hiddenDiv = form.get('#DCIRNumberElement');
        
        if ((event.target.value === 'Initial') 
        // || (event.target.value === '')
        )
        {
            $(hiddenDiv).fadeOut();
            form.clear();
            form.Values.set({
                ReportType: 'Initial',
                SubmitterName: User.DisplayText,
                SubmitterEmail: User.Email,
                Date: new Date().toISOString().split('T')[0],
            });
            hiddenSelect.removeAttribute('required');
        } else if(event.target.value === ''){
            $(hiddenDiv).fadeOut();
            hiddenSelect.removeAttribute('required');
            hiddenSelect.value = ''
        }
        
        else
        {
            $(hiddenDiv).fadeIn();
            hiddenSelect.setAttribute('required', '');
        }

    }

    async function hiddenSelectChange(event){

        const ReportsListObject = Web.getListDetails(ReportsListTitle);
        const previousReports = await Route.Get(ReportsListObject?.__metadata.uri + '/Items', {
            $top: ReportsListObject.ItemCount,
            $orderby: 'Id desc',
            $filter: `DCIRNumber eq '${event.target.value}'`
        })
        .then(data => data.d)
        .then(data => data.results);

        const previousReport = previousReports[0];
        // console.info(previousReport)

        /** Catch possible changes to the same form from corrective to initial; */
        if (!previousReport) return;

        let {
            DCIRNumber,
            EventTypeNumber,
            EventTypeCategory,
            EventTypeDescription,
            EventTypeNotificationMatrix,
            MarketId,
            MarketName,
            FacilityId,
            FacilityName,
            Latitude,
            Longitude,
            Date,
            Time,
            IndicationOfDegradation,
            PersonnelInvolved,
            IncidentStatement,
            MissionImpact,
            CorrectiveAction,
            HQAssistance,
            MediaInterest,
            LawEnforcementInvolved,
            DrugAlcoholUse,
        } = previousReport;

        const formData = {
            DCIRNumber,
            EventTypeNumber,
            EventTypeCategory,
            EventTypeDescription,
            EventTypeNotificationMatrix,
            MarketId,
            MarketName,
            FacilityId,
            FacilityName,
            Latitude,
            Longitude,
            Date,
            Time,
            IndicationOfDegradation,
            IncidentStatement,
            MissionImpact,
            HQAssistance,
            MediaInterest,
            LawEnforcementInvolved,
            DrugAlcoholUse,
        };

        if (form.get('select[name="ReportType"]').value !== 'Final') formData.CorrectiveAction = CorrectiveAction;
        form.Values.set(formData);

        const PersonnelArray = JSON.parse(PersonnelInvolved);
        if (PersonnelArray.length)
        {
            PersonnelArray.forEach(person => {
                GeneratePersonnelInfoSection(PersonnelContainer, { Branches, Ranks }, person, form);
            });
            form.get('span[data-remove]').dispatchEvent(new Event('click'));
        }

    }

    /** Add the choose option to the event type select; */
    createBlankChooseOption(EventTypesSelectElement).render();
    EventTypes.forEach(function ({ Id, EventNumber, Description, Category, NotificationMatrix }){
        return new Component({
            tag: 'option',
            attributes: [
                { name: 'value', value: EventNumber },
                { name: 'title', value: Description },
                { name: 'event-number', value: EventNumber },
                { name: 'description', value: Description },
                { name: 'category', value: Category },
                { name: 'notification-matrix', value: NotificationMatrix },
                { name: 'data-id', value: Id },
            ],
            parent: EventTypesSelectElement,
            // innerText: `(${EventNumber}) (${Category}) ${Description}`,
            innerText: `${EventNumber}`,
        }).render();
    });

    function EventTypesSelectElementChange(event){

        let descriptionElement = form.get('textarea[name="EventTypeDescription"]');
        let categoryElement = form.get('input[name="EventTypeCategory"]');
        let notificationMatrixElement = form.get('textarea[name="EventTypeNotificationMatrix"]');
        let EventTypeIdElement = form.get('input[name="EventTypeId"]');

        if (event.target.value)
        {
            let currentSelection = event.target.options[event.target.selectedIndex];
            descriptionElement.value = currentSelection.getAttribute('description');
            categoryElement.value = currentSelection.getAttribute('category');
            notificationMatrixElement.value = currentSelection.getAttribute('notification-matrix');
            EventTypeIdElement.value = currentSelection.dataset.id;
        }

        else if (event.target.value === '')
        {
            descriptionElement.value = '';
            categoryElement.value = '';
            notificationMatrixElement.value = '';
            EventTypeIdElement.value = '';
        }

    }

    /** Handle Market locations; */
    createBlankChooseOption(MarketSelectElement).render();
    Markets.forEach(function({Id, LocationName}){
        return new Component({
            tag: 'option',
            attributes: [
                { name: 'value', value: Id },
                { name: 'name', value: LocationName },
            ],
            parent: MarketSelectElement,
            innerText: LocationName,
        }).render();
    });

    /** Handle Facility locations; */
    /** Start - BasicSearch for locations; */
    const location_search = new BasicSearch({
        input: LocationSearch,
        key: 'LocationName',
        isInModal: true,
        data: Facilities,
        select(event, li) {
            FacilitySelectElement.value = li.item.data.Id;
            FacilitySelectElement.dispatchEvent(new Event('change'));
        },
    });

    function MarketSelectElementChange(event){

        // This will show and hide Facility options based on the selected Market;
        const marketNameElement = form.get('input[name="MarketName"]');
        
        location_search.filterSearchByKeyValue('AssignedMarket', event.target.value);
        if (event.target.value)
        {
            const currentSelection = event.target.options[event.target.selectedIndex];
            marketNameElement.value = currentSelection.getAttribute('name');
        } 
        
        else marketNameElement.value = '';
    }
    /** End - BasicSearch for locations; */

    createBlankChooseOption(FacilitySelectElement).render();
    Facilities.forEach(function({ Id, LocationName, AssignedMarket, Latitude, Longitude }){
        return new Component({
            tag: 'option',
            attributes: [
                { name: 'value', value: Id },
                { name: 'data-market', value: AssignedMarket },
                { name: 'name', value: LocationName },
                { name: 'latitude', value: Latitude ? Latitude : '' },
                { name: 'longitude', value: Longitude ? Longitude : '' },
            ],
            parent: FacilitySelectElement,
            innerText: LocationName,
        }).render();
    });

    function FacilitySelectElementChange(event){
        
        // If a facility is chosen first, we set the market. 
        let currentSelection = event.target.options[event.target.selectedIndex];
        
        if (!MarketSelectElement.value)
        {
            MarketSelectElement.value = currentSelection.dataset.market;
            MarketSelectElement.dispatchEvent(new Event('change'));
        }

        const facilityNameElement = form.get('input[name="FacilityName"]');
        
        // Then we set the hidden MarketName field;
        if (event.target.value) facilityNameElement.value = currentSelection.getAttribute('name');
        else facilityNameElement.value = '';

        const latitudeElement = form.get('input[name="Latitude"]');
        if (event.target.value) latitudeElement.value = currentSelection.getAttribute('latitude');
        else latitudeElement.value = '';

        const longitudeElement = form.get('input[name="Longitude"]');
        if (event.target.value) longitudeElement.value = currentSelection.getAttribute('longitude');
        else longitudeElement.value = '';

    }
    
    function formSetEvent(){

        /** FIXME: When changing the form between report types the dispatch fails; */
        // This triggers an infinate loop that is stopped by the browser;
        // This dispatches the change event that triggers the set method; line 366;
        /** TODO: Make sure we don't need this anywhere before removing the commented code; */
        // form.get('select[name="ReportType"]')?.dispatchEvent(new Event('change'));

        const PersonnelInvolved = form.get('textarea[name="PersonnelInvolved"]').value;
        const PersonnelArray = PersonnelInvolved ? JSON.parse(PersonnelInvolved) : [];
        
        if (PersonnelArray.length)
        {
            $(PersonnelContainer).empty();
            PersonnelArray.forEach(person => {
                GeneratePersonnelInfoSection(PersonnelContainer, { Branches, Ranks }, person, form);
            });
        }

        if (data?.Status && data?.Status !== 'Draft')
        {
            $('div[data-personnel-container]')
            .find('span[data-remove]')
            .map((i, element) => $(element).hide());

            const lockedFields = Array.from(form.get().querySelectorAll('[data-edit-locked]'));
            lockedFields.map(field => field.setAttribute('disabled', ''));
        }

    }

}

export function GeneratePersonnelInfoSection(parent, lookupOptions, data){

    // This function renders one of the repeating Personnel Info sections. 
    const { Branches, Ranks } = lookupOptions;

    const tag = 'div';
    const classList = 'row mt-4';

    const component = new Component({
        tag,
        classList,
        parent,
        innerHTML: /*html*/`
        <div class="col-12">
            <span class='float-end pointer' data-remove>X</span>
        </div>
        <div class="col-lg-3 col-md-12">
            <label for="inputService" class="form-label">Service</label>
            <select id="inputService" name="Service" class="form-select form-select-sm" aria-label="Service Select" data-personnel data-nav="nav-Personnel" data-edit-locked required></select>
        </div> 
        <div class="col-lg-3 col-md-12">
            <label for="inputComponent" class="form-label">Component</label>
            <select id="inputComponent" name="Component" class="form-select form-select-sm" aria-label="Component Select" data-personnel data-nav="nav-Personnel"data-edit-locked required>
                <option value="">Choose...</option>
                <option ${data?.Component == "Active Duty" ? 'selected' : ''} value="Active Duty">Active Duty</option>
                <option ${data?.Component == "Reserve" ? 'selected' : ''} value="Reserve">Reserve</option>
                <option ${data?.Component == "National Guard" ? 'selected' : ''} value="National Guard">National Guard</option>
                <option ${data?.Component == "None" ? 'selected' : ''} value="None">None</option>
            </select>
        </div> 
        <div class="col-lg-3 col-md-12">
            <label for="inputRank" class="form-label">Rank</label>
            <select id="inputRank" name="Rank" class="form-select form-select-sm" aria-label="Rank Select" data-personnel data-nav="nav-Personnel"data-edit-locked required></select>
        </div> 
        <div class="col-lg-3 col-md-12">
            <label for="inputGrade" class="form-label">Grade</label>
            <input type="text" id="inputGrade" name="Grade" class="form-control form-select-sm" aria-label="Grade Select" data-personnel data-nav="nav-Personnel" data-edit-locked required disabled>
        </div>  
        <div class="col-lg-12">
            <p class="form-label"><small class="text-muted">Include duty position, date of last deployment (if applicable) and any other pertinent information about the individual involved.<br> Do not include name, PII, or PHI.</small></p>
            <textarea class="border rounded form-control" 
                      rows="2" id="inputPersonnelDetails" 
                      name="PersonnelDetails" 
                      data-personnel 
                      data-nav="nav-Personnel" 
                      data-edit-locked 
                      required>${data?.PersonnelDetails ? data.PersonnelDetails : ''}</textarea>
        </div>`,
    });

    $(component.render().get()).hide().fadeIn();

    /** Handle the Personnel Information section, make sure the user has at least one person; */
    component.get(`span[data-remove]`).addEventListener('click', function(event){
        const PersonnelRowElements = Array.from(form.get(`div[data-personnel-container]`).querySelectorAll(`div.row`));
        if (PersonnelRowElements.length > 1) $(component.get()).fadeOut('', () => component.remove());
        else swal({
            icon: 'info',
            text: 'Each DCIR SITREP requires at least one Personnel Information section.',
        });
    });

    // Options for the dropdown selects in this section;
    const ServiceSelectElement = component.get(`select[name=Service]`);
    createBlankChooseOption(ServiceSelectElement).render();
    Branches
    .forEach(function({ Branch }){

        const attributesArray = [{ name: 'value', value: Branch }];
        if (Branch === data?.Service) attributesArray.push({ name: 'selected', value: '' });

        return new Component({
            tag: 'option',
            attributes: attributesArray,
            parent: ServiceSelectElement,
            innerText: Branch,
        }).render();

    });

    ServiceSelectElement.addEventListener('change', function(event){
        let currentSection = event.target.parentElement.parentElement;
        if (event.target.value)
        {
            $(currentSection.querySelectorAll(`option[data-service]`)).hide();
            $(currentSection.querySelectorAll(`option[data-service="${event.target.value}"]`)).show();
        } 
        else $(currentSection.querySelectorAll(`option[data-service]`)).show();
    });

    const RanksSelectElement = component.get(`select[name=Rank]`);
    createBlankChooseOption(RanksSelectElement).render();
    Ranks.forEach(function({ Rank, Grade, Branch }){
        const attributesArray = [
            { name: 'value', value: Rank },
            { name: 'data-grade', value: Grade },
            { name: 'data-service', value: Branch },
        ];
        if (Rank === data?.Rank) attributesArray.push({ name: 'selected', value: '' });
        return new Component({
            tag: 'option',
            attributes: attributesArray,
            parent: RanksSelectElement,
            innerText: Rank,
        }).render();
    });

    if (data?.Grade) component.get('input[name=Grade]').value = data.Grade;

    RanksSelectElement.addEventListener('change', function(event){

        let GradeInputElement = event.target.parentElement.nextElementSibling.children[1];
        let grade = Array.from(event.target.children).filter(l => l.selected)[0].dataset.grade;

        if (grade) GradeInputElement.value = grade;
        else GradeInputElement.value = "";
        
        if (!ServiceSelectElement.value)
        {
            ServiceSelectElement.value = Array.from(event.target.children).filter(l => l.selected)[0].dataset.service;
            ServiceSelectElement.dispatchEvent(new Event('change'));
        }

    });

}