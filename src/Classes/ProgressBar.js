/**
 * ProgressBar.js
 * @author Wilfredo Pacheco
 */

import Component from "./Component.js";
import { name as biome } from '../Biome.js';

/** TODO: Support the different progress bars available in bootstrap; */
// export default class AnimatedProgressBar extends Component {

export default class ProgressBar extends Component {

    constructor(arg) {

        if (typeof arg !== 'object') throw new Error(`${biome} | The argument passed is invalid!`);

        const {
            parent,
            background,
            text,
        } = arg;

        super({
            tag: 'div',
            parent,
            innerHTML: /*html*/`
            <p data-display>${text || 'Loading'}...<p>
            <div class="progress" style="height: 8px;">
                <div class="progress-bar progress-bar-striped progress-bar-animated" 
                     role="progressbar" 
                     aria-label="Animated striped" 
                     aria-valuenow="0" 
                     aria-valuemin="0" 
                     aria-valuemax="100" 
                     style="width: 0%"
                     data-progress >
                </div>
            </div>`
        });

        if (background) this.get('div[data-progress]')
        .classList
        .add(background);
    }

    /**
     * text
     * @param {String} Str will be used to update the display text.
     */
    text(Str) {
        this.get('p[data-display]').innerText = Str;
    }

    /**
     * progress
     * @param {*} value can be a number or string value.
     * @returns the component instance
     */
    progress(value){
        const element = this.get('div[role="progressbar"]');
        element.setAttribute('style', `width: ${value}%`);
        element.setAttribute('aria-valuenow', value);
        return this;
        // if (value >= 100) new Component({
        //     tag: 'p',
        //     parent: modal.Body,
        //     innerText: 'Done!'
        // }).render();
    }
}