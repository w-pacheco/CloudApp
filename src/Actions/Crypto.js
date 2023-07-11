/**
 * Crypto.js
 * @author Wilfredo Pacheco
 */

import { name as biome } from "../Biome.js";
import Store from "../Classes/Store.js";

const crypto = new Store();
export default crypto

export function encrypt(content){
    const key = crypto.password + crypto.salt;
    if (!window.CryptoJS) throw new Error(`${biome} | This method requires CryptoJS`);
    return CryptoJS.AES.encrypt(content, key);
}

export function decrypt(encrypted){
    const key = crypto.password + crypto.salt;
    if (!window.CryptoJS) throw new Error(`${biome} | This method requires CryptoJS`);
    return CryptoJS.AES.decrypt(encrypted, key).toString(CryptoJS.enc.Utf8);
}