/**
 * Calendar.js
 * @author Wilfredo Pacheco
 */

import Component from "./Component.js";

export function CalendarEvent(calendarEvent){
    
    const { Title, EventDate, EndDate, Id, __metadata } = calendarEvent;

    Object.assign(this, calendarEvent);
    const Starts = moment(EventDate);
    const Ends = moment(EndDate);
    const start = new Date(EventDate);
    const end = new Date(EndDate);
    
    this.start = new Date(start).toISOString();
    this.end = new Date(end).toISOString();
    
    this.title = `${Starts.format('HH:mm')}-${Ends.format('HH:mm')} ${Title}`; // document.getIcon('clock-fill').outerHTML
    this.id = Id;
    // This sends you to another page;
    // this.url = __metadata.uri;
    this.color = 'royalblue'; // specify the background color and border color can also create a class and use className parameter. 
}

export const COLORS = [
    '#466365', 
    '#B49A67', 
    '#93B7BE', 
    '#E07A5F', 
    '#849483', 
    '#084C61', 
    '#DB3A34'
];

const DEFAULT_OPTIONS = {

    /** FullCalendar v3.4.0 - Defaults */
    // weekends: false,
    // header: {
    //     left: 'prev,next today',
    //     center: 'title',
    //     right: 'month,basicWeek,basicDay'
    // },
    // displayEventTime: false,
    // editable: true,
    // timezone: "UTC",
    // droppable: true,

    /** FullCalendar Standard Bundle v6.1.4 - Defaults */
    initialView: 'dayGridMonth',
    themeSystem: 'standard',
    weekends: false,
    selectable: true,
    // editable: true, // Allows event drag and drop;
    // timeZone: 'UTC',
    headerToolbar: {
        start: 'dayGridMonth,timeGridWeek,timeGridDay',
        center: 'title',
        // end: 'Create,today prevYear,prev,next,nextYear',
        // end: 'Refresh,today prev,next',
        end: 'today prev,next',
    },

    // customButtons: {
    //     Refresh: {
    //         text: 'Refresh',
    //         // icon: 'arrow-repeat',
    //         click(event){
    //             return MeetingsCalendar.refresh(event);
    //         },
    //     },
    // },

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

export default class Calendar extends Component {

    constructor(arg){

        const {
            calendarOptions,
            parent,
            list,
        } = arg;

        super({
            tag: 'div',
            classList: 'w-100 h-100',
            attributes: [{ name: 'id', value: 'calendar' }],
            parent,
        });

        this.calendarOptions = calendarOptions || DEFAULT_OPTIONS;
        this.list = list;
        this.calendar = null;
        this.init();

    }

    refresh(event){

        // FIXME: Should this get the button and add a spinner?
        console.info(event);
        
        // Destroy/Remove the table container element;
        this.remove();

        // Call the init method again;
        this.init();
    }

    init(){

        this.render();

        const { calendarOptions } = this;
        const calendar = new FullCalendar.Calendar(this.get(), calendarOptions);
        this.calendar = calendar;
        calendar.render();
        // calendar.setOption('themeSystem', calendarOptions.themeSystem)
        
    }

}