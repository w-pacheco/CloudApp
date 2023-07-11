/**
 * tracker.js
 * @desctipion Used to add user tracking to out of the box Microsoft SharePoint site. This script is (and should always be)
 * updated with vanilla JavaScript to prevent the depending on any outsite libraries to ensure it always runs smoothly.
 * @author Wilfredo Pacheco
 */

(function(){

    var origin = window.location.protocol + '//' + window.location.host;
    var MODULE_TITLE = 'tracker.js';
    var SiteCollectionURL;
    // var SiteAbsoluteUrl;
    var CurrentUser;

    /** 
     * StyleSheet
     * @description This is created dynamically when this method runs to hide all the elements
     * on the DOM before we varify the user.
     */
    var customCSS = document.createElement('style');
    customCSS.innerText = 'body { display: none !important; }';
    document.head.insertAdjacentElement('afterbegin', customCSS);

    /**
     * Access Tokens
     * @description This is an Array of users identified to have access to the out of the box SharePoint
     * site collection views. The tokens are the user's LoginName, which can be parsed from the CurrentUser
     * account LoginName OR the Microsoft Active Directory Key property.
     */
    var ACCESS_TOKENS;

    /**
     * Blocked Tokens
     * @description This is an Array of users explicitly blocked from the out of the box SharePoint
     * site collection views.
     */
    var BLOCK_TOKENS;
   
    /**
     * White List
     * @description This is an Array of site pages or views that are allowed to everyone that visits
     * the site collection.
     */
    var URL_WHITELIST = [
        // '/sites/J5/QPP/SitePages/References.aspx',
        // '/sites/J5/QPP/HistoricalQPPToolData/Forms/Minimal.aspx',
        // '/sites/J5/QPP/Lists/QPP_Ticket_Tracker/AllItems.aspx',
        // '/sites/J5/QPP/Lists/QPP_Ticket_Tracker/Dev.aspx',
        // '/sites/J5/QPP/Lists/QPP_Ticket_Tracker/NewForm.aspx',
        // '/sites/J5/QPP/Lists/QPP_Ticket_Tracker/DispForm.aspx',
        // '/sites/J5/QPP/Lists/QPP_Ticket_Tracker/EditForm.aspx',
        // '/sites/J5/QPP/App/Forms/AllItems.aspx',
        // '/sites/J5/QPP/References/Forms/Minimal.aspx',
        // '/sites/J5/QPP/_layouts/15/Upload.aspx',
        // '/sites/J5/QPP/References/Forms/Upload.aspx',
        // '/sites/J5/QPP/HistoricalQPPToolData/Forms/EditForm.aspx',
    ];

    /** Function to detect IE version; */
    function isIE(loadPage) {
        loadPage = true;
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');
        if(msie > 0){
            loadPage = false;
            // IE 10 or older, return version number
            return ('IE ' + parseInt(ua.substring(
                msie + 5, ua.indexOf('.', msie)), 10));
        }
        var trident = ua.indexOf('Trident/');
        if(trident > 0){
            loadPage = false;
            // IE 11, return version number
            var rv = ua.indexOf('rv:');
            return ('IE ' + parseInt(ua.substring(
                rv + 3, ua.indexOf('.', rv)), 10));
        }
        var edge = ua.indexOf('Edge/');
        if(edge > 0){
            loadPage = false;
            //Edge (IE 12+), return version number
            // return undefined;
            return ('IE ' + parseInt(ua.substring(
                edge + 5, ua.indexOf('.', edge)), 10));
        }
        // User uses other browser
        return undefined;
    }

    function GET(url, callback){

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'json';

        xhr.onreadystatechange = function(){
            /** In local files, status is 0 upon success in Mozilla Firefox */
            if (xhr.readyState === XMLHttpRequest.DONE)
            {
                // var status = xhr.status;
                // if (status === 0 
                // || (status >= 200 && status < 400))
                // {
                    if (!!callback) callback(xhr.response);
                    else return xhr.response;
                // }
                // else
                // {
                    // console.info(xhr);
                //     if (!!callback) callback(xhr.response);
                //     else return xhr.response;
                // }
            }
        }

        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr.setRequestHeader('Accept', 'application/json; odata=verbose');
        xhr.send();
    }

    function showDOM(){
        return setTimeout(function(){
            customCSS.innerText = '';
        }, 1000);
    }

    function VarifyUser(){

        var LoginName = CurrentUser.LoginName;
        var UserHasAccess;
        var UserAccessBlocked;
        var AllUsersCanSee;

        ACCESS_TOKENS.forEach(function(SiteUser){
            if (SiteUser.Key === LoginName) return UserHasAccess = SiteUser.Key;
        });

        /** TODO: Handle blocked tokens; */
        // BLOCK_TOKENS.forEach(function(edipi){
        //     if (edipi === EDIPI) return UserAccessBlocked = edipi;
        // });

        /** TODO: Handle white listed URLs; */
        // URL_WHITELIST.forEach(function(url){
        //     if (window.location.pathname === url) return AllUsersCanSee = url;
        // });

        console.info(MODULE_TITLE + ' | Complete');
        if (!!AllUsersCanSee)
        { // All can see this page;
            customCSS.innerText = '';
            return;
        }

        else if (UserAccessBlocked 
        || !UserHasAccess) return location.href = SiteCollectionURL;

        return showDOM();
    }

    function UsersListCallFailed(error){
        console.info(MODULE_TITLE + ' Failed! | ' + error.code);
        console.info(error.message.value);
        return showDOM();
    }

    document.addEventListener('DOMContentLoaded', function DOMContentLoaded(event){
        // NOTE: This will break on internet explorer;
        // console.info('jQuery:', window?.$?.fn?.jquery);
        // console.info('Bootstrap:', window?.$?.fn?.tooltip?.Constructor?.VERSION);
        console.info('Running ' + MODULE_TITLE + '... | DOMContentLoaded');
        if (isIE()) console.info('Version: ' + isIE());
    });

    function init(event){

        /** NOTE: _spPageContextInfo requires the page to fully load before you can call it; */
        SiteCollectionURL = origin + _spPageContextInfo.webServerRelativeUrl;
        // SiteAbsoluteUrl = _spPageContextInfo.siteAbsoluteUrl;

        var CurrentUserURL = SiteCollectionURL + '/_api/Web/CurrentUser'; 
        var UsersURL = SiteCollectionURL 
        + '/_api/Web/Lists/getByTitle(\'Users\')/Items?$select=Key&$filter=(Role eq \'Developer\') or (Role eq \'Administrator\')';

        console.info('Running ' + MODULE_TITLE + '... | init');
        GET(UsersURL, function SetAccessTokens(response){
            /** A response from internet explorer has to be parsed; */
            if (isIE()) response = JSON.parse(response);
            /** Handle the possibility the Users list is missing; */
            if (!!response.error) UsersListCallFailed(response.error);
            try {
                ACCESS_TOKENS = response.d.results;
                if (CurrentUser && ACCESS_TOKENS) VarifyUser(); // Check if all the required values have been set;
            } catch(e) { }

        });

        GET(CurrentUserURL, function SetCurrentUser(response){
            if (isIE()) response = JSON.parse(response);
            CurrentUser = response.d;
            if (CurrentUser && ACCESS_TOKENS) VarifyUser(); // Check if all the required values have been set;
        });

    }
    
    window.addEventListener('load', init);
    
})();