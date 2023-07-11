
import { service, web, user } from "../../src/Biome.js";
import { Title as AcknowledgementsTitle } from "../Acknowledgements/List.js";

export function getAcknowledgementsByDCIR(dcir){
    const List = web.getListDetails(AcknowledgementsTitle);
    const { __metadata } = List;
    return service.get(`${__metadata.uri}/Items`, {
        $select: '*',
        $filter: `DCIR eq '${dcir}'`,
    })
    .then(data => data.d.results);
}

/** This creates our template for the DOC acknowledgement; */
export function createDOCAcknowledgement({group, DCIR, EventTypeId}){

    const List = web.getListDetails(AcknowledgementsTitle);
    const { __metadata, ListItemEntityTypeFullName } = List;
    
    const request = {
        type: 'DOC',
        sort: 1,
        Group: group,
        EventTypeId,
        DCIR,
        __metadata: {
            type: ListItemEntityTypeFullName,
        }
    }


    return service.post(`${__metadata.uri}/Items`, request);

}

/** This one creates the template for the Market POC acknowledgements; */
export function createMarketAcknowledgement({group, DCIR, EventTypeId}){

    const List = web.getListDetails(AcknowledgementsTitle);
    const { __metadata, ListItemEntityTypeFullName } = List;
    
    const request = {
        type: 'Market',
        sort: 2,
        Group: group,
        EventTypeId,
        DCIR,
        __metadata: {
            type: ListItemEntityTypeFullName,
        }
    }


    return service.post(`${__metadata.uri}/Items`, request);
    
}

/** This one creates the template for the Market POC acknowledgements; */
export function createOPRAcknowledgement({group, DCIR, EventTypeId}){

    const List = web.getListDetails(AcknowledgementsTitle);
    const { __metadata, ListItemEntityTypeFullName } = List;
    
    const request = {
        type: 'OPR',
        sort: 3,
        Group: group,
        EventTypeId,
        DCIR,
        __metadata: {
            type: ListItemEntityTypeFullName,
        }
    }


    return service.post(`${__metadata.uri}/Items`, request);
    
}

/** This one creates the template for the Market POC acknowledgements; */
export function createOCRAcknowledgement({group, DCIR, EventTypeId}){

    const List = web.getListDetails(AcknowledgementsTitle);
    const { __metadata, ListItemEntityTypeFullName } = List;
    
    const request = {
        type: 'OCR',
        sort: 4,
        Group: group,
        EventTypeId,
        DCIR,
        __metadata: {
            type: ListItemEntityTypeFullName,
        }
    }


    return service.post(`${__metadata.uri}/Items`, request);
    
}

export function setAcknowledgement(url, type, etag){

    const timestamp = new Date().toISOString();

    return service.patch(url, {
        timestamp,
        user: user.Title,
        email: user.Email,
        key: user.Key,
        __metadata: {
            type,
        }
    }, etag);

}

export function resetAcknowledgement(url, type, etag){

    return service.patch(url, {
        timestamp: null,
        user: null,
        email: null,
        key: null,
        __metadata: {
            type,
        }
    }, etag);

}
