/**
 * Values.js
 * @author Wilfredo Pacheco
 */

import { decrypt, encrypt } from '../Actions/Crypto.js';
import { name as biome } from '../Biome.js';

export default class Values {

    constructor (form){

        this.form = form;

        this.init();
        
    }

    set(arg){

        const form = this.form;

        if (!arg) throw new Error(`${biome} | arg is missing!`);

        for (const el of form.fields.get())
        {
            const name = el.getAttribute('name');
            const date = el.getAttribute('type') === 'date';
            const checkbox = el.getAttribute('type') === 'checkbox';
            const contenteditable = el.getAttribute('contenteditable') === 'true';
            
            /** If the element field has a name attribute & arg holds a value; */
            if (name && arg[name] && !date)
            {
                if (el.dataset?.crypto === 'true') el.value = decrypt(arg[name]);
                else if (checkbox) el.checked = arg[name];
                else el.value = arg[name];
            }

            if (name && contenteditable) el.innerHTML = arg[name];
            
            /** If the isDateField & the arg holds a value; */
            if (date && arg[name])
            {
                // const { locale, timeZone } = Intl.DateTimeFormat().resolvedOptions();
                const utc_date = new Date(arg[name]).toUTCString();
                // new Date(arg[name])
                // .toLocaleString(locale, {
                //     timeZone,
                //     year: 'numeric',
                //     month: 'numeric',
                //     day: 'numeric',
                // });

                // el.value = new Date(_date).toISOString().split('T')[0];
                el.value = moment(utc_date).format('YYYY-MM-DD');
            }
        }

        form.get().dispatchEvent(new Event('set'));

    }

    get(){

        const form = this.form;
        const fields = form.fields;
        const values = new Object();

        for (const el of fields.get())
        {
            const name = el.getAttribute('name');
            const date = el.getAttribute('type') === 'date';
            const number = el.getAttribute('type') === 'number';
            const checkbox = el.getAttribute('type') === 'checkbox';
            const contenteditable = el.getAttribute('contenteditable') === 'true';
            // const search = el.getAttribute('type') === 'search';

            if (name)
            {
                if (el.value !== '') 
                {
                    if (el.dataset?.crypto === 'true') values[name] = encrypt(el.value).toString();
                    else values[name] = el.value;
                }
                else if (el.value === '' && checkbox) values[name] = el.checked;

                if (contenteditable) values[name] = el.innerHTML;
                if (date && el.value !== '') values[name] = new Date(el.value).toISOString();
                if (number && el.value !== '') values[name] = Number(el.value);
            }
        }
        
        return values;

    }

    init(){

        const form = this.form;

        /** If the form is set, this needs will set the data-method=patch */
        form.get().addEventListener('set', function(event){
            form.get().setAttribute('data-method', 'patch');
        });

        /** If the form is cleared, this needs will set the data-method=post */
        form.get().addEventListener('clear', function(event){
            form.get().setAttribute('data-method', 'post');
        });

        /** TODO: Finish handling reseting forms; */
        form.get().addEventListener('reset', function(event){
            // console.info(event);
            // console.info(event.type);
            // form.get().setAttribute('data-patch')
        });

    }
}