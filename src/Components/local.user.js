export const CurrentUser = JSON.parse(`{
"__metadata":{
    "id":"https://{site_url}/_api/Web/CurrentUser",
    "uri":"https://{site_url}/_api/Web/CurrentUser",
    "type":"SP.User"
},
"Groups":{
    "__deferred":{
        "uri":"https://{site_url}/_api/Web/CurrentUser/Groups"}
    },
    "Id":666,
    "IsHiddenInUI":false,
    "LoginName":"i:0#.w|company-corp\\\\doejo",
    "Title":"Doe, John",
    "PrincipalType":1,
    "Email":"john.doe@email.com",
    "IsShareByEmailGuestUser":false,
    "IsSiteAdmin":true,
    "UserId":{
        "__metadata":{
            "type":"SP.UserIdInfo"
        },
        "NameId":"s-1-5-21-3923659354-477610687-2977832468-000000",
        "NameIdIssuer":"urn:office:idp:activedirectory"
    }
}`);

export default JSON.parse(`{
    "Key":"i:0#.w|saic-corp\\\\doejo",
    "Description":"SAIC-CORP\\\\doejo",
    "DisplayText":"Doe, John",
    "EntityType":"User",
    "ProviderDisplayName":"Active Directory",
    "ProviderName":"AD",
    "IsResolved":true,
    "EntityData":{
        "Title":"Biostatistician",
        "Email":"john.doe@mail.com",
        "MobilePhone":"",
        "PrincipalType":"User",
        "SIPAddress":"",
        "Department":"003 - HEALTH"
    },
    "MultipleMatches":[]
}`)