var searchResults = new Map([]);
var searchParams;
function loadInsearchResults(){
    searchParams = JSON.parse(sessionStorage.getItem("currentSearch"));
    console.log(searchParams);
    if(searchParams.Name){
        var request = new XMLHttpRequest()
        // Open a new connection, using the GET request on the URL endpoint
        request.open('GET', 'https://mb1zattts4.execute-api.us-east-1.amazonaws.com/dev/brewerySearch/' + searchParams.Name, true)
        
        request.onload = function () {
          var data = JSON.parse(this.response)
          console.log(data);
          if (request.status >= 200 && request.status < 400) {
            searchStatement.innerText = 'Breweries with the phrase: "' + searchParams["Name"] + '"';
            data.forEach((brewery) => {
              searchResults.set(brewery.UniqueID, brewery);
              //Breweries.set(brewery.UniqueID, brewery);
            })
            createBlocks(searchResults, seachResultsHolder);
          } else {
            searchStatement.innerHTML = '<Strong>Search for "' + searchParams["Name"] + '" failed...</Strong>';
            console.log('error')
          }
        }
        // Send request
        request.send()
    } else {
        var radius = searchParams.Radius;
        var data = {};
        if(searchParams['Crawlable'] == true) data['crawlable'] = true;
        if(searchParams['FamilyFriendly'] == true) data['familyFriendly'] = true;
        if(searchParams['DogFriendly'] == true) data['dogFriendly'] = true;
        if(searchParams['InHouseKitchen'] == true) data['inHouseKitchen'] = true;
        if(searchParams['OutdoorSeating'] == true) data['outdoorSeating'] = true;
        var request = new XMLHttpRequest()
        
        // Open a new connection, using the GET request on the URL endpoint
        request.open('POST', 'https://mb1zattts4.execute-api.us-east-1.amazonaws.com/dev/breweryByFilter', true)
        request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
        request.onload = function () {
            var data = JSON.parse(this.response)
            console.log(data);
            if (request.status >= 200 && request.status < 400) {
                var filters = "";
                data.foreach(key => {
                    filters += key + ", ";
                })
                searchStatement.innerText = "Breweries with the filters: " + filters + " within " + searchParams["Radius"] + " miles";
                data.forEach((brewery) => {
                    console.log(searchParams["Location"].lat, searchParams["Location"].lng, brewery.Latitude, brewery.Longitude, radius)
                    if(calcCrow(searchParams["Location"].lat, searchParams["Location"].lng, brewery.Latitude, brewery.Longitude) <= radius){
                        searchResults.set(brewery.UniqueID, brewery);
                    }
                    //Breweries.set(brewery.UniqueID, brewery);
                })
                createBlocks(searchResults, seachResultsHolder);
            } else {
                searchStatement.innerHTML = "<Strong>Search failed....</Strong>";
                console.log('error')
            }
        }
        // Send request
        console.log(JSON.stringify(data));
        request.send(JSON.stringify(data))
    }
}
loadInsearchResults();
function openSearchBrewery(UniqueID){
    var currentBrewery = searchResults.get(Number(UniqueID));
    sessionStorage.setItem("currentBrewery", JSON.stringify(currentBrewery));
    console.log(currentBrewery);
    window.location.pathname = './breweryProfile.html';
  }
function createBreweryBlock(brewery, location){
    var div = document.createElement('div');
    div.setAttribute('class', 'col-6 no-gutters');
    div.setAttribute('id', brewery.UniqueID);
    div.onclick = function() {openSearchBrewery(this.id)};
    div.innerHTML = document.getElementById('breweryCardTemplate').innerHTML;

    // You could optionally even do a little bit of string templating
    var image = ""
    if(typeof brewery.Image !== 'undefined'){
        image = brewery.Image[0];
    } else {
        image = "./assets/images/quenchedwithbg.png";
    }
    var distance = calcCrow(searchParams["Location"].lat, searchParams["Location"].lng, brewery.Latitude, brewery.Longitude).toFixed(1) + " miles";
    div.innerHTML = div.innerHTML
        .replace(/{Brewery}/g, brewery.Brewery)
        .replace(/{Location}/g, distance)
        .replace(/{imageUrl}/g, image);

    // Write the <div> to the HTML container
    //console.log(brewery);
    location.appendChild(div);
}

function createBlocks(mapList, location){
    mapList.forEach((brewery,keys) => {
        createBreweryBlock(brewery, location);
    })
}