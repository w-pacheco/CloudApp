/**
 * Icons.js
 * @author Wilfredo Pacheco
 */

import { CreateElementNode } from "../Actions/Element.Create.js"
import { localhost, BootstrapIconURL } from "../Biome.js";

export default async function Icons(Url){

    const Icons = localhost ? 
    await fetch(BootstrapIconURL)
    .catch(response => console.info(response))
    .then(data => data.text())
    .then(data => {
        const domParser = new DOMParser();
        return domParser.parseFromString(data, 'text/html');
    }) :     
    await fetch(Url || BootstrapIconURL)
    .catch(response => console.info(response))
    .then(data => data.text())
    .then(data => {
        const domParser = new DOMParser();
        return domParser.parseFromString(data, 'text/html');
    });

    /** Set methods on document; */
    document.getIcon = function getIcon(icon){
        
        const Element = Icons.querySelector('.bi-' + icon);
        return CreateElementNode({
            tag: 'svg',
            classList: Element.classList,
            attributes: [
                { name: 'width', value: '1em' },
                { name: 'height', value: '1em' },
                { name: 'viewBox', value: '0 0 16 16' },
                { name: 'fill', value: 'currentColor' },
                { name: 'xmlns', value: 'http://www.w3.org/2000/svg' },
            ],
            innerHTML: Element.innerHTML,
        });

    }

    document.listAllIcons = function listAllIcons(){

        return Array.from(Icons.all)
        .filter(el => el.tagName === 'symbol')
        .map(el => el.classList.value);

    }

    document.findIcon = function findIcon(queryString){

        const allIcons = Array.from(Icons.all)
        .filter(el => el.tagName === 'symbol')
        .map(el => el.classList[1]);
        
        const result = allIcons.find(icon => icon.includes(queryString));
        
        return result ?
        result.replace('bi-', '') : 
        result;

    }
    
}