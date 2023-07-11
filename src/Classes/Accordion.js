/**
 * Accordion.js
 * @author Wilfredo Pacheco
 */

import Component from "./Component.js";
import { name as biome } from '../Biome.js';

export default class Accordion extends Component {

    constructor(arg){

        if (!arg) throw new Error(`${biome} | The argument is invalid!`);

        const {
            parent,
            elements,
            customProperties,
            border,
        } = arg;

        const options = {
            tag: 'div',
            classList: 'accordion accordion-flush mt-3',
            attributes: [{ name: 'id', value: 'accordion-element' }],
            parent,
        }

        if (customProperties) options.customProperties = customProperties;

        super(options);
        
        /** By default the border is hidden, setting the border property to true will make it visible; */
        if (border) this.get()
        .classList
        .remove('accordion-flush');

        this.elements = elements || [];
        this.children = [];

    }

    expandAll(){

    }

    collapseAll(){

    }

    clear(){
        const component = this;
        component.get().innerHTML = '';
        this.children = [];
    }

    add({header, body, collapse, id, index}){

        const component = this;
        const element = new Component({
            tag: 'div',
            classList: 'accordion-item',
            attributes: [{ name: 'data-id', value: id || index }],
            parent: component,
            innerHTML: /*html*/`
            <h2 class="accordion-header" id="accordion-${id || index}">
                <button class="accordion-button collapsed" 
                        type="button" data-bs-toggle="collapse" 
                        data-bs-target="#collapseEl-${id || index}" 
                        aria-expanded="false" 
                        aria-controls="collapseEl-${id || index}">
                </button>
            </h2>
            <div id="collapseEl-${id || index}" 
                 class="accordion-collapse ${collapse ? 'collapse' : ''}" 
                 aria-labelledby="accordion-${id || index}" 
                 data-bs-parent="#accordion-element">
                <div class="accordion-body"></div>
            </div>`,
        }).render();

        const elementHeader = element.get('.accordion-header button');
        const elementBody = element.get('.accordion-body');

        if (body instanceof Component) body.render(elementBody);
        else if (typeof body === 'string') elementBody.innerHTML = body;

        if (header instanceof Component) header.render(elementHeader);
        else if (typeof header === 'string') elementHeader.innerHTML = header;

        this.children.push(element);
        return element;
    }

    init(){

        const { elements } = this;
        const component = this;
        
        this.clear();

        elements
        .forEach(function({header, body, id}, index){
            component.add({
                header,
                body,
                id,
                index,
                parent: component,
            });
        });

    }

}