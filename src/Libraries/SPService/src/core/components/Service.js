/**
 * Service.js
 * @author Wilfredo Pacheco
 */

import HttpHeaders from "./headers.js";

const url = new URL(location);
const SP_PROXY = JSON.parse(url.searchParams.get('PROXY')) !== false;

export default class Service {

    constructor(arg){
        
        const {
            protocol,
        } = arg;

        if (!arg) throw new Error(`Missing argument!`);
        // if (arg?.protocol === 'jQuery' && !this._jQuery) throw new Error('jQuery is missing, please import the library!');

        this.protocol = protocol;
        this.digest_timestamp = null;
        this.proxy = SP_PROXY;

        /** Http Headers used for calls in the application; */
        this.HttpHeaders = HttpHeaders;
        
        this.digest = {
            timestamp: null,
            value: null,
        };

    }

}