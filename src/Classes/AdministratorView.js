/**
 * AdministratorView.js
 * @author Wilfredo Pacheco
 */

// import { camelcaseToSentenceCaseText } from "../Actions/camelcaseToSentenceCaseText.js";
import Component from "./Component.js";

export default class AdministratorView {

    constructor({ Title, Icon, Menu, tabContent, active, content }){

        const icon = document.getIcon(Icon);
        const title = Title.toLocaleLowerCase();
        const buttonid = `${title}-tab`;
        const containerid = `pills-${title}`;

        this.button = new Component({
            tag: 'li',
            classList: 'nav-item',
            attributes: [{ name: 'role', value: 'presentation' }],
            parent: Menu,
            innerHTML: /*html*/`
            <a class="nav-link" 
                id="${buttonid}" 
                data-bs-toggle="pill" 
                data-bs-target="#${containerid}"
                href="#${Title}" 
                role="tab" 
                aria-controls="${containerid}" 
                aria-selected="${active}">${icon.outerHTML}&#160;${Title}</a>`,
        }).render();

        this.container = new Component({
            tag: 'div',
            classList: 'tab-pane fade w-100',
            attributes: [
                { name: 'id', value: containerid },
                { name: 'role', value: 'tabpanel' },
                { name: 'aria-labelledby', value: buttonid },
            ],
            parent: tabContent,
            innerHTML: content || '',
        }).render();

        if (active)
        {
            this.button.get('a').classList.add('active');
            this.container.get().classList.add('active');
        }

        this.Title = Title;
        this.Icon = Icon;
        this.Menu = Menu;
        this.title = title;
        this.buttonid = buttonid;
        this.containerid = containerid;
        this.tabContent = tabContent;
        this.active = active;
    }

    getButton(){
        return this.button;
    }

    getContainer(){
        return this.container;
    }

    show(){
        
        const container = this.getContainer();

        // The Boostrap way:
        const button = this.button.get('a');
        const bsTab = new bootstrap.Tab(button);
        bsTab?.show();
        
        // The jQuery way:
        // $(`#${this.buttonid}`).tab('show');

        container.dispatchEvent('show');

        return this;

    }

}