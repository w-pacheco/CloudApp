/**!
 * UnsupportedBrowser.js
 * 
 * Copyright (SAIC) Science Applications International Corporation and other contributors
 * Released under the MIT license.
 */

/**
 * UnsupportedBrowser.js
 * @description The purpose of the Unsupported Browser Template is to provide an easy to deploy tool that will detect 
 * a user's browser and instruct them to to load the site using Chrome if the site was opened in another browser. 
 * To see the tool in action, reload this page using Edge, IE, or Firefox.
 * @copyright 2022 (SAIC) Science Applications International Corporation and other contributors
 * @author Dr. Toby T. Canning
 */
(function(){

    var isChromium = window.chrome;
    var winNav = window.navigator;
    var vendorName = winNav.vendor;
    var isIEedge = winNav.userAgent.indexOf("Edg") > -1;
    var isIOSChrome = winNav.userAgent.match("CriOS");

    /** set the current href in session storage; */
    sessionStorage.setItem("myUrl", window.location.href);

    if (isIOSChrome 
    || isChromium !== null 
    && typeof isChromium !== "undefined" 
    && vendorName === "Google Inc." 
    && isIEedge === false) console.log("Browser | Chrome!");
    else
    {
        console.log("Browser | NOT Chrome!");
        window.location.replace('./src/pages/UnsupportedBrowser.aspx');
    }
})();