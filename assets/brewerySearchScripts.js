var searchResults = new Map([]);
//var SEARCH_PARAMS;
function loadInsearchResults(){
    //SEARCH_PARAMS = SEARCH_PARAMS;
    if(SEARCH_PARAMS == undefined){
        location.href='#appNavigation/searchNav'
        return;
    }
    if(SEARCH_PARAMS.Name){
        var request = new XMLHttpRequest()
        // Open a new connection, using the GET request on the URL endpoint
        request.open('GET', 'https://mb1zattts4.execute-api.us-east-1.amazonaws.com/dev/brewerySearch/' + SEARCH_PARAMS.Name, true)
        
        request.onload = function () {
          var data = JSON.parse(this.response)
          if (request.status >= 200 && request.status < 400) {
            searchStatement.innerText = 'Breweries with the phrase: "' + SEARCH_PARAMS["Name"] + '"';
            data.forEach((brewery) => {
              searchResults.set(brewery.UniqueID, brewery);
              //Breweries.set(brewery.UniqueID, brewery);
            })
            createSearchBlocks(searchResults, seachResultsHolder);
          } else {
            searchStatement.innerHTML = '<Strong>Search for "' + SEARCH_PARAMS["Name"] + '" failed...</Strong>';
          }
        }
        // Send request
        request.send()
    } else {
        var radius = SEARCH_PARAMS.Radius;
        console.log(SEARCH_PARAMS);
        var filterCount = 0;
        var filters = "";
        var data = {};
        if(SEARCH_PARAMS['Crawlable'] == true) {
           data['crawlable'] = true;
           if(filterCount > 0){
            filters += ", Crawlable";
           } else {
               filters += "Crawlable";
               filterCount++;
            }
        }
        if(SEARCH_PARAMS['FamilyFriendly'] == true){ 
            data['familyFriendly'] = true;
            if(filterCount > 0){
                filters += ", Family Friendly";
            } else {
                filters += "Family Friendly";
                filterCount++;
             }
        }
        if(SEARCH_PARAMS['DogFriendly'] == true){
          data['dogFriendly'] = true;
          if(filterCount > 0){
            filters += ", Dog Friendly";
           } else {
            filters += "Dog Friendly";
            filterCount++;
            }  
        } 
        if(SEARCH_PARAMS['InHouseKitchen'] == true){
           data['inHouseKitchen'] = true;
           if(filterCount > 0){
            filters += ", In House Kitchen";
           } else {
            filters += "In House Kitchen";
            filterCount++;
            }
        } 
        if(SEARCH_PARAMS['OutdoorSeating'] == true){
            data['outdoorSeating'] = true;
            if(filterCount > 0){
                filters += ", Outdoor Seating";
            } else {
                filters += "Outdoor Seating";
                filterCount++;
            }
        }
        var request = new XMLHttpRequest();
        
        // Open a new connection, using the GET request on the URL endpoint
        request.open('POST', 'https://mb1zattts4.execute-api.us-east-1.amazonaws.com/dev/breweryByFilter', true);
        request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
        request.onload = function () {
            var res = JSON.parse(this.response);
            console.log(data, typeof data);
            if (request.status >= 200 && request.status < 400) {
                searchStatement.innerText = filters + " within " + SEARCH_PARAMS["Radius"] + " miles";
                searchResults.clear();
                res.forEach((brewery) => {
                    if(calcCrow(SEARCH_PARAMS["Location"].lat, SEARCH_PARAMS["Location"].lng, brewery.Latitude, brewery.Longitude) <= radius){
                        searchResults.set(brewery.UniqueID, brewery);
                    }
                    //Breweries.set(brewery.UniqueID, brewery);
                })
                createSearchBlocks(searchResults, seachResultsHolder);
            } else {
                searchStatement.innerHTML = "<Strong>Search failed....</Strong>";
            }
        }
        // Send request
        request.send(JSON.stringify(data))
    }
}
//loadInsearchResults();
function openSearchBrewery(UniqueID){
    var currentBrewery = searchResults.get(Number(UniqueID));
    sessionStorage.setItem("currentBrewery", JSON.stringify(currentBrewery));
    //window.location.pathname = './breweryProfile.html';
    location.href='#openBrewery/'+Number(UniqueID)
  }
function createSearchBreweryBlock(brewery, location){
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
    var distance = calcCrow(SEARCH_PARAMS["Location"].lat, SEARCH_PARAMS["Location"].lng, brewery.Latitude, brewery.Longitude).toFixed(1) + " miles";
    div.innerHTML = div.innerHTML
        .replace(/{Brewery}/g, brewery.Brewery)
        .replace(/{Location}/g, distance)
        .replace(/src=""/g, 'src="' + image + '"');

    // Write the <div> to the HTML container
    //console.log(brewery);
    location.appendChild(div);
}

function createSearchBlocks(mapList, location){
    location.innerHTML = "";
    mapList.forEach((brewery,keys) => {
        createSearchBreweryBlock(brewery, location);
    })
}