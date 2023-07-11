/**
 * SPjQueryService.js
 * @author Wilfredo Pacheco
 */

import Service from "./Service.js";
import { localhost, title, DIGEST_INTERVAL } from "../../SPService.js";
import ActiveDirectorySearchPayload from "../actions/ActiveDirectorySearch.Create.js";

export default class SPjQueryService extends Service {

    constructor(arg){

        const {
            statusCode = {},
            SP_SITE,
            SP_WEB_URL,
            verbose,
        } = arg;

        super(arg);

        this.custom = window.jQuery;
        this.statusCode = statusCode;       /** jQuery statusCode methods; */
        this.SP_SITE = SP_SITE;
        this.SP_WEB_URL = SP_WEB_URL;
        this.verbose = verbose;
        this.init();

    }

    get(url, data = {}, options = {}){

        const SP_WEB_URL = this.SP_WEB_URL;

        if (!url) throw new Error(`${title} | URL is missing!`);
        
        if (this.digest === null 
        || (new Date().getTime() - this.digest.timestamp) > DIGEST_INTERVAL) this.getRequestDigest();

        /** Handle sp-rest-proxy for localhost; */
        if (localhost && url.includes(SP_WEB_URL)) url = url.replace(SP_WEB_URL, location.origin);
        
        const method = 'GET';
        const contentType = 'json';
        const headers = this.HttpHeaders.GET;
        const statusCode = this.statusCode;

        return jQuery.ajax(Object.assign({
            url,
            method,
            data,
            contentType,
            headers,
            statusCode,
        }, options));

    }

    post(url, data = {}){

        if (!url) throw new Error(`${title} | URL is missing!`);

        if (this.digest === null 
        || (new Date().getTime() - this.digest.timestamp) > DIGEST_INTERVAL) this.getRequestDigest();

        const SP_WEB_URL = this.SP_WEB_URL;
        /** Handle sp-rest-proxy for localhost; */
        if (localhost && url.includes(SP_WEB_URL)) url = url.replace(SP_WEB_URL, location.origin);

        data = typeof(data) === 'string' ? 
        data : 
        JSON.stringify(data);
       
        const ReqDigest = this.digest.value;
        const method = 'POST';
        const contentType = 'json';
        const headers = this.HttpHeaders.POST;
        const statusCode = this.statusCode;

        /** Set the RequestDigest; */
        headers['X-RequestDigest'] = ReqDigest;

        return jQuery.ajax({
            url,
            method,
            data,
            contentType,
            headers,
            statusCode,
        });

    }

    patch(url, data = {}, etag){

        if (!url) throw new Error(`${title} | URL is missing!`);

        if (this.digest === null 
        || (new Date().getTime() - this.digest.timestamp) > DIGEST_INTERVAL) this.getRequestDigest();

        const SP_WEB_URL = this.SP_WEB_URL;
        /** Handle sp-rest-proxy for localhost; */
        if (localhost && url.includes(SP_WEB_URL)) url = url.replace(SP_WEB_URL, location.origin);

        data = typeof(data) === 'string' ? 
        data : 
        JSON.stringify(data);

        const ReqDigest = this.digest.value;
        const method = 'POST';
        const contentType = 'json';
        const headers = this.HttpHeaders.PATCH;
        const statusCode = this.statusCode;

        /** Set the etag & RequestDigest; */
        headers['IF-MATCH'] = etag || '*';
        headers['X-RequestDigest'] = ReqDigest;

        return jQuery.ajax({
            url,
            method,
            data,
            contentType,
            headers,
            statusCode,
        });

    }

    delete(url){

        if (!url) throw new Error(`${title} | URL is missing!`);

        if (this.digest === null 
        || (new Date().getTime() - this.digest.timestamp) > DIGEST_INTERVAL) this.getRequestDigest();

        const SP_WEB_URL = this.SP_WEB_URL;
        /** Handle sp-rest-proxy for localhost; */
        if (localhost && url.includes(SP_WEB_URL)) url = url.replace(SP_WEB_URL, location.origin);

        const ReqDigest = this.digest.value;
        const method = 'POST';
        const headers = this.HttpHeaders.DELETE;
        const statusCode = this.statusCode;

        /** Set the RequestDigest; */
        headers['X-RequestDigest'] = ReqDigest;

        return jQuery.ajax({
            url,
            method,
            headers,
            statusCode,
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
        const statusCode = this.statusCode;
        const verbose = this.verbose;
        const service = this;

        return jQuery.ajax({
            url,
            method,
            headers,
            statusCode,
        })
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
        this.getRequestDigest();

        // console.info(`${title} | jQuery v${window?.$?.fn?.jquery}`);
        
    }

}