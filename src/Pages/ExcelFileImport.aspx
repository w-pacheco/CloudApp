<!DOCTYPE HTML>
<html>
<head>
    <meta name="author" content="Wilfredo Pacheco">
	<meta charset="utf-8">
	<title>Convert Excel to HTML Table using JavaScript</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="../../node_modules/bootstrap/dist/css/bootstrap.css">
    <style> * { font-size: 12px; } </style>
    <script src="../../node_modules/jquery/dist/jquery.js"></script>
    <script src="../Libraries/xlsx.full.min.js"></script>
</head>
<body>
    <div class="container">
    	<h2 class="text-center mt-4 mb-4">Convert Excel to HTML Table using JavaScript</h2>
    	<div class="card">
    		<div class="card-header"><b>Select Excel File</b></div>
    		<div class="card-body">
    			
                <input type="file" id="excel_file" />

    		</div>
    	</div>
        <div id="excel_data" class="mt-5"></div>
    </div>
    <script type="text/javascript">
    /** @reference https://www.webslesson.info/2021/07/how-to-display-excel-data-in-html-table.html */
    
    const excel_file = document.getElementById('excel_file');
    excel_file.addEventListener('change', function(event){
    
        // const File = window.File = event.target.files[0]
        if(!['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(event.target.files[0].type))
        {
            document.getElementById('excel_data').innerHTML = '<div class="alert alert-danger">Only .xlsx or .xls file format are allowed</div>';
            excel_file.value = '';
            return false;
        }
    
        var reader = new FileReader();
        reader.readAsArrayBuffer(event.target.files[0]);
        reader.onload = function(event){
            var data = new Uint8Array(reader.result);
            var work_book = XLSX.read(data, {type:'array'});
            var sheet_name = work_book.SheetNames;
            var sheet_data = window.sheet_data = XLSX.utils.sheet_to_json(work_book.Sheets[sheet_name[0]], {header:1});
            if(sheet_data.length > 0)
            {
                // var table_output = '<table class="table table-striped table-bordered" id="excel-table">';
                const TableEl = window.TableEl = document.createElement('table');
                TableEl.classList = 'table';
                TableEl.getData = () => sheet_data;
                TableEl.setAttribute('id', 'excel-table');
                TableEl.innerHTML = `
                <thead>
                    <tr>${sheet_data[0].map(header => `<th>${header}</th>`).join('')}</tr>
                </thead>
                <tbody></tbody>`;
    
                for(var index = 0; index < sheet_data.length; index++)
                {
                    const tr = document.createElement('tr');
                    for(var string = 0; string < sheet_data[index].length; string++)
                    {
                        if(index == 0)
                        {
                            // table_output += '<th>'+sheet_data[row][cell]+'</th>';
                        }
                        else
                        {
                            const td = document.createElement('td');
                            const tdValue = sheet_data[index][string] || '';
                            td.innerText = tdValue;
                            if ( !!tdValue && typeof(tdValue) === 'string' && tdValue.includes('RGB') )
                            {
                                const RGB = tdValue.replace('RGB', '');
                                td.setAttribute('style', `background-color: rgb(${
                                    RGB.split('').splice(1,3).join('')
                                },${
                                    RGB.split('').splice(3,3).join('')
                                },${
                                    RGB.split('').splice(6,3).join('')
                                })`);
                            }
                            tr.append(td);
                        }
                    }
                    TableEl.querySelector('tbody').append(tr);
                }
    
                const excelData = window.excelData = new Array();
                const Container = document.getElementById('excel_data');
                Container.append(TableEl);
    
                sheet_data.forEach((row, trIndex) => {
                    if ( trIndex > 0 ){
                        const Obj = new Object();
                        sheet_data[0].map((key, tdIndex) => {
                            const value = row[tdIndex];
                            if ( typeof value === 'string' && value.includes('RGB') ){
                                Obj[key+'RGB'] = row[tdIndex]
                            }
                            else {
                                Obj[key] = row[tdIndex]
                            }
                        })
                        excelData.push(Obj)
                    }
                });
    
                console.info('The global variable is: excelData');
                console.info(excelData);
                // console.info(JSON.stringify(excelData));
            }
            excel_file.value = '';
        }
    });
    
    </script>
     <script type="module">

        import '../../node_modules/js-sha256/src/sha256.js';
        import SharePointApi from '../Libraries/SharePointApi/src/SharePointApi.js';
    
        function Hash(arg){
            // if (typeof arg !== 'string') throw new Error(`${biome} | The argument is invalid!`);
            return sha256(encodeURIComponent(arg));
        }
    
        let Web = {};
        const Route = new SharePointApi({
            method: 'jQuery',
            verbose: false,
            statusCode: {
                307: function(xhr, error, textStatus){
                    alert( 'The application needs to refresh.');
                    return location.reload();
                },
                /** Method Not Allowed; */
                405: function(xhr, error, textStatus){ 
                    const { localhost } = Settings;
                    console.info(localhost);
                    console.info(xhr, error, textStatus);
                },
            },
        });
    
        const WebOptions = new Object();
        WebOptions.$select = '*';
        WebOptions.$expand = [
            'AllProperties',
            'CurrentUser',
            'Folders',
            'RootFolder',
            'Lists',
            'Lists/DefaultView',
            'Lists/Fields',
            'Lists/InformationRightsManagementSettings',
            'Lists/WorkflowAssociations',
            'RegionalSettings',
            'RegionalSettings/TimeZone',
            'RegionalSettings/TimeZones',
            'UserCustomActions',
            'WebInfos',
        ].join(',');
    
        async function init(){
    
            /** Call for data required for application to run; */
            Web = await Route.getWeb(WebOptions)
            .catch(console.info)
            .then(data => data);
    
            Object.assign(window,{
                Web,
                Route,
                Hash,
            });
        }
    
        window.onload = init;
    
    </script>
    <script type="text">
        function ExportToCSV(Title, csvStr){

            const csvFile = new Blob([csvStr], { type: 'text/csv' });
            const downloadLink = document.createElement('a');
        
            function DateTimeStr(){
                const DateString = new Date().toUTCString()
                const DateArray = DateString.split(' ')
        
                DateArray.pop()
                DateArray.shift()
                
                const Time = DateArray.pop()
        
                return `${DateArray.join('')}`
            }
        
            // File name
            // const today = new Date().toISOString().split('T')[0].split('-').join('');
            downloadLink.download = `${Title} - ${DateTimeStr()}.csv`;
        
            // We have to create a link to the file
            downloadLink.href = window.URL.createObjectURL(csvFile);
        
            // Make sure that the link is not displayed
            downloadLink.style.display = 'none';
        
            // Add the link to your DOM
            document.body.appendChild(downloadLink);
        
            // Lanzamos
            downloadLink.click();
        }

        ExportToCSV('test', [Object.keys(excelData[0]).join(','), excelData.map(i => Object.values(i).join(',')).join("\n")].join("\n"))

        ExportToCSV('test2', [Object.keys(excelData[0]).join(','), excelData.map(function(i){
            const valueArray = Object.values(i);
            return valueArray.map(function(value){
                if (value.includes(',')) return `"${value}"`
                else return value;
            }).join(',');
        }).join("\n")].join("\n"))
        

    </script>
</body>
</html>
