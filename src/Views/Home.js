/**
 * Home.js
 * Home View;
 * @author Wilfredo Pacheco
 */

import App, { Layout } from "../../app.js";
import View from "../Classes/View.js";

export const Icon = 'house-door';
export const Title = 'Home';

export let view;
export let button;
export let container;

export default function Home(){

    const { Menu, tabContent } = Layout;

    view = new View({
        Title, 
        Icon, 
        Menu, 
        tabContent,
        active: true,
        content: /*html*/`
        <div class="" id="featured-3">
            <h2 class="pb-2 border-bottom">${App.Name}</h2>
            <div class="row g-4 py-5 row-cols-1 row-cols-lg-3">
                <div class="feature col">
                    <div class="feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3 p-3 rounded">
                        <!-- <svg class="bi" width="1em" height="1em"><use xlink:href="#collection"></use></svg> -->
                        ${document.getIcon('collection').outerHTML}
                    </div>
                    <h3 class="fs-2">Featured title</h3>
                    <p>Paragraph of text beneath the heading to explain the heading. We'll add onto it with another sentence and probably just keep going until we run out of words.</p>
                    <a href="javascript:;" class="icon-link d-inline-flex align-items-center">
                        Call to action
                        <!-- <svg class="bi" width="1em" height="1em"><use xlink:href="#chevron-right"></use></svg> -->
                        ${document.getIcon('chevron-right').outerHTML}
                    </a>
                </div>
                <div class="feature col">
                    <div class="feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3 p-3 rounded">
                        <!-- <svg class="bi" width="1em" height="1em"><use xlink:href="#people-circle"></use></svg> -->
                        ${document.getIcon('person-circle').outerHTML}
                    </div>
                    <h3 class="fs-2">Featured title</h3>
                    <p>Paragraph of text beneath the heading to explain the heading. We'll add onto it with another sentence and probably just keep going until we run out of words.</p>
                    <a href="javascript:;" class="icon-link d-inline-flex align-items-center">
                        Call to action
                        <!-- <svg class="bi" width="1em" height="1em"><use xlink:href="#chevron-right"></use></svg> -->
                        ${document.getIcon('chevron-right').outerHTML}
                    </a>
                </div>
                <div class="feature col">
                    <div class="feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3 p-3 rounded">
                        <!-- <svg class="bi" width="1em" height="1em"><use xlink:href="#toggles2"></use></svg> -->
                        ${document.getIcon('toggles2').outerHTML}
                    </div>
                    <h3 class="fs-2">Featured title</h3>
                    <p>Paragraph of text beneath the heading to explain the heading. We'll add onto it with another sentence and probably just keep going until we run out of words.</p>
                    <a href="javascript:;" class="icon-link d-inline-flex align-items-center">
                        Call to action
                        <!-- <svg class="bi" width="1em" height="1em"><use xlink:href="#chevron-right"></use></svg> -->
                        ${document.getIcon('chevron-right').outerHTML}
                    </a>
                </div>
            </div>
        </div>`,
        // content: /*html*/`
        // <ul class="nav nav-pills nav-fill gap-2 p-1 small bg-white border rounded-5 shadow-sm" id="pills-tab" role="tablist">
        //     <li class="nav-item" role="presentation">
        //         <button class="nav-link rounded-5 active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Home</button>
        //     </li>
        //     <li class="nav-item" role="presentation">
        //         <button class="nav-link rounded-5" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Profile</button>
        //     </li>
        //     <li class="nav-item" role="presentation">
        //         <button class="nav-link rounded-5" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Contact</button>
        //     </li>
        //     <li class="nav-item" role="presentation">
        //         <button class="nav-link rounded-5" id="pills-disabled-tab" data-bs-toggle="pill" data-bs-target="#pills-disabled" type="button" role="tab" aria-controls="pills-disabled" aria-selected="false" disabled>Disabled</button>
        //     </li>
        // </ul>
        // <div class="tab-content" id="pills-tabContent">
        //     <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" tabindex="0">...</div>
        //     <div class="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabindex="0">...</div>
        //     <div class="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab" tabindex="0">...</div>
        //     <div class="tab-pane fade" id="pills-disabled" role="tabpanel" aria-labelledby="pills-disabled-tab" tabindex="0">...</div>
        // </div>`,
    });

    button = view.getButton();
    container = view.getContainer();

    App.Views[Title] = {
        Title,
        view,
        button,
        container,
    }

}

window.addEventListener('popstate', function (event){
    /** Parse the url & display the tab and/or data based on the url parameters; */
    if (location.hash === `#${Title}` 
    || this.location.hash === '')
    {
        /** Manually call the tab without replacing the rest of the history; */
        view.show();
    }
});