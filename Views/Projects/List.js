/**
 * List.js
 * Projects list;
 * @author Wilfredo Pacheco
 */

export const Title = 'Projects';
export const Description = 'This list holds the project details and group authorized to answer the questions.';
export const BaseTemplate = 100;
export const AddViewFieldTitle = false;
export const AddViewFieldGUID = false;
export const PredefinedData = [{
    "Project":"AERP War Room",
    "Status":"Active",
    "Description":"The DHA (AED) Analytics & Evaluation Division War Room tracks Analytics & Evaluation Request Portal (AERP) v2.0 project requests. This platform calls the parent AERP site and dynamically pulls AERP groups, group members, and active project requests. That information is used to keep leadership informed in hopes to distribute the project requirements within the assignee's section."
},{ 
    "Project":"DCIR",
    "Status":"Active",
    "Description":"The DCIR Notification Portal ensures timely and structured reporting of critical events to provide situational awareness and, where applicable, a coordinated response to support the decision cycle of the DHA Director and/or subordinate leaders. The Notification Portal is built with Biome-js, a JavaScript framework used to create single page applications hosted on Microsoft SharePoint (2010-2019) site collections."
},{ 
    "Project":"HMPDS",
    "Status":"Active",
    "Description":"HMPDS"
},{
    "Project":"QPP",
    "Status":"Active",
    "Description":"The Quadruple Aim Performance Process (QPP) application is hosted on Microsoft SharePoint."
}];

export const List = {
    Title,
    Description,
    BaseTemplate,
}

export const Fields = [{
    Title: 'Project',
    Description: 'Title of the project.',
    DefaultView: true,
    FieldTypeKind: 2,
},{
    Title: 'Description',
    Description: 'Description of the project.',
    DefaultView: true,
    FieldTypeKind: 3,
},{
    Title: 'Status',
    Description: 'Status of the project.',
    DefaultView: true,
    FieldTypeKind: 2,
},{
    Title: 'ProductionURL',
    Description: 'Production URL.',
    DefaultView: true,
    FieldTypeKind: 2,
},{
    Title: 'DevelopmentURL',
    Description: 'Development URL.',
    DefaultView: true,
    FieldTypeKind: 2,
},{
    Title: 'Github Repository URL',
    Description: 'Github repository URL.',
    DefaultView: true,
    FieldTypeKind: 2,
},{
    Title: 'Members',
    Description: 'Members with permission to answer questions submitted for this project.',
    DefaultView: true,
    FieldTypeKind: 3,
}];

export default {
    List,
    Fields,
    PredefinedData,
    AddViewFieldTitle,
    AddViewFieldGUID,
}