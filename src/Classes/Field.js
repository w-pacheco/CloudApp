/**
 * Field.js
 * @author Wilfredo Pacheco
 */

import Component from "./Component.js";
import { name as biome } from '../Biome.js';

export default class Field {

    constructor(arg, parent){
        
        let element;
        if (typeof arg !== 'object') throw new Error(`${biome} | The argument must be of type object!`);

        this.container = new Component({
            tag: arg.container.tag,
            classList: arg.container.classList,
            parent,
        }).render();

        this.label = new Component({
            tag: 'label',
            parent: this.container.get(),
            classList: arg.label.classList,
            innerText: arg.label.innerText,

        }).render();

        switch (arg.type) {
            case 'slot':
                element = new Component({
                    tag: 'input',
                    classList: arg.element.classList,
                    parent: this.container.get(),
                    events: arg.element.events,
                    innerText: arg.element.innerText,
                });
                break;

            case 'mlot':
                element = new Component({
                    tag: 'textarea',
                    classList: arg.element.classList,
                    parent: this.container.get(),
                    events: arg.element.events,
                    innerText: arg.element.innerText,
                });
                break;
            
            default:
                break;
        }

        if (arg.element?.required) element.get().setAttribute('required', '');
        if (arg.element?.placeholder) element.get().setAttribute('placeholder', arg.element.placeholder);
        
        element.render();

        this.element = element;
        
    }
}