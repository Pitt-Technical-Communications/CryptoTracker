var allCoinList = [];

/*
    Call CoinGecko API. The call is async so we return a promise stating the value will be returned upon function completion
    @Param url: API url to access
    @Return: JSON response from API
*/
const coinAPICall = async (url) =>
{
    const response = await (await fetch(url, {method: 'GET', mode: 'cors'})).json();
    return response;
}

/*
    Gets all coins currenly being tracked by CoinGecko and outputs them in a dictionary.
    Might be useful for later
*/
async function getCoins()
{
    //API access URL
    const listURL='https://api.coingecko.com/api/v3/coins/list';
    const coinData = await coinAPICall(listURL);
    //Insert data into a dicitonary
    for (var i = 0; i < coinData.length; i++)
    {
        allCoinList.push(coinData[i].id);
    }
}

/*
    Displays the coin on the current page
    @Param data: JSON data of the current coin
*/
const setHomeCoin = async (data) =>
{
    //Get coin ID
    coinID = data['id'];
    //Get coin name
    coinName = data['name'];
    //Get the current price, image, ticker, and percent change from the coin's JSON data
    coinPrice = data['current_price'];
    coinIMG = data['image'];
    coinTicker = data['symbol'].toUpperCase();
    coinStatus = data['price_change_percentage_7d_in_currency'].toFixed(2);
    coinMarketData = data['sparkline_in_7d']['price'];
    
    //Create container div for the coin
    const coinDiv = document.createElement('div');

    //Populate div with elements
    //Coin image
    divImg = document.createElement('img');
    divImg.src = coinIMG;
    divImg.classList.add('coin-img');
    //Header with coin name, ticker, and a link to the separate page
    divName = document.createElement('h1');
    divName.innerHTML = '<a class="coin-header" href="coin.html?id=' + coinID + '">' + coinName + ' (' + coinTicker + ')' + '</a>';
    //Price text
    divPrice = document.createElement('p');
    divPrice.innerHTML = coinPrice;
    divPrice.classList.add('Prices');
    //Favorite star
    divStar = document.createElement('button');
    divStar.classList.add('iconify');
    divStar.setAttribute('data-icon', "dashicons:star-empty");
    divStar.addEventListener("click", addCookie());
    divStar.setAttribute('data-inline', "false");
    //Percent change text
    divChange= document.createElement('p');
    divChange.classList.add('Changes');
    //Add elements to parent div
    coinDiv.appendChild(divImg);
    coinDiv.appendChild(divName);
    coinDiv.appendChild(divPrice);
    coinDiv.appendChild(divChange);
    coinDiv.appendChild(divStar);
    //Create a div and canvas element for the graphs
    chartDiv = document.createElement('div');
    currChart = document.createElement('canvas');
    currChart.classList.add('chart');
    currChart.style.width = "300px";
    currChart.style.height = "300px";
    chartDiv.appendChild(currChart);
    coinDiv.appendChild(chartDiv);


    //Add the created div to the coin container
    document.getElementById('coin-container').appendChild(coinDiv);

    if(coinStatus.charAt(0) == '-')
    {
        //color red if lost value
        divChange.style.color = 'red';
        divChange.innerHTML = coinStatus + '%';
        makeChart(coinMarketData, currChart, 'red');
    }
    else
    {
        //color green if gained value
        divChange.style.color = 'green';
        divChange.innerHTML = '+' + coinStatus + '%';
        makeChart(coinMarketData, currChart, 'green');
    }
    
    return coinDiv; 
}

/*
    Initialize all boxes on the home page with data
    @Param coinList: List of coin IDS to get data for
*/
async function initCoins(coinList, cssClass)
{
    //TODO: Populate dictionary with coins to showcase

    //Put all elements in the array into 1 string with the below substring between them
    var urlStr = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=' + coinList.join('%2C%20') + 
        '&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d%2C14d%2C30d%2C1y';
        
    console.log(urlStr);

    resp = await coinAPICall(urlStr);
    for (var i = 0; i < resp.length; i++)
    {
        //Display data for every coin and set an interval for them
        coinDiv = await setHomeCoin(resp[i]);
        coinDiv.classList.add(cssClass);
    }
    setInterval(refreshCoinData, 10000, urlStr);

}

/*
    Refreshes the data for each coin currently on the screen
*/
async function refreshCoinData(url)
{
    //Get new data on all of the current coins
    var resp = await coinAPICall(url);

    //Loop through all current coin boxes on the page
    var boxes = document.getElementsByClassName('coin-box')
    for(var i = 0; i < boxes.length; i++)
    {
        coinJSON = resp[i];
        //Get data that needs to update: price, %change, and the graph
        const currBox = boxes[i];
        const boxChildren = currBox.childNodes;
        console.log(boxChildren);
        const coinName = boxChildren[1].innerHTML.match(/(?<=id=\s*).*?(?=\s*">)/gs);
        const boxPrice = boxChildren[2];
        const boxChange = boxChildren[3];
        const chartDiv = boxChildren[5];

        var coinMarketData = coinJSON['sparkline_in_7d']['price'];
        chart = chartDiv.getElementsByClassName('chart')[0];
        const newCoinPrice = coinJSON['current_price'];
        const newCoinChange = coinJSON['price_change_percentage_7d'].toFixed(2);
        boxPrice.innerHTML = newCoinPrice;

        console.log(chartDiv);

        if(newCoinChange.charAt(0) == '-')
        {
            //color red if lost value
            boxChange.style.color = 'red';
            boxChange.innerHTML = newCoinChange + '%';
            makeChart(coinMarketData, chart, 'red');
        }
        else
        {
            //color green if gained value
            boxChange.style.color = 'green';
            boxChange.innerHTML = '+' + newCoinChange + '%';
            makeChart(coinMarketData, chart, 'green');
        } 
    }
}

/*
    Displays the coin on the single coin page
    @Param data: JSON data of the current coin
*/
const setSingleCoin = async (data, moreData) =>
{
     //Get coin ID
     coinID = data['id'];
     //Get coin name
     coinName = data['name'];
     //Get the current price, image, ticker, and percent change from the coin's JSON data
     coinPrice = data['current_price'];
     coinIMG = data['image'];
     coinTicker = data['symbol'].toUpperCase();
    
    coinMc = data['market_cap'];        // could be 0
    coinMcRank = data['market_cap_rank'];   // could be null
    coinTotalVol = data['total_volume'];
    coinHigh = data['high_24h'];
    coinLow = data['low_24h'];

    coinStatus = {}
    if (data['price_change_percentage_1h_in_currency']!=null)
        coinStatus['1h'] =  data['price_change_percentage_1h_in_currency'].toFixed(2);
    if (data['price_change_percentage_24h_in_currency']!=null)
        coinStatus['24h'] =  data['price_change_percentage_24h_in_currency'].toFixed(2);
    if (data['price_change_percentage_7d_in_currency']!=null)
        coinStatus['7d'] =  data['price_change_percentage_7d_in_currency'].toFixed(2);
    if (data['price_change_percentage_14d_in_currency']!=null)
        coinStatus['14d'] =  data['price_change_percentage_14d_in_currency'].toFixed(2);
    if (data['price_change_percentage_30d_in_currency']!=null)
        coinStatus['30d'] =  data['price_change_percentage_30d_in_currency'].toFixed(2);
    if (data['price_change_percentage_1y_in_currency']!=null)
        coinStatus['1y'] =  data['price_change_percentage_1y_in_currency'].toFixed(2);

    coinDesc = moreData['description']['en'];


    coinMarketData = data['sparkline_in_7d']['price'];
     
     //Create container div for the coin
     const coinDiv = document.createElement('div');
 
     //Populate div with elements
     //Coin image
     divImg = document.createElement('img');
     divImg.src = coinIMG;
     divImg.classList.add('coin-img');
     //Header with coin name, ticker, and a link to the separate page
     divName = document.createElement('h1');
     divName.innerHTML = '<a class="coin-header" href="coin.html?id=' + coinID + '">' + coinName + ' (' + coinTicker + ')' + '</a>';
     //Price text
     divPrice = document.createElement('p');
     divPrice.innerHTML = coinPrice;
     divPrice.classList.add('Prices');
     //Favorite star
     divStar = document.createElement('button');
     divStar.classList.add('iconify');
     divStar.setAttribute('data-icon', "dashicons:star-empty");
     divStar.addEventListener("click", addCookie());
     divStar.setAttribute('data-inline', "false");
     //Percent change text
     divChange = document.createElement('p');
     divChange.classList.add('Changes');
     //Add elements to parent div
     coinDiv.appendChild(divImg);
     coinDiv.appendChild(divName);
     coinDiv.appendChild(divPrice);
     coinDiv.appendChild(divChange);
     coinDiv.appendChild(divStar);
     //Create a div and canvas element for the graphs
     chartDiv = document.createElement('div');
     currChart = document.createElement('canvas');
     currChart.classList.add('chart');
     currChart.style.width = "400px";
     currChart.style.height = "300px";
     chartDiv.appendChild(currChart);
     coinDiv.appendChild(chartDiv);

     const table  = document.createElement('table');
     const tableLabels = document.createElement('tr');
     for (var key in coinStatus)
     {  
        divStatus = document.createElement('th');
        divStatus.classList.add('price-table-single');
        divStatus.innerHTML = key;
        tableLabels.appendChild(divStatus);
     }
     table.appendChild(tableLabels);

     const tableData = document.createElement('tr');
     for (var key in coinStatus)
     {  
        divStatus = document.createElement('th');
        divStatus.classList.add('price-table-single');
        tableData.appendChild(divStatus);

        if(coinStatus[key].charAt(0) == '-')
        {
            divStatus.style.color = 'red'  
            divStatus.innerHTML = coinStatus[key] + '%';
        }
        else
        {
            divStatus.style.color = 'green'  
            divStatus.innerHTML = '+' + coinStatus[key] + '%';
        }
     }
     table.appendChild(tableData);
     coinDiv.appendChild(table);

    if (coinDesc!=''){
        divDesc = document.createElement('p');
        divDesc.innerHTML = coinDesc;
        divDesc.classList.add('coin-desc-single');
        coinDiv.appendChild(divDesc);
    }

     document.getElementById('coin-container').appendChild(coinDiv);
 
     if(coinStatus['7d'].charAt(0) == '-')
     {
         //color red if lost value
         divChange.style.color = 'red';
         divChange.innerHTML = coinStatus['7d'] + '%';
         makeChart(coinMarketData, currChart, 'red');
     }
     else
     {
         //color green if gained value
         divChange.style.color = 'green';
         divChange.innerHTML = '+' + coinStatus['7d'] + '%';
         makeChart(coinMarketData, currChart, 'green');
     }
     return coinDiv;
}
/*
    Initialize coin on the single coin page
*/
async function initSingleCoin()
{
    var url = window.location.href;
    var id = [url.substring(url.indexOf("?id=") + 4)];

    var urlStr1 = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=' + id + 
        '&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d%2C14d%2C30d%2C1y';
        
    var urlStr2 = 'https://api.coingecko.com/api/v3/coins/' + id + '?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false';

    // console.log(urlStr);
    resp1 = await coinAPICall(urlStr1);
    resp2 = await coinAPICall(urlStr2);

    coinDiv = await setSingleCoin(resp1[0], resp2);
    coinDiv.classList.add('coin-box-single');
}

/*
    gathers historical data and calls chart() to graph recent 24 vol and prices.
    @Param coin: Coin ID to get graph for
    @Param chart: Chart to create/update
    @Param color: Color of graph
*/
const makeChart = async (coinData, chart, color) =>
{
    labels = [];
    for (var i = 0; i < coinData.length; i++)
        labels[i] = '';
    
    new Chart(chart, {
        type: 'line',
        data: {
          labels: labels,
            datasets: [{
                data: coinData,
                label: "price",
                borderColor: color,
                pointRadius: 0,
                pointBorderColor: 'none',
                fill: false
            }]

        }
    });
}

function addCookie(coin)
{
  if (coin == undefined) {
    return;
  }
  var num_cookies = document.cookie.split(";").length;
  if (document.cookie != "") {
    num_cookies += 1
  }
  document.cookie = num_cookies + "=" + coin;
}

function loadCookies()
{
    userCoins = document.cookie;
    console.log(userCoins);
    if(userCoins.length == 0)
    {
        noPins = document.createElement('h1');
        noPins.innerHTML = "You haven't favorited any coins yet.";
        document.getElementById('main').appendChild(noPins);
        numCookies = 0;
        return;
    }
    else
    {
        var cookies = document.cookie.split(";");
        var pinnedCoins = [];

        for(let i = 1; i <= cookies.length; i++) {
          var id = cookies[i - 1].split("=")[1];
          pinnedCoins.push(id);
        }
        initCoins(pinnedCoins);
    }
}

function addPin() {
  var id = document.getElementById("pin_input").value;
  addCookie(id);
  window.location.reload(true);
}

/* for debugging */
function deleteCookies() {
  var cookies = document.cookie.split(";");

  for(let i = 1; i <= cookies.length; i++) {
    document.cookie = cookies[i - 1] + ";max-age=0";
  }
  window.location.reload(true);
}

async function displayAllCoins()
{
    await getCoins();
    allCoinList = allCoinList.filter(e => !e.includes('-'));
    var urlStr = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=' + allCoinList.slice(0, 50).join('%2C%20') + '&order=market_cap_desc&per_page=250&page=1&sparkline=false';
    resp = await coinAPICall(urlStr);
    var table = document.createElement('table');
    table.style.width = "100%";
    table.setAttribute('border', '1');
    var tbdy = document.createElement('tbody');
    for(var i = 0; i < resp.length; i++)
    {
        var tr = document.createElement('tr');
        var td1 = document.createElement('td');
        td1.appendChild(document.createTextNode(resp[i].name));
        var td2 = document.createElement('td');
        td2.appendChild(document.createTextNode(resp[i].current_price));
        tr.appendChild(td1);
        tr.appendChild(td2);
        tbdy.appendChild(tr);

    }
    table.appendChild(tbdy);
    document.getElementById('coin-container').appendChild(table);
}