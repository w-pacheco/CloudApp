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


function renderCollapseOption(){

    /** Handle sidbar collapse; */
    const parent = Layout.Menu;
    const main = Layout.Main.get();
    const content = Layout.tabContent;
    const collapse_icon = document.getIcon('layout-sidebar-inset');
    collapse_icon.classList.add('icon');
    collapse_icon.setAttribute('data-sidebar-link-icon', '');

    new Component({
        tag: 'button',
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
                    logo.classList.remove('d-none');
                    sidebar_links.map((c, index) => {
                        const component = c.component;
                        component.get().classList.remove('d-flex');
                        component.get().classList.remove('justify-content-center');
                        component.get('svg[data-sidebar-link-icon]').removeAttribute('style');
                        $(component.get('span[data-sidebar-link-title]')).fadeIn();
                    });
                    this.dataset.collapsed = !collapsed;
                }

                else
                {
                    // console.info('You need to collapse it');
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
                    this.dataset.collapsed = !collapsed;
                }

                Layout.Main.get('nav[data-main-nav]').dataset.collapsed = !collapsed;

            },
        }],
        innerHTML: /*html*/`
        <span class="_icon ms-1">${collapse_icon.outerHTML}</span>`,
    }).render();

}

export default function Render(){

    /** Disable pace simple loading bar; */
    document.querySelector('link#pace-simple-custom')?.remove();

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
    renderCollapseOption();

}