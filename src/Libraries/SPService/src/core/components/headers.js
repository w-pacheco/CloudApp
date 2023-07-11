/** 
 * headers.js
 * @author Wilfredo Pacheco
 */

const http = { 
    'GET': { 
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json; odata=verbose',
    },
    'POST': {
        'Content-Type': 'application/json; odata=verbose',
        'Accept': 'application/json; odata=verbose',
        'X-RequestDigest': null,
    },
    'PATCH': {
        'Content-Type': 'application/json; odata=verbose',
        'Accept': 'application/json; odata=verbose',
        'X-HTTP-Method': 'MERGE',
        'X-RequestDigest': null,
        'IF-MATCH': '*',
    }, 
    'DELETE': { 
        'Content-Type': 'application/json; odata=verbose',
        'Accept': 'application/json; odata=verbose',
        'X-HTTP-Method': 'DELETE',
        'X-RequestDigest': null,
        'IF-MATCH': '*',
    },
    'REQUEST_DIGEST': {
        'Accept': 'application/json; odata=verbose',
    },
}

export default http;