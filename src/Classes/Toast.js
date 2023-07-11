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
            type,
            message,
            header,
            /** Mr. Park has requested that all toasts do not autohide; */
            // autohide = false,
            autohide,
            delay,
            parent,
        } = arg;

        super({
            tag: 'div',
            classList: `toast align-items-center text-bg-${type} border-0`,
            attributes: [
                { name: 'role', value: 'alert' },
                { name: 'aria-live', value: 'assertive' },
                { name: 'aria-atomic', value: 'true' },
            ],
            // parent: parent || Layout.ToastContainer,
            // parent,
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
                <div class="toast-body">${message}</div>
                <!-- <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button> -->
            </div>`,
        });

        this.autohide = autohide;
        this.delay = delay;
        
        this.init();

    }

    show(){
        $(this.Element).toast('show');
        return this;
    }

    hide(){
        $(this.Element).toast('hide');
        this.remove();
    }

    init(){

        // console.info(this.autohide);
        const autohide = this.autohide;
        const delay = this.delay;

        if (typeof this.autohide === 'boolean') this.Element.setAttribute('data-bs-autohide', autohide);
        if (typeof this.delay === 'number') this.Element.setAttribute('data-bs-delay', delay);

        SetHiddenEvent(this);
    }

}
// window.Toast = Toast;