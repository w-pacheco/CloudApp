/**
 * URLParam.Set.js
 * @description SetParam is a method used ONLY by the application,
 * if required by another part of the application a new method should be defined outside of
 * the src folder. This is to prevent global bugs during deployment.
 * @author Wilfredo Pacheco
 */

import SetHistory from './History.Set.js';

export default function SetParam(key, value){

    const url = new URL(location);

    /** Handle if array of items are passed as argument; */
    if (typeof key === 'object' 
    && Array.isArray(key)
    && key?.length)
    {
        key.forEach(set => {
            if (url.searchParams.get(set.key)) url.searchParams.set(set.key, set.value);
            else url.searchParams.append(set.key, set.value);
        });
    }

    /** Handle if key pair are passed as argument; */
    else if (typeof key === 'string' 
    && value !== ''
    && value !== null
    && value !== undefined
    && value !== 'null'
    && value !== 'undefined')
    {
        if (url.searchParams.get(key)) url.searchParams.set(key, value);
        else url.searchParams.append(key, value);
    }
    
    return SetHistory(url.href, document.title);
}