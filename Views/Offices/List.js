/**
 * List.js
 * Offices list;
 * @author Wilfredo Pacheco
 */

export const Title = 'Offices';
export const Description = `List of offices to be notified defined on the DCIR notification matrix. 
This matrix is also referenced in the (PI) Procedural Instruction provided.`;
export const BaseTemplate = 100;
export const AddViewFieldTitle = false;
export const AddViewFieldGUID = false;
//This predefined data array includes the emails for the offices, don't load this til production. 
// export const PredefinedData = [{
//     OfficeName: "Director, DHA",
//     Emails: JSON.stringify(['dha.ncr.dir-support.mbx.dha-director@health.mil',])
// },{
//     OfficeName: "Deputy Director, DHA",
//     Emails: JSON.stringify(['michael.p.malanoski.civ@health.mil',])
// },{
//     OfficeName: "Director of Staff, DHA",
//     Emails: JSON.stringify(['norman.s.west.mil@health.mil',])
// },{
//     OfficeName: "Chief of Staff",
//     Emails: JSON.stringify(['pamela.d.smith54.mil@health.mil',])
// },{
//     OfficeName: "Senior Enlisted Leader, DHA",
//     Emails: JSON.stringify(['tanya.y.johnson1.mil@health.mil',])
// },{
//     OfficeName: "DAD Health Care Operations",
//     Emails: JSON.stringify(['regina.m.julian.civ@health.mil',])
// },{
//     OfficeName: "DAD Medical Affairs",
//     Emails: JSON.stringify(['paul.r.cordts.civ@health.mil',])
// },{
//     OfficeName: "DAD Administration and Management (J-1)",
//     Emails: JSON.stringify(['ronald.a.hamilton2.civ@health.mil',])
// },{
//     OfficeName: "J-3/5/7",
//     Emails: JSON.stringify(['stephen.m.duryea.mil@health.mil',])
// },{
//     OfficeName: "J-3 Operations",
//     Emails: JSON.stringify(['dha.ncr.operations-j-3.mbx.dha-ops-center@health.mil',])
// },{
//     OfficeName: "DAD-Acquisition and Sustainment (J-4)",
//     Emails: JSON.stringify(['eskinder.dagnachew.mil@health.mil',])
// },{
//     OfficeName: "DAD Strategy and Innovation (J-5)",
//     Emails: JSON.stringify(['lisa.a.white86.mil@health.mil',])
// },{
//     OfficeName: "DAD Information Operations (J-6)",
//     Emails: JSON.stringify(['dha.ncr.bus-ops.mbx.dadio-j6-ops-reachback@health.mil',])
// },{
//     OfficeName: "DAD Education and Training (J-7)",
//     Emails: JSON.stringify(['dianne.m.stroble.mil@health.mil',])
// },{
//     OfficeName: "DAD Financial Operations (J-8)",
//     Emails: JSON.stringify(['robert.l.goodman28.civ@health.mil',])
// },{
//     OfficeName: "Research and Engineering (J-9)",
//     Emails: JSON.stringify(['sean.biggerstaff.civ@health.mil',])
// },{
//     OfficeName: "Public Health",
//     Emails: JSON.stringify(['adam.w.armstrong1.mil@health.mil',])
// },{
//     OfficeName: "MEDLOG",
//     Emails: JSON.stringify(['dha.ncr.med-log.mbx.lpr-joc@health.mil',])
// },{
//     OfficeName: "Medical Education & Training Command",
//     Emails: JSON.stringify(['david.c.walmsley.mil@health.mil',])
// },{
//     OfficeName: "STRATCOMM",
//     Emails: JSON.stringify(['timothy.e.clarke12.civ@health.mil',])
// },{
//     OfficeName: "Office of General Counsel",
//     Emails: JSON.stringify(['dina.l.bernstein.civ@health.mil',])
// },{
//     OfficeName: "Chief Nurse Officer",
//     Emails: JSON.stringify(['katherine.a.simonson.mil@health.mil',])
// },{
//     OfficeName: "Pharmacy",
//     Emails: JSON.stringify(['randy.d.dorsey.mil@health.mil',])
// },{
//     OfficeName: "TRICARE",
//     Emails: JSON.stringify(['john.p.kendrick2.mil@health.mil',])
// },{
//     OfficeName: "Armed Forces Medical Examiner System",
//     Emails: JSON.stringify(['alice.j.briones.mil@health.mil',])
// },{
//     OfficeName: "Joint Trauma System",
//     Emails: JSON.stringify(['kenneth.s.leffler.ctr@health.mil',])
// },{
//     OfficeName: "Armed Services Blood Program",
//     Emails: JSON.stringify(['chih.c.huang.mil@health.mil',])
// },{
//     OfficeName: "Office of the Chaplain",
//     Emails: JSON.stringify(['stanley.v.smith.mil@health.mil',])
// },{
//     OfficeName: "BUMED",
//     Emails: JSON.stringify(['james.f.garrett29.ctr@health.mil',])
// },{
//     OfficeName: "MEDCOM",
//     Emails: JSON.stringify(['army.medcom-ops-center@health.mil',])
// },{
//     OfficeName: "AFMRA",
//     Emails: JSON.stringify(['kimberly.a.edwards42.mil@health.mil',])
// },{
//     OfficeName: "Services",
//     Emails: JSON.stringify(['matthew.b.young.mil@health.mil', 'kimberly.a.edwards42.mil@health.mil', 'ronald.a.fancher.mil@health.mil',])
// },{
//     OfficeName: "Combatant Commands",
//     Emails: JSON.stringify(['archie.r.phlegar.mil@mail.mil', 'edward.n.king6.civ@health.mil', 'christopher.w.richards.civ@health.mil', 'edward.n.king6.civ@health.mil', 'rickey.j.smith.civ@mail.mil', 'kinau.y.mccoy.mil@health.mil', 'kinau.y.mccoy@pacom.mil"', 'michael.g.maclaren.civ@socom.mil', 'teofilo.a.henriquez.civ@mail.mil', 'anthony.d.ross20.civ@health.mil', ])
// }];
export const PredefinedData = [{
    OfficeName: "Director, DHA",
},{
    OfficeName: "Deputy Director, DHA",
},{
    OfficeName: "Director of Staff, DHA",
},{
    OfficeName: "Chief of Staff",
},{
    OfficeName: "Senior Enlisted Leader, DHA",
},{
    OfficeName: "DAD Health Care Operations",
},{
    OfficeName: "DAD Medical Affairs",
},{
    OfficeName: "DAD Administration and Management (J-1)",
},{
    OfficeName: "J-3/5/7",
},{
    OfficeName: "J-3 Operations",
},{
    OfficeName: "DAD-Acquisition and Sustainment (J-4)",
},{
    OfficeName: "DAD Strategy and Innovation (J-5)",
},{
    OfficeName: "DAD Information Operations (J-6)",
},{
    OfficeName: "DAD Education and Training (J-7)",
},{
    OfficeName: "DAD Financial Operations (J-8)",
},{
    OfficeName: "Research and Engineering (J-9)",
},{
    OfficeName: "Public Health",
},{
    OfficeName: "MEDLOG",
},{
    OfficeName: "Medical Education & Training Command",
},{
    OfficeName: "STRATCOMM",
},{
    OfficeName: "Office of General Counsel",
},{
    OfficeName: "Chief Nurse Officer",
},{
    OfficeName: "Pharmacy",
},{
    OfficeName: "TRICARE",
},{
    OfficeName: "Armed Forces Medical Examiner System",
},{
    OfficeName: "Joint Trauma System",
},{
    OfficeName: "Armed Services Blood Program",
},{
    OfficeName: "Office of the Chaplain",
},{
    OfficeName: "BUMED",
},{
    OfficeName: "MEDCOM",
},{
    OfficeName: "AFMRA",
},{
    OfficeName: "Services",
},{
    OfficeName: "Combatant Commands",
}];

export const List = {
    Title,
    Description,
    BaseTemplate,
}

export const Fields = [{
    Title: 'OfficeName',
    FieldTypeKind: 2,
    DefaultView: true,
    Order: 1,
},{
    Title: 'Emails',
    FieldTypeKind: 3,
    DefaultView: true,
    Order: 2,
}];

export default {
    List,
    Fields,
    PredefinedData,
    AddViewFieldTitle,
    AddViewFieldGUID,
}