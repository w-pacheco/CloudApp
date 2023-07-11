/**
 * index.js
 * @author Wilfredo Pacheco
 */

import '../../node_modules/jquery/dist/jquery.js';
import '../../node_modules/jquery-ui/dist/jquery-ui.js';
import '../../node_modules/bootstrap/dist/js/bootstrap.bundle.js';
import '../../node_modules/pdfmake/build/pdfmake.js';
import '../../node_modules/pace-js/pace.js';
import '../../src/Libraries/DataTables/dataTables.js';
import '../../node_modules/js-sha256/src/sha256.js';

import Biome from "../../src/Biome.js";
import * as Settings from './settings.js';
import Component from '../../src/Classes/Component.js';
import Modal from '../../src/Classes/Modal.js';
import Form from '../../src/Classes/Form.js';
import Toast from '../../src/Classes/Toast.js';
import Report from '../../src/Components/Report.js';
import { Copyright, Name, Icon, Version, favicon } from '../../app.details.js';

const COPYRIGHT = `&copy 2023 SAIC`;
// const COPYRIGHT = '&copy 2023 DHA J-5 AED Knowledge Management';
const CAPTION = `The a template of Biome.js version 2 for developers.`;
// const NAV_ELEMENT_IMAGE_LINK = './src/images/SAIC/3_Black/SAIC-Logo-RGB-Black-sm.png';
const NAV_ELEMENT_IMAGE_LINK = './images/DHA/DefenseHealthAgencyDHALogo2black.png';

/**
 * parseURL
 * @param {String} url is a URL string
 * @description Used by SPService to handle statusCode specific errors;
 * @returns URL string
 */
function parseURL(url){
    const newURL = new URL(url);
    const { origin, pathname } = newURL;
    return origin + pathname;
}

const FORCE = 'force';
// const emailservice = 'workflow';
const appSettings = {...Settings};
const App = new Biome(Object.assign(appSettings, {
    // emailservice,
    Copyright, 
    Name, 
    Icon, 
    Version, 
    favicon,
    serviceOptions: {
        protocol: 'jQuery',
        verbose: false,
        statusCode: {
            /** Temporary Redirect; */
            307: function(xhr, error, textStatus){
                return swal({
                    icon: 'warning',
                    text: 'Something went wrong, the application needs to refresh.',
                }).then(response => { return location.reload(); });
            },
            /** Unauthorized; */
            401: function(xhr, error, textStatus){
                return new Toast({ /** Alert; */
                    type: 'danger',
                    message: `${xhr.status} ${textStatus}! Your ${this.type} request: ${parseURL(this.url)} Failed!`,
                }).render().show();
            },
            /** Method Not Allowed; */
            405: function(xhr, error, textStatus){
                return new Toast({ /** Alert; */
                    type: 'danger',
                    message: `${xhr.status} ${textStatus}! Your ${this.type} request: ${parseURL(this.url)} Failed!`,
                }).render().show();
            },
        },
    },
}));

export const NavBarLogo = {
    // src: './src/Images/bootstrap-logo-shadow.png', width: 20, /** Default; */
    // src: './src/images/SAIC/3_Black/SAIC-Logo-RGB-Black-sm.png', width: 35, /** SAIC; */
    src: './src/images/SAIC/4_White/SAIC-Logo-RGB-White-sm.png', width: 40,
    // src: './images/DHA/DefenseHealthAgencyDHALogo2black.png', width: 35, /** DHA; */
    // src: './images/DHA/DefenseHealthAgencyDHALogowhitetransp.png', width: 35,
    // src: './images/DHA/DefenseHealthAgencyDHALogo2.png', width: 15,
}

/** Handle application roles; */
export let ADMINISTRATOR = 'Administrator';
export let DEVELOPER = 'Developer';
export let isReload = false;
export let Web = {};
export let Site = {};
export let User = {};
export let CustomSettings = {};
export let Layout = {};
export let store = App.store;
export const Route = App.route;

export default App;

/**
 * init
 * @returns App Object
 */
async function init(event){

    const { ext } = App;

    /** Load Settings; */
    await Settings.default(App);

    const { web, user, site } = await App.config();

    Web = web;
    User = user;
    Site = site;
    store = App.store;
    ADMINISTRATOR = App.ADMINISTRATOR;
    DEVELOPER = App.DEVELOPER;

    // await setStaticListObserver();
    // document.body.classList.add('container-xl');

    const Main = new Component({
        tag: 'main',
        classList: 'row h-100 p-0 m-0 m-100',
        parent: document.body,
        innerHTML: /*html*/`
        <div aria-live="polite" aria-atomic="true" style="z-index:2147483647 !important;">
            <div class="toast-container top-0 end-0 p-3" data-toast-container></div>
        </div>
        <div class="container py-3">
            <header>
                <div class="d-flex flex-column flex-md-row align-items-center pb-3 mb-4 border-bottom">
                    <a href="/" class="d-flex align-items-center link-body-emphasis text-decoration-none ms-2">
                        <img class="logo" src="${NavBarLogo.src}" style="width:${NavBarLogo.width}%;" alt="DHA-seal" />
                    </a>

                    <nav class="d-inline-flex mt-2 mt-md-0 ms-md-auto">
                        <a class="me-3 py-2 link-body-emphasis text-decoration-none d-none" href="#">Features</a>
                        <a class="me-3 py-2 link-body-emphasis text-decoration-none d-none" href="#">Enterprise</a>
                        <a class="me-3 py-2 link-body-emphasis text-decoration-none d-none" href="#">Support</a>
                        <a class="py-2 link-body-emphasis text-decoration-none d-none" href="#">Sign Out</a>
                    </nav>
                </div>

                <div class="pricing-header p-3 pb-md-4 mx-auto text-center rounded-top">
                    <h1 class="fw-normal text-white">${Name}</h1>
                </div>
            </header>

            <main class="rounded-bottom mt-5">
                <div class="row row-cols-1 row-cols-md-3 mb-3 text-center mx-3">
                    <div class="col">
                        <div class="card mb-4 rounded-3 shadow-sm">
                            <div class="card-header py-3">
                                <h4 class="my-0 fw-normal">info.health.mil</h4>
                            </div>
                            <div class="card-body">
                                <h1 class="card-title pricing-card-title d-none"><small class="fw-light">Visit info.health.mill</small></h1>
                                <ul class="list-unstyled mt-3 mb-4">
                                    <li>Visit info.health.mil</li>
                                    <li>Search info.health.mil</li>
                                    <li>Sign Out</li>
                                </ul>
                                <a href="javascript:alert('Element is missing URL!');" class="w-100 btn btn-lg btn-outline-primary mt-4">Visit</a>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="card mb-4 rounded-3 shadow-sm">
                            <div class="card-header py-3">
                                <h4 class="my-0 fw-normal">Reports</h4>
                            </div>
                            <div class="card-body">
                                <h1 class="card-title pricing-card-title d-none"><small class="text-body-secondary fw-light"></small></h1>
                                <ul class="list-unstyled mt-3 mb-4">
                                    <li>Create a DCIR Report</li>
                                    <li>Submit a DCIR Report</li>
                                </ul>
                                <button type="button" class="w-100 btn btn-lg btn-primary mt-5" data-create>Create</button>
                                <!-- <a href="./app.${ext}?show=form#Reports" class="w-100 btn btn-lg btn-primary mt-5">Create</a> -->
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="card mb-4 rounded-3 shadow-sm">
                            <div class="card-header py-3">
                                <h4 class="my-0 fw-normal">Manage</h4>
                            </div>
                            <div class="card-body">
                                <h1 class="card-title pricing-card-title d-none">$29<small class="text-body-secondary fw-light">/mo</small></h1>
                                <ul class="list-unstyled mt-3 mb-4">
                                    <li>Create a DCIR Report Draft</li>
                                    <li>Create/Manage Existing Reports</li>
                                    <li>Revisit Completed Reports</li>
                                    <li>Manage Existing Report Drafts</li>
                                </ul>
                                <a href="./app.${ext}" class="w-100 btn btn-lg btn-primary">Enter</a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer class="pt-3 border-top">
                <div class="row">
                    <div class="col-12 col-md">
                        <!-- <img class="mb-2" src="${NAV_ELEMENT_IMAGE_LINK}" alt="DHA" width="90" height="36" /> -->
                        <!-- <img class="logo w-25" src="${NAV_ELEMENT_IMAGE_LINK}" alt="DHA" /> -->
                        <small class="d-block mb-3 text-body-secondary text-end me-3 text-white">&copy 2023 DHA J-5 AED Knowledge Management</small>
                    </div>
                    <div class="col-6 col-md d-none">
                        <h5>Features</h5>
                        <ul class="list-unstyled text-small">
                            <li class="mb-1"><a class="link-secondary text-decoration-none" href="#">Cool stuff</a></li>
                            <li class="mb-1"><a class="link-secondary text-decoration-none" href="#">Random feature</a></li>
                            <li class="mb-1"><a class="link-secondary text-decoration-none" href="#">Team feature</a></li>
                            <li class="mb-1"><a class="link-secondary text-decoration-none" href="#">Stuff for developers</a></li>
                            <li class="mb-1"><a class="link-secondary text-decoration-none" href="#">Another one</a></li>
                            <li class="mb-1"><a class="link-secondary text-decoration-none" href="#">Last time</a></li>
                        </ul>
                    </div>
                    <div class="col-6 col-md d-none">
                        <h5>Resources</h5>
                        <ul class="list-unstyled text-small">
                        <li class="mb-1"><a class="link-secondary text-decoration-none" href="#">Resource</a></li>
                        <li class="mb-1"><a class="link-secondary text-decoration-none" href="#">Resource name</a></li>
                        <li class="mb-1"><a class="link-secondary text-decoration-none" href="#">Another resource</a></li>
                        <li class="mb-1"><a class="link-secondary text-decoration-none" href="#">Final resource</a></li>
                        </ul>
                    </div>
                    <div class="col-6 col-md d-none">
                        <h5>About</h5>
                        <ul class="list-unstyled text-small">
                        <li class="mb-1"><a class="link-secondary text-decoration-none" href="#">Team</a></li>
                        <li class="mb-1"><a class="link-secondary text-decoration-none" href="#">Locations</a></li>
                        <li class="mb-1"><a class="link-secondary text-decoration-none" href="#">Privacy</a></li>
                        <li class="mb-1"><a class="link-secondary text-decoration-none" href="#">Terms</a></li>
                        </ul>
                    </div>
                </div>
            </footer>
        </div>`,
        innerHTML: /*html*/`
        <div class="pt-3">
            <header>
                <div class="d-flex flex-column flex-md-row align-items-center pb-3 mb-4 border-bottom">
                    <a href="/" class="d-flex align-items-center link-body-emphasis text-decoration-none ms-2">
                        <img class="logo" src="${NavBarLogo.src}" style="width:${NavBarLogo.width}%;" alt="DHA-seal" />
                    </a>
                </div>
            </header>
        </div>
        <div aria-live="polite" aria-atomic="true" style="z-index:2147483647 !important;">
            <div class="toast-container top-0 end-0 p-3" data-toast-container></div>
        </div>
        <div class="text-center rounded-3">
            <img class="logo mb-3" src="${favicon}" data-seal alt="DHA-seal" />
            <h1 class="text-white">${Name}</h1>
            <p class="col-lg-8 mx-auto fs-5 text-white">${CAPTION}</p>
            <div class="d-inline-flex gap-2 mb-5">
                <button class="d-inline-flex align-items-center btn btn-success btn-lg px-4 rounded-pill" type="button" data-create>
                    Create Report&#160;<span class="ps-1 pb-1">${document.getIcon('pencil-square').outerHTML}</span>
                </button>
                <a href="./app.${ext}" class="d-inline-flex align-items-center btn btn-success btn-lg px-4 rounded-pill" type="button">
                    Enter Portal&#160;<span class="ps-1 pb-1">${document.getIcon('arrow-right').outerHTML}</span>
                </a>
            </div>
        </div>
        <footer class="pt-3">
            <div class="row">
                <div class="col-12 col-md">
                    <small class="d-block mb-3 text-end me-3 text-white">${COPYRIGHT}</small>
                </div>
            </div>
        </footer>`,
    }).render();

    $(Main.get()).hide().fadeIn();

    const ToastContainer = Main.get('div.toast-container');
    /** This defines the Layout element, used to render views in the application; */
    Layout = {
        Main,
        ToastContainer,
    }

    /** NOTE: This should be removed after developement is complete; */
    if (User?.hasRole(DEVELOPER)) Object.assign(window, {
        App,
        Web,
        Route,
        Site,
        User,
        Layout,
        Biome,
        CustomSettings,
    });

    const CreateBtn = Main.get(`button[data-create]`);
    // $(CreateBtn).hide();
    // console.info(CreateBtn);
    CreateBtn.classList.add('d-none');
    // CreateBtn.addEventListener('click', createBtnClick);

    async function createBtnClick(event){
        
        let modal;
        let form;
        const title = `New Report`;

        /** Get the incidents here before you set the form logic; */
        const IncidentsList = Web.getListDetails(IncidentsListTitle);
        const Incidents = await Route.Get(`${IncidentsList.__metadata.uri}/Items`, {
            $select: '*',
            $filter: `(Status ne 'Closed') and (Status ne 'Legacy')`,
            $top: IncidentsList.ItemCount,
        })
        .then(data => data.d)
        .then(data => data.results);

        const buttons = [{
            tag: 'button',
            type: 'post',
            classList: 'btn btn-success btn-sm',
            innerText: 'Submit Report',
            events: [{
                name: 'click',
                action(event){

                    event.preventDefault();
                    event.stopPropagation();

                    const Element = event.target.tagName === 'BUTTON' ?
                    event.target :
                    event.target.closest('button');

                    /** Form Validation - if the return is false, this will be true and return null; */
                    if (!form.Fields.validate()) return swal({
                        icon: 'warning',
                        text: 'This form cannot be submitted until all required fields are completed.',
                    });

                    $(Element)
                    .attr('disabled', '') /** Disable button; */
                    .html(/*html*/`<!-- Spinner Element -->
                    <span class="spinner-border spinner-border-sm" 
                          role="status" 
                          aria-hidden="true">
                    </span> Sending Request...`);

                    const List = Web.getListDetails('Reports');
                    const Url = `${List.__metadata.uri}/Items`;
                    let notification_toast = new Toast({
                        type: 'warning',
                        message: `<strong>Warning:</strong> Please do not navigate from this page until the notifications have been sent.`,
                        autohide: false,
                    })
                    .render()
                    .show();

                    return createIncidentItemAndReportPOSTRequest({
                        List,
                        form,
                        Web,
                        Route,
                        Layout,
                    })
                    .then(function({ request, incidentData }){

                        /** Send POST request to the Reports list; */
                        return Route.Post(Url, request)
                        .done(function RequestComplete(data, textStatus, xhr) {
                            if (xhr.status >= 200 && xhr.status < 300) {

                                $(Element).text('Success!');
                                modal.hide();

                                /** Notify Markets and DOC that a report has been submitted */
                                // NotifyReportSubmitted(data.d, incidentData);

                                /** Start - Handle locations not found on the locations list; */
                                const { FacilityName, FacilityId, ReportType, DCIRNumber } = data.d;
                                
                                /** Handle the creation of locations based on the facility name saved regardless of the item status; */
                                Promise.all([
                                    /** Get the location by title from the locations list; */
                                    getLocationByTitle(FacilityName),
                                    /** Get the location request by DCIR number from the location request list; */
                                    getRequestByDCIR(DCIRNumber),
                                    /** Notify Markets and DOC that a report has been submitted */
                                    NotifyReportSubmitted(data.d, incidentData),
                                ])
                                .then(function ([
                                    LocationResult,
                                    LocationRequestResult,
                                ]){
                                    if (!LocationResult && !LocationRequestResult) createLocationRequest(Object.assign(data.d, {
                                        LocationName: FacilityName,
                                    }))
                                    .then(data => {
                                        return NotifyAdminOfLocationRequest(data.d);
                                    });
                                })
                                .then(() => {
                                    notification_toast.hide();

                                    // new Toast({
                                    //     type: 'success',
                                    //     message: `Notifications have been sent! It is safe to navigate away from this page.`,
                                    // })
                                    // .render()
                                    // .show();

                                });
                                /** End - Handle locations not found on the locations list; */

                                /** Alert; */
                                new Toast({
                                    type: 'success',
                                    message: `Success! Your ${data.d.ReportType} Report was submitted.`,
                                    parent: Layout.ToastContainer,
                                })
                                .render()
                                .show();

                            }
                        })
                        .fail(function RequestFailed(xhr, textStatus, errorThrown) {

                            const AlertBodyStr = xhr.responseJSON ?
                            xhr.responseJSON.error.message.value.split('.').join('</div><div>') :
                            errorThrown;

                            new Toast({
                                type: 'danger',
                                message: /*html*/`Request ${textStatus} - ${errorThrown}
                                <div>${AlertBodyStr}</div>`,
                            })
                            .render()
                            .show();

                        })
                        .catch(console.info);
                    });

                },
            }],
        }];

        modal = new Modal({
            title,
            draggable: true,
            size: 'modal-xl',
            buttons,
        }).render();
        
        form = new Form({
            classList: 'g-3 needs-validation',
            parent: modal.body,
            innerHTML: formHTML(User),
        }).render();

        /** Set for logic resouces; */
        setResources({
            Web,
            Route,
            store,
            modal,
            form,
        });

        setFormLogic({
            Web,
            store,
            form,
            modal,
            isEvent: true,
            Incidents,
            data: new Object(),
        });

        /** NOTE: Currently Users should ONLY create and submit reports from the index page; */
        const ReportTypeElement = form.get('select[name=ReportType]');
        ReportTypeElement.value = 'Initial';
        ReportTypeElement.setAttribute('disabled', '');
        /*********************************************************************************** */

        modal.show();
        
    }

    /** Handle App settings - By default darkmode is disabled when the site loads; */
    // if (!CustomSettings.DarkMode && !isReload) ToggleDarkTheme();
    // if (CustomSettings.Theme) SetTheme(CustomSettings.Theme);

    /** Render the views within the application based on the user's roles; */
    // Render();
    // if (Settings.Verbose) DisplayVerbose(Settings);
    
    /** Log the first view for the user; */
    window.dispatchEvent(new Event('popstate'));
    isReload = true;
    return App;
}

/** Application Global Event Listeners; */
// window.addEventListener('keydown', darkModeEvent);
// window.addEventListener('popstate', LogActions);
window.addEventListener('unhandledrejection', Report);
window.addEventListener('error', Report);
// window.addEventListener('load', init);
window.onload = init;