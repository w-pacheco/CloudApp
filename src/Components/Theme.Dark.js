/**
 * Theme.Dark.js
 * @build 2023.06.29
 * @author Wilfredo Pacheco
 * (C) 2020-2023 WP
 */

export default function ToggleDarkTheme(event){

    const DarkModeCSS = 'dark.css';
    const DarkThemeStyleSheet = document.querySelector(`link#${DarkModeCSS.replace('.css', '')}`);
    if (event)
    { /** Will set the property & value passed, this is caught by the proxy; */
        const BtnElement = event.target.SetCustomSetting ? 
        event.target : 
        event.target.closest('button');
        BtnElement.SetCustomSetting('DarkMode', DarkThemeStyleSheet.disabled);
    }

    try
    { // Throws error in DevMode;
        /** If the DarkThemeStyleSheet is disabled, the theme is light; */
        return DarkThemeStyleSheet.disabled = !DarkThemeStyleSheet.disabled;
    }catch(e){}

}