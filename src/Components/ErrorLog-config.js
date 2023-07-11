/**!
 * ErrorLog-config.js
 * 
 * Copyright 2023 (SAIC) Science Applications International Corporation and other contributors
 * Released under the MIT license.
 */

(function(showConsoleButton = false){
    
    var origin = window.location.origin;
    var windowConsole = null;

    // function response(e) {
    //     var urlCreator = window.URL || window.webkitURL;
    //     var imageUrl = urlCreator.createObjectURL(this.response);
    //     console.info(imageUrl);
    //     return imageUrl;
    // }

    // function getImage(href, onload){
    //     var xhr = new XMLHttpRequest();
    //     xhr.open("GET", href);
    //     xhr.responseType = "blob";
    //     xhr.onload = onload;
    //     xhr.send();
    // }

    // function convertToBase64(image){
    //     console.info(image);
    //     // const file = new Blob(img, {type: 'image/png'});
    //     const reader = new FileReader();
    //     reader.onloadend = function() {
    //         const base64 = reader.result;
    //         return base64;
    //     };  
    //     return reader.readAsDataURL(image);
    // }

    console.info('Loading Error Capture...');

    document.CONSOLELOG = new Array();
    document.ERRORS = new Array();

    var ReportErrors = function ReportErrors() {

        windowConsole = window.open();
        // console.log(windowConsole);
        // console.info(document.querySelector('link#favicon'));
        // var favicon = document.querySelector('link#favicon').outerHTML;

        windowConsole.document.write(/*html*/`
        <style>
            body {
                background-color: #0c0c0c;
                color: white;
                font-family: sans-serif;
                font-size: .8rem;
                letter-spacing: 1.4;
            }

            .console {
                background-color: #202124;
                margin: 20px;
                border: 1px solid white;
                border-radius: 10px;
                height: calc(100vh - 50px);
                overflow-y: scroll;
            }

            .console::-webkit-scrollbar {
                width: .8em;
            }
            
            .console::-webkit-scrollbar-track {
                box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
            }
            
            .console::-webkit-scrollbar-thumb {
                background-color: lightgrey;
                outline: 1px solid slategrey;
                border-radius:10px;
            }
            .console hr {
                margin: 0px;
                border-color: #747474;
            }
            .console div {
                padding: 5px 15px;
            }
            .console p {
                margin:0px
            }
        </style>`);

        var log = document.CONSOLELOG;

        windowConsole.document.write(/*html*/`<div class='console'>`);

        log.forEach((msg, index) => {
            windowConsole.document.write(/*html*/`<div class=""><p>${msg}</p></div><hr>`);
        });

        windowConsole.document.write(/*html*/`</div>`);
        windowConsole.document.title = `${document.title} - Console`;
    }

    var onerror = function onerror(msg, url, lineNo, columnNo) {
        document.ERRORS.push({
            msg: msg,
            url: url,
            lineNo: lineNo,
            columnNo: columnNo,
            Created: new Date().toISOString(),
        });
    }

    var former_log = console.log;
    const custom_log = function custom_log(...msg){

        former_log(...msg);  // maintains existing logging via the console.
        
        let consoleStr = "";
        if (arguments && arguments.length)
        {
            Array.from(arguments).forEach(arg => {
                if (typeof arg === 'object')
                {
                    try { 
                        consoleStr += JSON.stringify(arg, null, 2); 
                    } catch (e) { 
                        consoleStr += ": Cannot stringify"; 
                    }
                } 
                else consoleStr += arg;
            });
        }
        
        else
        {
            if (typeof msg === 'object')
            {
                try { 
                    consoleStr += JSON.stringify(msg, null, 2); 
                } catch (e) { 
                    consoleStr += ": Cannot stringify"; 
                }
            }
            else consoleStr += arg;
        }

        if (windowConsole) {
            let console = windowConsole.document.querySelector(".console");
            if (console) console.insertAdjacentHTML('beforeend', '<div><p>' + consoleStr + '</p></div><hr>');
        }

        document.CONSOLELOG.push(consoleStr);
    }

    var former_info = console.info;
    const custom_info = function custom_info(...msg){

        former_info(...msg);  // maintains existing logging via the console.
        
        let consoleStr = "";
        if (arguments && arguments.length)
        {
            Array.from(arguments).forEach(arg => {
                if (typeof arg === 'object')
                {
                    try { 
                        consoleStr += JSON.stringify(arg, null, 2); 
                    } catch (e) { 
                        consoleStr += ": Cannot stringify"; 
                    }
                } 
                else consoleStr += arg;
            });
        }
        
        else
        {
            if (typeof msg === 'object')
            {
                try { 
                    consoleStr += JSON.stringify(msg, null, 2); 
                } catch (e) { 
                    consoleStr += ": Cannot stringify"; 
                }
            }
            else consoleStr += arg;
        }

        if (windowConsole) {
            let console = windowConsole.document.querySelector(".console");
            if (console) console.insertAdjacentHTML('beforeend', '<div><p>' + consoleStr + '</p></div><hr>');
        }

        document.CONSOLELOG.push(consoleStr);
    }

    var former_warn = console.warn;
    const custom_warn = function custom_warn(...msg){

        former_warn(...msg);  // maintains existing logging via the console.
        
        let consoleStr = "";
        if (arguments && arguments.length)
        {
            Array.from(arguments).forEach(arg => {
                if (typeof arg === 'object')
                {
                    try { 
                        consoleStr += JSON.stringify(arg, null, 2); 
                    } catch (e) { 
                        consoleStr += ": Cannot stringify"; 
                    }
                } 
                else consoleStr += arg;
            });
        }
        
        else
        {
            if (typeof msg === 'object')
            {
                try { 
                    consoleStr += JSON.stringify(msg, null, 2); 
                } catch (e) { 
                    consoleStr += ": Cannot stringify"; 
                }
            }
            else consoleStr += arg;
        }

        if (windowConsole) {
            let console = windowConsole.document.querySelector(".console");
            former_info(console)
            if (console) console.insertAdjacentHTML('beforeend', '<div><p style="color: gold;">' + consoleStr + '</p></div><hr>');
        }

        document.CONSOLELOG.push(consoleStr);
    }

    console.log = custom_log;
    console.info = custom_info;
    console.warn = custom_warn;

    window.ReportErrors = ReportErrors;
    window.onerror = onerror;

    window.addEventListener("error", event => {
        if (windowConsole) windowConsole.document.write('<div class="" ><p>' + msg + '</p></div><hr>');
        console.log("<span style='color:crimson'>JavaScript error: " + event.error.message + " on line " + event.lineno + " for " + event.filename + ";  Stack Trace: <br>" + event.error.stack.replaceAll("\n", "<br>") + "</span>");
    });
    
    window.addEventListener('unhandledrejection', event => {
        if (windowConsole) windowConsole.document.write('<div class="" ><p>' + msg + '</p></div><hr>');
        // console.log("<span style='color:red'>JavaScript unhandled rejection: " + event.error.message + " on line " + event.lineno + " for " + event.filename + ";  Stack Trace: <br>" + event.error.stack.replaceAll("\n", "<br>") + "</span>");
    });

    window.addEventListener('keydown', function (event) {
        var ctrlKey = event.ctrlKey;
        var shiftKey = event.shiftKey;
        var key = event.key;
        var keyCode = event.keyCode;
        if (ctrlKey
        && shiftKey
        && (keyCode === 69 || key === "E")) ReportErrors();
    });

    /** This will add the button to the DOM for users to access the console; */
    window.addEventListener('load', function(){

        const body = document.body;
        const Container = document.createElement('div');
        if (!showConsoleButton) Container.classList.add('d-none');
        Container.innerHTML = /*html*/`
        <style>
            button#console-button {
                z-index: 1000; 
                background: transparent;
                border: none;
                cursor: pointer;
                position: fixed;
                right: 20px;
                top: 55px;
                height: 5px;
                width: 5px;

            }
        </style>

        <button class="btn btn-sm" title="Console" id="console-button" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-back" viewBox="0 0 16 16">
                <path d="M0 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2H2a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H2z"/>
            </svg>
        </button>`;
        // <button class="btn btn-sm" title="Console" id="console-button" type="button" style="float: right;">
        //     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-back" viewBox="0 0 16 16">
        //         <path d="M0 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2H2a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H2z"/>
        //     </svg>
        // </button>`;

        // Get the container element by ID
        // const ribbonContainer = document.getElementById("RibbonContainer-TabRowRight");
        const ribbonContainer = document.body;
        const shareButton = document.getElementById("ctl00_ctl00_site_share_button");

        // Place  the console-button to the left of the element with the id "site_follow_button"
        ribbonContainer.insertBefore(Container, ribbonContainer.childNodes[0]);
        // ribbonContainer.insertBefore(Container, shareButton);
        // List items are added to the div with the id "Ribbon.ListForm.Edit" like: <li class="ms-cui-group" id="Ribbon.ListForm.Edit.Commit" unselectable="on"><span class="ms-cui-groupContainer" unselectable="on"><span class="ms-cui-groupBody" unselectable="on"><span class="ms-cui-layout" id="Ribbon.ListForm.Edit.Commit-LargeLarge" unselectable="on"><span class="ms-cui-section" id="Ribbon.ListForm.Edit.Commit-LargeLarge-0" unselectable="on"><span class="ms-cui-row-onerow" id="Ribbon.ListForm.Edit.Commit-LargeLarge-0-0" unselectable="on"><a class="ms-cui-ctl-large" id="Ribbon.ListForm.Edit.Commit.Publish-Large" onclick="return false;" href="javascript:;" mscui:controltype="Button" aria-describedby="Ribbon.ListForm.Edit.Commit.Publish_ToolTip" role="button" unselectable="on"><span class="ms-cui-ctl-largeIconContainer" unselectable="on"><span class=" ms-cui-img-32by32 ms-cui-img-cont-float ms-cui-imageDisabled" unselectable="on"><img class="" style="top: -69px;left: -511px;" unselectable="on" src="/_layouts/15/1033/images/formatmap32x32.png?rev=43"></span></span><span class="ms-cui-ctl-largelabel" unselectable="on">Save</span></a><a class="ms-cui-ctl-large" id="Ribbon.ListForm.Edit.Commit.Cancel-Large" onclick="return false;" href="javascript:;" mscui:controltype="Button" aria-describedby="Ribbon.ListForm.Edit.Commit.Cancel_ToolTip" role="button" unselectable="on"><span class="ms-cui-ctl-largeIconContainer" unselectable="on"><span class=" ms-cui-img-32by32 ms-cui-img-cont-float ms-cui-imageDisabled" unselectable="on"><img class="" style="top: -1px;left: -545px;" unselectable="on" src="/_layouts/15/1033/images/formatmap32x32.png?rev=43"></span></span><span class="ms-cui-ctl-largelabel" unselectable="on">Cancel</span></a></span></span></span></span><span class="ms-cui-groupTitle" unselectable="on">Commit</span></span><span class="ms-cui-groupSeparator" unselectable="on"></span></li>
        const listFormEdit = document.getElementById("Ribbon.ListForm.Edit");
        const listFormDisplay = document.getElementById("Ribbon.ListForm.Display");
        // if #Ribbon.ListForm.Edit exists, then add the console-button as a list item to the div with the id "Ribbon.ListForm.Edit.Commit"
        if (listFormEdit) {
            const commit = document.getElementById("Ribbon.ListForm.Edit.Commit");
            commit.insertBefore(Container, commit.childNodes[0]);
        }
        if (listFormDisplay) {
            const commit = document.getElementById("Ribbon.ListForm.Display.Manage");
            commit.insertBefore(Container, commit.childNodes[0]);
        }

        // Allow console-button to be dragged without triggering a click event. If not dragged, click events trigger ReportErrors(). 
        let isDragging = false;
        let button = document.getElementById('console-button');
        button.addEventListener('mousedown', () => isDragging = false);
        button.addEventListener('mousemove', () => isDragging = true);
        button.addEventListener('mouseup', () => {
            if (isDragging) isDragging = false;
            else ReportErrors();
        });
        // If Control + click is used, the console button display will be set to none.
        button.addEventListener('click', (e) => {
            if (e.ctrlKey) button.style.display = 'none';
        });

        // Allow the button to be dragged
        var elmnt = document.getElementById("console-button");
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        if (elmnt) elmnt.onmousedown = dragMouseDown;
        
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }
        
        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }

        console.info('Error Capture Loaded!');

    });

})();

//CarePoint has a session timeout feature that can be called using: 
//cpt.idp.session.timeout.onready();
//the function below will call the function above and display the timer in in the upper right corner of the screen.
window.sessionTimer = function sessionTimer() {

        let cp_localStorageSupport = (typeof(Storage) != "undefined");
        let dt = new Date()
        let currentTicks = dt.getTime()
        let cp_sessionTimeoutTicksKey = "session-timeout-ticks";
        
        let signOutMill = CP_GetDiffTicksInSeconds(CP_GetSessionTimeoutTicks(), currentTicks) * 1000;
                
        function CP_GetSessionTimeoutTicks() {
        var ticks = -1;
        if (cp_localStorageSupport) {
            if (localStorage[cp_sessionTimeoutTicksKey]) {
                ticks = Number(localStorage[cp_sessionTimeoutTicksKey]);
            }
        } else {
            var dt = new Date();
            ticks = dt.setMinutes(dt.getMinutes() + cp_sessionTimeout);
        }
        return ticks;
        }
        
        function CP_GetDiffTicksInSeconds(ticks1, ticks2) {
        var diffSeconds = Math.ceil((ticks1 - ticks2) / 1000);
        return diffSeconds;
        }
        
        
        let signOutMin = Math.round(signOutMill/60000)
            signOutMin = Math.abs(signOutMin)
            if (signOutMin > 30){signOutMin = 30}
        let cptHeader = document.createElement('div')
            cptHeader.setAttribute('id','timer')
            cptHeader.style.height = "60px"
            cptHeader.style.width = "150px"
            cptHeader.style.top = "35px"
            cptHeader.style.position = "absolute"
            cptHeader.style.right = "200px"
            cptHeader.style.padding = "5px"
            cptHeader.style.textAlign = 'center'
            sessionStorage.setItem("timer", signOutMin);
            sessionStorage.setItem("time", new Date());
            cptHeader.innerText = `Session expires\n in ${signOutMin} minutes.`
            //add event listener to refresh the timer when the user clicks on the cptHeader div, it sets the style to display none.
            cptHeader.addEventListener('click', function(){
                cptHeader.style.display = 'none'
            })
        document.body.appendChild(cptHeader)
        // Set the display to none if cptHeader is in an iframe
        if (window.self !== window.top) {
            cptHeader.style.display = 'none'
        }        

        setInterval(function() {
            
            let cptHeader = document.getElementById('timer')
            let timerDiv = cptHeader.innerText
            let time = sessionStorage.getItem("time");
            let timer = sessionStorage.getItem("timer");
            let timeRemaining = Math.round(timer - (new Date() - new Date(time)) / 60000);

            if (timeRemaining > 0){
                document.getElementById('timer').innerText = `Session expires\n in ${timeRemaining} minutes.`
                
            } else {
                document.getElementById('timer').innerText = 'Session expired.'
                cptHeader.style.backgroundColor = 'red'
                cptHeader.style.color = 'white'
                cptHeader.style.padding = '5px'
                cptHeader.style.borderRadius = '5px'
                cptHeader.style.display = 'flex'
                cptHeader.style.flexDirection = 'column'
                cptHeader.style.alignItems = 'center'
                cptHeader.style.justifyContent = 'center'
            }
            
            
        }, 10000)
}
// window.onload = sessionTimer