
// import SharePointApi from '../Libraries/SharePointApi/src/SharePointApi.js';
import SPService from '../Libraries/SPService/src/SPService.js';
import '../../node_modules/pace-js/pace.js';
import '../Libraries/chart-js/dist/chart.umd.js';
import SetTheme from '../Actions/Theme.Set.js';
import { Title as ErrorListTitle } from '../Views/Errors/List.js';

const url = new URL(location);
const ServerRelativeUrl = url.searchParams.get('ServerRelativeUrl');

// dark mode
if (window.matchMedia 
&& window.matchMedia('(prefers-color-scheme: dark)').matches)
{
    const stylesheet = Array.from(document.querySelectorAll('link')).find(l => l.href.includes('dark.css'));
    if (stylesheet) stylesheet.removeAttribute('disabled');
}

// Forces page to load data from any site collection lists;
const SiteUrl = location.origin + ServerRelativeUrl;
const MonitorOptions = { interval: 20000 };
const SiteTitle = 'ErrorLog'; // The name of the HTML page;
const SharepointOptions = new Object({ // Options for first call to Sharepoint;
    $select: '*',
    $expand: 'Lists',
});

// CSS string;
const colorTheme = '/* SP-darkRed */' +
'.bg-SP-darkRed { background-color: rgb(110, 1, 56) !important; }' +
'.border-SP-darkRed { border-color: rgb(110, 1, 56)!important; }' +
'.text-SP-darkRed { color: rgb(110, 1, 56) !important; }' +
'li.dropdown:hover {' +
    'box-shadow: 10px 1rem 3rem rgba(0, 0, 0, 0.175) !important;' +
'}';

const SiteTheme = new Object({
    defaultColor: 'darkslategray',
    darkColor: 'darkgreen',
    primaryColor: 'royalblue',
    secondaryColor: 'aliceblue',
    darkHighlightColor: 'gold',
    lightHighlightColor: 'lightyellow'
});

let Web;
// const Route = new SharePointApi({
//     method: 'jQuery',
//     verbose: false
// });

const Route = new SPService({
    protocol: 'jQuery',
    // method: 'jQuery',
    verbose: false
});

// Sets site theme;
SetTheme(SiteTheme);

function getIconSource(item, link){
    
    // *NOTE: This object NEEDS to have these properties=> File, FieldValuesAsHtml, FieldValuesAsText
    
    const str = item.File.ServerRelativeUrl ? 
    item.File.ServerRelativeUrl.split('.')[1] : 
    '';

    link = '';

    const Icon_Legend = {
        0: '/_layouts/15/images/ic' + str + '.png?rev=23',
        1: '/_layouts/15/images/folder.gif?rev=23',
    }

    if (item.FieldValuesAsHtml.HTML_x005f_x0020_x005f_File_x005f_x0020_x005f_Type === '') link = Icon_Legend[item.FileSystemObjectType];
    else
    {
        console.warn('This item has a value.');
        console.info(item);
    }

    return link;
}

async function RenderErrorLog(list, options){

    // Define options for data;
    options = new Object({
        $select: '*',
        $top: list.ItemCount
    });

    // Get url for list items and make call to list;
    const url = list.Items.__deferred.uri
    const data = await Route.Get(url, options)
    .then(data => data.d);

    // Get the file name from the FileUrl property;
    data.results
    .forEach(item => {
        try
        {
            let array = item.FileUrl.split('/');
            item.FileName = array[array.length - 1];
        }
        catch(e)
        {
            // This catches null FileUrl values;
            item.FileName = item.URL ? item.URL : null;
            try
            {
                let array = item.FileName.split('/');
                item.FileName = array[array.length - 1];
            }
            catch(e)
            {
                // console.info(e);
            }
        }
    });

    Object.assign(list.Items, data);

    // This is where we send data to the Chart.js;

    function RenderChartFrame(){
        return $('main div._container').append(`
        <div class="row">
            <div class="col-lg-6 col-md-12 col-sm-12" style="" id="data-display">
                <canvas class="d-none" id="chart-area"></canvas>
            </div>
            <div class="col-lg-6 col-md-12 col-sm-12 p-0">
                <canvas id="canvas" style="width: auto;"></canvas>
            </div>
        </div>`);
    }

    function displayAllErrors(list){
        const data = list.Items.results
        list.Items.results.forEach((error, index) => $('span#app-title-count').text(index + 1))
        if(list.ItemCount === 0){
            $('div#data-display').append('<div class="text-danger fadeIn">This Application does not have any enteries for the error list.</div>')
        }
        // Filter results and get error count per file;
        let _filter = [... new Set(data.map(item => item.FileName))]
        _filter.forEach(file => {
            const results = data.filter(item => item.FileName === file)
        $('div#data-display').append('<div class="fadeIn">' + file + ' | Count: <span class="text-danger">' + results.length + '</span></div>')
            // console.info(results)
        })
    }
    
    // RenderChartFrame()
    // this.RenderChart(list)
    $(function(){

        let data = list.Items.results;

        // Basic Line Chart
        var MONTHS = [
            'January', 
            'February', 
            'March', 
            'April', 
            'May', 
            'June', 
            'July', 
            'August', 
            'September', 
            'October', 
            'November', 
            'December',
        ];

        function getMonthLegend(){
            const MONTH_LIMIT = 6
            const _month = new Date().getMonth()
            let legendArray = []
            function getMonth(monthIndex, MONTH_LIMIT, today){ return MONTHS[monthIndex - (MONTH_LIMIT - today)] }
            for(let i = 0; i <= MONTH_LIMIT; i ++){
                if(MONTHS[MONTH_LIMIT + _month + i]){
                    legendArray.push(MONTHS[MONTH_LIMIT + _month + i])
                }
                else{
                    legendArray.push(getMonth(i, MONTH_LIMIT, _month))
                }
            }
            return legendArray
        }
        
        function getDataStats(){
            return CurrentMonths.map(monthStr => {
                let monthFilter = MONTHS.findIndex(month => month === monthStr)
                let result = data.filter(error => {
                    const itemDate = new Date(error.Created)
                    return itemDate.getMonth() === monthFilter && itemDate.getFullYear === new Date().getFullYear
                })
                // console.info(results)
                return result.length
            })
        }
        
        let CurrentMonths = getMonthLegend()
        var config = {
            type: 'bar',
            data: {
                labels: CurrentMonths,
                datasets: [{
                    label: 'Monthly Error Count',
                    backgroundColor: window.chartColors.red,
                    borderColor: window.chartColors.red,
                    data: getDataStats(),
                    fill: false,
                }
            ]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: Web.Title + ' Error Log'
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                scales: {
                    x: {
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Month'
                        }
                    },
                    y: {
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Value'
                        }
                    }
                },
                onResize: function(){
                    // window.myLine.update();
                }
            }
        };
        var ctx = document.getElementById('canvas').getContext('2d');
        window.myBarGraph = new Chart(ctx, config);
        window.myBarGraph.update();
        
    })

    function displayAllErrors(list){

        const data = list.Items.results;
        
        list.Items.results.forEach((error, index) => $('span#app-title-count').text(index + 1));
        
        if (list.ItemCount === 0) $('div#data-display')
        .append('<div class="text-danger fadeIn">This Application does not have any enteries for the error list.</div>')
        
        // Filter results and get error count per file;
        let _filter = [... new Set(data.map(item => item.FileName))];
        _filter.forEach(file => {
            const results = data.filter(item => item.FileName === file)
        $('div#data-display')
        .append('<div class="fadeIn">' + file + ' | Count: <span class="text-danger">' + results.length + '</span></div>')
            // console.info(results)
        });
    }

    displayAllErrors(list);
    // this.Monitor(list)
    return data.results;
}

async function init(){

    window.chartColors = {
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(54, 162, 235)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(201, 203, 207)'
    };

    $(document.querySelector('span[data-web-title]')).hide();
    
    Web = ServerRelativeUrl ? 
    await Route.getWeb(SharepointOptions, SiteUrl) : 
    await Route.getWeb(SharepointOptions);
    
    // loadContent(Web);
    $('head title').text(`Error Log - ${Web.Title}`);
    $(document.createElement('style')).text(colorTheme).appendTo('head');

    $('head')
    .append(/*html*/`
    <link rel="shortcut icon" 
            href="/_layouts/15/images/favicon.ico?rev=23" 
            type="image/vnd.microsoft.icon" 
            id="favicon" 
    />`);
    
    $(document.querySelector('span[data-web-title]')).text(Web.Title).fadeIn();
    $(document.querySelector('[data-container]'))
    .prepend(/*html*/`
    <h1 class="display-4">${Web.Title}</h1>
    <p>Monitor and manage error log data.</p>`);
    
    if (Web.getListDetails(ErrorListTitle)) RenderErrorLog(Web.getListDetails(ErrorListTitle));

}

window.onload = init;