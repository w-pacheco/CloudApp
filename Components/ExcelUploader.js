
(function(){
    const HTMLString = /*html*/`
    <div class="container-fluid">
        <h2 class="text-center mt-4 mb-4">Upload Excel Data to SharePoint</h2>
        <div class="card">
            <div class="card-header"><b>Select Excel File</b></div>
            <div class="card-body">
                <div class="row align-items-end">
                    <div class="col-sm-auto">
                        <label for="file">Step 1: Select Excel File</label>
                        <input type="file" id="excel_file" />
                    </div>
                    <div class="col-sm-auto">
                        <label for="sheet">Step 2: Select Sheet</label>
                        <select id="excel_sheet" style="padding:4px">
                            <option>Select a sheet:</option>
                        </select>
                    </div>
                    <div class="col-sm-auto">
                        <label for="SpList">Step 3: Select SharePoint List</label>
                        <select id="sharepoint_list" style="padding:4px">
                            <option>Select a List:</option>
                        </select>
                    </div>
                    <div class="col-sm-auto">
                        <label for="SpList">Step 4:</label>
                        <button type='button' id="excel_verify" class="btn btn-primary">Check Data
                            <div id="CheckDataLoader" class="excel_loader" style="display:none;"></div>
                        </button>

                    </div>
                    <div class="col-sm-auto" style="max-width:250px">
                        <label for="SpList">Step 5: </br> Select Items to be uploaded by clicking the check boxes in the
                            first column</label>
                    </div>
                    <div class="col-sm-auto">
                        <label for="SpList">Step 6:</label>
                        <button type='button' id="excel_upload" class="btn btn-primary">Upload Data
                            <div id="UploadDataLoader" class="excel_loader" style="display:none;"></div>
                        </button>

                    </div>


                </div>
            </div>
        </div>
        <div id="excel_data" class="mt-5"></div>
    </div>`
    

const excel_file = document.getElementById('excel_file');
const excel_sheet = document.getElementById('excel_sheet');
const sharepoint_list = document.getElementById('sharepoint_list');
const excel_data = document.getElementById('excel_data');
const excel_upload = document.getElementById('excel_upload');
const excel_verify = document.getElementById('excel_verify');
const appWebUrl = _spPageContextInfo.webAbsoluteUrl;
var dataChecked = false;
window.SpColumns;
window.SpUsedUsers = [];
window.SPUsedListsPromise = [];
window.SpUsedLists = {};

//get all site lists when window loads
window.addEventListener('load', (event) => {
GetSharepointUsers().then(Users => window.SpAllUsers = Users);
GetAllSharepointLists().then(lists => {
    lists.forEach(list => {
        if (list.Title === "TaskCustomerRequests") {
            var option = document.createElement("option");
            option.innerText = list.Title;
            sharepoint_list.append(option);
        }
    });
    $('body').loadingModal('hide')
})
})

//these to event listeners call the function that creates the table from the excel sheet
excel_file.addEventListener('change', (event) => {
excel_sheet.innerHTML = "<option>Select a sheet:</option>";
ContvertExcelToTable();
});
excel_sheet.addEventListener('change', (event) => {
ContvertExcelToTable();
});

//When a user selects a column try and match titles and verify data
sharepoint_list.addEventListener('change', (event) => {
GetSharepointColumns(sharepoint_list.value).then(columns => {

    //create select element;
    SpColumns = columns;
    var ColumnSelect = document.createElement("select");
    var DefaultOption = document.createElement("option");
    var SkipOption = document.createElement("option");
    DefaultOption.innerText = "Select a Column";
    SkipOption.innerText = "Skip Uploading this Column";
    ColumnSelect.append(DefaultOption);
    ColumnSelect.append(SkipOption);
    columns.forEach(column => {
        var option = document.createElement("option");
        option.value = column.InternalName;
        option.innerText = column.Title;
        ColumnSelect.append(option);
    })


    columns.forEach((column) => {
        if (column.FieldTypeKind === 7 && !!column.LookupList) {
            if (!SpUsedLists[column.LookupList]) {
                SpUsedLists[column.LookupList] = [];
                excel_verify.disabled = true;
                document.getElementById("CheckDataLoader").style.display = ""
                SPUsedListsPromise.push(new Promise((resolve, reject) => {

                    GetSharepointListsItems(column.LookupList).then(data => {
                        var items = data.d.results;
                        SpUsedLists[column.LookupList] = items;
                        resolve(items);
                    })

                }))
            }
        }
        if (column.FieldTypeKind === 20 && !!column.LookupList) {
            if (!SpUsedLists[column.LookupList]) {
                SpUsedLists[column.LookupList] = [];
                var filter = "&$select=*,ImnName&$expand=ContentType"
                excel_verify.disabled = true;
                document.getElementById("CheckDataLoader").style.display = ""
                SPUsedListsPromise.push(new Promise((resolve, reject) => {

                    GetSharepointListsItems(column.LookupList, filter).then(data => {
                        var items = data.d.results;
                        SpUsedLists[column.LookupList] = items;
                        resolve(items);
                    })

                }))
            }
        }
    })


    //if the table has already been created append select to headers
    if (!!excel_data.children.length && excel_data.children[0].tagName === "TABLE") {
        var headerRow = excel_data.querySelectorAll("th");
        headerRow.forEach((header, index) => {
            //if (index === 0) return;
            var text = header.getElementsByTagName("div")[0];
            var select = ColumnSelect.cloneNode(true);

            header.innerHTML = select.outerHTML + text.outerHTML;

            //Search the options for an exact match of the title
            //Skip this for AERP because of the specific list to upload in switch statement line 210
            var ColIndex;
            var value;
            // value = columns.filter((column, index) => {
            //     if (text.innerText === column.Title || text.innerText === column.InternalName) {
            //         ColIndex = index;
            //         return true;
            //     }
            // });
            var selectEl = header.getElementsByTagName("select")[0]

            var cells = excel_data.querySelectorAll("[data-col='" + header.dataset.col + "']")
            if (cells[0].children[0].value === 'Skip Uploading this Column' || cells[0].children[0].value === 'Select a Column') {
                for (i = 1; i < cells.length; i++) {
                    cells[i].children[0].removeAttribute("data-colname")
                    cells[i].children[0].removeAttribute("data-value")
                    cells[i].removeAttribute("data-colarray");
                }
            }

            //event listener to run validation when a column select is updated
            selectEl.addEventListener("change", (event) => {
                //do validation on the columns data
                var colArrayIndex
                var select = columns.filter((column, index) => {
                    colArrayIndex = index;
                    return event.target.value === column.InternalName
                });
                var cells = excel_data.querySelectorAll("[data-col='" + header.dataset.col + "']")
                if (event.target.value === 'Skip Uploading this Column' || event.target.value === 'Select a Column') {
                    for (i = 1; i < cells.length; i++) {
                        cells[i].children[0].removeAttribute("data-colname")
                        cells[i].children[0].removeAttribute("data-value")
                        cells[i].removeAttribute("data-colarray");
                        VerifyColumnData(cells[i], select[0]);
                    }
                } else {
                    for (i = 1; i < cells.length; i++) {
                        if (!!select[0] && (select[0].FieldTypeKind == 7 || select[0].FieldTypeKind == 20))
                            cells[i].children[0].setAttribute("data-colname", select[0].InternalName + "Id");
                        else !!select[0] ? cells[i].children[0].setAttribute("data-colname", select[0].InternalName) : "";
                        ColIndex && !!select[0] ? cells[i].setAttribute("data-colarray", colArrayIndex) : cells[i].setAttribute("data-colarray", null);
                        //console.log("target", event.target)
                        VerifyColumnData(cells[i], select[0])
                    }
                }
            })

            //If no match do a less specific search
            if (!value || !value.length) {
                var newName
                //console.log("no matching column found, do a less specific search", text.innerText);
                if (event.target.value == "TaskCustomerRequests") {

                    switch (text.innerText) {
                        case 'GOVID':
                            newName = "GovIDV2"; 
                            selectEl.setAttribute("disabled", "true");
                            break;
                        case 'Submission Title':
                            newName = "RequestTitleV2"; break;
                        case 'Submitted Date':
                            newName = "EnteredIntoMHS"; break;
                        case 'Submitting Location':
                            newName = "LkupMTFV2"; break;
                        case 'Service':
                            newName = "LkupRegionsV2"; break;
                        case 'Region':
                            newName = "LkupAgenciesV2"; break;
                        case 'Is Covid?':
                            newName = "IsCOVID"; break;
                        case 'Requester Rank':
                            newName = "RequesterRank"; break;
                        case 'Requester First Name':
                            newName = "RequesterFirstName"; break;
                        case 'Requester Last Name':
                            newName = "RequesterLastName"; break;
                        case 'Requester Phone':
                            newName = "RequesterPhoneV2"; break;
                        case 'Requester Email':
                            newName = "RequesterEmailV2"; break;
                        case 'Govt First Name':
                            newName = "GovFirstName"; break;
                        case 'Govt Last Name':
                            newName = "GovLastName"; break;
                        case 'Govt Phone':
                            newName = "GOVPhoneV2"; break;
                        case 'Govt Email':
                            newName = "GOVEmailV2"; break;
                        case 'Functional First Name':
                            newName = "FuncFirstName"; break;
                        case 'Functional Last Name':
                            newName = "FuncLastName"; break;
                        case 'Functional Email':
                            newName = "FunctionalProEmailV2"; break;
                        case 'Functional Phone':
                            newName = "FunctionalProPhoneV2"; break;
                        case 'Alternate First Name':
                            newName = "AltFirstName"; break;
                        case 'Alternate Last Name':
                            newName = "AltLastName"; break;
                        case 'Alternate Email':
                            newName = "AlternateEmailV2"; break;
                        case 'Alternate Phone':
                            newName = "AlternatePhoneV2"; break;
                        case 'Problem Statement':
                            newName = "ProblemStatementV2"; break;
                        case 'Problem Breakdown':
                            newName = "BreakdownProblemV2"; break;
                        case 'Target':
                            newName = "DesiredOutcomeV2"; break;
                        case 'Baseline Funded':
                            newName = "FYBaselineV2"; break;
                        case 'Required Completion Date':
                            newName = "NeedByDateV2"; break;
                        case 'AE Request Type Description':
                            newName = "TopicV2"; break;
                        case 'Is PHI or PII':
                            newName = "PIIPHIV2"; break;
                        case 'Related GOVIDS':
                            newName = "HistoricGovIDV2"; break;

                    }


                    // FOR AERP 1.0 to 2.0
                    // switch (text.innerText) {
                    //     case 'GovID':
                    //         newName = "GovIDV2"; break;
                    //     case 'RequestTitle':
                    //         newName = "RequestTitleV2"; break;
                    //     case 'RequesterName':
                    //         newName = "RequesterFirstName"; break;
                    //     case 'RequesterEmail':
                    //         newName = "RequesterEmailV2"; break;
                    //     case 'Need By Date':
                    //         newName = "NeedByDateV2"; break;
                    //     case 'RequesterPhone':
                    //         newName = "RequesterPhoneV2"; break;
                    //     case 'LkupAgency':
                    //         newName = "LkupAgenciesV2"; break;
                    //     case 'LkupRegion':
                    //         newName = "LkupRegions"; break;
                    //     case 'LkupMTF':
                    //         newName = "LkupMTFV2"; break;
                    //     case 'Health Affairs Branch':
                    //         newName = "HealthAffairsBranch"; break;
                    //     case 'GovPOC':
                    //         newName = "GovFirstName"; break;
                    //     case 'GovEmail':
                    //         newName = "GOVEmailV2"; break;
                    //     case 'GovPhone':
                    //         newName = "GOVPhoneV2"; break;
                    //     case 'FunctionalProName':
                    //         newName = "FuncFirstName"; break;
                    //     case 'FunctionalProEmail':
                    //         newName = "FunctionalProEmailV2"; break;
                    //     case 'FunctionalProPhone':
                    //         newName = "FunctionalProPhoneV2"; break;
                    //     case 'AlternatePOC':
                    //         newName = "AltFirstName"; break;
                    //     case 'AlternateEmail':
                    //         newName = "AlternateEmailV2"; break;
                    //     case 'AlternatePhone':
                    //         newName = "AlternatePhoneV2"; break;
                    //     case 'Problem Statement':
                    //         newName = "ProblemStatementV2"; break;
                    //     case 'Problem Breakdown':
                    //         newName = "BreakdownProblemV2"; break;
                    //     case 'Target':
                    //         newName = "DesiredOutcomeV2"; break;
                    //     case 'FYBaseline':
                    //         newName = "FYBaselineV2"; break;
                    //     case 'IsCovidRelated':
                    //         newName = "IsCOVID"; break;
                    //     case 'PII/PHI':
                    //         newName = "PIIPHIV2"; break;
                    //     case 'QPPInitiative':
                    //         newName = "Isqpp"; break;
                    //     case 'IsCongressionalItem':
                    //         newName = "IsCongressionalItem"; break;
                    //     case 'Topic':
                    //         newName = "TopicV2"; break;
                    //     case 'OnHoldStartOrEndDate':
                    //         newName = "OnHoldStartDate"; break;
                    //     case 'AETTTriageReviewDate':
                    //         newName = "AETTTriageReviewDate"; break;

                    // }
                }
                if (event.target.value == "AETT") {
                    switch (text.innerText) {
                        case 'GovID':
                            newName = "GovIDV2"; break;
                        case 'StatusChoice':
                            newName = "FormStatus"; break;
                        case 'MHSTriageDate':
                            newName = "MHSTriageDate"; break;
                        case 'AETTSuspenseDate':
                            newName = "AETTSuspenseDateV2"; break;
                        case 'COP_Section':
                            newName = "OperationFunction"; break;
                        case 'AnalyticsSection':
                            newName = "BranchTeam"; break;
                        case 'GLComments':
                            newName = "AETTComments"; break;
                        case 'J5SpfiPrioritization':
                            newName = "J5SpfiPrioritizationV2"; break;
                        case 'ExpectedDuration':
                            newName = "ExpectedDuration"; break;
                        case 'Prioritization':
                            newName = "PrioritizationV2"; break;
                        case 'Level of Complexity':
                            newName = "LoC"; break;
                        case 'Level of Urgency':
                            newName = "LoUV2"; break;
                        case 'PrimaryObjective':
                            newName = "PrimaryObjectiveV2"; break;
                        case 'ResourcePhase':
                            newName = "ResourcePhase"; break;
                        case 'dateAchievable':
                            newName = "dateAchievable"; break;
                        case 'triageQuorum':
                            newName = "triageQuorumV2"; break;
                        case 'smartGoals':
                            newName = "smartGoalsV2"; break;
                        case 'missingDoc':
                            newName = "dadMeeting"; break;
                        case 'redundantRequest':
                            newName = "redundantRequest"; break;
                        case 'dateAchievable':
                            newName = "dateAchievable"; break;
                        case 'TriageApproveDate':
                            newName = "TriageApproveDate"; break;
                        case 'OnHoldStatusNotes':
                            newName = "OnHoldComments"; break;



                    }
                }
                if (event.target.value == "GroupLeads") {
                    switch (text.innerText) {
                        case 'GovID':
                            newName = "GovIDV2"; break;
                        case 'StatusChoice':
                            newName = "FormStatus"; break;
                        case 'GLApprovedDate':
                            newName = "GLApprovedDate"; break;
                        case 'GLReviewDate':
                            newName = "GLReviewDate"; break;
                        case 'GLComments':
                            newName = "GLCommentsV2"; break;
                        case 'policyImpact':
                            newName = "policyImpactV2"; break;
                        case 'AssignQCAnalyst':
                            newName = "UserAnalystName"; break;
                        case 'AssignAnalyst':
                            newName = "ContractTitleCoName"; break;

                    }
                }
                if (event.target.value == "Analyst") {
                    switch (text.innerText) {
                        case 'GovID':
                            newName = "GovIDV2"; break;
                        case 'StatusChoice':
                            newName = "FormStatus"; break;
                        case 'readyForQC': //?? ReadyForQCDate
                            newName = "ReadyForQCDate"; break;
                        case 'SMEReviewDate':
                            newName = "AnalystReviewDate"; break;
                        case 'sbarSituation':
                            newName = "sbarSituationV2"; break;
                        case 'sbarBackground':
                            newName = "sbarBackgroundV2"; break;
                        case 'sbarAssessment':
                            newName = "sbarAssessmentV2"; break;
                        case 'AnalystComments':
                            newName = "AnalystCommentsV2"; break;
                        case 'DateDeliveredToGovPOC':
                            newName = "DateDeliveredToPOCV2"; break;
                    }
                }
                if (event.target.value == "TriageMemberQC") {
                    switch (text.innerText) {
                        case 'GovID':
                            newName = "GovIDV2"; break;
                        case 'StatusChoice':
                            newName = "FormStatus"; break;
                        case 'reviewedByLead':
                            newName = "reviewedByLead"; break;
                        case 'readyForRelease':
                            newName = "readyForRelease"; break;
                        case 'readyForQC': //?? ReadyForQCDate
                            newName = "LeadershipReviewedV2"; break;
                        case 'QCApprovedDate':
                            newName = "QCApprovedDate"; break;
                        case 'QCApproved':
                            newName = "QCReceiveDate"; break;
                    }
                }
                if (event.target.value == "ReleaseAuthority") {
                    switch (text.innerText) {
                        case 'GovID':
                            newName = "GovIDV2"; break;
                        case 'StatusChoice':
                            newName = "FormStatus"; break;
                        case 'RAReviewDate':
                            newName = "RAReviewDate"; break;
                        case 'customerReceivedProduct':
                            newName = "customerReceivedProductV2"; break;
                    }
                }
                console.log("NewName", newName)
                if (!!newName) {
                    var value = columns.filter((column, index) => {
                        if (newName === column.Title || newName === column.InternalName) {
                            ColIndex = index;
                            return true;
                        }
                    });
                }

            }

            //if a matching option is found set it as the select value
            if (!!value && !!value.length) {
                var selectEl = header.getElementsByTagName("select")[0]
                selectEl.value = value[0].InternalName;

                //do validation on the columns data
                var cells = excel_data.querySelectorAll("[data-col='" + header.dataset.col + "']")
                for (i = 1; i < cells.length; i++) {
                    //VerifyColumnData(cells[i], value[0])
                    ColIndex ? cells[i].setAttribute("data-colarray", ColIndex) : "";
                    if (!!value[0] && (value[0].FieldTypeKind == 7 || value[0].FieldTypeKind == 20))
                        cells[i].children[0].setAttribute("data-colname", value[0].InternalName + "Id");
                    else !!value[0] ? cells[i].children[0].setAttribute("data-colname", value[0].InternalName) : "";
                    cells[i].children[0].addEventListener("focusout", (event) => {
                        VerifyColumnData(event.target.closest("td"), value[0])
                    })
                }
            }
        })
    } else {
        console.log("Table Doesn't Exist");
    }
    console.log(columns);
    Promise.all(SPUsedListsPromise).then(data => {
        console.log(data, SpUsedLists)
        excel_verify.disabled = false;
        document.getElementById("CheckDataLoader").style.display = "none"
    })
});

});

//event listener for upload Data button, verify data and send to server
excel_upload.addEventListener('click', (event) => {
if (!dataChecked) {
    alert("Please run data check before uploading");
    return;
}
var [isValid, errors] = UploadValidCheck()

if (!isValid) {
    var errorString = ""
    for (var i = 0; i < errors.length; i++) {
        errorString = errorString + errors[i] + "\n\n"
    }
    alert("errors: \n" + errorString);
}



if (isValid || (confirm("Errors were found. Columns with Errors will not be uploaded, do you wish to upload anyway?") && confirm("Are you sure?"))) {
    console.log("File is ready for upload")
    var rows = Array.from(excel_data.querySelectorAll("tr"));
    var checkedRows = rows.filter(row => row.children[0]?.children[0]?.children[0]?.checked)
    var promiseArray = []
    console.log(checkedRows);
    for (var i = 0; i < checkedRows.length; i++) {
        if (checkedRows[i] == excel_data.children[0].children[0].children[0]) continue;
        var row = checkedRows[i]
        var data = {};
        var cells = row.children
        for (var j = 0; j < cells.length; j++) {
            var dataEl = cells[j].children[0];
            var colName = dataEl.getAttribute("data-colname");
            var colValue = dataEl.getAttribute("data-value");
            if (!!colName && !!colValue) data[colName] = colValue;
            if (!!colValue && colValue.includes('{"results":')) {
                data[colName] = JSON.parse(colValue);
            }
        }
        console.log(data);
        //the Title should be a concatination of GovID and Request Title
        if (data.GovIDV2 && data.RequestTitleV2) {
            data.Title = data.GovIDV2 + "_" + data.RequestTitleV2
            if (data.Title.length > 255) data.Title = data.Title.substring(0, 240);
        } else {
            data.Title = "Missing GovID or Request Title Fields"
        }

        if (!data.NeedByDateV2 || data.NeedByDateV2 == "Invalid Date") data.NeedByDateV2 = new Date().toISOString();

        document.getElementById("UploadDataLoader").style.display = ""
        promiseArray.push(new Promise((resolve, reject) => {
            var row = checkedRows[i];
            UploadRow(sharepoint_list.value, data).then(data => {
                console.log(data);
                row.style.border = "2px solid #00cf00";
                row.children[0].children[1].setAttribute("style", "display:none;");
                resolve([row, data]);

            }).catch(data => {
                console.log("fail", data);
                row.style.border = "2px solid red";
                var errorDiv = row.children[0].children[1];
                var error = JSON.parse(data.body);
                console.log(error);
                errorDiv.style.display = "block";
                errorDiv.children[1].innerText = error.error?.message?.value ? error.error.message.value : "Post Request Failed without Error Message";
                reject([row, data]);
            })
        }))

    }

    Promise.all(promiseArray).then(data => {
        alert("Post Requests finished");
        document.getElementById("UploadDataLoader").style.display = "none"
        console.log(data);
    })
}
})

excel_verify.addEventListener('click', (event) => {
dataChecked = true;
document.getElementById("CheckDataLoader").style.display = ""
var cells = excel_data.querySelectorAll("td");
var promises = []
for (var i = 0; i < cells.length; i++) {
    var column = SpColumns[cells[i].getAttribute("data-colarray")]
    promises.push(new Promise((resolve, reject) => {
        resolve(VerifyColumnData(cells[i], column));
    }));
}

Promise.all(promises).then(data => {
    alert("Data Check Complete, See Results below");
    document.getElementById("CheckDataLoader").style.display = "none"
})
})

function ContvertExcelToTable() {

if (!['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(excel_file.files[0].type)) {
    document.getElementById('excel_data').innerHTML = '<div class="alert alert-danger">Only .xlsx or .xls file format are allowed</div>';
    excel_file.value = '';
    return false;
}

var reader = new FileReader();
reader.readAsArrayBuffer(excel_file.files[0]);
reader.onload = function () {

    var data = new Uint8Array(reader.result);
    var work_book = XLSX.read(data, { type: 'array' });
    console.log("work_book", work_book);
    var sheet_name = work_book.SheetNames;

    //if there are multiple sheets and non selected, create the sheet select
    if (isNaN(Number(excel_sheet.value)) && sheet_name.length > 0) {
        var sheetSelect = document.getElementById("excel_sheet")
        for (var i = 0; i < sheet_name.length; i++) {
            var option = document.createElement("option");
            option.value = i;
            option.innerText = sheet_name[i];
            sheetSelect.append(option);
        }
        return;
    }

    console.log("sheet_name", sheet_name);
    var sheet_data = XLSX.utils.sheet_to_json(work_book.Sheets[sheet_name[Number(excel_sheet.value)]], { header: 1, raw: false, dateNF: 14 });

    console.log("sheet_data", sheet_data);
    // console.log("sheet_html", sheet_html);


    //sort the data adn trim to 250 items 
    var GovIdIndex = sheet_data[0].findIndex((item) => item.toUpperCase() == "GOVID")
    var headers = sheet_data.shift();
    sheet_data = sheet_data.sort((rowA, rowB) => {
        if (!!rowB[GovIdIndex] && rowA[GovIdIndex]) {
            rowB[GovIdIndex].localeCompare(rowA[GovIdIndex])
        }

    })
    sheet_data.unshift(headers);

    if (sheet_data.length > 250) {
        alert("There is a maximum of 150 items that can be uploaded at one time.\n This view will sort the items by GovID and show the top 150 items");
        sheet_data = sheet_data.slice(0, 150);
    }



    if (sheet_data.length > 0) {
        var table_output = '<table class="table table-striped table-bordered">';
        for (var row = 0; row < sheet_data.length; row++) {
            table_output += '<tr>';
            for (var cell = 0; cell < sheet_data[0].length; cell++) {
                if (cell == 0) {
                    table_output += '<td  class="excel_checkbox_outer" ><div class="excel_checkbox" ><input type="checkbox" ></div>' +
                        '<div class="excel_error" style="display:none;"><div class="error" onclick=hideErrors(this) >Error</div><div class="message" style="min-width:200px;max-height: 200px;overflow: auto;"></div></div>' + '</td>';
                }
                if (row == 0) {
                    table_output += '<th data-row="' + row + '" data-col="' + cell + '" ><div>' + sheet_data[row][cell] + '</div></th>';
                }

                else {
                    if (sheet_data[row][cell] === undefined) sheet_data[row][cell] = "";
                    table_output += '<td  data-row="' + row + '" data-col="' + cell + '" ><div class="excel_value" contenteditable="true">' + sheet_data[row][cell] + '</div>' +
                        '<div class="excel_error" style="display:none;"><div class="error" onclick=hideErrors(this) >Error</div><div class="message" style="min-width:200px;max-height: 200px;overflow: auto;"></div></div>' + '</td>';
                }
            }
            table_output += '</tr>';
        }
        table_output += '</table>';
        document.getElementById('excel_data').innerHTML = table_output;

        var firstCheckbox = excel_data.querySelector(".excel_checkbox");
        firstCheckbox.children[0].addEventListener("change", function (event) {

            var checkboxes = Array.from(excel_data.querySelectorAll(".excel_checkbox"))
            checkboxes.shift();
            if (event.target.checked) {
                checkboxes.forEach(checkbox => checkbox.children[0].checked = true)
            }
            else checkboxes.forEach(checkbox => checkbox.children[0].checked = false)

        })
    }
    //excel_file.value = '';
}
}

function hideErrors(el) {
el.parentElement.setAttribute("style", "display:none;")
}

function UploadValidCheck() {
var isValid = false;
var errors = [];
var headerRow = excel_data.querySelectorAll("th");
var tableRows = excel_data.querySelectorAll("tr");
var Columns = []

var invalidElements = excel_data.querySelectorAll("div.excel_error:not([style='display:none;'])");
!!invalidElements.length ? errors.push(invalidElements.length + " Cell(s) have invalid data \n\n") : "";

//check that the all selects have a value
for (var i = 0; i < headerRow.length; i++) {
    var select = headerRow[i].children[0];
    var columnData = window.listColumns.filter(column => column.InternalName === select.value)[0];

    if (select.value === 'Skip Uploading this Column') continue;
    else if (select.tagName != "SELECT") return [false, ["No list was selected, or select element has been removed from a column"]];
    else if (select.value === 'Select a Column') errors.push("Column " + i + "(" + headerRow[i].children[1].innerText + "):\n does not have a column selected")
    else if (!columnData) errors.push("Column " + i + "(" + headerRow[i].children[1].innerText + "):\n Cannot find a matching column")
    else if (!!columnData["ColumnUsed"]) errors.push("Column " + i + "(" + headerRow[i].children[1].innerText + "):\n has a column value that is already used")
    else Columns[i] = columnData;

}

// //check that column data matches column type
// if (errors.length === 0 || true) { //remove true when done testing
//     var invalidElements = excel_data.querySelectorAll("div.excel_error:not([style='display:none;'])");
//     !!invalidElements.length ? errors.push(invalidElements.length + " Cells have invalid data") : "";
// }

//No Errors have been found  
if (errors.length === 0) isValid = true;
return [isValid, errors]
}

//This function checks a cell value against a column type to make sure the data is valid
//valid data is stored in the element data-value attribute, in string that is ready to send once parsed
function VerifyColumnData(cell, column) {
//console.log(cell, column);
var cellvalue = cell.children[0];
var cellData = cellvalue.innerText.trim();
var error = "";
if (cell.className === "excel_checkbox_outer") return;
if (cellData === "" || !column);

//Single Line of Text
else if (column.FieldTypeKind === 2) {
    if (column.InternalName === "RequestTitleV2" && cellData.length > 240) cellData = cellData.substring(0, 240);
    if (cellData.length > column.MaxLength) { error = "Data exceeds max value of " + column.MaxLength + " characters." }
    else cellvalue.setAttribute("data-value", cellData)
}

//MultiLine of Text
else if (column.FieldTypeKind === 3) {

    //console.log("Multiple lines of text")
    cellvalue.setAttribute("data-value", cellData)
}

//Choice Field
else if (column.FieldTypeKind === 6) {
    //console.log("Choice")
    if (column) {
        if (cellData.toUpperCase() === "YES" || cellData.toUpperCase() === "NO") {
            var boolIndex = column.Choices.results.findIndex(choice => choice.toUpperCase() === cellData.toUpperCase())
            if (boolIndex != -1) { cellData = column.Choices.results[boolIndex] }
        }
        var match = column.Choices.results.find(choice => choice.replace(/[^a-zA-Z0-9]+/g, "").localeCompare(cellData.replace(/[^a-zA-Z0-9]+/g, "")) === 0)
        if (!match) {
            error = "Value is not a valid option \n options: \n";
            column.Choices.results.forEach(choice => error = error + choice + "\n")
        }
    }

    if (cellData.includes(";")) error = "This fields is a single choice column, please remove ; and all data after"
    if (!error) cellvalue.setAttribute("data-value", match)
}

//MultiChoice (Checkbox);
else if (column.FieldTypeKind === 15) {
    //console.log("MultiChoice", column, cellData)
    var usedValues = [];
    //Sharepoint passes data diminated by ;#, but we also want to check if its deliminated just by ;
    var cellArray = cellData.replaceAll("#", "");
    cellArray = cellArray.split(";");
    for (var i = 0; i < cellArray.length; i++) {
        cellArray[i] = cellArray[i].trim();
        //Check if the value is in the columns choices
        if (!!cellArray[i] && !column.Choices.results.find(choice => choice === cellArray[i])) {
            error = cellArray[i] + " is not a valid option \n options: \n";
            column.Choices.results.forEach(choice => error = error + choice + "\n")
        }
        //check if the item has already been used
        if (!!cellArray[i] && usedValues.find(choice => choice === cellArray[i])) {
            error = cellArray[i] + " has already been selected";
        }
        else usedValues.push(cellArray[i]);
    }
    if (!error) cellvalue.setAttribute("data-value", '{"results":' + JSON.stringify(usedValues) + "}");
}

//Number
else if (column.FieldTypeKind === 9) {
    //console.log("Number")
    var number = Number(cellData.replace(/[^0-9.-]+/g, ""));
    if (isNaN(number)) { error = "Value is not a number."; }
    else if (!!column.MinimumValue && number < column.MinimumValue) { error = "Value is less than minimum value : " + column.MinimumValue; }
    else if (!!column.MaximumValue && number > column.MaximumValue) { error = "Value is greater than minimum value : " + column.MaximumValue; }
    if (!error) cellvalue.setAttribute("data-value", number);
}

//Currency
else if (column.FieldTypeKind === 10) {
    //console.log("Currency");
    var number = Number(cellData.replace(/[^0-9.-]+/g, ""));
    if (isNaN(number)) { error = "Value is not a number."; }
    else if (!!column.MinimumValue && number < column.MinimumValue) { error = "Value is less than minimum value : " + column.MinimumValue; }
    else if (!!column.MaximumValue && number > column.MaximumValue) { error = "Value is greater than minimum value : " + column.MaximumValue; }
    if (!error) cellvalue.setAttribute("data-value", number);
}

//Date and DateTime
else if (column.FieldTypeKind === 4) {
    //console.log("Date and Time")
    var date = new Date(cellData);
    if (date == "Invalid Date") error = "Value is not a Date. \n Example: 10/20/21 10:30 AM";
    if (!error) cellvalue.setAttribute("data-value", date.toISOString());
}

//Lookup and MultiLookup
else if (column.FieldTypeKind === 7) {
    //console.log("Lookup", column, cellData);
    if (column.AllowMultipleValues) {

        //Sharepoint passes data delimited by ;#, but we also want to check if its deliminated just by ;
        var cellArray = cellData.replaceAll("#", "");
        cellArray = cellArray.split(";");
        //console.log(cellArray);
        var matchedList = SpUsedLists[column.LookupList];
        var validData = [];
        for (var i = 0; i < cellArray.length; i++) {
            cellArray[i] = cellArray[i].trim();

            var matchedItem = matchedList.find(item => {
                //if the value is an Id
                if (!!cellArray[i] && !isNaN(Number(cellArray[i]))) return item.Id == cellArray[i]
                //if the value is a not a number
                else return item[column.LookupField] == cellArray[i]

            })
            if (!!matchedItem && !validData.find(id => id === matchedItem.Id)) {
                validData.push(matchedItem.Id)
            }
            if (!!cellArray[i] && !matchedItem) {
                error = cellArray[i] + " is not a valid option \n options: \n";
                matchedList.forEach(choice => error = error + choice[column.LookupField] + ";" + choice.Id + "\n")
            }

        }
        if (!error) cellvalue.setAttribute("data-value", '{"results":' + JSON.stringify(validData) + "}");
    } else {
        var matchedList = SpUsedLists[column.LookupList];
        var matchedItem = matchedList.find(item => item[column.LookupField] == cellData)
        if (!matchedItem && column.Title === "LkupAgenciesV2" && cellData === "DHA HQ") {
            matchedItem = matchedList.find(item => item[column.LookupField] == "DHA Markets (HQ Only)")
        }
        if (!matchedItem) {
            error = "Value is not a valid option \n options: \n";
            matchedList.forEach(choice => error = error + choice[column.LookupField] + "\n")
        }
        if (cellData.includes(";")) error = "This fields is a single lookup column, please remove ; and all data after"
        if (!error) cellvalue.setAttribute("data-value", JSON.stringify(matchedItem.Id));
    }

}

//Yes/No
else if (column.FieldTypeKind === 8) {
    if (cellData.toUpperCase() != "TRUE" && cellData.toUpperCase() != "FALSE" && cellData.toUpperCase() != "YES" && cellData.toUpperCase() != "NO")
        error = "Value must be Yes, No, true, or false"
    if (!error && cellData.toUpperCase() === "TRUE" || cellData.toUpperCase() === "YES") cellvalue.setAttribute("data-value", true);
    if (!error && cellData.toUpperCase() === "FALSE" || cellData.toUpperCase() === "NO") cellvalue.setAttribute("data-value", false);
}

// Person or Group and MultiPerson or Group'
//This can be optimized by searching a local usedUsers array and adding new users to the array
else if (column.FieldTypeKind === 20) {
    if (column.AllowMultipleValues) {
        //Sharepoint passes data delimited by ;#, but we also want to check if its deliminated just by ;
        var cellArray = cellData.replaceAll("#", "");
        cellArray = cellArray.split(";");
        var matchedList = SpUsedLists[column.LookupList];
        var validData = [];

        for (var i = 0; i < cellArray.length; i++) {
            cellArray[i] = cellArray[i].trim();
            var matchedItem = matchedList.find(item => {
                //if the value is an Id
                if (!!cellArray[i] && !isNaN(Number(cellArray[i]))) return item.Id == cellArray[i]
                //if the value is a not a number
                else return item[column.LookupField] == cellArray[i]

            })
            if (!!matchedItem && !validData.find(id => id === matchedItem.Id)) {
                validData.push(matchedItem.Id)
            }
            if (!!cellArray[i] && !matchedItem) {
                error = cellArray[i] + " is not a valid option \n options: \n";
                matchedList.forEach(choice => error = error + choice[column.LookupField] + ";" + choice.Id + "\n")
            }

        }
        if (!error) cellvalue.setAttribute("data-value", '{"results":' + JSON.stringify(validData) + "}");

    } else {
        var matchedList = SpUsedLists[column.LookupList];
        var matchedItem = matchedList.find(item => item[column.LookupField] == cellData)
        if (!matchedItem) {
            error = "Value is not a valid option \n options: \n";
            matchedList.forEach(choice => error = error + choice[column.LookupField] + "\n")
        }
        if (cellData.includes(";")) error = "This fields is a single item column, please remove ; and all data after"
        if (!error) cellvalue.setAttribute("data-value", JSON.stringify(matchedItem.Id));
    }
}
else if (column.FieldTypeKind === 17) {
    error = "Data cannot be uploaded to Calculated Columns"
}
else {
    if (!!column.FieldTypeKind && !isNaN(Number(column.FieldTypeKind))) error = "this column has not been mapped for data validation and cannot be uploaded";
}
if (error != "") {
    cell.children[1].style.display = "block";
    cell.style.border = "2px solid red";
    cell.children[1].children[1].innerText = error;
}
else {
    cell.style.border = "";
    cell.children[1]?.style.display ? cell.children[1].setAttribute("style", "display:none;") : "";
}

return error
}


function GetAllSharepointLists() {
return new Promise((resolve, reject) => {
    var reqExecutor = new SP.RequestExecutor(appWebUrl);
    reqExecutor.executeAsync({
        url: appWebUrl + "/_api/web/Lists/",
        method: "GET",
        headers: {
            "Accept": "application/json; odata=verbose",
            "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
        },
        success: function (data) {
            data = JSON.parse(data.body);
            // filter data for non-hidden lists
            data.d.results = data.d.results.filter(list => list.Hidden === false);
            resolve(data.d.results)
        },
        error: function (data) {
            reject(data);
        }
    });
})
}

function GetSharepointListsItems(List, Filter) {
if (!Filter) Filter = ""
return new Promise((resolve, reject) => {

    GetSharepointListsItemCount(List).then(data => {
        if (List[0] === "{") {
            List = List.substring(1, List.length - 1);
            var url = appWebUrl + "/_api/web/lists(guid'" + List + "')/items"
        }
        else {
            var url = appWebUrl + "/_api/web/lists/getbytitle('" + List + "')/items"
        }
        url = url + "?$top=" + data.d.ItemCount + Filter;
        var reqExecutor = new SP.RequestExecutor(appWebUrl)
        reqExecutor.executeAsync({
            url: url,
            method: "GET",
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) { resolve(JSON.parse(data.body)) },
            error: function (data) { reject(data) },
        })
    })
});
}

function GetSharepointListsItemCount(List) {

if (List[0] === "{") {
    List = List.substring(1, List.length - 1);
    var url = appWebUrl + "/_api/web/lists(guid'" + List + "')/ItemCount"
}
else {
    var url = appWebUrl + "/_api/web/lists/getbytitle('" + List + "')/ItemCount"
}
var reqExecutor = new SP.RequestExecutor(appWebUrl)
return new Promise((resolve, reject) => {
    reqExecutor.executeAsync({
        url: url,
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) { resolve(JSON.parse(data.body)) },
        error: function (data) { reject(data) },
    })
});

}

function GetSharepointUsers() {
return new Promise((resolve, reject) => {
    var reqExecutor = new SP.RequestExecutor(appWebUrl);
    reqExecutor.executeAsync({
        url: appWebUrl + "/_api/web/SiteUsers",
        method: "GET",
        headers: {
            "Accept": "application/json; odata=verbose",
            "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
        },
        success: function (data) {
            data = JSON.parse(data.body);
            resolve(data.d.results)
        },
        error: function (data) {
            reject(data);
        }
    });
})
}

function GetSharepointColumns(ListTitle) {
return new Promise((resolve, reject) => {
    var reqExecutor = new SP.RequestExecutor(appWebUrl);
    reqExecutor.executeAsync({
        url: appWebUrl + "/_api/web/Lists/GetByTitle('" + ListTitle + "')/fields",
        method: "GET",
        headers: {
            "Accept": "application/json; odata=verbose",
            "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
        },
        success: function (data) {
            data = JSON.parse(data.body);
            // filter data for user created columns & the title column
            data.d.results = data.d.results.filter(column => column.CanBeDeleted === true || column.InternalName === "Title");
            window.listColumns = data.d.results;
            resolve(data.d.results)
        },
        error: function (data) {
            reject(data);
        }
    });
})
}

function UploadRow(list, data) {
//TODO: get data from the row and store in variable to send
return new Promise((resolve, reject) => {

    GetSharepointListsMetadata(list).then(metadata => {
        data.__metadata = { type: metadata.ListItemEntityTypeFullName }
        var reqExecutor = new SP.RequestExecutor(appWebUrl);
        reqExecutor.executeAsync({
            url: appWebUrl + "/_api/web/Lists/GetByTitle('" + list + "')/items",
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Accept": "application/json; odata=verbose",
                "Content-Type": "application/json;odata=verbose",
                "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
            },
            success: function (data) {
                data = JSON.parse(data.body);
                resolve(data.d)
            },
            error: function (data) {
                reject(data);
            }
        });
    })
})
}

function GetSharepointListsMetadata(ListTitle) {
//TODO: get data from the row and store in variable to send

return new Promise((resolve, reject) => {
    var reqExecutor = new SP.RequestExecutor(appWebUrl);
    reqExecutor.executeAsync({
        url: appWebUrl + "/_api/web/Lists/GetByTitle('" + ListTitle + "')/",
        method: "POST",
        headers: {
            "Accept": "application/json; odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
        },
        success: function (data) {
            data = JSON.parse(data.body);
            resolve(data.d)
        },
        error: function (data) {
            reject(data);
        }
    });
})
}

function UploadDataToExistingItems() {
GetSharepointListsItems("TaskCustomerRequests").then((existingItems) => {

    var rows = Array.from(excel_data.querySelectorAll("tr"));
    var checkedRows = rows.filter(row => row.children[0]?.children[0]?.children[0]?.checked)
    var promiseArray = []
    console.log(checkedRows);
    for (var i = 0; i < checkedRows.length; i++) {
        if (checkedRows[i] == excel_data.children[0].children[0].children[0]) continue;
        var row = checkedRows[i]
        var data = {};
        var cells = row.children
        for (var j = 0; j < cells.length; j++) {
            var dataEl = cells[j].children[0];
            var colName = dataEl.getAttribute("data-colname");
            var colValue = dataEl.getAttribute("data-value");
            if (!!colName && !!colValue) data[colName] = colValue;
            if (!!colValue && colValue.includes('{"results":')) {
                data[colName] = JSON.parse(colValue);
            }
        }
        console.log(existingItems)
        var existingItem = existingItems.d.results.find(item => item.GovIDV2 == data.GovIDV2);
        // console.log(data, existingItem, existingItem.Id);
        data.Id = existingItem.Id
        document.getElementById("UploadDataLoader").style.display = ""
        promiseArray.push(new Promise((resolve, reject) => {
            var row = checkedRows[i];
            UpdateRow(sharepoint_list.value, data).then(data => {
                console.log(data);
                row.style.border = "2px solid #00cf00";
                row.children[0].children[1].setAttribute("style", "display:none;");
                resolve([row, data]);

            }).catch(data => {
                console.log("fail", data);
                row.style.border = "2px solid red";
                var errorDiv = row.children[0].children[1];
                var error = JSON.parse(data.body);
                console.log(error);
                errorDiv.style.display = "block";
                errorDiv.children[1].innerText = error.error?.message?.value ? error.error.message.value : "Post Request Failed without Error Message";
                reject([row, data]);
            })
        }))

    }

    Promise.all(promiseArray).then(data => {
        alert("Post Requests finished");
        document.getElementById("UploadDataLoader").style.display = "none"
        console.log(data);
    })
})
}

function UpdateRow(list, data) {
//TODO: get data from the row and store in variable to send
return new Promise((resolve, reject) => {



    GetSharepointListsMetadata(list).then(metadata => {
        data.__metadata = { type: metadata.ListItemEntityTypeFullName }
        var reqExecutor = new SP.RequestExecutor(appWebUrl);
        reqExecutor.executeAsync({
            url: appWebUrl + "/_api/web/Lists/GetByTitle('" + list + "')/items(" + data.Id + ")",
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Accept": "application/json; odata=verbose",
                "Content-Type": "application/json;odata=verbose",
                "IF-MATCH": "*",
                "X-HTTP-Method": "MERGE",
                "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
            },
            success: function (data) {
                resolve(data)
            },
            error: function (data) {
                reject(data);
            }
        });
    })
})
}

})();