/**
 * @title Post.js
 * @description Post event for <<TITLE>> list items
 */

import { List, table } from './View.js';
import { form, modal } from './Form.js';
import { service } from '../../src/Biome.js';
import Toast from '../../src/Classes/Toast.js';

export default function Post(event) {

    event.preventDefault();
    event.stopPropagation();

    const Element = event.target.tagName === 'BUTTON' ?
    event.target :
    event.target.closest('button');

    /** Form Validation - if the return is false, this will be true and return null; */
    if (!form.Fields.validate()) return null;

    const { ListItemEntityTypeFullName, __metadata } = List;
    const Url = `${__metadata.uri}/Items`;

    const request = form.Values.get();
    request.__metadata = {
        type: ListItemEntityTypeFullName,
    }

    $(Element)
    .attr('disabled', '') /** Disable button; */
    .html(/*html*/`<!-- Spinner Element -->
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true">
    </span> Sending Request...`);

    return service.post(Url, request)
    .done(async function RequestComplete(data, textStatus, xhr) {
        if (xhr.status >= 200 && xhr.status < 300)
        {
            $(Element).text('Success!');
            modal.hide();

            /** Alert; */
            new Toast({
                type: 'success',
                message: 'Success! Your item was created.',
            })
            .render()
            .show();

            table.watcher();
        }
    })
    .fail(function RequestFailed(xhr, textStatus, errorThrown){

        // console.info(xhr);
        const AlertBodyStr = xhr.responseJSON ?
        xhr.responseJSON.error.message.value :
        errorThrown;
        
        new Toast({
            type: 'danger',
            message: /*html*/`${errorThrown}!
            <br>
            <br>
            ${AlertBodyStr}`,
            autohide: false,
        })
        .render()
        .show();

    })
    .catch(console.info);
}