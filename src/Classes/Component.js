/**
 * Component.js
 * @author Wilfredo Pacheco
 */

import CreateElement from "../Actions/Element.Create.js";
import Store from "./Store.js";
import { name as biome } from '../Biome.js';

export default class Component {

    constructor(arg) {
        
        if (!arg) throw new Error(`${biome} | Invalid request, argument is invalid!`);
        
        this.Store = new Store();
        this.Store.set('callstack', new Error());

        /** If the instance of the argument is HTMLElement an element the options are set to null; */
        this.options = arg instanceof HTMLElement ? 
        null :
        arg;

        /** If the instance of the argument is HTMLElement an element is supercharged, else it is created; */
        this.Element = arg instanceof HTMLElement ? 
        CreateElement({}, arg) :
        CreateElement(arg);

        /** This will set the DOM element with the component instance; */
        this.Element.component = this;
        this.Element.setAttribute('component', '');
        
    }

    /**
     * render
     * @param {Object} parent is the HTML element this component will be append to.
     * @returns component
     */
    render(parent){

        /** If a parent is passed in the argument and is and instanceof HTMLElement; */
        if (!!parent 
        && parent instanceof HTMLElement) parent.append(this.Element);

        else if (!!parent 
        && parent instanceof Component) parent.get().append(this.Element);

        /** If the parent is not passed, this will look for the parent property in the options; */
        else if (!!this.options.parent)
        {

            /** If the parent is a component, then we need to call the get method; */
            if (this.options.parent instanceof Component) this.options.parent.get().append(this.Element);
            if (this.options.parent instanceof HTMLElement) this.options.parent.append(this.Element);
        }

        return this;
    }

    /**
     * get
     * @param {String} arg is a string used to reference an object in the element defined.
     * @returns The HTML element requested within the scope of this element, this element if the arg is missing, throws error if invalid argument.
     */
    get(arg){
        if (arg && typeof arg === 'string') return this.Element.querySelector(arg);
        else if (!arg) return this.Element;
        else throw new Error(`${biome} | The argument passed was invalid!`);
    }

    /**
     * getOriginalOptions
     * @returns orignal options used to define this component
     */
    getOriginalOptions(){
        return this.options;
    }

    /**
     * getCallStack
     * @param {String} arg will use the console.table method if the following strings are passed: list,table,display,show
     * @returns callstack array
     */
    getCallStack(arg){
        
        const StackArray = this.Store.callstack.stack.split(' '); // Split the string on the space;
        StackArray.shift(); // Remove the error string from the front of the array;

        /** Create a new array from the valid strings; */
        const CallerStack = StackArray
        .filter(str => !!str && str !== 'at')
        .map(str => {

            str = str.trim().replace(/[()]/gi, ''); // Replace the paren from the js file url;

            /** Return the end of the array which includes the file name, col no, line no; */
            if (str.includes('/')) return str.split('/').pop();

            /** Just return the string; */
            else return str;

        });

        /** @returns an filtered array of objects; */
        if (arg 
        && (arg === 'list' || arg === 'table' || arg === 'display' || arg === 'show')
        && console?.table) return console.table(CallerStack.map((str, index) => {
            if (!str.includes(':')) return {
                caller: str,
                file: CallerStack[index + 1],
                location: StackArray
                .find(str => str.includes(CallerStack[index + 1]))
                ?.trim()
                ?.replace(/[()]/gi, ''),
            }            
        }).filter(item => !!item));

        return CallerStack.map((str, index) => {
            if (!str.includes(':')) return {
                caller: str,
                file: CallerStack[index + 1],
                location: StackArray
                .find(str => str.includes(CallerStack[index + 1]))
                ?.trim()
                ?.replace(/[()]/gi, ''),
            }            
        }).filter(item => !!item);
    }

    /**
     * NOTE: The following exposes the methods available to an HTML element;
     */

    /**
     * querySelector
     * @param {String} queryString string used to query the element defined.
     * @returns search result
     */
    querySelector(queryString){
        return this.get().querySelector(queryString);
    }

    /**
     * querySelectorAll
     * @param {String} queryString string used to query a group of elements.
     * @returns search result
     */
    querySelectorAll(queryString){
        return this.get().querySelectorAll(queryString);
    }

    /** @reference https://developer.mozilla.org/en-US/docs/Web/API/Element/remove */
    remove(){
        return this.get().remove();
    }

    destroy(){
        return this.get().remove();
    }

    prepend(element){

        if (!element) throw new Error(`${biome} | Invalid request, argument is invalid type!`);
        if (element instanceof Component) this.get().prepend(element.get());
        if (element instanceof HTMLElement) this.get().prepend(element);

        return this;

    }

    setAttribute(attributeString, value){
        return this.get().setAttribute(attributeString, value);
    }

    removeAttribute(attributeString){
        return this.get().removeAttribute(attributeString);
    }

    getAttribute(attributeString){
        return this.get().getAttribute(attributeString);
    }

    addEventListener(event, method){
        return this.get().addEventListener(event, method);
    }

    dispatchEvent(event){
        return this.get().dispatchEvent(new Event(event));
    }

}