/**
 * OffCanvas.js
 * @author Wilfredo Pacheco
 */

import Component from "./Component.js";
import { name as biome } from '../Biome.js';

export default class OffCanvas extends Component {

    constructor(options){

        const {
            title, // HTML String;
            body, // HTML String;
            id,
            backdrop,
            remove,
        } = options;

        if (!title) throw new Error(`${biome} | The OffCanvas is missing a title!`);

        super(Object.assign(options, {
            tag: 'div',
            classList: 'offcanvas offcanvas-end',
            attributes: [
                // { name: 'data-bs-backdrop', value: backdrop || 'static' },
                { name: 'tabindex', value: '-1' },
                { name: 'id', value: `staticBackdrop-${id}` },
                { name: 'aria-labelledby', value: 'staticBackdropLabel' },
            ],
            innerHTML: /*html*/`
            <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="staticBackdropLabel">${title}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">${
                body || ''
            }</div>`,
        }));

        if (backdrop) this.get().setAttribute('data-bs-backdrop', 'static');
        this.remove = remove;
        this.init();

    }

    getTitle(){
        return this.get('h5.offcanvas-title');
    }

    getBody(){
        return this.get('div.offcanvas-body');
    }

    show(){
        $(this.get()).offcanvas('show');
    }

    hide(){
        $(this.get()).offcanvas('hide');
    }

    init(){

        const component = this;

        if (this.remove) this.get()
        .addEventListener('hidden.bs.offcanvas', function(event){
            return component.get().remove();
        });

    }

}