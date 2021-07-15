function createBreweryBlock(brewery, location){
    var div = document.createElement('div');
    div.setAttribute('class', 'col-6 no-gutters');
    div.setAttribute('id', brewery.UniqueID);
    div.onclick = function() {openBrewery(this.id)};
    div.innerHTML = document.getElementById('breweryCardTemplate').innerHTML;

    // You could optionally even do a little bit of string templating
    var image = ""
    if(typeof brewery.Image !== 'undefined'){
        image = brewery.Image[0];
    } else {
        image = "./assets/images/quenchedwithbg.png";
    }
    var distance;
    if(typeof currentUserLoc !== 'undefined'){
        distance = calcCrow(currentUserLoc.lat, currentUserLoc.lng, brewery.Latitude, brewery.Longitude).toFixed(1) + " miles";
    } else {
        distance = "";
    }
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
function createBlocksFromMarkers(listMarkers, location){
    location.innerHTML = "";
    var toDisplay = [];
    for (var i = 0; i < listMarkers.length; i++){
        var obj = listMarkers[i];
        if(obj.marker.visible){
            toDisplay.push(obj.json);
            //createBreweryBlock(obj.json, location);
        };
    }
    console.log(toDisplay);
    toDisplay.sort((a,b)=>{
        return calcCrow(a.Latitude, a.Longitude, currentUserLoc.lat, currentUserLoc.lng) > calcCrow(b.Latitude, b.Longitude, currentUserLoc.lat, currentUserLoc.lng) ? 1 : -1;
    })
    console.log(toDisplay);
    for (var i = 0; i < toDisplay.length; i++){
        var obj = toDisplay[i];
        createBreweryBlock(obj, location);
    }
}