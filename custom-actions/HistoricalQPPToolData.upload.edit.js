/**
 * HistoricalQPPToolData.upload.edit.js
 * @desctipion Used to add custom webparts to an out of the box Microsoft SharePoint site.
 * The purpose of this script is to hit the cancel button after the page loads, regardless
 * if it is in a modal or not. Will send the user back to the all items view.
 * @author Wilfredo Pacheco
 */

(function(){

    var pathnametoken = '/sites/J5/QPP/HistoricalQPPToolData/Forms/EditForm.aspx';
    var searchtoken = 'IsDlg=1';
    var CancelButton = 'input[value="Cancel"]';
    // var CancelButton = 'input[accesskey="C"]';
    
    document.addEventListener('DOMContentLoaded', function init(event){

        // We could use these libraries if they are available;
        // console.info('jQuery:', window?.$?.fn?.jquery);
        // console.info('Bootstrap:', window?.$?.fn?.tooltip?.Constructor?.VERSION);

        function HistoricalDataCancelEditEvent(event){
                    
            // If we are in a modal;
            // if (window.location.search.includes(searchtoken))
            // {

                /** This method is called regardless of the view we are in; */
                try
                {
                    document.querySelector(CancelButton).click();
                }
                catch(e)
                {
                    console.info({
                        message: 'HistoricalQPPToolData.upload.edit.js | Cancel method has failed!',
                        error: e,
                    });
                }

            // }
            // else
            // {
            //     /** Insert logic here; */
            // }
        }
        
        /** Set the listener if the pathname matches the string; */
        if (window.location.pathname === pathnametoken)
        {
            window.addEventListener('load', HistoricalDataCancelEditEvent);
        }
    
    });

})();