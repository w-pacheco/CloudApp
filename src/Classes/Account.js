/**
 * Account.js
 * @author Wilfredo Pacheco
 */

import Hash from '../Actions/Hash.js';
import { name as biome } from '../Biome.js';

export default class Account {

    #ActiveDirectory = null;
    #CurrentUser = null;
    // #Title = null;
    // #Email = null;
    // #LoginName = null;
    // #Key = null;
    // #Roles = [];

    constructor(acct){

        const {
            Title,
            Email,
            LoginName,
            Key,
            DisplayText,
            CurrentUser,
        } = acct;
        
        const Roles = [];
        const KeyChain = [];

        /** This item is from active directory; */
        if (acct?.ProviderDisplayName)
        {
            const { Email } = acct.EntityData;
            this.#ActiveDirectory = acct;
            this.Title = DisplayText;
            this.DisplayText = DisplayText;
            this.Email = Email;
            this.LoginName = Key;
            this.Key = Key;
            this.Account = acct;

            if (Email) KeyChain.push(Hash(Email));
            else console.info(`%cThis account has an invalid email!`, 'background: #222; color: #ffc107');
            KeyChain.push(Hash(Key));
        }

        /** This item is from the Web object; */
        else
        {
            this.#CurrentUser = acct;
            this.Title = Title;
            this.DisplayText = Title;
            this.Email = Email;
            this.LoginName = LoginName;
            this.Key = LoginName;
            this.Account = acct;

            if (Email) KeyChain.push(Hash(Email));
            else console.info(`%cThis account has an invalid email!`, 'background: #222; color: #ffc107');
            KeyChain.push(Hash(LoginName));
        }

        this.Roles = Roles;
        this.KeyChain = KeyChain;
        this.CurrentUser = CurrentUser;
        this.init();
    }

    get(arg){
        if (!arg) return this;
        else if (typeof arg === 'string') return this[arg];
        else throw new Error(`${biome} | The argument passed was invalid!`);
    }

    set(key, value, arg){
        const exists = this[key];
        if (!exists) return this[key] = value;
        else if (exists && arg === 'force') return this[key] = value;
        else throw new Error(`${biome} | The key aready exists! If you would like to overwrite the '${
            key
        }' property, pass the 'force' string in the argument.`);
    }

    setSiteUser(){
        const FORCE = 'force';
        const { 
            Id,
            IsSiteAdmin,
        } = this.CurrentUser;

        this.set('Id', Id, FORCE);
        this.set('IsSiteAdmin', IsSiteAdmin, FORCE);
        /** TODO: Set the groups is available; */
        // this.set('Groups', Groups.results, FORCE);
    }

    hasRole(role){
        return this.Roles.includes(role);
    }

    hasKey(key){
        return this.KeyChain.includes(key);
    }

    init(){
        if (this?.CurrentUser) this.setSiteUser();
    }

}