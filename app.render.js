/**
 * app.render.js
 * @description This is used to render the different views.
 * @author Wilfredo Pacheco
 */

import { ADMINISTRATOR, DEVELOPER, Layout, User } from "./app.js";
import Home from "./Views/Home/View.js";
import Settings from "./Views/Settings.js";
import Administrator from './src/Views/Administrator.js';
// import Projects from "./Views/Projects/View.js";
// import Series from "./Views/Series/View.js";
// import Questions from "./Views/Questions/View.js";
import Component from "./src/Classes/Component.js";
// import RandomUsers from "./Views/RandomUsers/View.js";

export default function Render(){

    Home();
    // Projects();
    // Series();
    
    // if (User.hasRole(DEVELOPER)) Questions();
    // RandomUsers();

    if (User.hasRole(DEVELOPER) 
    || User.hasRole(ADMINISTRATOR))
    {
        Administrator();
    }

    Settings();

    /** Handle sidbar collapse; */
    const parent = Layout.Menu;
    const main = Layout.Main.get();
    const content = Layout.tabContent;
    const collapse_icon = document.getIcon('layout-sidebar-inset');
    collapse_icon.classList.add('icon');
    collapse_icon.setAttribute('data-sidebar-link-icon', '');
    parent.insertAdjacentHTML('afterbegin', /*html*/`
    <style data-sidebar-style></style>`);

    new Component({
        tag: 'button',
        // classList: 'nav-link nav-sb text-start position-absolute bottom-0 start-0 ps-3 pb-2',
        classList: 'nav-link nav-sb text-end position-absolute bottom-0 mb-2',
        attributes: [
            { name: 'id', value: 'collapse-btn' },
            { name: 'title', value: 'Collapse_Sidebar' },
            { name: 'data-sidebar-link', value: '' },
            { name: 'type', value: 'button' },
            { name: 'data-collapsed', value: false },
        ],
        parent,
        events: [{
            name: 'click',
            action(event){

                const collapsed = JSON.parse(this.dataset.collapsed);
                const nav = parent;
                const logo_container = nav.querySelector('div[data-logo-container]');
                const logo = nav.querySelector('img[data-sidebar-logo]');
                const sidebar_links = Array.from(nav.querySelectorAll('*[data-sidebar-link]'));
                const customStyleTag = nav.querySelector('style[data-sidebar-style]');

                if (collapsed)
                {
                    // console.info('You need to expand it');
                    main.classList.remove('d-inline-flex');
                    main.classList.add('row');
                    main.querySelector('nav').classList.add('nav-sb');
                    content.classList.remove('px-2');
                    nav.classList.add('col-1');
                    logo_container.classList.add('mb-4');
                    logo_container.classList.remove('d-none');
                    customStyleTag.innerText = '';
                    logo.classList.remove('d-none');
                    sidebar_links.map((c, index) => {
                        const component = c.component;
                        component.get().classList.remove('d-flex');
                        component.get().classList.remove('justify-content-center');
                        component.get('svg[data-sidebar-link-icon]').removeAttribute('style');
                        $(component.get('span[data-sidebar-link-title]')).fadeIn();
                    });
                    this.dataset.collapsed = false;
                }

                else
                {
                    // console.info('You need to collapse it');
                    customStyleTag.innerText = /*css*/`
                    main nav *[data-sidebar-link]:first-child {
                        border-radius: 12px !important;
                        box-shadow: -5px 3px 15px 0 rgba(0, 0, 0, 0.3) !important;
                    }

                    a[data-sidebar-link], button[data-sidebar-link] {
                        padding: var(--bs-nav-link-padding-y) var(--bs-nav-link-padding-x);
                    }

                    .nav .nav-link ._icon {
                        padding-right: 0px;
                        transition: none !important;
                    }

                    main nav a.nav-link.active {
                        margin: 3px 5px !important;
                        border-radius: 12px !important;
                        box-shadow: 
                            inset 2px 2px 3px 0 rgba(0, 0, 0, 0.2),  /* Dark */
                            inset 0px 0px 26px 0 rgba(0, 0, 0, 0.2)  /* Light */
                    }
                    
                    main nav .nav-pills .nav-link.active, 
                    main nav .nav-pills .show > .nav-link { 
                        background-color: transparent !important; 
                    }`;

                    main.classList.remove('row');
                    main.classList.add('d-inline-flex');
                    main.querySelector('nav').classList.remove('nav-sb');
                    content.classList.add('px-2');
                    nav.classList.remove('col-1');
                    logo_container.classList.remove('mb-4');
                    logo_container.classList.add('d-none');
                    logo.classList.add('d-none');
                    sidebar_links.map((c, index) => {
                        const component = c.component;
                        component.get().classList.add('d-flex');
                        component.get().classList.add('justify-content-center');
                        component.get('svg[data-sidebar-link-icon]').setAttribute('style', 'font-size: 1.15em;');
                        // $(component.get('span[data-sidebar-link-title]')).hide();
                        $(component.get('span[data-sidebar-link-title]')).fadeOut('fast', function(){
                            $(this).hide();
                        });
                    });
                    this.dataset.collapsed = true;
                }

            },
        }],
        innerHTML: /*html*/`
        <span class="_icon ms-1">${collapse_icon.outerHTML}</span>`,
    }).render();

}