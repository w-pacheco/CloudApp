/**
 * History.Set.js
 * @author Wilfredo Pacheco
 */

export function ReplaceLocation(Url){

    if (typeof Url === 'string' 
    && location.href !== Url) history.pushState({}, document.title, Url);

    if (typeof Url === 'object' 
    && location.href !== Url.href) history.pushState({}, document.title, Url.href);
}

export default function SetHistory(Url, Title){

    if (!history.state 
    || history.state.url != Url) history.pushState({
        url: Url,
        title: Title
    }, Title, Url);
}