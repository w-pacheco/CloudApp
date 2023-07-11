Biome-js
========

Biome-js is a JavaScript framework used to create single page applications hosted on Microsoft SharePoint (2010-2019) site collections. This framework is designed to enhance a user's SharePoint experience and takes advantage of Google's V8 engine. Biome-js creates a firm foundation to help escape customizing views using SharePoint's webpart implementation, and take full control of any project hosted on a site collection.

version: 2.0.0  
build: 20230531  

---
## Getting Started
To deploy this application on a Microsoft SharePoint site collection, visit the site collection's Site Assets folder. Create a folder labeled `App` in the SiteAssets folder to host the application, upload this project to that new folder.
<!-- [https://{site_url}/_api/web](https://{site_url}/_api/web) -->

### Install Dependencies
To install the dependencies locally, run the following script in the command prompt:   
``` cmd
npm install
```

## Hosting Locally
To host locally using live-server, first use npm to install the required dependencies. Then run the following in the terminal:
```cmd
npm run dev
```

__NOTE__: This version of Biome.js is working on incoporating the [sp-rest-proxy](https://www.npmjs.com/package/sp-rest-proxy) dependency which my impact the live-server functionality.

### Using sp-rest-proxy Dependency
When access to a development Microsoft SharePoint site is available, Biome.js has been updated with the ability to hot reload for a more efficient development environment. To start the proxy, begin by running the following command in the terminal:  
```cmd

npm run serve

# ? SharePoint URL 
<<SiteCollectionURL>>

# ? Authentication strategy 
<<NTLM>>

# ? User name 
<<LoginName>>

# ? Password 
<<*******>>

```

Here is an example of the layout for a directory when creating a project:
```
App
├── README.md
├── node_modules
├── package.json
├── .gitignore
├── app.js
├── app.Render.js
├── app.Settings.js
├── Actions (Project Specific Actions)
│   └── Action.js
├── Components (Project Specific Components)
│   └── Component.js
├── custom-actions (SharePoint Custom Actions Scripts)
│   └── custom.js
├── images (Project Specific images)
|   ├── logo.jpg
│   └── favicon.png
├── Views
│   └── Meetings (Project Specific Views)
|       ├── List.js
|       ├── Post.js
|       ├── Patch.js
|       ├── Form.js
|       └── View.js
└── src
    ├── Actions
    ├── Classes
    ├── Components
    ├── CSS
    ├── images
    ├── Libraries
    ├── Pages
    ├── Schema
    ├── Views
    └── Biome.js
```
<!-- ## Known Issues -->
### GFE Dimentions
1366 x 768

## Merging Template Updates
Here are some commands to help merge if you started a new project and used Biome.js as a template:
``` cmd
git remote add template https://github.com/w-pacheco/Biome-js.git

git fetch template

git checkout master

git merge template/master 
```

If the template was not related to the project:
``` cmd
git merge template/master --allow-unrelated-histories
```

### Biome.js CLI
Biome.js has CLI methods to help create project specific views quickly in the command line, more to come soon!
```cmd
npm run biome-create
```

```cmd
npm run biome-create <<CMD>> <<TITLE>>
```

## Views 
When creating views that include lists and managing list items, the following items should be updated within the view folder (if needed):

- View.js -> Icon - With the icon that the sidebar nav will display.
- View.js -> th - With the fields the table will display.
- Form.js -> innerHTML with the template of the form for the list.

## Components
Components are created using the Component class, this insures that we can extend from this class after an element is created. The argument passed is an object that defines the element to be created. These options are passed to the method CreatElement and referenced by the component instance.

### CreateElement
The CreateElement is a custom method used to dynamically create elements on the DOM. This method is and should only be called from the component instance and passed the options that define the element to be created. The following options are passed as the argument to create the element:
``` javascript
const {
    tag,                // String
    classList,          // String
    attributes,         // Array
    events,             // Array
    customProperties,   // Array;
} = options;
```

customProperties is an array of objects the key and value properties defined. The CreateElement method iterates over the array if defined to set custom properties to the element. It is important to note that they are not set as attributes, so setting the id property might function as expected since id should always be set using the .setAttribute() method.
``` javascript
const SetCustomProperty = function SetCustomProperty(prop, value){
    Element[prop] = value;
    return Element;
}
```

### Creating Components
The argument for components is shown below:
```javascript
const component = new Component({
    tag: 'div',
    classList: 'w-100',
    parent: HomeContainer,
    innerHTML: /*html*/`
    <div tab-header class="jumbotron jumbotron-fluid border w-100">
        <div class="px-5">
            <div class="d-inline-flex">
                <h1 class="display-5 text-primaryColor">{Title}</h1>
            </div>
            <p class="lead text-primaryColor">Description: {Description}</p>
            <div>version ({'00.0.0.0000'})</div>
            <div>URL: {Url}</div>
            <div>Lists: {0}</div>
            <div>Document Libraries: {0}</div>
            <div>SubSites: {0}</div>
        </div>
    </div>`,
});
```

The following are some methods available to in the component class:

### render 
The argument 'parent' is the HTML element this component will be append to, returns the component instance.
``` javascript
render(parent){

    /** If a parent is passed in the argument and is and instanceof HTMLElement; */
    if (!!parent 
    && parent instanceof HTMLElement) parent.append(this.Element);

    else if (!!parent 
    && parent instanceof Component) parent.get().append(this.Element);

    /** If the parent is not passed, this will look for the parent property in the options; */
    else if (!!this.options.parent)
    {

        /** If the parent is a component, then we need to call the get method; */
        if (this.options.parent instanceof Component) this.options.parent.get().append(this.Element);
        if (this.options.parent instanceof HTMLElement) this.options.parent.append(this.Element);
    }

    return this;
}
```

### get
This method exposes the querySelector method defined on the element created. Else it will return the element instance of this component if no argument is passed.
``` javascript
get(arg){
    if (arg && typeof arg === 'string') return this.Element.querySelector(arg);
    else if (!arg) return this.Element;
    else throw new Error(`${biome} | The argument passed was invalid!`);
}
```

### remove
This method exposes the remove method found on the element created. To learn more, visit: [https://developer.mozilla.org/en-US/docs/Web/API/Element/remove](https://developer.mozilla.org/en-US/docs/Web/API/Element/remove)
``` javascript
remove(){
    return this.get().remove();
}
```

### querySelector
This method is used to query the element defined.
``` javascript
querySelector(queryString){
    return this.get().querySelector(queryString);
}
```

### prepend
This method exposes the element.prepend and handles component instances.  
``` javascript
prepend(element){
    if (!element) throw new Error(`${biome} | Invalid request, argument is invalid type!`);
    if (element instanceof Component) this.get().prepend(element.get());
    if (element instanceof HTMLElement) this.get().prepend(element);

    return this;
}
```

## Classes
This framework relies on classes defined

<!-- ### Account -->
<!-- ### Alert -->
<!-- ### Dropdown -->
<!-- ### Email -->
<!-- ### Fields -->

### Forms 
Forms extend the component class, and are created with the same options. 
``` javascript
const form = new Form({
    classList: 'row g-3 needs-validation',
    parent: view,
    innerHTML: /*html*/`<!-- ${List.Title} Form -->
        <div class="form-row my-2">
            <div class="col-lg-6 col-md-12">
                <label for="inputUsers" class="form-label">Role</label>
                <input type="text" 
                       name="RoleTitle" 
                       class="form-control form-control-sm" 
                       id="inputRole" required />
                <div class="invalid-feedback"></div>
            </div>
        </div>
        <div class="form-row my-2">
            <div class="col-12">
                <label for="inputDescription" class="form-label">Description</label>
                <textarea name="Description" 
                    class="form-control form-control-sm" 
                    id="inputDescription"></textarea>
                <div class="invalid-feedback"></div>
            </div>
        </div>`,
}).render();
```

It is important to note, each field that saves data needs the name attribute (`name="Title"`) defined. The form class iterates on the form fields and ONLY adds the field with a name attribute to the request body.

### Modal  
When creating a modal instance, the following methods can be used to toggle the view using javascript. It is important to note, the modal is removed from the DOM on a `hide()` method call.
``` javascript
show(){
    $(this.get()).modal('show');
    return this;
}

hide(){
    $(this.get()).modal('hide');
}
```

The following are properties found on the modal instance to help render elements on the modal:
``` javascript
this.header = this.get('div.modal-header');
this.body = this.get('div.modal-body');
this.footer = this.get('div.modal-footer');
this.dialog = this.get('div.modal-dialog');
this.content = this.get('div.modal-content');
```
These can be used by assigning them as the value to the parent property and calling the render method on the component. See example below:
``` javascript
modal = new Modal();

new Component({
    tag: 'div',
    parent: modal.body,
}).render();
```

### OffCanvas  
Below is an example of how to create a new OffCanvas instance within Biome.js:  
``` javascript
new OffCanvas({
        title: 'Welcome Page',
        id: 'offcanvas',
        parent,
        remove: true,
        body: /*html*/`
        <p>Note: Updating this will change the landing for this site collection!</p>`,
    }).render();
```

### ProgressBar
This class extends Component, the following methods are available on this class:

### text
This method will be used to update the display text for the progress bar.
``` javascript
text(Str) {
    this.get('p[data-display]').innerText = Str;
}
```

### progress
This method takes a raw number or string value to update the progress bar.
``` javascript
progress(value){
    const element = this.get('div[role="progressbar"]');
    element.setAttribute('style', `width: ${value}%`);
    element.setAttribute('aria-valuenow', value);
    return this;
}
```

### SpreadSheet
***Prototype  
Table element that allows live in-table edits to the sharepoint list;

### Store
This is an object used to hold data.

### Table
This compoent is a datatable instance which will provide item filtering & data exports.
Note: In order to successfully use the change token methods in this class, it requires the datatable view to include the item ID.  
``` javascript
// The datatable options example;
export const columns = th.map(item => item.col);
export const processing = true;
export const responsive = true;
export const pageLength = 10;
export const tableOptions = {
    processing,
    responsive,
    pageLength,
    columns,
};

const table = new Table({
    List,                       // Microsoft SharePoint list Object;
    th,                         // (Array) table header strings;
    tableElementId,             // table element id unique when a list is defined, uses guid;
    tableOptions,               // (Object) datatable options
    parent: container.get(),    // The element this list will be appened to;
    colvis: true,               // datatables custom column view;
    extentions: {               // datatables extentions;
        buttons: {
            copy: true,
            csv: true,
            excel: true,
            pdf: true,
            print: true,
            custom: [],         // Array of custom buttons to add to datatable button extention;
        },
    },
}).init();
```

### Toast  
It is important to render the Toast using the render() method and then call the show() method to display it in the DOM. There are three different types that can be passed when creating an instance: 'success', 'warning', & 'danger' to properly dress the the toast for the user. Below is an example on how to create and render a new Toast instance within Biome.js:  
``` javascript
new Toast({
    type: 'success',
    message: 'Success! Your item was created.',
})
.render()
.show();
```

<!-- ### UserSearch -->
<!-- ### Values -->
### View
This class defines the main view within the application. This class creates two components:  
1. A button component: used toggle the view, renders in the in the main side bar.
2. A container component: this is used to identify where the content will render.

The View class has the following methods available: 

### getButton 
The returns the button component used to toggle the view for the content.
``` javascript
getButton(){
    return this.button;
}
```

### getContainer
Returns the container component used to hold the content for this view.
``` javascript
getContainer(){
    return this.container;
}
```

### show
This will toggle the container element and is currently defined only with jQuery.
``` javascript
show(){
    $(`#v-pills-${this.Title.toLowerCase()}-tab`).tab('show');
}
```

### Wizard
The Wizard class extends the Component class and is used to create wizard elements on the DOM. This of course requires the use of both jQuery and SmartWizard libraries.

``` javascript
new Wizard({
    parent,
    steps: [{
        id: 1,
        title: 'Select Directory',
        body: /*html*/`
        <p>Please select a Microsoft SharePoint directory to install:</p>
        <div class="step-one"></div>`,
    },{
        id: 2,
        title: 'Select Version',
        body: /*html*/`
        <p>Please the .zip file application/version you would like to install:</p>
        <div class="step-two"></div>`,
    },{
        id: 3,
        title: 'App Folder',
        body: /*html*/`
        <p>Please provide a few details for where your application will live:</p>
        <div class="step-three mt-4"></div>`,
    },{
        id: 4,
        title: 'Summary',
        body: /*html*/`
        <div class="step-four"></div>`,
    }],
    buttons: [
        $(new Component({
            tag: 'button',
            classList: 'btn btn-outline-secondary',
            attributes: [{ name: 'type', value: 'button' }],
            /** NOTE: This will not work after its passed to jQuery; */
            // events: [{
            //     name: 'click',
            //     action(event){
            //         console.info(event);
            //         alert('Test complete | Biome.js component event listener;');
            //     }
            // }],
            innerText: 'Test-Button',
        }).get())
        .on('click', function(event){
            console.info(event);
            alert('Test complete | jQuery event listener;');
        }),
    ],
});
```

## Calendar  
The calendar library used in this build is FullCalendar Standard Bundle v6.1.4, below is an example of creating a calender on the DOM:  
``` javascript
const MeetingsCalendar = new Calendar({
    parent: CalendarContainer,
    calendarOptions: {
        initialView: 'dayGridMonth',
        themeSystem: 'standard',
        weekends: false,
        selectable: true,
        headerToolbar: {
            start: 'dayGridMonth,timeGridWeek,timeGridDay',
            center: 'title',
            end: 'Refresh,today prev,next',
        },

        customButtons: {
            Refresh: {
                text: 'Refresh',
                // icon: 'arrow-repeat',
                click(event){
                    return MeetingsCalendar.refresh(event);
                },
            },
        },

        buttonText: {
            today: 'Today',
        },

        windowResize(arg) {
            console.info('The calendar has adjusted to a window resize. Current view: ' + arg.view.type);
        },

        eventClick(data){
            console.info(data.event.id);
        },

        eventDrop(event, delta, revertFunc){
            console.info({ event, delta, revertFunc });
        },

        events: function (start, end, timezone, callback){
            console.info({ start, end, timezone, callback });
        },

    }
});
```

### Dark Mode
<kbd>ctrl</kbd> + <kbd>m</kbd>


changelog
=========

- Updated Forms to prevent submitting when user hits enter
- Updated Route/service library
- Updated Account.js to handle CurrentUser Web property
- added ext to handle production/proxy URLs 
- updated table to prevent duplitate list items when refresh button is clicked