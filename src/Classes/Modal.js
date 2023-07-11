/**
 * Modal.js
 * @author Wilfredo Pacheco
 */

import Component from "./Component.js";
import { ReplaceLocation } from '../Actions/History.Set.js';

export function MakeDraggable(ModalHeader){

    if (!window?.$?.fn?.jquery) return;
    
    /** Give the header the cursor: move; inform user know it can be dragged; */
    ModalHeader.setAttribute('style', 'cursor: move;');
    
    $(ModalHeader).on("mousedown", function(mousedownEvt) {
        var $draggable = $(this);
        var x = mousedownEvt.pageX - $draggable.offset().left,
            y = mousedownEvt.pageY - $draggable.offset().top;
        $("body").on("mousemove.draggable", function(mousemoveEvt) {
            $draggable.closest(".modal-dialog").offset({
                "left": mousemoveEvt.pageX - x,
                "top": mousemoveEvt.pageY - y
            });
        });
        $("body").on("mouseup", function() {
            $("body").off("mousemove.draggable");
        });
        $draggable.closest(".modal").on("hidden.bs.modal", function(event){
            $("body").off("mousemove.draggable");
            /** Reset the modal since it is used throught the application; */
            $draggable.closest(".modal-dialog").css({
                top: 0,
                left: 0
            });
        });
    });

    // TODO: Start resize feature for modal;
    // overflow: scroll;
    // $(ModalHeader).closest('.modal-content').resizable({
    //     alsoResize: '.modal-header, .modal-body, .modal-footer'
    // });
}

export default class Modal extends Component {

    constructor(options){

        const {
            title,
            size,
            draggable,
            buttons,
            body,
        } = options;
        
        const component = super({
            tag: 'div',
            classList: 'modal fade',
            attributes: [
                { name: 'id', value: 'tempModal' },
                { name: 'tabindex', value: '-1' },
                { name: 'aria-labelledby', value: 'tempModalLabel' },
                { name: 'aria-hidden', value: 'true' },
            ],
            parent: document.body,
            events: [{
                name: 'hidden.bs.modal',
                action(event){

                    /** These are the token parameters the UI looks for when a modal is closed; */
                    const tokens = ['GUID', 'Id', 'ID'];

                    /** Create a new URL Object based on the location; */
                    const url = new URL(location);
                    
                    /** Iterate over the tokens and if the token if found, call the delete method from the new URL */
                    tokens.forEach(token => {
                        if (url.searchParams.get(token)) url.searchParams.delete(token);
                    });

                    /** Replace the location with the removed parameters; */
                    ReplaceLocation(url);

                    return component.remove();
                }
            }],
            innerHTML: /*html*/`
            <!-- Modal -->
            <div class="modal-dialog ${size || ''}">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="tempModalLabel">${title || 'Modal title'}</h1>
                        <div class="btn-group" role="group" aria-label="Modal buttons">
                            <button type="button" class="btn-close btn-resize" data-bs-resize="modal" aria-label="Resize"></button>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                    </div>
                    <div class="modal-body">
                        <!-- Modal Body -->
                        ${body || ''}
                    </div>
                    <div class="modal-footer">
                        <div class="col p-0" data-delete></div>
                        <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>`,
        });

        this.draggable = draggable;
        this.buttons = buttons;
        this.size = size;
        this.header = this.get('div.modal-header');
        this.body = this.get('div.modal-body');
        this.footer = this.get('div.modal-footer');
        this.dialog = this.get('div.modal-dialog');
        this.content = this.get('div.modal-content');

        this.init();
    }

    show(){
        $(this.get()).modal('show');
        return this;
    }

    hide(){
        $(this.get()).modal('hide');
    }

    init(){

        const {
            draggable,
            header, 
            buttons,
            footer,
            size,
        } = this;
        
        /** Handle draggable & fullscreen modals; */
        if (draggable && size !== 'modal-fullscreen') MakeDraggable(header);

        if (buttons && buttons.length) buttons
        .forEach(function(b){
            const { type } = b;
            if (type === 'delete') new Component(b).render(footer.querySelector('div[data-delete]'));
            else new Component(b).render(footer);
        });

        const component = this;
        this.get(`button[data-bs-resize]`).addEventListener('click', event => {

            const dialog = component.get(`div.modal-dialog`);
            const isExpanded = dialog.classList.contains('modal-fullscreen');

            if (!isExpanded)
            {
                dialog.classList.remove(size);
                dialog.classList.add('modal-fullscreen');
            } 

            else
            {
                dialog.classList.remove('modal-fullscreen');
                dialog.classList.add(size);
            }
            
        });
        
    }

}