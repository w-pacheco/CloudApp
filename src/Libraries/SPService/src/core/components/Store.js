/**
 * Store.js
 * @author Wilfredo Pacheco
 */

import { title } from '../../SPService.js';

// TODO: Make this an 'new Set()'
export default class Store {

    constructor (arg){
        this.arg = arg;
    }

    get(arg){

        if (!arg) return this;
        // typeof arg === 'string'
        else if (typeof arg === 'string') return this[arg];
        else throw new Error(`${title} | Invalid argument!`);
        
    }

    set(key, value, arg){
        const exists = this[key];
        if (!exists) return this[key] = value;
        else if (exists && arg === 'force') return this[key] = value;
        else throw new Error(`${title} | The key aready exists! If you would like to overwrite the '${
            key
        }' property, pass the 'force' string in the argument.`);
    }

    remove(arg){
        if (typeof arg === 'string') return delete this[arg];
        else throw new Error(`${title} | The argument passed is invalid!`);
    }
}