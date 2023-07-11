/**
 * Search.js
 * @author Wilfredo Pacheco
 */

// import SearchActiveDirectory from "../Actions/ActiveDirectory.Search.js";
// import { Route } from "../../app.js";
// import Component from "./Component.js";
// import Store from "./Store.js";

export class BasicSearch {

    constructor(arg){

        const { 
            input,
            data,
            key,
            select,
            isInModal = false,
        } = arg;

        this.input = input;
        this.data = data;
        this.isInModal = isInModal;
        this.key = key;
        this.select = select || function (event, li){
            console.info(event, li);
        };
        
        this.source = data.map(item => {
            return {
                label: item[key],         // User display title;
                value: item[key],         // User key;
                data: item,               // Object;
                // getAction: element.liAction // callback;
            }
        });
        
        this.init();
    }

    setMinLength(minLength){
        const input = this.input;
        return $(input).autocomplete({
            minLength,
        });
    }

    filterSearchByKeyValue(key, value){

        const input = this.input;
        const source = this.source;

        function filterSource(key, value){
            return source.filter(option => option.data[key] === value);
        }
        
        if (key && value)
        {
            // Set the min length to zero to expose all the results for this search field;
            this.setMinLength(0);

            const newSourceData = filterSource(key, value);
            $(input).autocomplete({
                source: newSourceData,
            });

            return $(input).autocomplete('search', '');
        }

        else 
        {
            // Set the min length back to the default of 1;
            this.setMinLength(1);

            $(input).autocomplete({ source });
        }
        
    }

    clear(){
        this.input.value = '';
        return this;
    }

    init(){

        const {
            input,
            source,
            isInModal,
            select,
        } = this;

        if (false) input.addEventListener('input', function(event){

            const element = event.target;

            /** Check for JUST 'Enter' button; */
            if (event.keyCode === 13)
            {
                event.preventDefault();
                // return document.querySelector(buttonId).click();
            }

            /** Check for 'Enter', 'Up', 'Down' buttons; */
            if (event.keyCode !== 13 
            && event.keyCode !== 40 
            && event.keyCode !== 38)
            {
                // Check element value is not an empty string;
                if (element.value !== "")
                {

                    $(element).autocomplete({

                        // source(request, response){
                        //     console.info(request,response)
                        //     return this;
            
                        // },
                        source,
            
                        search(event, ui){
                            console.info(event, ui);
                            /** Identify if the search element in a modal; */
                            // const bindings = [...$(input).autocomplete().data().uiAutocomplete.bindings];
                            // console.info(bindings);
                            // bindings
                            // if (isInModal) 
                            // {
                            //     $(bindings.find(function(element){
                            //         $(element).hasClass('ui-front');
                            //     }))
                            //     .attr('style', 'z-index:2147483647;');
                            // }
                            
                            // setTimeout(function(){
                            // }, 400);
                        },
                        
                        select(event, li){
                            console.info(event, li);
                        },
            
                        // open(event){
            
                        //     console.info(event);
                        //     /** Identify if the search element in a modal; */
                        //     const bindings = [...$(input).autocomplete().data().uiAutocomplete.bindings];
                        //     console.info(bindings);
                        //     if (isInModal) setTimeout(function(){
                        //         $(bindings.find(function(element){
                        //             $(element).hasClass('ui-front');
                        //         }))
                        //         .attr('style', 'z-index:2147483647;');
                        //     }, 400);
            
                        // }
            
                    });
                }
            }

            /** Identify if the search element in a modal; */
            const bindings = [...$(element).autocomplete().data().uiAutocomplete.bindings];
            if (isInModal) $(bindings.find(function(element){
                $(element).hasClass('ui-front');
            }))
            .attr('style', 'z-index:2147483647;');

            /** The autocomplete is asked to search results after call returns; */
            return $(element).autocomplete('search');

        });

        const autocomplete = $(input).autocomplete({

            /**
             * source
             * Array, String, Function(Object request, Function response(Object data))
             * @description Defines the data to use, must be specified.
             */
            source,

            // search(event, ui){
            //     console.info(event, ui);
            //     console.info(autocomplete);
            // },
            
            select,

            open(event){
                
                /** Identify if the search element in a modal; */
                const bindings = [...$(input).autocomplete().data().uiAutocomplete.bindings];

                if (isInModal) bindings.find(function(binding){
                    if (binding?.classList?.contains('ui-front')) binding.classList.add('zindex-top');
                });

            }

        });

        this.autocomplete = autocomplete;
    }

}

export default class Search {

    constructor(arg){

        const { 
            type, 
            input, 
            modal, 
            liAction, 
            Url, 
            $select, 
            $top,
            $orderby,
            filter,
            label,
        } = arg;

        this.type = type;
        this.input = input;
        this.modal = modal;
        this.liAction = liAction;
        this.label = label;
        this.filter = filter;
        this.Url = Url;
        this.$top = $top;
        this.$select= $select;
        this.$orderby = $orderby;
        
        this.init();
    }

    init(){

        const {
            input,
            modal,
            liAction,
            Url,
            $select,
            $top,
            filter,
            label,
        } = this;
    
        var XHR = null;

        input.addEventListener('input', async function(event){
        
            const element = event.target;
            const buttonId = element.getAttribute('data-add-id');
            
            // const data = {};
            // data.$select = $select || '*';
        
            /** Check for JUST 'Enter' button; */
            if (event.keyCode === 13)
            {
                event.preventDefault();
                return document.querySelector(buttonId).click();
            }
        
            /** Check for 'Enter', 'Up', 'Down' buttons; */
            if (event.keyCode !== 13 
            && event.keyCode !== 40 
            && event.keyCode !== 38)
            {
                // Check element value is not an empty string;
                if (element.value !== "")
                {        
                    /** Abort any request in progress; */
                    if (XHR) XHR.abort();
                    const $filter = filter
                    .map(field => `(substringof('${element.value}', ${field}))`)
                    .join(' or ');
    
                    XHR = $.ajax({
                        // url: `${Web.Url}/_api/search/${element.value}`,
                        url: Url,
                        method: 'GET',
                        contentType: 'json',
                        data: {
                            $select,
                            $top,
                            $filter,
                        },
                        headers: { 
                            "Content-Type": "application/json; charset=UTF-8", 
                            "Accept": "application/json; odata=verbose" 
                        },
                    });
                    // Route.Get(Url, {
                    //     $select,
                    //     $filter: `(substringof('${element.value}', ErrorType))`,
                    //     $top,
                    // });
    
                    const source = await XHR.catch(e => { /* console.info(e) */ })
                    .then(data => data.d)
                    .then(data => data.results)
                    .then(data => {
                        return data.map(result => {
                            return {
                                label: result[label],
                                value: '',
                                data: result,
                                getAction: element.liAction,
                            }
                        });
                    });
        
                    $(element).autocomplete({
        
                        /** This catch will the error thrown by the abort method; */
                        source,
        
                        open: function(event){
        
                            const element = this;                                   // This will give us access to 'this' within the forEach;
                            const ElementData = $(element).autocomplete().data();   // Call uiAutocomplete for the element;
                            // const { bindings } = ElementData.uiAutocomplete;
    
                            // console.info(ElementData)
        
                            /** bindings is an iterable & can give us all the elements we need; */
                            // Array.from(bindings)
                            // .forEach(item => {
        
                            //     /** Since the global 'window' is part of this list, we need to just get HTML elements for ui-autocomlpete; */
                            //     if (item?.classList?.contains('ui-autocomplete')
                            //     && item.children 
                            //     && Array.from(item.children).length)
                            //     {
                            //         /** This is an <li> element with children <div>s holding text assigned by uiAutocomplete; */
                            //         Array.from(item.children)
                            //         .forEach((li, index) => {
                                        
                            //             // Array of results holding .data from Active Directory;
                            //             const AccountSource = ElementData.uiAutocomplete.options.source;
        
                            //             // Object holding the required account data;
                            //             // const result = AccountSource.find(item => item.label === li.innerText); // Item;
                            //             /** NOTE: 
                            //              * Changed to index since names with the same title fail to render correctly
                            //              * when using the find method.
                            //              * @author Wilfredo Pacheco
                            //              */
                            //             const result = AccountSource[index]; // Item;
                            //             if (result)
                            //             {
                            //                 // This catches null results for the <li>;
                            //                 try
                            //                 {
                            //                     new Component({
                            //                         tag: 'span',
                            //                         parent: li.querySelector('div'),
                            //                         innerHTML: /*html*/`
                            //                          -- <em class="f12">(${result.data.EntityData.Email})</em>`,
                            //                     }).render();
                                                
                            //                     li.setAttribute('title', result.data.Key);
                            //                 } catch(e){ }
                            //             }
                            //         });
                            //     }
                            // });
                        },
        
                        /** Note: This is calling the App.Account.set */
                        select: function(event, li){
                            li.item.getAction(li.item.data, element, buttonId);
                        }
                    });
        
                    /** Identify if the search element in a modal; */
                    const bindings = [...$(element).autocomplete().data().uiAutocomplete.bindings];
                    if (element.isInModal) $(bindings.find(function(element){
                        $(element).hasClass('ui-front');
                    }))
                    .attr('style', 'z-index:2147483647;');
        
                    /** The autocomplete is asked to search results after call returns; */
                    return $(element).autocomplete('search');
                }
            }
        });
    
        input.isInModal = modal;
        input.liAction = liAction;


    }

}