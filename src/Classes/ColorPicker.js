/**
 * ColorPicker.js
 * @author Wilfredo Pacheco
 */

import { name as biome } from "../Biome.js";
import Component from "./Component.js";
import SetTheme from "../Actions/Theme.Set.js";
import SVGColors from "../Components/SVG.Colors.js";

/** @link http://www.javascripter.net/faq/rgbtohex.htm */
export function rgbToHex(R,G,B) {
    return toHex(R)+toHex(G)+toHex(B)
}

export function toHex(n) {
    n = parseInt(n,10);
    if (isNaN(n)) return "00";
    n = Math.max(0,Math.min(n,255));
    return "0123456789ABCDEF".charAt((n-n%16)/16)
        + "0123456789ABCDEF".charAt(n%16);
}

export function FindSVGColorHex(SVGColor){

    const result = SVGColors.find(obj => obj[SVGColor]);
    const HASH = '#';
    let str;
    
    /** Handle SVG Colors; */
    if (result) return Object.values(result)[0];

    /** Handle rgb Colors; */
    else if (SVGColor.includes('rgb'))
    {
        str = SVGColor.replace('rgb(', '');
        str = str.replace(')', '');
        str = str.split(',');
        return HASH + rgbToHex(str[0],str[1],str[2]);
    }
    
    /** Return colors already in HEX format; */
    else return SVGColor;
}

export default class ColorPicker extends Component {

    constructor(arg){

        const {
            App,
            parent,
        } = arg;

        if (!parent) throw new Error(`${biome} | This argument is missing a parent defenition!`);

        super({
            tag: 'div',
            classList: 'card bg-transparent col-xl-4 col-lg-6 float-left',
            attributes: [{ name: 'style', value: 'border-radius: .5rem!important;'}],
            parent,
            innerHTML: /*html*/`
            <div class="card-header bg-transparent border-0 text-right"></div>
            <div class="card-body bg-transparent"></div>
            <div class="card-footer bg-transparent border-0 py-3 d-none"></div>`,
        });

        const defaultTheme = App.DefaultTheme;

        this.App = App;
        this.defaultTheme = defaultTheme;

        this.init();
    }

    init(){
        
        const App = this.App;
        const defaultTheme = this.defaultTheme;
        const theme = App.Settings.Theme || App.settings.theme; // Current theme;
        const header = this.get('div.card-header');
        const body = this.get('div.card-body');
        const footer = this.get('div.card-footer');

        /** Card Title Header; */
        header.innerHTML = /*html*/`
        <h5 class="mt-2">Theme Manager</h5>`;

        /** Card body for color picker element; */
        body.innerHTML = /*html*/`<!-- Card Body -->
        <div class="row p-0">
            <div class="col-12" id="btn-container"></div>
            <div class="col">
                <label for="primaryColor" style="font-size: 1em;font-weight: 500;">primaryColor</label>
                <input class="form-control btn border" 
                       type="color" 
                       name="primaryColor"
                       value="${FindSVGColorHex(theme.primaryColor)}" />
            </div>
            <div class="col">
                <label for="darkColor" style="font-size: 1em;font-weight: 500;">darkColor</label>
                <input class="form-control btn border" 
                       type="color" 
                       name="darkColor"
                       value="${FindSVGColorHex(theme.darkColor)}" />
            </div>
        </div>`;

        const input_primaryColor = body.querySelector('input[name=primaryColor');
        const input_darkColor = body.querySelector('input[name=darkColor');

        /** Reset Theme Button; */
        new Component({
            tag: 'button',
            classList: 'btn btn-sm float-end',
            attributes: [{ name: 'title', value: 'Reset'}],
            events: [{
                name: 'click',
                action(event){

                    /** Set the elements with the default colors; */
                    input_primaryColor.value = defaultTheme.primaryColor;
                    input_darkColor.value = defaultTheme.darkColor;
                    
                    /** Set the application instance with the default theme; */
                    // This triggers the save to the CustomSettings list for the user;
                    App.Settings.Theme = defaultTheme;

                    /** Set the acutal browser theme; */
                    SetTheme(defaultTheme);
                },
            }],
            parent: body.querySelector('div#btn-container'),
            innerHTML: document.getIcon('lightning').outerHTML,
        }).render();

        /** Assign buttons to div.card-footer; */
        footer.innerHTML = (/*html*/`<!-- buttons -->
        <button name="clear-theme" class="btn btn-danger btn-sm d-none">Clear Theme</button>
        <button name="set-theme" class="btn btn-primary btn-sm">Set Theme</button>
        <button name="save-theme" class="btn btn-primary btn-sm float-right">Save Theme</button>`);

        function setThemeEvent(event){
    
            /** Get the values for the primaryColor & darkColor; */
            theme.primaryColor = input_primaryColor.value;
            theme.darkColor = input_darkColor.value;
            
            /** Set the application instance with the default theme; */
            // This triggers the save to the CustomSettings list for th
            App.Settings.Theme = theme;
            
            /** Set the acutal browser theme; */
            SetTheme(theme);
        }

        input_primaryColor.addEventListener('change', setThemeEvent);
        input_darkColor.addEventListener('change', setThemeEvent);

        /** Assign event handlers to button element; */
        // document.querySelector('button[name=save-theme]')?.addEventListener('click', saveThemeEvent);
        // document.querySelector('button[name=clear-theme]')?.addEventListener('click', clearSavedThemes);

        // try
        // {
        //     SavedOptions.addEventListener('change', () => {
        //         const selected = JSON.parse(decodeJSON(SavedOptions.value));
        //         CardElement.querySelector('input[name=primaryColor').value = selected.primaryColor;
        //         CardElement.querySelector('input[name=darkColor').value = selected.darkColor;
        //         SetTheme(selected);
        //     });
        // }catch(e){}

    }
}