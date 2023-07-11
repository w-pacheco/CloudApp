/**
 * Wizard.js
 * @description Designed to work with SmartWizard v4.3.1
 * @author Wilfredo Pacheco
 */

import Component from "./Component.js";
import { name as biome } from '../Biome.js';

export default class Wizard extends Component {

    constructor(arg){

        const {
            parent,
            $options,
            steps,
            buttons,
            id,
        } = arg;

        const defaults = new Object();
        defaults.selected = 0; // Initial selected step, 0 = first step
        defaults.keyNavigation = false; // Enable/Disable keyboard navigation(left and right keys are used if enabled)
        defaults.autoAdjustHeight = true; // Automatically adjust content height
        defaults.cycleSteps = false; // Allows to cycle the navigation of steps
        defaults.backButtonSupport = true; // Enable the back button support
        defaults.useURLhash = true; // Enable selection of the step based on url hash
        defaults.showStepURLhash = true; // Show url hash based on step
        defaults.lang = new Object(); // Language variables for button
        defaults.lang.next = 'Next';
        defaults.lang.previous = 'Previous';

        defaults.toolbarSettings = {
            toolbarPosition: 'bottom', // none, top, bottom, both
            toolbarButtonPosition: 'end', // start, end
            showNextButton: true, // show/hide a Next button
            showPreviousButton: true, // show/hide a Previous button
            toolbarExtraButtons: [] // Extra buttons to show on toolbar, array of jQuery input/buttons elements
        };

        defaults.anchorSettings = {
            anchorClickable: true, // Enable/Disable anchor navigation
            enableAllAnchors: false, // Activates all anchors clickable all times
            markDoneStep: true, // Add done css
            markAllPreviousStepsAsDone: true, // When a step selected by url hash, all previous steps are marked done
            removeDoneStepOnNavigateBack: false, // While navigate back done step after active step will be cleared
            enableAnchorOnDoneStep: true // Enable/Disable the done steps navigation
        };

        defaults.contentURL = null; // content url, Enables Ajax content loading. Can also set as data data-content-url on anchor
        defaults.contentCache = true; // cache step contents, if false content is fetched always from ajax url
        defaults.ajaxSettings = {}; // Ajax extra settings
        defaults.disabledSteps = []; // Array Steps disabled
        defaults.errorSteps = []; // Highlight step with errors
        defaults.hiddenSteps = []; // Hidden steps
        defaults.theme = 'default'; // theme for the wizard, related css need to include for other than default theme
        defaults.transitionEffect = 'fade'; // Effect on navigation, none/slide/fade
        defaults.transitionSpeed = '400';

        super({
            tag: 'div',
            classList: 'h-100',
            attributes: [{ name: 'id', value: id || '' }],
            parent,
            innerHTML: /*html*/`
            <ul id="wizard-nav" data-wizard-nav></ul>
            <div id="wizard-content" data-wizard-content></div>`,
        });

        if ($options?.toolbarSettings?.toolbarExtraButtons) throw new Error(`${
            biome
        } | The options for the 'toolbarExtraButtons' should be passed in the argument defined as 'buttons'`);

        // this.$options = defaults;
        this.$options = $options ? Object.assign(defaults, $options) : defaults;
        this.steps = steps;
        this.buttons = buttons;
        this.$wizard = null;
        this.init();

    }

    getNavContainer(){
        return this.get('ul[data-wizard-nav]');
    }

    getContentContainer(){
        return this.get('div[data-wizard-content]');
    }

    getContent(){
        return this.$wizard.getContent();
    }

    init(){

        const { steps, $options, buttons } = this;
        const element = this.get();
        const nav = this.getNavContainer();
        const content = this.getContentContainer();
        let $wizard = null;

        this.render();

        if (steps?.length) steps
        .forEach(function({ title, body, id, description }){
            
            new Component({
                tag: 'li',
                // classList: 'done',
                attributes: [
                    { name: 'data-wizard-step-link', value: '' },
                ],
                events: [{
                    name: 'change',
                    action(event){
                        console.info(event);
                    },
                }],
                parent: nav,
                innerHTML: /*html*/`
                <a href="#step-${id}">${title}
                    <br />
                    <small class="d-none">${description || ''}</small>
                </a>`,
            }).render();

            new Component({
                tag: 'div',
                classList: 'card my-3 border-0',
                attributes: [{ name: 'id', value: `step-${id}` }],
                parent: content,
                innerHTML: /*html*/`
                <div class="card-header bg-transparent border-0">
                    <h2>${title}</h2>
                </div>
                <div class="card-body">
                    <div>${body}</div>
                </div>
                <div class="card-footer bg-transparent border-0"></div>`,
            }).render();

        });

        if (buttons?.length) buttons
        .forEach(btn => {
            if (btn instanceof HTMLElement) $options.toolbarSettings.toolbarExtraButtons.push($(btn));
            else if (btn instanceof Component) $options.toolbarSettings.toolbarExtraButtons.push($(btn.get()));
            else if (window?.$?.fn?.jquery && btn instanceof jQuery) $options.toolbarSettings.toolbarExtraButtons.push(btn);
            else throw new Error(`${biome} | The button definition passed is invalid!`);
        });

        if (!steps.length) console.info(`%c${biome} | Wizard instance is missing steps & has failed!`, 'color: gold;');

        $wizard = $(element).smartWizard($options);
        $(this.get('div.btn-group.sw-btn-group')).addClass('order-2 mx-2');

        /** TODO: Make call back to track movement in the wizard, and set the done check mark if the response is not empty; */
        /** @reference http://techlaboratory.net/jquery-smartwizard */
        $($wizard).on("leaveStep", function(e, anchorObject, currentStepIndex, nextStepIndex, stepDirection){
            console.info({
                e, anchorObject, currentStepIndex, nextStepIndex, stepDirection,
            });
            // return confirm("Do you want to leave the step " + currentStepIndex + "?");
        });

        this.$wizard = $wizard;

        return this;
    }

}