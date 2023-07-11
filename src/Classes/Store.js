/**
 * Store.js
 * @author Wilfredo Pacheco
 */

import { name as biome } from '../Biome.js';
// TODO: Make this an 'new Set()'
export default class Store {

    constructor (options){
        // console.info(options)
    }

    get(arg){

        if (!arg) return this;
        // typeof arg === 'string'
        else if (typeof arg === 'string') return this[arg];
        else throw new Error(`${biome} | Invalid argument!`);
        
    }

    set(key, value, arg){
        const exists = this[key];
        if (!exists) return this[key] = value;
        else if (exists && arg === 'force') return this[key] = value;
        else throw new Error(`${biome} | The key aready exists! If you would like to overwrite the '${
            key
        }' property, pass the 'force' string in the argument.`);
    }

    remove(arg){
        if (typeof arg === 'string') return delete this[arg];
        else throw new Error(`${biome} | The argument passed is invalid!`);
    }
}