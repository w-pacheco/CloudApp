/**!
 * Biome.js
 * https://github.com/w-pacheco/Biome-js
 * 
 * Copyright (SAIC) Science Applications International Corporation and other contributors
 * Released under the MIT license.
 */

/**
 * @description Biome is a JavaScript framework used to create single page applications hosted on 
 * Microsoft SharePoint (2010-2019) site collections. This version is a stripped implementation, 
 * isolating the core of the framework which takes advantage of Google's V8 engine. This template 
 * provides a starting point for developing a single page application on SharePoint, and defines 
 * the suggested directory structure for the framework. Biome creates a firm foundation to help escape 
 * customizing views using SharePoint's webpart implementation, and take full control of any project 
 * hosted on a site collection.
 * 
 * @author Wilfredo Pacheco, Logan Bunker, John W. Westhuis, Dr. Toby Canning
 */

const { origin, hostname, port, pathname, href } = location;

const url = new URL(location);
const SP_REST_PROXY = JSON.parse(url.searchParams.get('PROXY')) !== false;
// console.info('SP_REST_PROXY:', SP_REST_PROXY);

import CreateUUID from './Actions/UUID.Create.js';
import Account from './Classes/Account.js';
import LocalDataBase from './Classes/LocalDataBase.js';
import Store from './Classes/Store.js';
import SPService from './Libraries/SPService/src/SPService.js';
import { Title as RolesListTitle } from './Views/Roles/List.js';

export const name = 'Biome-js [Tundra]';
export const build = '2023.05.24';
export const version = '2.0.0';
export const copyright = '\u{00A9} 2020-2023 (SAIC) Science Applications International Corporation';
export const author = 'SAIC';

/** Global Resources; */
export let web;
export let user = {};
export let service = {};
export let store = new Store();
export let site = {};

/** These get updated if the product owner has requested the role be different; */
export let ADMINISTRATOR = 'Administrator';
export let DEVELOPER = 'Developer';

/** The default email service is the SharePoint REST API; */
export let emailservice = 'default'; // options: workflow

/**
 * SessionId {String}
 * @description Helpful when identifying bugs within the application, this is also logged when TrackUser is set to true.
 */
export const SessionId = CreateUUID();
document.SessionId = SessionId;

export const BoostrapVersion = window?.$?.fn?.tooltip?.Constructor?.VERSION;
export const jQueryVersion = window?.$?.fn?.jquery;
export const BootstrapIconURL = './node_modules/bootstrap-icons/bootstrap-icons.svg';

/** Used to identify the domain hosting the application; */
export const CarePoint = hostname === 'carepoint.health.mil';
export const LaunchPad = hostname === 'info.health.mil';
export const iCenter = hostname === 'icenter.saic.com';

/** Used to dynamically create links to other pages in the application; */
export const useASPX = pathname.includes('.aspx');
export const ext = useASPX ? 'aspx' : 'html';

/** Used to identify if the application is hosted locally; */
export const localhost = hostname === '127.0.0.1'
|| port === '8080'
|| origin.includes('localhost')
|| origin.includes('127.');

function getAdminRoleTitle(){
    const { Url } = web;
    const ADMINISTRATOR = 'Admin';  // Default Administrator String;
    return service.Get(`${Url}/_api/Web/Lists/getByTitle('${RolesListTitle}')/Items`, {

        /** NOTE: The role SHOULD have the Administrator string in the title; */
        $filter: `substringof('${ADMINISTRATOR}',RoleTitle)`,
        
    })
    .then(data => data.d)
    .then(data => data.results)
    .then(results => results[0])
    .then(data => {
        if (data) return data.RoleTitle;
        else return ADMINISTRATOR;
    })
    .catch(e => {
        console.info(e); 
        return [];
    });
}

function setWeb(WebOptions = {}){

    /** Call for data required for application to run; */

    /** If localhost is sp-rest-proxy; */
    if (SP_REST_PROXY && localhost) return service.getWeb(WebOptions, origin)
    .catch(console.info)
    .then(data => data);

    /** Handle live-server; */
    else if (!SP_REST_PROXY && localhost) return import('./Components/local.web.js')
    .then(mod => mod.default)
    .then(web => {
        return import('./Libraries/SharePointApi/src/Component.WebUtilities.js')
        .then(mod => {
            return Object.assign(web, mod.default);
        });
    });
    
    /** Handle production; */
    else if (!localhost) return service.getWeb(WebOptions)
    .catch(console.info)
    .then(data => data);


}

function setUser(){

    if (!SP_REST_PROXY && localhost) return import('./Components/local.user.js')
    .then(mod => mod.default)
    .then(acct => new Account(acct));

    return service.searchActiveDirectory(web?.CurrentUser?.Email)
    .catch(console.info)
    .then(function(results){
        if (web?.CurrentUser) return Object.assign(results[0], {
            CurrentUser: web.CurrentUser,
        });
        else return results[0];
    })
    .then(acct => new Account(acct));
}

function setSite(){
    if (!SP_REST_PROXY && localhost) return {};
    if (web.CurrentUser.IsSiteAdmin) return service.Get(`${web?.Url}/_api/site`)
    .catch(console.info)
    .then(data => data?.d);
    
    /** Since the method initially returns a promise, we can create our own here; */
    else return new Promise((resolve, reject) => {
        resolve();
    });
}

export default class Biome {

    constructor(settings){

        if (typeof settings !== 'object') throw new Error(`${name} | Error, the argument passed to the constructor was invalid!`);
        
        const {
            Name,
            emailservice,
            serviceOptions,
            theme,
        } = settings;

        this.Name = Name;
        this.SessionId = SessionId;

        this.CarePoint = CarePoint;
        this.LaunchPad = LaunchPad;
        this.iCenter = iCenter;
        this.proxy = SP_REST_PROXY;

        this.ADMINISTRATOR = ADMINISTRATOR;
        this.DEVELOPER = DEVELOPER;
        
        this.ext = ext;
        this.localhost = localhost;
        
        this.store = store;
        this.emailservice = emailservice;
        this.settings = settings;
        this.serviceOptions = serviceOptions;

        this.ReadOnly = null;
        this.PrimaryUri = null;
        this.Views = {};
        
        this.DefaultTheme = theme;
        this.Settings = {
            DarkMode: false,
            SidebarCollapsed: false,
        };

        this.engine = {
            name,
            build,
            version,
            copyright,
            author,

            core_libraries: {
                BoostrapVersion,
                jQueryVersion,
                BootstrapIconURL,
            }

        }

        this.init();

    }

    async config(){

        const { WebOptions } = this.settings;

        /** Set the web, user, and site object; */
        web = await setWeb(WebOptions);
        user = await setUser();
        site = await setSite();

        this.web = web;
        this.store = store;
        this.user = user;

        /** Set the site properties if available; */
        if (site)
        {
            this.ReadOnly = site.ReadOnly;
            this.PrimaryUri = site.PrimaryUri;
        }

        /** Set the new ADMINISTRATOR title if product owner has requested a title change; */
        /** port 8081 is set in live-server; */
        if (port !== '8081') this.ADMINISTRATOR = await getAdminRoleTitle().then(title => {
            ADMINISTRATOR = title;
            return title;
        });

        if (port === '8081') user.Roles.push('Developer');

        // DEVELOPER = this.DEVELOPER;
       
        return this;

    }

    get(arg){
        if (arg && typeof arg === 'string') return this[arg];
        else if (!arg) return this;
        else throw new Error(`${name} | The argument passed was invalid!`);
    }

    set(key, value){
        if (typeof key !== 'string' || !key) throw new Error(`${name} | One of your values is invalid!`);
        this[key] = value;
    }

    remove(key){
        delete this[key];
    }

    getCoreImports(){
        return import('./core.js').then(module => module.default).catch(console.info);
    }

    init(){

        const { serviceOptions } = this;

        /** Set the service to access the SharePoint REST API; */
        service = new SPService(serviceOptions);
        this.route = service;

        /** Set the email service; */
        if (this.emailservice) emailservice = this.emailservice;

        console.info(`${'\u{1F30E}'} ${name} v${version}`);
        // console.info(copyright);

    }
    
}