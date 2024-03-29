var Favorites = new Map([]);
var favsUpToDate = false;

function toggleSearchOption(tab){
    document.getElementById("filterSearch").classList.remove("activeSearchNav");
    document.getElementById("namefilterSearch").classList.remove("activeSearchNav");
    document.getElementById("filterSearchSelected").classList.remove("active");
    document.getElementById("namefilterSearchSelected").classList.remove("active");
    document.getElementById("searchWithFilterTab").style.display = "none";
    document.getElementById("searchByNameTab").style.display = "none";
    switch(tab.id){
      case "filterSearch":
        document.getElementById(tab.id).classList.add("activeSearchNav");
        document.getElementById("filterSearchSelected").classList.add("active");
        document.getElementById("searchWithFilterTab").style.display = "block";
        break;
      case "namefilterSearch":
        //loadInFavorites(null);
        document.getElementById(tab.id).classList.add("activeSearchNav");
        document.getElementById("namefilterSearchSelected").classList.add("active");
        document.getElementById("searchByNameTab").style.display = "block";
        break;
      default:
        break;
    }
}

function loadInFavorites(){
  console.log("loadinFavs");
if(favsUpToDate || User == undefined){
    return;
}
id = User["email"];
if(id == "" || id == undefined) return;
var request = new XMLHttpRequest()
// Open a new connection, using the GET request on the URL endpoint
request.open('GET', 'https://mb1zattts4.execute-api.us-east-1.amazonaws.com/dev/favorites/'+id, true)

request.onload = function () {
  var data = JSON.parse(this.response)
  console.log(data);
  if (request.status >= 200 && request.status < 400) {
    data.forEach((brewery) => {
      Favorites.set(brewery.UniqueID, brewery);
      Breweries.set(brewery.UniqueID, brewery);
    })
    createBlocks(Favorites, searchListBreweries);
    favsUpToDate = true;
  } else {
    console.log('error')
  }
}
// Send request
request.send()
}
var searchCrawable = {val: false};
var searchFamilyFriendly = {val: false};
var searchDogFriendly = {val: false};
var searchInHouseKitchen = {val: false};
var searchOutdoorSeating = {val: false};
var radius = 25;
function toggleSearchFilter(field, btn){
    field.val = !field.val;
    if(field.val){
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
    filterPins();
  }
var SEARCH_PARAMS;
function openSearchByFilter(){
  var params = {};
  params["Crawlable"] = searchCrawable.val;
  params["FamilyFriendly"] = searchFamilyFriendly.val;
  params["DogFriendly"] = searchDogFriendly.val;
  params["InHouseKitchen"] = searchInHouseKitchen.val;
  params["OutdoorSeating"] = searchOutdoorSeating.val;
  params["Radius"] = radius;
  params["Location"] = currentUserLoc;
  SEARCH_PARAMS = params;
  location.href='#search/'+this.id
}
function openSearchByName(searchName){
  if(BreweryNamesList.has(searchName)){
    location.href='#openBrewery/' + BreweryNamesList.get(searchName).UniqueID;
    return;
  }
  if(searchName == "" && searchName.length > 1 ) return;
  var params = {};
  params["Name"] = searchName;
  params["Location"] = currentUserLoc;
  //sessionStorage.setItem("currentSearch", JSON.stringify(params));
  //var url = './brewerySearch.html';
  SEARCH_PARAMS = params;
  location.href='#search/'+searchName
}