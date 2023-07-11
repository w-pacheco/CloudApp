/**
 * List.js
 * NotificationTypes list;
 * @author Wilfredo Pacheco
 */

export const Title = 'NotificationTypes';
export const Description = '';
export const BaseTemplate = 100;
export const AddViewFieldTitle = false;
export const AddViewFieldGUID = false;
export const PredefinedData = [{ 
    Value: '0',  
    Description: 'No immediate notification', 
  },{ 
    Value: '1',  
    Description: 'Office of Primary Responsibility (OPR)', 
  },{ 
    Value: '2',  
    Description: 'Office of Coordinating Responsibility (OCR)', 
  },{ 
    Value: '3',  
    Description: 'For information only', 
  },{ 
    Value: 'WUC',  
    Description: '24/7 Wake-up call',
  },{ 
    Value: 'WUE',  
    Description: '24/7 Email Notificaiton',
  }]

export const List = {
    Title,
    Description,
    BaseTemplate,
}

export const Fields = [{
    Title: 'Value',
    FieldTypeKind: 2,
    DefaultView: true,
    Order: 1,
}, {
    Title: 'Description',
    FieldTypeKind: 3,
    DefaultView: true,
    Order: 3,
}];

export default {
    List,
    Fields,
    PredefinedData,
    AddViewFieldTitle,
    AddViewFieldGUID,
}