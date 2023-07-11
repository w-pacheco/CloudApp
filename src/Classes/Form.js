/**
 * Form.js
 * @author Wilfredo Pacheco
 */

import Component from "./Component.js";
// import Field from "./Field.js";
import Fields from './Fields.js';
import Store from "./Store.js";
import Values from "./Values.js";

// export function DisableAllFormElements(form){
//     try 
//     {
//         Array.from(form.querySelectorAll('div[contenteditable=true]'))
//         .forEach(field => field.setAttribute('contenteditable', 'null'));

//     } catch(e) { console.info(e); }
//     return Array.from(form).forEach(field => field.setAttribute('disabled', ''));
// }

// export function EnableAllFormElements(form){
//     try
//     {
//         Array.from(form.querySelectorAll('div[contenteditable=null]'))
//         .forEach(field => field.setAttribute('contenteditable', 'true'));

//     } catch(e) { console.info(e); }

//     return Array.from(form).forEach(field => field.removeAttribute('disabled'));
// }

/**
 * @reference https://stackoverflow.com/questions/53304725/how-to-exclude-a-specific-literal-in-pattern
 * pattern="(?!Test$).*" 
 * pattern="(?!(Test|test)$).*" 
 * 
 * data-invalid-custom="The entered value already exists on this list, please enter a different value"
 */

export default class Form extends Component {

    constructor(options){

        /** By default auto-toggle for date and time fields are set to true; */
        const autotoggle = options?.autotoggle || true;
        const component = super(Object.assign(options, {
            /** Since this is a form constructor, we will always set this for the user; */
            tag: 'form',
            autotoggle,
        }));

        /** Testing new fields creation; */
        // this.Fields = options.fields.map(f => {
        //     return new Field(f, this.get());
        // });

        /** Original fields implementation; */
        const fields = new Fields(this.Element);
        const values = new Values(component);

        this.fields = fields;
        this.values = values;
        this.Fields = fields;
        this.Values = values;

        if (options.store) this.Store = new Store();

        this.init();

    }

    /** This will reset the form to the original values; */
    reset(){

        this.Element.reset();
        this.Element.classList.remove('was-validated');
        
        this.get().dispatchEvent(new Event('reset'));

    }

    /** This will clear all the fields in the form to include contenteditable divs; */
    clear(){
        
        this.Element.classList.remove('was-validated');
        this.fields.get().map(function(f){
            if (f.getAttribute('contenteditable') === 'true') f.innerHTML = '';
            f.value = '';
        });

        this.get().dispatchEvent(new Event('clear'));
    }

    set(data){
        return this.values.set(data);
    }

    validate(){
        return this.fields.validate();
    }

    init(){

        /** By default we assume all forms will be a POST method; */
        this.Element.setAttribute('data-method', 'post');

        /** Auto-Toggle picker for date and time elements when user focuses; */
        if (this.autotoggle) [
            Array.from(this.Element.querySelectorAll('input[type="date"]')),
            Array.from(this.Element.querySelectorAll('input[type="time"]')),
        ]
        .flat()
        .map(el => {
            el.addEventListener('focus', function ShowPicker(event){
                return this.showPicker();
            });
            return el;
        });

        /**
         * CopyButtons will search the form for button elements with a data-copy attribute
         * and add the event listener to it;
         * 
         * The event listener will copy the input value for where the button is located,
         * and add that value to the users' clipboard;
         */
        const CopyButtons = Array.from(this.Element.querySelectorAll('button[data-copy]'));
        const thisElement = this.Element;
        CopyButtons.forEach(btn => {
            btn.addEventListener('click', function (event){
                const CheckIcon = document.getIcon('check2-circle').outerHTML;
                const OriginalHTML = btn.innerHTML;
                const input = thisElement.querySelector(`#${btn.dataset.copy}`);
                navigator.clipboard.writeText(input.value);
                $(btn).hide().fadeIn();
                btn.innerHTML = CheckIcon;
                setTimeout(function(){
                    btn.innerHTML = OriginalHTML;
                    $(btn).hide().fadeIn('fast');
                }, 800);
            });
        });

        /** Handle enter button when the form is valid but not ready; */
        this.get().addEventListener('submit', function(event){
            event.preventDefault();
            event.stopPropagation();
        });

    }

}