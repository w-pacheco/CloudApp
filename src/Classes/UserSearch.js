/**
 * UserSearch.js
 * @author Wilfredo Pacheco
 */

import SearchActiveDirectory from "../Actions/ActiveDirectory.Search.js";
import Component from "./Component.js";
import Store from "./Store.js";

function SetSearchEvent(component){

    const {
        input,
        modal,
        liAction,
    } = component;

    input.addEventListener('input', SearchActiveDirectory);
    input.isInModal = modal;
    input.liAction = liAction || function(user){
        return user;
        // return component.add(user);
    }

}

export default class UserSearch {

    constructor(arg){

        const {

            type,
            input,
            display,
            modal,
            showDisplay,
            liAction,
            select,
            source,
            
            /** This is required to render all the results and not compare the label or value properties one for one; */
            minLength = 0,
            
        } = arg;

        const store = new Store();

        /** Set the results array to hold all the search results from Microsoft Active Directory; */
        store.set('results', []);

        this.type = type;
        this.input = input;
        this.display = display;
        this.modal = modal;
        this.Store = store;
        this.showDisplay = showDisplay;
        this.liAction = liAction;
        this.minLength = minLength;
        
        this.source = source || function(){

        }

        this.select = select || function (event, li){
            console.info(event, li);
        };
        
        this.init();

    }

    add(account){

        const { Key, DisplayText } = account;
        const found = this.Store.results.find(acct => acct.Key === Key);
        // const thisClear = this.clear;

        /** Check to see if the contact has already been added to the Store for this field; */
        if (found) alert(`You have already added ${DisplayText} to this field!`);

        /** If the account has not been added, add to the Store; */
        else
        {
            this.Store.results.push(account);
            
            // Route.Get(`${Web.Url}/_api/Web/SiteUsers`, {
            //     $select: 'Id',
            //     $filter: `LoginName eq '${Key}'`
            // }).then(data => {
            //     Account.Id = data.d.results[0].Id
            //     console.info(data.d.results[0])
            // })

            /** setTimeout used since this clears the field before the account can be defined; */
            // setTimeout(function(){
            //     thisClear();
            // }, 200);
            
            return this.update();
        }
    }

    set(accounts){
        const thisAdd = this.add;
        accounts.forEach(acct => thisAdd(acct));
        return this;
    }
    
    get(){
        return this.Store.results;
    }

    clear(){

        const { input } = this;
        
        setTimeout(function(){
            return input.value = '';
        }, 150);

    }

    remove(event){
        
        const Account = event.target.ACCOUNT;
        const { Key, DisplayText } = Account;

        if (confirm(`Would you like to remove ${DisplayText} from this field?`))
        {
            const IndexOfAccount = Store.results.indexOf(account => account.Key === Key);
            Store.results.splice(IndexOfAccount, 1);
            return this.update();
        }

    }

    update(){

        const {
            display,
            remove,
        } = this;

        const store = this.Store.results;

        /** Empty the display element; */
        $(display).empty();

        store.forEach(Account => {

            const { DisplayText, EntityData, Key } = Account;
            const BadgeElement = new Component({
                tag: 'span',
                classList: `badge badge-pill badge-primary mr-1 point animated fadeIn`,
                events: [{ name: 'click', action: remove }],
                attributes: [
                    { name: 'data-key', value: encodeURIComponent(Key) },
                    { name: 'title', value: EntityData.Email },
                ],
                innerText: DisplayText,
            });

            BadgeElement.ACCOUNT = Account;

            if (!EntityData.Email)
            {
                const ExclamationIcon = document.getIcon('exclamation-circle');
                ExclamationIcon.classList.add('mr-1');
                ExclamationIcon.setAttribute('style', 'margin-bottom: .18rem!important;');
                BadgeElement.prepend(ExclamationIcon);
            }

            display.append(BadgeElement.get());
            
        });

    }

    init(){

        const { 
            input,
            source,
            isInModal,
            select,
            display, 
            showDisplay,
            minLength,
        } = this;

        SetSearchEvent(this);

        if (!showDisplay) $(display).hide();

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

            /** This is required to render all the results and not compare the label or value properties one for one; */
            minLength,

            open(event){
                
                /** Identify if the search element in a modal; */
                // const bindings = [...$(input).autocomplete().data().uiAutocomplete.bindings];

                // if (isInModal) bindings.find(function(binding){
                //     if (binding?.classList?.contains('ui-front')) binding.classList.add('zindex-top');
                // });

            }

        });

        this.autocomplete = autocomplete;

    }

}