/**!
 * Checkpoint
 * https://github.com/w-pacheco/checkpoint
 * 
 * @descripton app.js
 * @author Wilfredo Pacheco
 * 
 * Copyright (SAIC) Science Applications International Corporation and other contributors
 * Released under the MIT license.
 */

/** Imports that have been checked and adjusted; */
import Biome, { localhost } from "./src/Biome.js";
import Component from './src/Classes/Component.js';
import Report from './src/Components/Report.js';
import LogActions, { DisplayVerbose } from './src/Actions/Actions.Log.js';
import ToggleDarkTheme from './src/Components/Theme.Dark.js';
import crypto from './src/Actions/Crypto.js';
import darkModeEvent from './src/Actions/darkModeEvent.js';

/** Imports that still need to be checked and adjusted; */
import * as Settings from './app.settings.js';
import Render from './app.render.js';
import CheckSchema from './src/Actions/Schema.Check.js';
import SetTheme from './src/Actions/Theme.Set.js';
import { getRoles, getSettings } from './src/Actions/User.js';
// import getCurrentUserProjects from "./Views/Projects/getCurrentUserProjects.js";
import SPStaticListObserver from "./src/Classes/SPStaticListObserver.js";
import { Copyright, Name, Icon, Version, favicon } from './app.details.js';
import Toast from "./src/Classes/Toast.js";
// import LocalDB from './src/Classes/LocalDataBase.js';
// import LocalStorage from "./src/Classes/LocalStorage.js";

const { port } = location;

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
                    autohide: false,
                }).render().show();
            },
            /** Method Not Allowed; */
            405: function(xhr, error, textStatus){
                if (localhost)
                {
                    const toast = new Toast({ /** Alert; */
                        type: 'danger',
                        message: `${xhr.status} ${textStatus}! Your ${this.type} request: ${parseURL(this.url)} Failed! To reload the application without a proxy click the button below.`,
                        autohide: false,
                    }).render();

                    const parent = toast.get('.toast-body');
                    const url = new URL(location);
                    url.searchParams.set('PROXY', false);
                    new Component({
                        tag: 'div',
                        classList: 'mt-2 text-end',
                        parent,
                        innerHTML: /*html*/`
                        <a class="btn btn-sm btn-light text-dark" href="${url.href}">Reload</a>`,
                    }).render();
                    
                    return toast.show();
                }
                
                else return new Toast({ /** Alert; */
                    type: 'danger',
                    message: `${xhr.status} ${textStatus}! Your ${this.type} request: ${parseURL(this.url)} Failed!`,
                    autohide: false,
                }).render().show();
            },
        },
    },
}));

export const NavBarLogo = {
    // src: './src/Images/bootstrap-logo-shadow.png', width: 55,                /** Default; */
    src: './src/images/SAIC/4_White/SAIC-Logo-RGB-White-sm.png', width: 85,  /** SAIC; */
    // src: './src/images/SAIC/4_White/SAIC-Logo-RGB-White-sm.png', width: 85,
    // src: './images/DHA/DefenseHealthAgencyDHALogowhitetransp.png', width: 80,   /** DHA; */
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
export let store = {};
export const Route = App.route;

/**
 * setStaticListObserver
 * @description Set the lists that we will reference during application usage; testing phase;
 */
function setStaticListObserver(storedLists){

    if (!storedLists instanceof Array || !storedLists.length) return;

    const listObserver = new SPStaticListObserver({storedLists});
    store.set('listObserver', listObserver, FORCE);
    return listObserver.init();
}

/**
 * init
 * @returns App Object
 */
async function init(event){

    const { storedLists } = Settings;
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

    /** Handle if locally hosted with live-server; */
    if (port !== '8081')
    {
        await getRoles()
        .then(Roles => {
            User.Roles = Roles.map(r => r.Role);
        });

        await CheckSchema();

        /** set the projects the use is a member of to the user object; */
        // User.Projects = await getCurrentUserProjects();
        // console.info(User.Projects);

        /** Load Custom User Settings; */
        CustomSettings = await getSettings();
        App.set('Settings', CustomSettings, FORCE);

        await setStaticListObserver(storedLists);
    }

    // const changeTokens = new LocalStorage({
    //     name: 'ChangeTokens',
    //     data: web.Lists.results
    //     .filter(function allAppLists(list){
    //         const createdByApp = App.SiteCollectionLists.find(item => item.List.Title === list.Title);
    //         if (createdByApp) return list;
    //     })
    //     .map(function({
    //         Id,
    //         Title,
    //         CurrentChangeToken,
    //         LastItemDeletedDate,
    //         LastItemModifiedDate,
    //     }){
    //         return { 
    //             Id,
    //             Title,
    //             CurrentChangeToken: CurrentChangeToken.StringValue,
    //             LastItemDeletedDate,
    //             LastItemModifiedDate,
    //         }
    //     }),
    // });
    // console.info(changeTokens);

    const Main = new Component({
        tag: 'main',
        classList: 'row h-100 w-100 p-0 m-0',
        parent: document.body,
        // `
        // <nav class="navbar navbar-expand-lg bg-body-tertiary bg-primaryColor" data-bs-theme="dark">
        //     <div class="container-fluid">
        //         <a class="navbar-" href="./">
        //             <img src="${NavBarLogo.src}" 
        //                  class="d-inline-block align-top" 
        //                  style="width:${45}%;" 
        //                  alt="logo" />
        //         </a>
        //         <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        //             <span class="navbar-toggler-icon"></span>
        //         </button>
        //         <div class="collapse navbar-collapse" id="navbarNavDropdown">
        //             <ul class="navbar-nav">
        //                 <li class="nav-item">
        //                     <a class="nav-link active" aria-current="page" href="#">Home</a>
        //                 </li>
        //                 <li class="nav-item">
        //                     <a class="nav-link" href="#">Features</a>
        //                 </li>
        //                 <li class="nav-item">
        //                     <a class="nav-link" href="#">Pricing</a>
        //                 </li>
        //                 <li class="nav-item dropdown">
        //                     <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        //                         Dropdown link
        //                     </a>
        //                 <ul class="dropdown-menu">
        //                     <li><a class="dropdown-item" href="#">Action</a></li>
        //                     <li><a class="dropdown-item" href="#">Another action</a></li>
        //                     <li><a class="dropdown-item" href="#">Something else here</a></li>
        //                 </ul>
        //                 </li>
        //             </ul>
        //         </div>
        //     </div>
        // </nav>`
        innerHTML: /*html*/`
        
        <nav class="nav flex-column nav-pills me-3 nav-sb col-1 p-0" 
            id="v-pills-tab" 
            role="tablist" 
            aria-orientation="vertical" 
            data-main-nav>
            <div class="d-flex justify-content-center mb-4 mt-1" data-logo-container>
                <a class="navbar-brand text-white d-flex justify-content-center" href="./index.${ext}">
                    <img src="${NavBarLogo.src}" 
                         class="d-inline-block align-top" 
                         style="width:${NavBarLogo.width}%;" 
                         data-sidebar-logo 
                         alt="logo" />
                </a>
            </div>
        </nav>
        <content class="tab-content col py-4" id="v-pills-tabContent">
            <div aria-live="polite" aria-atomic="true" style="z-index:2147483647 !important;">
                <div class="toast-container top-0 end-0 p-3" data-toast-container></div>
            </div>
        </content>`,
    }).render();

    /** This defines the Layout element, used to render views in the application; */
    const Menu = Main.get('nav[data-main-nav]');
    const tabContent = Main.get('content');
    const ToastContainer = Main.get('div.toast-container');

    Layout = {
        Main,           // component;
        Menu,           // HTMLElement;
        tabContent,     // HTMLElement;
        ToastContainer, // HTMLElement;
    }

    $(Main.get('img[data-sidebar-logo]')).hide();
    Main.get('img[data-sidebar-logo]').onload = function(){
        $(this).fadeIn();
    }

    /** NOTE: This should be removed after developement is complete; */
    if (User.hasRole(DEVELOPER)) Object.assign(window, {
        App,
        Web,
        Route,
        Site,
        User,
        Layout,
        Biome,
        CustomSettings,
    });
   
    // const localDB = new LocalDB({ name: Web.Id });
    crypto.set('salt', 'salt', FORCE);
    crypto.set('password', 'password', FORCE);
    // App.set('localDB', await localDB.init());

    /** Handle App settings - By default darkmode is disabled when the site loads; */
    if (!CustomSettings.DarkMode && !isReload) ToggleDarkTheme();
    if (CustomSettings.Theme) SetTheme(CustomSettings.Theme);

    /** Render the views within the application based on the user's roles; */
    Render();
    if (Settings.Verbose) DisplayVerbose(Settings);
    
    /** Log the first view for the user; */
    window.dispatchEvent(new Event('popstate'));
    isReload = true;
    return App;
}

/** Application Global Event Listeners; */
window.addEventListener('keydown', darkModeEvent);
window.addEventListener('popstate', LogActions);
window.addEventListener('unhandledrejection', Report);
window.addEventListener('error', Report);
// window.addEventListener('load', init);
window.onload = init;

export default App;