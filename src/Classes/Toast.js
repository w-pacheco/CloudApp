/**
 * Toast.js
 * @author Wilfredo Pacheco
 */

import Component from "./Component.js";

/**
 * SetHiddenEvent
 * @param {Component} component is the created instance of the element;
 */
function SetHiddenEvent(component){
    component.get().addEventListener('hidden.bs.toast', function(event){
        return component.remove();
    });
}

export default class Toast extends Component {

    constructor(arg){

        const {

            /** String - primary, danger, warning, secondary, success; */
            type,

            /** String - can be text string or HTML string; */
            header,
            message,

            /** Boolean; */
            autohide,

            /** Number; */
            delay,

            /** HTML Element/Component - passing in a parent will repalce the default toast container; */
            parent,

            /** Setting this to false on an instance will keep the element on the screen; */
            destroy = true,

        } = arg;

        super({
            tag: 'div',
            classList: `toast align-items-center text-bg-${type} border-0`,
            attributes: [
                { name: 'role', value: 'alert' },
                { name: 'aria-live', value: 'assertive' },
                { name: 'aria-atomic', value: 'true' },
            ],
            parent: parent || document.querySelector('div[data-toast-container]') || document.body,
            innerHTML: /*html*/`
            <div class="toast-header text-bg-${type}">
                ${
                    document?.getIcon ? 
                    document.getIcon('exclamation-circle').outerHTML :
                    ''
                }&#160;
                <span class="me-auto">${header || 'Notification'}</span>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="">
                <div class="toast-body">${message || ''}</div>
            </div>`,
        });

        this.autohide = autohide;
        this.delay = delay;
        this.destroy = destroy;
        
        this.init();

    }

    getBody(){
        return this.get('div.toast-body');
    }

    show(){
        $(this.Element).toast('show');
        this.get().dispatchEvent(new Event('show'));
        return this;
    }

    hide(){
        $(this.Element).toast('hide');
        this.get().dispatchEvent(new Event('hide'));
        this.remove();
    }

    init(){
        const autohide = this.autohide;
        const delay = this.delay;
        if (typeof this.autohide === 'boolean') this.Element.setAttribute('data-bs-autohide', autohide);
        if (typeof this.delay === 'number') this.Element.setAttribute('data-bs-delay', delay);
        if (this.destroy) SetHiddenEvent(this);
    }

}