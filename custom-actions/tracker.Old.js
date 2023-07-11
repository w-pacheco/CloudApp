/**
 * tracker.js
 * @desctipion Used to add user tracking to out of the box Microsoft SharePoint site.
 * @author Wilfredo Pacheco
 */

 (function(){

    /** 
     * URLs; 
     * Note: origin has to be created since IE location does not have it defined as a property.
     */
    var origin = window.location.protocol + '//' + window.location.host;
    var SiteCollectionURL = origin + _spPageContextInfo.webServerRelativeUrl;
    var LoginNamePath = SiteCollectionURL + '/_api/Web/CurrentUser/LoginName';
    var IsSiteAdminURL = SiteCollectionURL + '/_api/Web/CurrentUser/IsSiteAdmin';

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
     * site collection views. The tokens are the user's EDIPI, which can be parsed from the CurrentUser
     * account LoginName OR the Microsoft Active Directory Key property.
     */
    var EDIPI_ACCESS_TOKENS = [
        // SAIC;
        '1440537576', // WP
        '1099970991', // CH
        '1607897499', // JW
        '1033301959', // PC
        '1242821943', // LB
        '1293360207', // TC
        // DHA;
        '1399723651', // JP
        '1386225288', // AM
    ];

    /**
     * Blocked Tokens
     * @description This is an Array of users explicitly blocked from the out of the box SharePoint
     * site collection views.
     */
    var EDIPI_BLOCK_TOKENS = [
        /** @example */
        // '1440537576', // wilfredo.pacheco14.ctr@mail.mil
        // '1607897499', // JW
    ];

    /**
     * White List
     * @description This is an Array of site pages or views that are allowed to everyone that visits
     * the site collection.
     */
    var URL_WHITELIST = [
        '/sites/J5/QPP/SitePages/References.aspx',
        '/sites/J5/QPP/SitePages/References2.aspx',
        '/sites/J5/QPP/HistoricalQPPToolData/Forms/Minimal.aspx',
        '/sites/J5/QPP/Lists/QPP_Ticket_Tracker/AllItems.aspx',
        '/sites/J5/QPP/Lists/QPP_Ticket_Tracker/Dev.aspx',
        '/sites/J5/QPP/Lists/QPP_Ticket_Tracker/NewForm.aspx',
        '/sites/J5/QPP/Lists/QPP_Ticket_Tracker/DispForm.aspx',
        '/sites/J5/QPP/Lists/QPP_Ticket_Tracker/EditForm.aspx',
        '/sites/J5/QPP/App/Forms/AllItems.aspx',
        '/sites/J5/QPP/References/Forms/Minimal.aspx',
        '/sites/J5/QPP/_layouts/15/Upload.aspx',
        '/sites/J5/QPP/References/Forms/Upload.aspx',
        '/sites/J5/QPP/HistoricalQPPToolData/Forms/EditForm.aspx',
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
                var status = xhr.status;
                if (status === 0 
                || (status >= 200 && status < 400))
                {
                    if (!!callback) callback(xhr.response);
                    else return xhr.response;
                }
    
                else console.log(xhr);
            }
        }
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr.setRequestHeader('Accept', 'application/json; odata=verbose');
        xhr.send();
    }

    function VarifyUser(response){
        
        if (isIE()) response = JSON.parse(response);
        var UserHasAccess;
        var UserAccessBlocked;
        var AllUsersCanSee;
        var LoginName = response.d.LoginName;
        var EDIPI = GetEDIPI(LoginName);
        
        EDIPI_ACCESS_TOKENS.forEach(function(edipi){
            if (edipi === EDIPI) return UserHasAccess = edipi;
        });
        
        EDIPI_BLOCK_TOKENS.forEach(function(edipi){
            if (edipi === EDIPI) return UserAccessBlocked = edipi;
        });

        URL_WHITELIST.forEach(function(url){
            if (window.location.pathname === url) return AllUsersCanSee = url;
        });

        console.info('tracker.js | Complete');
        if (!!AllUsersCanSee) 
        {
            // console.info('All can see this page');
            customCSS.innerText = '';
            return;
        }
        else if (UserAccessBlocked || !UserHasAccess)
        {
            // console.warn('Redirect |' + window.location.pathname);
            return location.href = SiteCollectionURL;
        }
        customCSS.innerText = '';
    }

    function GetEDIPI(LoginName){
        var edipi = LoginName.split('|').pop();
        edipi = edipi.split('@')[0];
        return edipi;
    }

    document.addEventListener('DOMContentLoaded', function DOMContentLoaded(event){
        // console.info('jQuery:', window?.$?.fn?.jquery);
        // console.info('Bootstrap:', window?.$?.fn?.tooltip?.Constructor?.VERSION);
        console.info('Running tracker.js... | ' + window.location.pathname);
        if (isIE()) console.info('Version: ' + isIE());
        return GET(LoginNamePath, VarifyUser);

        /** Check if user IsSiteAdmin; */
        // return GET(IsSiteAdminURL, function(response){
        //     if (isIE()) response = JSON.parse(response);
        //     console.info(response.d.IsSiteAdmin);
        //     if (response.d.IsSiteAdmin) customCSS.innerText = '';
        //     else return GET(LoginNamePath, VarifyUser);
        // });
    });
    
})();