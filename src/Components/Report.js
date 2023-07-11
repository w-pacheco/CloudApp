/**
 * Report.js
 * @author Wilfredo Pacheco
 */

import { service, web, localhost, SessionId } from '../Biome.js';
import { Title } from '../Views/Errors/List.js';

const { port } = location;

export default function Report(event){

    if (localhost && port === '8081') return;

    const { filename, lineno, colno } = event;
    const msg = event.message ? 
    event.message : 
    event.reason;
    
    const List = web?.getListDetails ? web?.getListDetails(Title) : null;
    if (!List) return;

    // Prevents errors from jquery ui;
    if (msg === 'Uncaught TypeError: this.source is not a function') return;

    /** Chrome 102 update throws error when typing in console; */
    /** FIXME: This is not a permanent solution; */
    if (msg === 'Uncaught EvalError: Possible side-effect in debug-evaluate') return;
    if (msg === 'Uncaught SyntaxError: Unexpected end of input') return;

    const userAgent = window.navigator.userAgent;
    const appVersion = window.navigator.appVersion;
    const FileUrl = filename;
    const LocationHash = location.search + location.hash;
    const Line = lineno;
    const Column = colno;
    const __metadata = {
        type: List.ListItemEntityTypeFullName,
    };

    const type = event?.reason?.message || msg?.split(':')[0]?.split(' ')?.join('');
    const message = event?.reason?.stack || msg.split(':')[1];
    const ErrorType = type?.trim() || type;
    const ErrorMessage = message?.trim() || message;

    const errorRequest = {
        ErrorType,      // Error type;
        ErrorMessage,   // Message recieved by error;
        FileUrl,        // Url location of file that fired error event;
        Line,
        Column,
        LocationHash,
        userAgent,
        appVersion,
        SessionId,
        __metadata,     // *Important: This should change with the corresponding POST request link;
    };

    return service.Post(`${List.__metadata.uri}/Items`, errorRequest);
    // return Route.GetRequestDigest()
    // .then(ReqDigest => {
    //     return Route.Post(`${List.__metadata.uri}/Items`, errorRequest, ReqDigest);
    // });
}