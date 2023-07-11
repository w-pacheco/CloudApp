/**
 * StyleSheet.Create.js
 * @author Wilfredo Pacheco
 */

import Component from "../Classes/Component.js";

/** Prevent cached css when in production; */
const version = `?rev=${new Date().getTime()}`;

export default function CreateStyleSheetElement({ href, parent }){

    const filename = href.split('/').pop();

    return new Component({
        tag: 'link',
        attributes: [
            { name: 'rel', value: 'stylesheet' },
            { name: 'id', value: filename.replace('.css', '') },
            { name: 'href', value: href + version },
            { name: 'data-file', value: filename },
        ],
        parent,
    });

}