/**
 * Actions.Log.js
 * @description Used to track user views grouped by SessionId (UUID) & when stat is set (SessionState.Set.js);
 * @author Wilfredo Pacheco
 */

import { Title as ListTitle } from '../Views/Log/List.js';
import App from '../../app.js';
import { TrackUser, Verbose, VerboseColor, WebOptions } from '../../app.settings.js';
import { localhost, web, service, user } from '../Biome.js';

export function DisplayVerbose(params){
    const { ApplicationSettings } = params;
    console.info(`%cHosted Locally: ${localhost}`, VerboseColor);
    console.info(`%cjQuery Version | ${window?.$.fn.jquery}`, VerboseColor);
    console.info(`%cBootstrap Version | ${window?.$.fn.tooltip.Constructor.VERSION}`, VerboseColor);
    console.info(`%cDataTable Version | ${window?.$.fn.DataTable.version}`, VerboseColor);
    console.info(`%cjs-sha256 loaded.`, VerboseColor);
    console.info(`%cpace-js loaded.`, VerboseColor);
    console.info('%c---------------------------- SharePoint REST Api Options ---------------------------------', VerboseColor);
    console.info(WebOptions);
    console.info('%c------------------------------- Application Settings -------------------------------------', VerboseColor);
    console.info(ApplicationSettings);
}

export default async function LogActions(event){

    const { port } = location;

    const { 
        SessionId, 
        NeedsInstall, 
    } = App;

    if (NeedsInstall 
    || port === '8081'
    || !web?.getListDetails) return console.info('Route logged.');;
    
    const message = new Error();                // Creates a stack trace;
    const List = web.getListDetails(ListTitle); // List the request is going to;
    const Url = `${List.__metadata.uri}/Items`; // Url used for request;
    const StackTrace = message.stack;

    const RequestBody = {
        __metadata: { type: List.ListItemEntityTypeFullName },
        SessionId,
        UserKey: user.Key,
        Message: location.href,
        StackTrace: StackTrace.replace('Error', 'Log'),
    }

    if (TrackUser) return service.Post(Url, RequestBody)
    .then(data => {
        console.info('Route logged.');
        if (Verbose)
        {
            console.info(event);
            console.info(data.d);
        }
    });
    
}

window.addEventListener('log', LogActions);