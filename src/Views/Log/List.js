/**
 * Log.js
 * @description Application System List - Log list definition;
 * @author Wilfredo Pacheco
 */

export const Title = 'Log';
export const Description = 'Log user routes.';
export const BaseTemplate = 100;
export const AddViewFieldTitle = true;
export const AddViewFieldGUID = false;
export const PredefinedData = false;
export const List = {
    Title,
    Description,
    BaseTemplate,
}

export const Fields = [{
    Title: 'SessionId',
    Description: `This field is a unique value created when the application first loads. It is used to 
    group the views render by a user and when they visit the application. It can be used to both solve 
    application errors reported to the Errors list or track malicious events.`,
    FieldTypeKind: 2,
    DefaultView: true,
    Order: 1
},{
    Title: 'Message',
    Description: 'This field is used to track the URL used during the log event.',
    FieldTypeKind: 3,
    DefaultView: true,
    Order: 2
},{
    Title: 'Module',
    // Description: '',
    FieldTypeKind: 2,
    DefaultView: true,
    Order: 3
},{
    Title: 'StackTrace',
    Description: 'This field holds the stack trace string created by the browser during the users\' visit.',
    FieldTypeKind: 3,
    DefaultView: true,
    Order: 4
},{
    Title: 'UserKey',
    Description: 'This field holds the login name string value for the user being tracked.',
    FieldTypeKind: 2,
    DefaultView: true,
    Order: 5
}];

export default {
    List,
    Fields,
    PredefinedData,
    AddViewFieldTitle,
    AddViewFieldGUID,
}