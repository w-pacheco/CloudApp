/**
 * Dropdown.js
 * @author Wilfredo Pacheco
 */

import Component from "./Component.js";
import { name as biome } from '../Biome.js';

export default class Dropdown extends Component {

    constructor(options){

        const {
            tag,
            title,
            menuOptions,
            buttonClassList,
            buttonColor = 'secondary',
        } = options;

        if (!title) throw new Error(`${biome} | Creating dropdowns requires a title!`);

        super(Object.assign(options, {
            tag: tag || 'div',
            attributes: [{ name: 'role', value: 'group' }],
            innerHTML: /*html*/`
            <button class="btn btn-${buttonColor} dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                ${title}
            </button>
            <ul class="dropdown-menu gap-1 p-2 rounded-3 mx-0"></ul>`,
        }));

        this.menuOptions = menuOptions;
        this.buttonClassList = buttonClassList;
        this.init();

    }

    getButton(){
        return this.get('button');
    }

    getMenu(){
        return this.get('ul.dropdown-menu');
    }

    init(){

        /** Add the dropdown class to the element; */
        this.get().classList.add('dropdown');
        this.get().classList.add('btn-group');

        const btn = this.get('button');
        const buttonClassList = this.buttonClassList;
        if (buttonClassList 
        && typeof buttonClassList === 'string') buttonClassList.split(' ')
        .forEach(str => {
            btn.classList.add(str);
        });

        const menuOptions = this.menuOptions;
        const menuContainer = this.getMenu();
        if (menuOptions 
        && typeof menuOptions === 'object') menuOptions
        .forEach(option => {

            const li = new Component({
                tag: 'li',
                // classList: 'dropdown-item',
                parent: menuContainer,
            }).render();

            // if (option.classList) option.classList.split(' ')
            // .forEach(str => {
            //     li.get().classList.add(str);
            // });

            new Component(Object.assign(option, {
                parent: li,
            })).render();

        });

    }

}