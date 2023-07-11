/**
 * SPfetchService.js
 * @author Wilfredo Pacheco
 */

import Service from "./Service.js";
import { localhost, title, DIGEST_INTERVAL } from "../../SPService.js";
import ActiveDirectorySearchPayload from "../actions/ActiveDirectorySearch.Create.js";

export default class SPfetchService extends Service {

    constructor(arg){

        const {
            SP_SITE,
            SP_WEB_URL,
            verbose,
        } = arg;

        super(arg);

        this.custom = window.fetch;
        this.SP_SITE = SP_SITE;
        this.SP_WEB_URL = SP_WEB_URL;
        this.verbose = verbose;
        this.init();

    }

    get(url, data = {}){

        const SP_WEB_URL = this.SP_WEB_URL;

        if (!url) throw new Error(`${title} | URL is missing!`);

        if (this.digest != null 
        && (new Date().getTime() - this.digest.timestamp) < DIGEST_INTERVAL) this.getRequestDigest();

        /** Handle sp-rest-proxy for localhost; */
        if (localhost && url.includes(SP_WEB_URL)) url = url.replace(SP_WEB_URL, location.origin);

        const method = 'GET';
        const headers = this.HttpHeaders.GET;

        if (data && typeof data === 'object')
        {
            url = `${url}?${
                Object.entries(data)
                .map(e => `${e[0]}=${e[1]}`)
                .join('&')
            }`
        }
        
        return fetch(url, {
            method,
            headers,
        }).then(data => data.json());

    }

    post(url, data = {}){

        if (!url) throw new Error(`${title} | URL is missing!`);

        if (this.digest != null 
        && (new Date().getTime() - this.digest.timestamp) < DIGEST_INTERVAL) this.getRequestDigest();

        const SP_WEB_URL = this.SP_WEB_URL;
        /** Handle sp-rest-proxy for localhost; */
        if (localhost && url.includes(SP_WEB_URL)) url = url.replace(SP_WEB_URL, location.origin);

        data = typeof(data) === 'string' ? 
        data : 
        JSON.stringify(data);
       
        const ReqDigest = this.digest.value;
        const method = 'POST';
        const headers = this.HttpHeaders.POST;

        /** Set the RequestDigest; */
        headers['X-RequestDigest'] = ReqDigest;

        return fetch(url, {
            method,
            body: data,
            headers,
        }).then(data => data.json());

    }

    patch(url, data = {}, etag){

        if (!url) throw new Error(`${title} | URL is missing!`);

        if (this.digest != null 
        && (new Date().getTime() - this.digest.timestamp) < DIGEST_INTERVAL) this.getRequestDigest();

        const SP_WEB_URL = this.SP_WEB_URL;
        /** Handle sp-rest-proxy for localhost; */
        if (localhost && url.includes(SP_WEB_URL)) url = url.replace(SP_WEB_URL, location.origin);

        data = typeof(data) === 'string' ? 
        data : 
        JSON.stringify(data);

        const ReqDigest = this.digest.value;
        const method = 'POST';
        const headers = this.HttpHeaders.PATCH;

        /** Set the etag & RequestDigest; */
        headers['IF-MATCH'] = etag || '*';
        headers['X-RequestDigest'] = ReqDigest;

        return fetch(url, {
            method,
            body: data, // body data type must match "Content-Type" header;
            headers,
        });

    }

    delete(url){

        if (!url) throw new Error(`${title} | URL is missing!`);

        if (this.digest != null 
        && (new Date().getTime() - this.digest.timestamp) < DIGEST_INTERVAL) this.getRequestDigest();

        const SP_WEB_URL = this.SP_WEB_URL;
        /** Handle sp-rest-proxy for localhost; */
        if (localhost && url.includes(SP_WEB_URL)) url = url.replace(SP_WEB_URL, location.origin);
        
        const ReqDigest = this.digest.value;
        const method = 'POST';
        const headers = this.HttpHeaders.DELETE;

        /** Set the RequestDigest; */
        headers['X-RequestDigest'] = ReqDigest;

        return fetch(url, {
            method,
            headers,
        });

    }

    recycle(url){

        if (!url) throw new Error(`${title} | URL is missing!`);
        return this.delete(url + '/recycle()');
    }

    getRequestDigest(url){

        if (!this.proxy && localhost) return;
        
        url = `${url || this.SP_SITE}/_api/contextinfo`;
        
        const method = 'POST';
        const headers = this.HttpHeaders.REQUEST_DIGEST;
        const verbose = this.verbose;
        const service = this;

        return fetch(url, {
            method,
            headers,
        })
        .then(data => data.json())
        .then(data => data.d.GetContextWebInformation.FormDigestValue)
        .then(FormDigestValue => {

            if (verbose) console.info(`%c${title} | The Request Digest was updated!`, 'color: limegreen');
            service.digest = {
                timestamp: new Date().getTime(),
                value: FormDigestValue,
            };

            return FormDigestValue;
        });

    }

    searchActiveDirectory(queryString){

        /** Create query String; */
        const Payload = ActiveDirectorySearchPayload(queryString);
        
        // const contentType = 'xml';
        const url = `${this.SP_SITE}/_vti_bin/client.svc/ProcessQuery`;

        return this.post(url, Payload)
        .then(result => {
            
            /** @return the result array; */
            return JSON.parse(result[2]);
        
        });

    }

    async init(){

        /** Handle the first request digest; */
        if (localhost) this.digest = await new Promise((resolve, reject) => {
            resolve({
                "d": {
                    "GetContextWebInformation": {
                        "__metadata": {
                            "type": "SP.ContextWebInformation"
                        },
                        "FormDigestTimeoutSeconds": 1800,
                        "FormDigestValue": "0xF2192FFC7230889E04578590FF29C48F3FB6E6085E8318A780995A0D7F1C6036E56F8A7A20851D501D95A56F4668D8AF5F7D5F2146C6E9C4AC7D139514884463,16 Feb 2023 15:48:38 -0000",
                        "LibraryVersion": "16.0.5373.1000",
                        "SiteFullUrl": "https://{site_url}/sites",
                        "SupportedSchemaVersions": {
                            "__metadata": {
                                "type": "Collection(Edm.String)"
                            },
                            "results": [
                                "14.0.0.0",
                                "15.0.0.0"
                            ]
                        },
                        "WebFullUrl": "https://{site_url}/sites"
                    }
                }
            });
        }).then(data => {
            return {
                timestamp: new Date().getTime(),
                value: data.d.GetContextWebInformation.FormDigestValue,
            };
        });

        this.getRequestDigest();
        
    }

}