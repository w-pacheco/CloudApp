/**
 * View.js
 * @author Wilfredo Pacheco
 */

import { camelcaseToSentenceCaseText } from "../Actions/camelcaseToSentenceCaseText.js";
import Component from "./Component.js";

export default class View {

    constructor(arg){

        const { 
            Title, 
            Icon, 
            Menu, 
            tabContent, 
            active, 
            content, 
            displayTitle,
        } = arg;
        
        const icon = document.getIcon(Icon);
        icon.classList.add('icon');
        icon.setAttribute('data-sidebar-link-icon', '');

        const buttonid = `v-pills-${Title.toLocaleLowerCase()}-tab`;
        const containerid = `v-pills-${Title.toLocaleLowerCase()}`;

        this.button = new Component({
            tag: 'a',
            classList: 'nav-link nav-sb text-start',
            attributes: [
                { name: 'id', value: buttonid },
                { name: 'data-bs-target', value: `#${containerid}` },
                { name: 'data-sidebar-link', value: '' },
                { name: 'type', value: 'button' },
                { name: 'role', value: 'tab' },
                { name: 'aria-controls', value: containerid },
                { name: 'aria-selected', value: active },
                { name: 'href', value: `#${Title}` },
            ],
            parent: Menu,
            innerHTML: /*html*/`
            <span class="_icon">${icon.outerHTML}</span>
            <span class="pb-0 mb-0 mt-2 ml-1" data-sidebar-link-title>${displayTitle ? displayTitle : camelcaseToSentenceCaseText(Title)}</span>`,
        }).render();

        this.container = new Component({
            tag: 'div',
            classList: `tab-pane fade w-100 ${active ? 'show' : ''}`,
            attributes: [
                { name: 'id', value: containerid },
                { name: 'role', value: 'tabpanel' },
                { name: 'aria-labelledby', value: buttonid },
                { name: 'tabindex', value: '0' },
            ],
            parent: tabContent,
            innerHTML: content || '',
        }).render();

        if (active)
        {
            this.button.get().classList.add('active');
            this.container.get().classList.add('active');
        }

        this.Title = Title;
        this.Icon = Icon;
        this.Menu = Menu;
        this.buttonid = buttonid;
        this.containerid = containerid;
        this.tabContent = tabContent;
        this.active = active;
    }

    /**
     * getButton
     * @returns The button element used to toggle the view container
     */
    getButton(){
        return this.button;
    }

    /**
     * getContainer
     * @returns the container element used to hold the content for this view
     */
    getContainer(){
        return this.container;
    }

    /**
     * show
     * @description This will toggle the container element and is currently defined only with jQuery.
     */
    show(){

        const container = this.container;

        $(`#${this.buttonid}`).tab('show');

        container.dispatchEvent('show');

        return this;
        
    }

    updateButtonIcon(iconString){
        const button_component = this.getButton();
        const icon = document.getIcon(iconString);
        icon.classList.add('icon');
        button_component.get('span._icon').innerHTML = icon.outerHTML;
    }
    
}