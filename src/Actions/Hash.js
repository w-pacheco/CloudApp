/**
 * Hash.js
 * @author Wilfredo Pacheco
 */

import { name as biome } from '../Biome.js';

export default function Hash(arg){
    if (typeof arg !== 'string') throw new Error(`${biome} | The argument is invalid!`);
    return sha256(encodeURIComponent(arg));
}