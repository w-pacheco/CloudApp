/**
 * Theme.Set.js
 * @author Wilfredo Pacheco
 */

import Component from "../Classes/Component.js";

export default function SetTheme(Options){

    const head = document.querySelector('head');
    const AppThemeEl = head.querySelector('#app-theme');
    const { 
        defaultColor, 
        darkColor, 
        primaryColor, 
        secondaryColor, 
        darkHighlightColor, 
        lightHighlightColor 
    } = Options;
    
    if (AppThemeEl) AppThemeEl.remove();

    return head.prepend(new Component({
        tag: 'style',
        attributes: [
            { name: 'href', value: './' },
            { name: 'id', value: 'app-theme' },
        ],
        innerText: /*css*/`
        /* Sets Theme Colors */
        :root {
            --defaultColor: ${defaultColor};
            --darkColor: ${darkColor};
            --primaryColor: ${primaryColor};
            --secondaryColor: ${secondaryColor};
            --darkHighlightColor: ${darkHighlightColor};
            --lightHighlightColor: ${lightHighlightColor};
        }
        
        /* Theme colors */
        .bg-darkColor { background-color: var(--darkColor) !important; }
        .text-darkColor { color: var(--darkColor) !important; }
        .bg-secondaryColor { background-color: var(--secondaryColor) !important; }
        .text-primaryColor { color: var(--primaryColor) !important; }
        .bg-primaryColor { background-color: var(--primaryColor) !important; }
        .text-secondaryColor { color: var(--secondaryColor) !important; }
        .text-darkHighlightColor { color: var(--darkHighlightColor) !important; }`
        // .replace(/[\n]/gi, '\u23CE')
    }).get());
}