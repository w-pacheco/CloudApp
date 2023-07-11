/**
 * ButtonGroup.js
 * @author Wilfredo Pacheco
 */

import Component from "./Component.js";
// import { name as biome } from '../Biome.js';

export default class ButtonGroup extends Component {

    constructor(arg = {}){

        const {
            // classList,
            parent,
            buttons,
            innerHTML,
        } = arg;

        const options = {
            tag: 'div',
            classList: 'btn-group float-end',
            parent,
            attributes: [{ name: 'role', value: 'group' }],
            // innerHTML: ``,
        }

        if (innerHTML) options.innerHTML = innerHTML;

        super(options);

        this.buttons = buttons;

        this.init();

    }

    init(){
        // console.info(this.buttons);
    }

}