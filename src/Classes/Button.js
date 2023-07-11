/**
 * Button.js
 * @author Wilfredo Pacheco
 */

import Component from "./Component.js";

export default class Button extends Component {

    constructor(options){

        const {
            icon,
            classList = 'btn btn-outline-secondary',
        } = options;

        const tag = 'button';

        super(Object.assign(options, {
            tag,
            classList,
        }));

        this.options = options;
        this.icon = icon;

        this.init();
        
    }

    init(){

        const icon = this.icon;

        if (icon)
        {
            const element = document.getIcon(icon);
            element.setAttribute('style', 'font-size: 1.25em;');
            element.setAttribute('data-icon', '');
            this.Element.append(element);
        }

    }

}