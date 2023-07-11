/**
 * @title Post.js
 * @description Post event for Locations list items
 * @author Wilfredo Pacheco
 */

import { List, table } from './View.js';
import { form, modal } from './Form.js';
import { Route, Layout, store } from '../../app.js';
import Toast from '../../src/Classes/Toast.js';
import Component from '../../src/Classes/Component.js';

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
    /**Check for duplicates */
    let duplicate = store.lists[List.Id].data.filter(l => l.LocationName.toUpperCase() === request.LocationName.toUpperCase())[0]
    console.info(request.LocationName, duplicate)
    if (duplicate) {
        swal({
            icon: 'error',
            text: `
            An item with the name ${duplicate.LocationName} already exists.\n
            Click View to load the form for the existing item where you can view details and make edits.\n
            Click Cancel to return to the form and update the name of your new location.\n
            `,
            buttons: {
                confirm: {
                    text: `View ${duplicate.LocationName}`,
                    value: true,
                    visible: true,
                },
                cancel: {
                    text: 'Cancel',
                    value: null,
                    visible: true,
                },
            }
        }).then(dupChoice => {
            if (dupChoice) {
                //Close current form and load duplicate item
                // console.info('view duplicate')
                modal.hide()
                App.Views.Locations.table.edit(`${duplicate.__metadata.uri}`)
            } else {
                return
            }
        })
        return
    }
    /**Check for email addresses, warn if none are present */
    if (request.LocationType === 'Market' && !request.hasOwnProperty('EmailAddresses')) {
        let emailAlert = swal({
            icon: 'info',
            text: `
                The email addresses saved to a market item are notified automatically when a report is submitted under that market.\n
                If no email addresses are listed the tool will only notify the DHA Operations Center.\n\n
                Click Return to go back to the form and add email addresses that need to be notified when a report is submitted for this market.\n
                Click Create Market to create a market item with no associated email addresses.
                `,
            buttons: {
                confirm: {
                    text: "Return",
                    value: true,
                    visible: true,
                },
                cancel: {
                    text: "Create Market",
                    value: null,
                    visible: true,
                }
            },
        })
        if (emailAlert) {
            return
        }
    }

    $(Element)
        .attr('disabled', '') /** Disable button; */
        .html(/*html*/`<!-- Spinner Element -->
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true">
    </span> Sending Request...`);

    return Route.Post(Url, request)
        .done(function RequestComplete(data, textStatus, xhr) {
            if (xhr.status >= 200 && xhr.status < 300) {
                console.info(data.d)
                if (data.d.LocationType === "Market") {
                    Route.Patch(data.d.__metadata.uri, {
                        AssignedMarket: data.d.Id.toString(),
                        __metadata: {
                            type: ListItemEntityTypeFullName,
                        }
                    })
                }
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
        .fail(function RequestFailed(xhr, textStatus, errorThrown) {

            console.info(xhr, textStatus, errorThrown);
            console.warn(`${textStatus} | ${errorThrown}`);
            console.info(xhr);

            const AlertBodyStr = xhr.responseJSON ?
                xhr.responseJSON.error.message.value.split('.').join('</div><div>') :
                errorThrown;

            // return Alert
            console.info({
                Title: `Request ${textStatus} - ${errorThrown}`,
                TitleTimestamp: '',
                Body: '<div>' + AlertBodyStr + '</div>',
                AutoHide: false,
                Classes: 'bg-danger text-white',
                Type: textStatus
            });

            // new Toast({
                // type: 'danger',
                //     message: `Request ${textStatus} - ${errorThrown}
            //     <div>${AlertBodyStr}</div>`,
            // })
            // .render()
            // .show();

        })
        .catch(console.info);
}