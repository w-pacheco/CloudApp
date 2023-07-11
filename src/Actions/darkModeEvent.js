/**
 * darkModeEvent.js
 * @author Wilfredo Pacheco
 */

import ToggleDarkTheme from "../Components/Theme.Dark.js";
import App from '../../app.js';

/** DarkMode - Ctrl + M to toggle; */
export default function darkModeEvent(event){

    const {
        ctrlKey, // For Windows ctrl key;
        metaKey, // For Apple command key;
        keyCode,
        key,
    } = event;

    const WindowsControlKey = ctrlKey;
    const AppleCommandKey = metaKey;
    const keyCode_M = keyCode === 77;

    if ((WindowsControlKey || AppleCommandKey) && keyCode_M)
    {
        const isDisabled = ToggleDarkTheme();
        if (App?.Settings) App.Settings.DarkMode = !isDisabled;
    }
    
}