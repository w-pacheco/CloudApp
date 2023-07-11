/**
 * Theme.Dark.js
 * @build 2021.01.05
 * @author Wilfredo Pacheco
 * (C) 2020 WP
 */

export default function ToggleDarkTheme(event){

    const DarkModeCSS = 'dark.css';
    const DocumentStyleSheets = Array.from(document.styleSheets);
    
    function findSheet(sheet){

        /** Keeps from split() fail if no href attribute; */
        if (!sheet.href) return sheet.href;
        else
        {
            const hrefArray = sheet.href.split('/');
            return hrefArray[hrefArray.length - 1] === DarkModeCSS;
        }
    }
    
    const DarkThemeStyleSheet = DocumentStyleSheets.find(findSheet);
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