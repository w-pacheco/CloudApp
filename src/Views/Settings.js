/**
 * Settings.js
 * Settings View;
 * @author Wilfredo Pacheco
 */

import App, { Layout, User } from "../../app.js";
import Component from "../Classes/Component.js";
import View from "../Classes/View.js";
import ColorPicker from "../Classes/ColorPicker.js";

import ButtonGroup from "../Classes/ButtonGroup.js";
import ToggleDarkTheme from "../Components/Theme.Dark.js";

export const Icon = 'gear-wide-connected';
export const Title = 'Settings';

export let button;
export let view;
export let container;

export function DarkThemeBtn(name = 'brightness-high'){

    const icon = document.getIcon(name);
    icon.setAttribute('style', 'height:24px;width:24px;');

    return new Component({
        tag: 'button',
        classList: 'btn text-darkColor',
        attributes: [{ name: 'title', value: 'DarkMode' }],
        events: [{
            name: 'click', 
            action(event){
                App.Settings.DarkMode = !App.Settings.DarkMode;
                return ToggleDarkTheme();
            }
        }],
        innerHTML: icon.outerHTML,
    });

}

/** Handle clear datatable state custom views; */
export function ClearStateBtn(name = 'lightning'){

    const icon = document.getIcon(name);
    icon.setAttribute('style', 'height:24px;width:24px;');

    return new Component({
        tag: 'button',
        classList: 'btn text-darkColor',
        attributes: [{ name: 'title', value: 'Reset' }],
        events: [{
            name: 'click', 
            action(event){
                return swal({
                    icon: 'warning',
                        text: 'Are you sure you want to clear all custom table settings?',
                        buttons: {
                          cancel: true,
                          confirm: true,
                        },
                })
                .then(response => {
                    if (response)
                    {
                        Object.keys(App.Views)
                        .forEach(view => {
                            if (App.Views[view]?.table?.$table)
                            {
                                const { $table } = App.Views[view].table;
                                $table.state.clear();
                            }
                        });
        
                        console.info(`%c${App.engine.name} | Your saved table state have been globally reset, the application will now reload...`, 'color: gold');
                        Layout.Main.remove();
                        return onload()
                        .then(data => { // console.info(data);
                            console.info(`%c${App.engine.name} | Reload Complete!`, 'color: limegreen');
                        });
                    }
                });
            },
        }],
        innerHTML: `${icon.outerHTML} Reset Table Settings`,
    });

}

export default function Settings(){

    const { Menu, tabContent } = Layout;
    const { SessionId } = App;

    view = new View({
        Title, 
        Icon, 
        Menu, 
        tabContent,
    });

    button = view.getButton();
    container = view.getContainer();

    const jumbotron = new Component({
        tag: 'div',
        classList: 'jumbotron px-3 pt-3 text-darkColor shadow-lg',
        attributes: [{ name: 'tab-header', value: '' }],
        parent: container,
        innerHTML: /*html*/`
        <span class="lead" style="font-size: 2em;">${document.getIcon('person-badge').outerHTML}</span>
        <span class="lead" style="font-size: 2em;">${User.Title}</span>
        <div class="mt-4">Session Id: ${SessionId}</div>
        <div>Key: ${User.KeyChain[0]}</div>
        <div>Roles: ${User.get('Roles')}</div>`,
    }).render();

    const buttonGroup = new ButtonGroup();
    DarkThemeBtn().render(buttonGroup);
    ClearStateBtn().render(buttonGroup);
    jumbotron.prepend(buttonGroup);

    /** Color Picker; */
    // if (User.hasRole('Developer')) 
    // ColorPicker(container, App).render();
    new ColorPicker({
        App,
        parent: container,
    }).render();

    App.Views[Title] = {
        Title,
        view,
        button,
        container,
    }

}

window.addEventListener('popstate', function (event){
    /** Parse the url & display the tab and/or data based on the url parameters; */
    if (location.hash === `#${Title}`)
    {
        /** Manually call the tab without replacing the rest of the history; */
        view.show();
    }
});