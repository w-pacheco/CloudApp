/**
 * Errors.js
 * @author Wilfredo Pacheco
 */

export const Title = 'Errors';
export const Description = 'Used to track user errors within the application.';
export const BaseTemplate = 100;
export const AddViewFieldTitle = false;
export const AddViewFieldGUID = false;
export const PredefinedData = false;
export const List = {
    Title,
    Description,
    BaseTemplate,
}

/**
 * FieldTypeKind for SharePoint 
 * {FieldTypeKind} - 2 (Single Line of Text)
 * {FieldTypeKind} - 3 (Mulitiple Lines of Text)
 * {FieldTypeKind} - 4 (Single Line of Text)
 * {FieldTypeKind} - 9 (Number)
 */
export const Fields = [{
    Title: 'ErrorType',
    Description: 'Used to capture the error type i.e. UncaughtTypeError, UncaughtReferenceError, etc.',
    FieldTypeKind: 2, // Single Line of Text
    DefaultView: true,
    Order: 1
},{
    Title: 'ErrorMessage',
    Description: 'This field is used to capture the error message caught from the console.',
    FieldTypeKind: 3, // Multiline Line of Text
    DefaultView: true,
    Order: 1
},{
    Title: 'Line',
    Description: 'If available, Line is used to capture the line number the error was triggered.',
    FieldTypeKind: 9, // Number
    DefaultView: true,
    Order: 1
},{
    Title: 'Column',
    Description: 'If available, Column is used to capture the column number the error was triggered.',
    FieldTypeKind: 9, // Number
    DefaultView: true,
    Order: 1
},{
    Title: 'FileUrl',
    Description: 'If available, this field caputres the file that triggered the error or renders N/A',
    FieldTypeKind: 2, // Single Line of Text
    DefaultView: true,
    Order: 1
},{
    Title: 'userAgent',
    Description: `Logs the userAgent value of the browser used during the error event, helps identify 
    browser related errors.`,
    FieldTypeKind: 2, // Single Line of Text
    DefaultView: true,
    Order: 1
},{
    Title: 'SessionId',
    Description: `This field is used to track the session id used when the error was captured, this is to 
    be used in association with the Log list (if enabled, tracks user views within application) to solve 
    issues with the application.`,
    FieldTypeKind: 2, // Single Line of Text
    DefaultView: true,
    Order: 1
},{
    Title: 'LocationHash',
    Description: `This field is used to capture the view based on the hash string value held in the URL, 
    since the Log list may be disabled this field can capture the details on the view rendered when the 
    error was reported.`,
    FieldTypeKind: 2, // Single Line of Text
    DefaultView: true,
    Order: 1
},{
    Title: 'appVersion',
    Description: `Logs the appVersion of the browser used during the error event to help identifiy browser 
    related errors.`,
    FieldTypeKind: 2, // Single Line of Text
    DefaultView: true,
    Order: 1
}];

export default {
    List,
    Fields,
    PredefinedData,
    AddViewFieldTitle,
    AddViewFieldGUID,
}