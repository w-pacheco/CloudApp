/**
 * @title Post.js
 * @description Post event for Reports list items
 * @author Wilfredo Pacheco
 */

import { List, table } from './View.js';
import { form, modal } from './AccordionForm.js';
import App, { Route, Layout } from '../../app.js';
import Toast from '../../src/Classes/Toast.js';
// import { List as IncidentList } from '../Incidents/View.js';

import getLocationByTitle from '../Locations/getLocationByTitle.js';
import NotifyAdminOfLocationRequest from '../LocationRequests/LocationRequestNotification.js';
import NotifyReportSubmitted, { NewReportSubmitted } from './ReportSubmittedNotification.js';
import getRequestByDCIR from '../LocationRequests/getRequestByDCIR.js';
import { createIncidentItemAndReportPOSTRequest } from './Post.logic.js';
import createLocationRequest from '../LocationRequests/createLocationRequest.js';

export default async function Post(event) {

    event.preventDefault();
    event.stopPropagation();

    const Element = event.target.tagName === 'BUTTON' ?
    event.target :
    event.target.closest('button');

    /** Form Validation - if the return is false, this will be true and return null; */
    if (!form.Fields.validate()) return swal({
        icon: 'warning',
        text: 'This form cannot be submitted until all required fields are completed.',
    });

    let notification_toast;
    const Url = `${List.__metadata.uri}/Items`;

    $(Element)
    .attr('disabled', '') /** Disable button; */
    .html(/*html*/`<!-- Spinner Element -->
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true">
    </span> Sending Request...`);

    notification_toast = new Toast({
        type: 'warning',
        message: `<strong>Warning:</strong> Please do not navigate from this page until the notifications have been sent.`,
        autohide: false,
    })
    .render()
    .show();

    const {
        request,
        incidentData,
    } = await createIncidentItemAndReportPOSTRequest({
        List,
        form,
        Web,
        Route,
        Layout,
    });

    /** Send POST request to the Reports list; */
    return Route.Post(Url, request)
    .done(function RequestComplete(data, textStatus, xhr) {
        if (xhr.status >= 200 && xhr.status < 300) {

            $(Element).text('Success!');
            modal.hide();

            /** Notify Markets and DOC that a report has been submitted */
            // NotifyReportSubmitted(data.d, incidentData);

            /** Start - Handle locations not found on the locations list; */
            const { FacilityName, FacilityId, ReportType, DCIRNumber } = data.d;

            /** Handle the creation of locations based on the facility name saved regardless of the item status; */
            Promise.all([
                /** Get the location by title from the locations list; */
                getLocationByTitle(FacilityName),
                /** Get the location request by DCIR number from the location request list; */
                getRequestByDCIR(DCIRNumber),
                /** Notify Markets and DOC that a report has been submitted */
                // NotifyReportSubmitted(data.d, incidentData),
                NewReportSubmitted(incidentData),
            ])
            .then(function ([
                LocationResult,
                LocationRequestResult,
            ]){

                if (!LocationResult && !LocationRequestResult) createLocationRequest(Object.assign(data.d, {
                    LocationName: FacilityName,
                }))
                .then(data => {
                    return NotifyAdminOfLocationRequest(data.d);
                });

            })
            .then(() => {
                notification_toast.hide();
            });
            /** End - Handle locations not found on the locations list; */

            /** Alert; */
            new Toast({
                type: 'success',
                message: `Success! Your ${data.d.ReportType} Report was submitted.`,
                parent: Layout.ToastContainer,
            })
            .render()
            .show();

            table.watcher();
            App.Views.Incidents.table.watcher();
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
        //     type: 'danger',
        //     message: `Request ${textStatus} - ${errorThrown}
        //     <div>${AlertBodyStr}</div>`,
        //     autohide: false,
        // })
        // .render()
        // .show();

    })
    .catch(console.info);
}