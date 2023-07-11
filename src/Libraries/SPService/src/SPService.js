/**!
 * SPService.js
 * https://github.com/w-pacheco/SP-Service
 * 
 * Copyright Wilfredo Pacheco
 * Released under the MIT license.
 * 
 * @author Wilfredo Pacheco
 * build: 2023.06.21
 */

import SPfetchService from "./core/components/SPfetchService.js";
import SPjQueryService from "./core/components/SPjQueryService.js";
import Social from "./core/components/Social.js";

const { hostname, origin, port } = location;

export const title = 'SPService';
export const version = '1.00';
export const author = 'Wilfredo Pacheco';
export const copyright = '\u{00A9} 2021-2023 SAIC';
export const github = 'https://github.com/w-pacheco/SP-Service';
export const localhost = hostname === '127.0.0.1' 
|| port === '8080' 
|| origin.includes('localhost') 
|| origin.includes('127.');

function getUrl(UrlTokens){

    const { href } = location;

    let NewUrl = null;
    UrlTokens.forEach(token => {
        if (href.includes(token)) NewUrl = location.href.split(token)[0];
    });
    
    if (localhost) NewUrl = origin;
    
    return NewUrl;
    
}

export const DIGEST_INTERVAL = 6e5; // (10 minutes) used to update the request digest;
export const WebPath = '/_api/Web';
export const UrlTokens = ['/App', '/SiteAssets', '/SitePages'];
export const site = getUrl(UrlTokens);

class SPService {

    /** Check for the methods used to create REST calls; */
    _jQuery = !!window?.$?.fn?.jquery;
    _fetch = !!window?.fetch;

    constructor(arg){

        if (!arg) throw new Error(`${title} | Missing argument!`);

        const {
            protocol = 'fetch',
            verbose = false,
            site,
            statusCode,
        } = arg;

        let service = null;                         // service used for all REST API calls;
        const SP_SITE = site || getUrl(UrlTokens);  // Microsoft SharePoint Site Collection URL;
        const DEFAULT_OPTIONS = new Object();       // Placeholder for default options for web object call;

        DEFAULT_OPTIONS.$select = '*';
        DEFAULT_OPTIONS.$expand = [
            'AllProperties',
            'CurrentUser',
            'Folders',
            'RootFolder',
            'Lists',
            'Lists/DefaultView',
            'Lists/Fields',
            'Lists/InformationRightsManagementSettings',
            'Lists/WorkflowAssociations',
            'RegionalSettings',
            'RegionalSettings/TimeZone',
            'RegionalSettings/TimeZones',
            'UserCustomActions',
            'WebInfos',
        ].join(',');

        this.verbose = verbose;
        this.protocol = protocol;                   /** Method used to make the REST API calls; */
        this.details = {                            /** Details on SP-Service; */
            title,
            version,
            author,
            copyright,
            github,
        }

        this.site = site;                           /** URL string passed with user defined site collection; */
        this.SP_SITE = SP_SITE;                     /** SPService definded site collection URL; */
        this.DEFAULT_OPTIONS = DEFAULT_OPTIONS;
        this.SP_WEB_URL = null;
        // this.DIGEST_INTERVAL = DIGEST_INTERVAL;
        this.statusCode = statusCode;

        /** Handle the service - by default the service is set to fetch; */
        service = new SPfetchService(this);

        /** Check the protocol to see if jQuery has been selected; */
        if (protocol === 'jQuery' 
        || protocol === '$' 
        && this._jQuery) service = new SPjQueryService(this);
        
        /** Warn the user jQuery is missing; */
        else if (!this._jQuery) console.warn(`${
            title
        } | jQuery library not found! Service is set to default: fetch`);

        this.service = service;
        this.social = Social(this);
        this.init();

    }

    /** Globaly expose the get, post, patch, delete, recycle methods; */
    get(url, data = {}, options){
        if (!url) throw new Error(`${title} | URL is missing!`);
        return this.service.get(url, data, options);
    }

    post(url, data = {}){
        if (!url) throw new Error(`${title} | URL is missing!`);
        return this.service.post(url, data);
    }

    patch(url, data = {}, etag){
        if (!url) throw new Error(`${title} | URL is missing!`);
        return this.service.patch(url, data, etag);
    }

    delete(url){
        if (!url) throw new Error(`${title} | URL is missing!`);
        return this.service.delete(url);
    }
    
    recycle(url){
        if (!url) throw new Error(`${title} | URL is missing!`);
        return this.service.recycle(url);
    }

    Get(url, data = {}, options){
        if (!url) throw new Error(`${title} | URL is missing!`);
        return this.service.get(url, data, options);
    }

    Post(url, data = {}){
        if (!url) throw new Error(`${title} | URL is missing!`);
        return this.service.post(url, data);
    }

    Patch(url, data = {}, etag){
        if (!url) throw new Error(`${title} | URL is missing!`);
        return this.service.patch(url, data, etag);
    }

    Delete(url){
        if (!url) throw new Error(`${title} | URL is missing!`);
        return this.service.delete(url);
    }
    
    Recycle(url){
        if (!url) throw new Error(`${title} | URL is missing!`);
        return this.service.recycle(url);
    }

    /** Globaly expose the getRequestDigest method for each service; */
    GetRequestDigest(){
        if (!this.service.proxy && localhost) return;
        return this.service.getRequestDigest();
    }

    searchActiveDirectory(queryString){
        return this.service.searchActiveDirectory(queryString);
    }

    /** The following methods are used to call the site collection directly; */
    getWeb(options, SiteCollectionUrl){

        options = options || this.DEFAULT_OPTIONS;
        const component = this;
        const SP_SITE = this.SP_SITE;
        const url = SiteCollectionUrl || SP_SITE;

        /**
        * @param {Web} Holdes all application information
        * FirstUniqueAncestorSecurableObject:
        * RoleAssignments: List of all possible groups available in Sharepoint;
        * AllProperties:
        * AssociatedMemberGroup:
        * AssociatedOwnerGroup:
        * AssociatedVisitorGroup:
        * AvailableContentTypes:
        * AvailableFields:
        * ContentTypes:
        * CurrentUser: Details of user currently logged in;
        * EventReceivers:
        * Features:
        * Fields:
        * Folders: List of available folders from application root;
        * Lists: All available List (tables) in application;
        * ListTemplates:
        * Navigation:
        * ParentWeb: Details of application parent directory;
        * PushNotificationSubscribers: *Will break application if not defined and called;
        * RecycleBin: Collection of any deleted item, folder, list item, file, etc...;
        * RegionalSettings: User regional time settings;
        * RoleDefinitions: List of all roles/permissions and details available to a user;
        * RootFolder: Details for application root folder;
        * SiteGroups: All available groups in Sharepoint;
        * SiteUserInfoList:
        * SiteUsers: All available users in Sharepoint;
        * ThemeInfo: (self explanitory)
        * UserCustomActions:
        * Webs:
        * WebInfos:
        * WorkflowAssociations:
        * WorkflowTemplates:
        */

        return this.get(url + WebPath, options)
        .then(data => data.d)
        .then(web => {

            /** Assign the SP_WEB_URL to handle any proxy calls that reference the web object; */
            component.SP_WEB_URL = web.Url;
            component.service.SP_WEB_URL = web.Url;
            if (this.service.proxy && localhost) web.Url = location.origin;
            
            return web;

        })
        .then(web => Object.assign(web, {

            /** Returns all lists available; */
            getAllLists(){
                return this.Lists.results;
            },
        
            /** Returns an array of list objects; */
            getAllListTitles(){
                return this.getAllLists().map(item => item.Title);
            },
            
            /** Returns list object by title; */
            // TODO: this would be cool if it took two variables, the property name, and the value in question;
            getListDetails(listTitle){
                if (!listTitle) throw new Error('The list title is missing from the argument!');
                return this.getAllLists().find(item => item.Title === listTitle);
            },

            getListIdByTitle(listTitle){
                if (!listTitle) throw new Error('The list title is missing from the argument!');
                const list = this.getAllLists().find(item => item.Title === listTitle);
                return list?.Id;
            },
            
            /** Returns list count number value; */
            getListCount(listTitle){
                return this.getListDetails(listTitle).ItemCount;
            },
            
            /** Returns all list items for requested listTitle; */
            getAllListItems(listTitle){
                if (!listTitle) throw new Error('The list title is missing from the argument!');
                const results = this.getAllLists().find(list => list.Title === listTitle).Items.results;
                return results ? results : new Array();
            },
            
            /** Returns list item object based on title and any key/value pair; */
            getListItem(listTitle, key, value){
                if (!listTitle) throw new Error('The list title is missing from the argument!');
                return this.getListDetails(listTitle).Items.results.find(item => item[key] === value);
            },
            
            /** Returns array of list item objects; */
            /** This should define forms for editing/creating list items; */
            getListItemFields(listTitle){
                if (!listTitle) throw new Error('The list title is missing from the argument!');
                return this.getListDetails(listTitle).Fields.results.filter(item => item.FromBaseType === false);
            },
            
            /** Returns the current user propery value from the web object if available; */
            getUser(){
                return this.CurrentUser;
            },

            /** NEW METHODS; */
            /** Gets the unique values from a column on a list; */
            async getUniqueValues(listTitle, fieldInternalName){
    
                /** @reference https://social.technet.microsoft.com/wiki/contents/articles/40066.retrieve-unique-column-values-in-sharepoint-list-using-javascript.aspx */
                
                const list = web.getListDetails(listTitle);
                const defaultViewId = await component.service.get(`${list.__metadata.uri}/DefaultView`, {
                    $select: 'Id',
                }).then(data => data.d.Id);
                
                return component.service.get(`${web.Url}/_layouts/15/filter.aspx?ListId={${
                    list.Id
                }}&FieldInternalName=${
                    fieldInternalName
                }&ViewId={${
                    defaultViewId
                }}&FilterOnly=1&Filter=1`)
                .then(data => {
                    const options = Array.from($(data).find('OPTION'))
                    .map(option => {
                        return $(option)[0].value;
                    })
                    .filter(str => !!str);
                    return options;
                });
            },

            /** Gets a filtered item count based on the passed filter; */
            /** @example await Web.getCountByFilter('DMIS', `MarketCode eq 'SSO'`); */
            /** @example await Web.getCountByFilter('DMIS', `(MarketCode eq 'ALASKA') or (MarketCode eq 'SSO')`); */
            getCountByFilter(listTitle, $filter){
                return fetch(`${web.Url}/_vti_bin/listdata.svc/${listTitle}/$count?$filter=((${$filter}))`)
                .then(data => data.text())
                .then(value => Number(value));
            },

        }));
        
    }

    getFolders(SiteCollectionUrl){

        const { SP_SITE } = this;
        const url = SiteCollectionUrl || SP_SITE;

        return this.get(`${url + WebPath}/Folders`)
        .then(data => data.d.results);
        
    }

    getLists(SiteCollectionUrl){

        const { SP_SITE } = this;
        const url = SiteCollectionUrl || SP_SITE;

        return this.get(`${url + WebPath}/Lists`)
        .then(data => data.d.results);

    }

    getListByTitle(title, SiteCollectionUrl){

        if (!title) throw new Error('A list title is required!');
        
        const { SP_SITE } = this;
        const url = SiteCollectionUrl || SP_SITE;

        return this.get(`${url + WebPath}/Lists/getByTitle('${title}')`)
        .then(data => data.d);

    }

    getCurrentUser(SiteCollectionUrl){

        const { SP_SITE } = this;
        const url = SiteCollectionUrl || SP_SITE;

        return this.get(`${url + WebPath}/CurrentUser`)
        .then(data => data.d);

    }

    getSiteUsers(SiteCollectionUrl){

        const { SP_SITE } = this;
        const url = SiteCollectionUrl || SP_SITE;

        return this.get(`${url + WebPath}/SiteUsers`)
        .then(data => data.d.results);

    }

    getSiteGroups(SiteCollectionUrl){

        const { SP_SITE } = this;
        const url = SiteCollectionUrl || SP_SITE;

        return this.get(`${url + WebPath}/SiteGroups`)
        .then(data => data.d.results);

    }

    init(){
        console.info(`${title} | v${version} | ${copyright}`);
    }

}

export default SPService;
// window.SPService = SPService;