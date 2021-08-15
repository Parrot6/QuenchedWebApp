function closeMenuAndGoTo(query) {
  document.querySelector('#hero-menu').classList.toggle('ft-menu--js-show')
  setTimeout(() => {
    const element = document.querySelector(query)
    window.scrollTo({
      top: element.getBoundingClientRect().top,
      behavior: 'smooth'
    })
  }, 250);
}

  let stateHashMap = new Map([
    ["Alabama","AL"],
        ["Alaska","AK"],
        ["Alberta","AB"],
        ["American Samoa","AS"],
        ["Arizona","AZ"],
        ["Arkansas","AR"],
        ["Armed Forces (AE)","AE"],
        ["Armed Forces Americas","AA"],
        ["Armed Forces Pacific","AP"],
        ["British Columbia","BC"],
        ["California","CA"],
        ["Colorado","CO"],
        ["Connecticut","CT"],
        ["Delaware","DE"],
        ["District Of Columbia","DC"],
        ["Florida","FL"],
        ["Georgia","GA"],
        ["Guam","GU"],
        ["Hawaii","HI"],
        ["Idaho","ID"],
        ["Illinois","IL"],
        ["Indiana","IN"],
        ["Iowa","IA"],
        ["Kansas","KS"],
        ["Kentucky","KY"],
        ["Louisiana","LA"],
        ["Maine","ME"],
        ["Manitoba","MB"],
        ["Maryland","MD"],
        ["Massachusetts","MA"],
        ["Michigan","MI"],
        ["Minnesota","MN"],
        ["Mississippi","MS"],
        ["Missouri","MO"],
        ["Montana","MT"],
        ["Nebraska","NE"],
        ["Nevada","NV"],
        ["New Brunswick","NB"],
        ["New Hampshire","NH"],
        ["New Jersey","NJ"],
        ["New Mexico","NM"],
        ["New York","NY"],
        ["Newfoundland","NF"],
        ["North Carolina","NC"],
        ["North Dakota","ND"],
        ["Northwest Territories","NT"],
        ["Nova Scotia","NS"],
        ["Nunavut","NU"],
        ["Ohio","OH"],
        ["Oklahoma","OK"],
        ["Ontario","ON"],
        ["Oregon","OR"],
        ["Pennsylvania","PA"],
        ["Prince Edward Island","PE"],
        ["Puerto Rico","PR"],
        ["Quebec","PQ"],
        ["Rhode Island","RI"],
        ["Saskatchewan","SK"],
        ["South Carolina","SC"],
        ["South Dakota","SD"],
        ["Tennessee","TN"],
        ["Texas","TX"],
        ["Utah","UT"],
        ["Vermont","VT"],
        ["Virgin Islands","VI"],
        ["Virginia","VA"],
        ["Washington","WA"],
        ["West Virginia","WV"],
        ["Wisconsin","WI"],
        ["Wyoming","WY"],
        ["Yukon Territory","YT"],
  ]);
  var map;
  var infoWindow;
  let stateAlreadyLoadedHashMap = new Map([]);
  
  function showOptions() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  function hideOptions() {
    document.getElementById("myDropdown").classList.remove("show");
  }
  var currentUserLoc;
  function getUserLocation(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          currentUserLoc = pos;
        },
        () => {
          //thePos = null;
        }
      );
    } else {
      // Browser doesn't support Geolocation
      //thePos = null;
    }
  }
  function myMap() {
    var mapProp= {
      center:new google.maps.LatLng(32.8012595,-79.9459408),  
      zoom:12,
      fullscreenControl: false,
      mapTypeControl: false
    };
    currentUserLoc = {
      lat: 32.8012595,
      lng: -79.9459408,
    };
    map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
    infoWindow = new google.maps.InfoWindow();
      const locationButton = document.createElement("button");
      locationButton.textContent = "Go to Current Location";
      locationButton.classList.add("custom-map-control-button");
      locationButton.style.backgroundColor = "white";
      locationButton.style.font = "500 14px Roboto, Arial, sans-serif";
      locationButton.style.padding = "0px 5px";
      locationButton.style.height = "30px";
      locationButton.style.cursor = "pointer";
      locationButton.style.borderRadius = "3px";
      locationButton.style.marginTop = "10px"
      locationButton.style.marginRight = "10px"
      locationButton.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
      map.controls[google.maps.ControlPosition.TOP_RIGHT].push(locationButton);
      locationButton.addEventListener("click", () => {
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              currentUserLoc = pos;
              infoWindow.setPosition(pos);
              infoWindow.setContent("Your location");
              infoWindow.open(map);
              map.setCenter(pos);
              searchCurrentLocation(pos.lat, pos.lng);
            },
            () => {
              handleLocationError(true, infoWindow, map.getCenter());
            }
          );
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
      });
    loadInitialBreweries();
    locationButton.click();
    //loadPins('SC');
  }
  var markers = [];
  let Breweries = new Map([]);
  var crawable = {val: false};
  var familyFriendly = {val: false};
  var dogFriendly = {val: false};
  var inHouseKitchen = {val: false};
  var outdoorSeating = {val: false};
  function filterPins(){
    if(!crawable.val && !familyFriendly.val && !dogFriendly.val && !outdoorSeating.val && !inHouseKitchen.val){
      markers.forEach((item)=>{
        if(Number(filterDisance) > calcCrow(currentUserLoc.lat, currentUserLoc.lng, item.json.Latitude, item.json.Longitude) || Number(filterDisance) == -1){
          item.marker.setVisible(true);
        } else {
          item.marker.setVisible(false);
        }
      })
    } else {
      markers.forEach((item)=>{
        item.marker.setVisible(false);
        var add = false;
        var dontadd = false;
        if(Number(filterDisance) > calcCrow(currentUserLoc.lat, currentUserLoc.lng, item.json.Latitude, item.json.Longitude) || Number(filterDisance) == -1){
          if(familyFriendly.val){
            if(item.json['Family Friendly'] == 'TRUE') add = true;
            else dontadd = true;
          }
          if(dogFriendly.val){
            if(item.json['Dog Friendly'] == 'TRUE') add = true;
            else dontadd = true;
          }
          if(outdoorSeating.val){
            if(item.json['Outdoor Seating'] == 'TRUE') add = true;
            else dontadd = true;
          }        
          if(crawable.val){
            if(item.json.Crawable == 'TRUE') add = true;
            else dontadd = true;
          }
          if(inHouseKitchen.val){
            if(item.json['In House Kitchen'] == 'TRUE') add = true;
            else dontadd = true;
          }
        } else {
          dontadd = true;
        }
        if(dontadd){
          item.marker.setVisible(false);
        } else if(add){
          item.marker.setVisible(true);
        }
      })
    }
    updateMapListViewTiles();
  }
  var filterDisance = 25;
  function updateRadius(button){
    filterDisance = button.value;
    console.log(filterDisance);
    filterPins();
  }
  function toggle(field, btn){
    field.val = !field.val;
    if(field.val){
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
    filterPins();
  }
  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
  }

  function loadPins(state){
    var request = new XMLHttpRequest()
    if(stateAlreadyLoadedHashMap.has(state)){
      return;
    } else {
      stateAlreadyLoadedHashMap.set(state, true);
    }
    if(stateAlreadyLoadedHashMap.size == 1){
      markers.forEach((element) => {
        element.marker.setMap(null);
     });
      markers.length = 0;
    }
    // Open a new connection, using the GET request on the URL endpoint
    request.open('GET', 'https://mb1zattts4.execute-api.us-east-1.amazonaws.com/dev/breweryByState/'+state, true)

    request.onload = function () {
      // Begin accessing JSON data here
      
      var data = JSON.parse(this.response)
      if (request.status >= 200 && request.status < 400) {
        data.forEach((brewery) => {
          Breweries.set(brewery.UniqueID, brewery);
          const newloc = { lat: parseFloat(brewery.Latitude), lng: parseFloat(brewery.Longitude)};
          
          var filterablePin = {
            json: brewery,
            marker: new google.maps.Marker({
              position: newloc,
              map: map,
              title: brewery.Brewery,
              animation:google.maps.Animation.DROP
            })
          }
          google.maps.event.addListener(filterablePin.marker , 'click', function(){
              /*var infowindow = new google.maps.InfoWindow({
                content:'<Strong>'+brewery.Brewery+'</Strong></br><span>'+brewery.address+", "+brewery.City+"</span>",
                position: newloc,
              });
              infowindow.open(map);*/
              infoBelowMap(brewery);
              toggleBounce(filterablePin.marker);
          });
          markers.push(filterablePin);
        })
        filterPins();
      } else {
        console.log('error')
      }
    }

    // Send request
    request.send()
  }
  function toggleBounce(mark) {
    for (var j = 0; j < markers.length; j++) {
      markers[j].marker.setAnimation(null);
    }
    mark.setAnimation(google.maps.Animation.BOUNCE);
  }
  function searchCurrentLocation(lat, lon){
    var request = new XMLHttpRequest()
    const api = "https://nominatim.openstreetmap.org/reverse?lat=" + lat + "&lon=" + lon + "&zoom=16&format=json&addressdetails=1";
    // Open a new connection, using the GET request on the URL endpoint
    request.open('GET', api, true)

    request.onload = function () {
      var init = JSON.parse(this.response);
      const jso = init.address;
      const state = jso.state;
      var area = jso.town || jso.county || jso.postcode;
      updateLocationRadiusText(area, state);
      loadPins(stateHashMap.get(state))
    }

    request.send();
    
  }
  function updateLocationRadiusText(area, state){
    var els = document.getElementsByClassName("currentSearchArea");
    Array.prototype.forEach.call(els, function (el) {
      el.innerText = "Radius based on location: " + area + ", " + state;
    })
  }
  function loadInitialBreweries(){
    initialData.forEach((brewery) => {
      Breweries.set(brewery.UniqueID, brewery);
        const newloc = { lat: parseFloat(brewery.Latitude), lng: parseFloat(brewery.Longitude)};
        
        var filterablePin = {
          json: brewery,
          marker: new google.maps.Marker({
            position: newloc,
            map: map,
            title: brewery.Brewery,
            animation:google.maps.Animation.DROP
          })
        }
        google.maps.event.addListener(filterablePin.marker , 'click', function(){
            /*var infowindow = new google.maps.InfoWindow({
              content:'<Strong>'+brewery.Brewery+'</Strong></br><span>'+brewery.address+", "+brewery.City+"</span>",
              position: newloc,
            });
            infowindow.open(map);*/
            infoBelowMap(brewery);
            toggleBounce(filterablePin.marker);
        });
        markers.push(filterablePin);
      })
  }
  function isUndefined(val){
    if(val== undefined) return true;
    return false;
  }
  function validateText(str)
  {
      var tarea = str;
      if (!tarea.indexOf("http://") == 0 && !tarea.indexOf("https://") == 0) {
          return "https://"+tarea;
      }
      return str;
  }
  function toggleMapListView() {
    if(mapListView.style.display === "none"){
      listView.innerText = "MAP VIEW";
      googleMap.style.display = "none"
      mapListView.style.display = "block"
      updateMapListViewTiles();
    } else {
      listView.innerText = "LIST VIEW";
      googleMap.style.display = "block";
      mapListView.style.display = "none"; 
    }
  }
  function updateMapListViewTiles(){
    if(mapListView.style.display !== "block") return;
    createBlocksFromMarkers(markers, mapListBreweries);
    closeInfoContainer();
  }
  function toggleFilterContainer(filterBar){
    if(filterBar.style.display === "none"){
      filterBar.style.display = "block"
    } else {
      filterBar.style.display = "none"; 
    }
  }
  function closeInfoContainer() {
    pinInfoContainer.style.display = "none";
  }
  function infoBelowMap(breweryJson){
      UniqueID.innerText = breweryJson.UniqueID;
      pinInfoContainer.style.display = "block"
      Brewery.innerText = breweryJson.Brewery;
      Address.innerText = breweryJson.address + ", " + breweryJson.City + ", " + breweryJson.StateProvince;
      var str = "";
      if(!isUndefined(breweryJson.WebSite)){
        str = "<a href='" + validateText(breweryJson.WebSite) + "' target='_blank'>" + breweryJson.WebSite + '</a>';
      } else {
        str = "";
      }

      var strippedNum = "";
      var phoneHtml = ""
      if(breweryJson.phone_Number !== undefined && breweryJson.phone_Number !== 'undefined'){
        strippedNum = breweryJson.phone_Number.replace(/\D/g,'');
        phoneHtml = "Phone: <a href='tel:+1" + strippedNum + "'>"+breweryJson.phone_Number+"</a>"
      } else {
        phoneHtml = "Phone: Unlisted"
      }

      var phoneHtml = "Phone: <a href='tel:+1" + strippedNum + "'>"+breweryJson.phone_Number+"</a>"
      AddressExtra.innerHTML = phoneHtml;
      Website.innerHTML = str;
      //BreweryDesc.innerText = breweryJson.description;
      if(breweryJson.Image === undefined){
        breweryPic.src = "./assets/images/quenchedwithbg.png";
      } else {
        breweryPic.src = breweryJson.Image[0];
      }
      if(breweryJson['Crawable'] == 'TRUE'){
        infoCraPopup.style.display = "block";
      } else {
        infoCraPopup.style.display = "none";
      }
      if(breweryJson['Family Friendly'] == 'TRUE'){
        infoFamPopup.style.display = "block";
      } else {
        infoFamPopup.style.display = "none";
      }
      if(breweryJson['Dog Friendly'] == 'TRUE'){
        infoDogPopup.style.display = "block";
      } else {
        infoDogPopup.style.display = "none";
      }
      if(breweryJson['Outdoor Seating'] == 'TRUE'){
        infoOutPopup.style.display = "block";
      } else {
        infoOutPopup.style.display = "none";
      }
      if(breweryJson['In House Kitchen'] == 'TRUE'){
        infoInHPopup.style.display = "block";
      } else {
        infoInHPopup.style.display = "none";
      }
      // addressLat.innerText = breweryJson.Latitude;
      // addressLon.innerText = breweryJson.Longitude;
      // if(breweryJson.facebook !== undefined){
      //   breweryFacebook.href = breweryJson.facebook;
      //   breweryFacebook.style.display = "inline-block";
      // } else {
      //   breweryFacebook.style.display = "none";
      // }
      // if(breweryJson.instagram !== undefined){
      //   breweryInstagram.href = breweryJson.instagram;
      //   breweryInstagram.style.display = "inline-block";
      // } else {
      //   breweryInstagram.style.display = "none";
      // }
  }
  function doSearch(input){
    hideOptions();
    const query = input.value;
    const api = "https://nominatim.openstreetmap.org/search?countrycodes=us&q=" + query + "&limit=5&format=json&addressdetails=1";
    var request = new XMLHttpRequest()

    // Open a new connection, using the GET request on the URL endpoint
    request.open('GET', api, true)
    request.onload = function () {
      var init = JSON.parse(this.response)
      console.log(init)
      myDropdown.innerHTML = '';
      var divy = document.createElement('a');
      divy.innerText = "Cancel Search";
      myDropdown.appendChild(divy);
      divy.onclick = function(){cancelSearch()};
      init.forEach((result) => {
        var div = document.createElement('button');
        var area = result.address.town || result.address.county || result.address.postcode;
        div.innerText = result.display_name;
        myDropdown.appendChild(div);
        div.onclick = function(){loadResult(area, result.address.state, result.lat, result.lon)};
      });
      showOptions();
      /*var data = init['0']
      console.log(data);
      const lat = parseFloat(data.lat);
      const lon = parseFloat(data.lon);
      const jso = data["address"];
      const newLatLng = new google.maps.LatLng(lat, lon)
      map.setCenter(newLatLng);
      map.setZoom(9);
      const state = jso["state"];
      const stateAbbrev = stateHashMap.get(state);
      loadPins(stateAbbrev)*/
    }

    // Send request
    request.send()
  }
  function cancelSearch(){
    searchbox.value = "";
    hideOptions();
  }
  function loadResult(area, state, lat, lon){
      searchbox.value = "";
      showOptions()
      const newLatLng = new google.maps.LatLng(lat, lon)
      map.setCenter(newLatLng);
      map.setZoom(9);
      const stateAbbrev = stateHashMap.get(state);
      loadPins(stateAbbrev);
      currentUserLoc.lat = lat;
      currentUserLoc.lng = lon;
      updateLocationRadiusText(area, state);
  }
  function uberLink(){
    const lat = currentBrewery.Latitude;
    const lon = currentBrewery.Longitude;
    var link = "https://m.uber.com/ul/?client_id=rC3LeSNyncKuWq8O89OUCBdoUQWOo_SO&action=setPickup&dropoff[formatted_address]=" + currentBrewery.address + "&pickup=my_location&dropoff[latitude]="+lat+"&dropoff[longitude]="+ lon;
    console.log(link)
    window.open(
      link, "_blank");
  }
  function lyftLink(){
    const lat = currentBrewery.Latitude;
    const lon = currentBrewery.Longitude;
    var res = encodeURI(Brewery.innerText);
    var link = "https://lyft.com/ride?id=lyft&pickup[latitude]=null8&pickup[longitude]=null&partner=...&destination[latitude]="+lat+"&destination[longitude]="+lon;

    window.open(
      link, "_blank"); 
  }
  let initialData = [
{
    "Zip": "29401-2125",
    "Brewery": "Charleston Taproom and Beer Sanctuary",
    "City": "Charleston",
    "phone_Number": "(843) 853-4677",
    "BreweryType": "Planning",
    "StateProvince": "SC",
    "Longitude": "-79.9275509",
    "Latitude": "32.7784833",
    "address": "161 E Bay St",
    "UniqueID": 8647
},
{
    "Longitude": "-79.951104",
    "Latitude": "32.81812",
    "thursday_Hours": "3pm-9pm",
    "sunday_Hours": "1pm-8pm",
    "email": "info@munklebrewing.com",
    "Family Friendly": "TRUE",
    "tuesday_Hours": "3pm-9pm",
    "instagram": "https://www.instagram.com/munklebrewingco/",
    "wednesday_Hours": "3pm-9pm",
    "Crawable": "TRUE",
    "UniqueID": 8699,
    "Zip": "29405-9301",
    "facebook": "https://www.facebook.com/MunkleBrewingCo/",
    "Brewery": "Munkle Brewing Co",
    "City": "Charleston",
    "StateProvince": "SC",
    "saturday_Hours": "1pm-10pm",
    "monday_hours": "Closed",
    "address": "1513 Meeting Street Rd",
    "Outdoor Seating": "TRUE",
    "logo": "wix:image://v1/8b7ff5_53e30e625c2a4d0385d5a69967eca6b4~mv2.png/logo_edited.png#originWidth=960&originHeight=960",
    "Dog Friendly": "TRUE",
    "phone_Number": "(843) 789-3109",
    "BreweryType": "Micro",
    "Image": [
        "https://i.imgur.com/ipilp6Y.png",
        "https://i.imgur.com/0lHRLhJ.png",
        "https://i.imgur.com/41a7jpn.jpg",
        "https://i.imgur.com/MfGB80m.png"
    ],
    "In House Kitchen": "FALSE",
    "friday_Hours": "2pm-10pm",
    "description": "Munkle Brewing Company may be located in Charleston, but its soul is in Belgium. They are unabashedly all about brewing beer the way it has been done for centuries in Europe. This commitment paid off when they won a Gold Medal at the Great American Beer Festival for their Belgian Style Ale. The European feel goes beyond the beers you’ll find on tap. Their brewery and taproom in Charleston’s brewery district combines an old world vibe with modern sophistication. In addition to the comfortable taproom, Munkle has a great outdoor space with big comfortable chairs and a fire pit. If you’re looking for a comfortable, sophisticated brewery experience head over to Munkle for a great beer with a European flair.",
    "WebSite": "https://www.munklebrewing.com"
},
{
    "Longitude": "-79.9852493",
    "Latitude": "32.7816338",
    "thursday_Hours": "12pm-8pm",
    "sunday_Hours": "11am-6pm",
    "email": "adam@chsfermentory.com",
    "Family Friendly": "TRUE",
    "tuesday_Hours": "12pm-8pm",
    "instagram": "https://www.instagram.com/chsfermentory/",
    "wednesday_Hours": "12pm-8pm",
    "Crawable": "TRUE",
    "UniqueID": 8646,
    "Zip": "29407-7278",
    "facebook": "https://www.facebook.com/chsfermentory/",
    "Brewery": "Charles Towne Fermentory",
    "City": "Charleston",
    "StateProvince": "SC",
    "saturday_Hours": "10am-8pm",
    "monday_hours": "12pm-8pm",
    "address": "809 Savannah Hwy",
    "Outdoor Seating": "FALSE",
    "logo": "wix:image://v1/8b7ff5_f73f2dbb734b481f9dd508d867de1374~mv2.png/Charles%20Towne%20Fermentory%20logo%20small%202.pn#originWidth=300&originHeight=145",
    "Dog Friendly": "FALSE",
    "phone_Number": "(843) 641-0431",
    "BreweryType": "Taproom",
    "Image": [
        "https://i.imgur.com/oiq872C.jpg",
        "https://i.imgur.com/cH82tlb.jpg",
        "https://i.imgur.com/zRHKHOG.jpg",
        "https://i.imgur.com/3ec4Sy7.jpg"
    ],
    "In House Kitchen": "FALSE",
    "friday_Hours": "12pm-8pm",
    "description": "When you walk in through the front door or the big open garage door you’re instantly going to feel at home at the Charles Towne Fermentory. The vibe is that of a friendly neighborhood brewery within walking distance to a great selection of restaurants, bars and local shops. While there is a good selection of board and card games as well as two foosball tables the real take away for me is that it is the perfect place for a conversation while drinking some kick ass beer. If you are looking for a place to take a date, a friend, or a colleague, Charles Towne Fermentory is the place to go.  *Currently only offering to-go 4-packs, bottles, and crowlers.",
    "WebSite": "www.chsfermentory.com"
},
{
    "Longitude": "-80.0688239",
    "Latitude": "32.9255398",
    "thursday_Hours": "3pm-9pm",
    "sunday_Hours": "12pm-4pm",
    "Family Friendly": "TRUE",
    "tuesday_Hours": "3pm-7pm",
    "instagram": "https://www.instagram.com/snafubrewingcompany/",
    "wednesday_Hours": "3pm-7pm",
    "Crawable": "TRUE",
    "UniqueID": 8723,
    "Zip": "29418-8452",
    "facebook": "https://www.facebook.com/snafubrewingcompany/",
    "Brewery": "Snafu Brewing Co.",
    "City": "Charleston",
    "StateProvince": "SC",
    "saturday_Hours": "2pm-9pm",
    "monday_hours": "3pm-7pm",
    "address": "3280 Industry Dr",
    "Outdoor Seating": "TRUE",
    "logo": "wix:image://v1/8b7ff5_d53e6dd5551b4c7183ba97534364867d~mv2.png/logo%20transparent%20facebook.png#originWidth=576&originHeight=576",
    "Dog Friendly": "TRUE",
    "phone_Number": "(843) 767-4121",
    "BreweryType": "Micro",
    "Image": [
        "https://i.imgur.com/r7yyxUb.jpg",
        "https://i.imgur.com/DdvPICn.jpg",
        "https://i.imgur.com/enu08rk.jpg",
        "https://i.imgur.com/08qgTa4.jpg"
    ],
    "In House Kitchen": "FALSE",
    "friday_Hours": "3pm-9pm",
    "description": "Snafu is your classic garage brewery. It’s all about hanging out with friends and drinking great beer. Speaking of the beer, Snafu specializes in sours and has a wide variety of them. If you are looking for a place to meet some friends and reminisce about old adventures or to plan new ones Snafu is a great place to start.",
    "WebSite": "www.snafubrewingcompany.com"
},
{
    "Zip": "29403",
    "Brewery": "Holy City Brewing Baker and Brewer",
    "City": "Charleston",
    "phone_Number": "(843) 225-6089",
    "BreweryType": "Brewpub",
    "StateProvince": "SC",
    "Longitude": "-79.9423106",
    "Latitude": "32.802499",
    "address": "94 Stuart St",
    "UniqueID": 8679,
    "WebSite": "www.bakerandbrewer.com"
},
{
    "Longitude": "-79.9459408",
    "Latitude": "32.8012595",
    "thursday_Hours": "4pm-9pm",
    "sunday_Hours": "1pm-7pm",
    "email": "info@palmettobrewery.com",
    "Family Friendly": "TRUE",
    "tuesday_Hours": "4pm-9pm",
    "instagram": "https://www.instagram.com/palmettobrewing/",
    "wednesday_Hours": "4pm-9pm",
    "Crawable": "TRUE",
    "UniqueID": 8705,
    "Zip": "29403-4560",
    "facebook": "https://www.facebook.com/PalmettoBrewing/",
    "Brewery": "Palmetto Brewing Co.",
    "City": "Charleston",
    "StateProvince": "SC",
    "saturday_Hours": "1pm-9pm",
    "monday_hours": "4pm-9pm",
    "address": "289 Huger St Bldg B",
    "Outdoor Seating": "TRUE",
    "logo": "wix:image://v1/8b7ff5_385ec86ddd2047d1aec004ace4da02f2~mv2.png/blue%20logo%20facebook%20transparent.png#originWidth=960&originHeight=960",
    "Dog Friendly": "TRUE",
    "phone_Number": "(843) 937-0903",
    "BreweryType": "Regional",
    "Image": [
        "https://i.imgur.com/PHThFBY.jpg",
        "https://i.imgur.com/E2Olzn5.jpg",
        "https://i.imgur.com/4wJ1oAu.jpg",
        "https://i.imgur.com/4IUcY3H.jpg"
    ],
    "In House Kitchen": "FALSE",
    "friday_Hours": "1pm-9pm",
    "description": "As the first licensed brewery to open in the State of South Carolina since the fall of Prohibition, Palmetto Brewing Company's taproom serves as a showcase for the Palmetto favorites. Customers may also enjoy a constantly rotating selection of Small Batch and Experimental beers on tap while walking around the giant brewhouse, observing both the brewing process and the history of this long-standing tradition. The outdoor seating has plenty of shade for those hot, low country days and a stage for live music. There is normally a pizza stand out front and the occasional event, such as ax throwing.",
    "WebSite": "https://palmettobrewery.com/"
},
{
    "Longitude": "-80.0021313",
    "Latitude": "32.8424263",
    "thursday_Hours": "2pm-8pm",
    "sunday_Hours": "12pm-6pm",
    "email": "info@freehousebeer.com",
    "Family Friendly": "TRUE",
    "tuesday_Hours": "2pm-8pm",
    "instagram": "https://www.instagram.com/freehousebeerchs/",
    "wednesday_Hours": "2pm-8pm",
    "Crawable": "FALSE",
    "UniqueID": 8666,
    "Zip": "29405-7506",
    "facebook": "https://www.facebook.com/FreehouseBrewery/",
    "Brewery": "Freehouse Brewery",
    "City": "Charleston",
    "StateProvince": "SC",
    "saturday_Hours": "12pm-9pm",
    "monday_hours": "Closed",
    "address": "2895 Pringle St Ste B",
    "Outdoor Seating": "TRUE",
    "logo": "wix:image://v1/8b7ff5_9f0708cda62a4cff9374b0d8cf224ad2~mv2.png/logo%2520facebook_edited.png#originWidth=630&originHeight=630",
    "Dog Friendly": "TRUE",
    "BreweryType": "Micro",
    "Image": [
        "https://i.imgur.com/BYHiKMq.jpg",
        "https://i.imgur.com/LzzEXHi.jpg",
        "https://i.imgur.com/B0w0AK9.jpg",
        "https://i.imgur.com/j3QGHEY.jpg"
    ],
    "In House Kitchen": "FALSE",
    "friday_Hours": "2pm-8pm",
    "description": "A very unique brewery experience. First, the location; located at the end of the road in an industrial area in North Charleston Freehouse Brewery is in a World War II era army barracks sitting on the banks of the Ashley River. The building is all roughhewn plank floors and walls giving it the feel of an old barn. Outside, the fire pit and seating look out over the marsh and river. Second, the beer; its organic, seasonal and delicious. Freehouse is South Carolina’s artisanal organic brewery. They’re commitmentted to using ingredients free of pesticides and artificial ingredients. The result are brews that are both refreshing and are some of the best craft beers in the area. Freehouse Brewery is as unique and pleasurable brewery experience as you’ll find in Charleston.",
    "WebSite": "www.freehousebeer.com"
},
{
    "Longitude": "-79.950826",
    "Latitude": "32.8165644",
    "thursday_Hours": "4pm-9pm",
    "sunday_Hours": "12pm-6pm",
    "email": "tim@fattysbeerworks.com",
    "Family Friendly": "TRUE",
    "tuesday_Hours": "4pm-9pm",
    "instagram": "https://www.instagram.com/fattysbeerworks/",
    "wednesday_Hours": "4pm-9pm",
    "Crawable": "TRUE",
    "UniqueID": 8663,
    "Zip": "29405-9342",
    "facebook": "https://www.facebook.com/fattysbeer/",
    "Brewery": "Fatty’s Beer works",
    "City": "Charleston",
    "StateProvince": "SC",
    "saturday_Hours": "12pm-10pm",
    "monday_hours": "4pm-9pm",
    "address": "1437 Meeting Street Rd",
    "Outdoor Seating": "TRUE",
    "logo": "wix:image://v1/8b7ff5_9bd159249f7d4709b41a2ddd79428267~mv2.jpg/logo%2520black_edited.jpg#originWidth=600&originHeight=353",
    "Dog Friendly": "TRUE",
    "phone_Number": "(843) 974-5330",
    "BreweryType": "Micro",
    "Image": [
        "https://i.imgur.com/eqOb9XY.jpg",
        "https://i.imgur.com/50efD4X.png",
        "https://i.imgur.com/SzpTGs3.jpg",
        "https://i.imgur.com/hKmjDUU.png"
    ],
    "In House Kitchen": "FALSE",
    "friday_Hours": "4pm-10pm",
    "description": "Fatty’s is located in the heart of Charleston’s Brewery District. Fatty’s has a laid back, relaxed vibe to go with its refreshing brews. The taproom has a nice bar and good seating which fits nicely into part of the brewery. There’s also a dedicated outside area with games and seating. It’s hard not to leave Fatty’s with a smile on your face from the good people, fun atmosphere and awesome brews!",
    "WebSite": "http://www.fattysbeerworks.com"
},
{
    "Longitude": "-79.9548871",
    "Latitude": "32.8160037",
    "thursday_Hours": "4pm-8pm",
    "sunday_Hours": "1pm-7pm",
    "email": "michael@cooperriverbrewing.com",
    "Family Friendly": "TRUE",
    "tuesday_Hours": "Closed",
    "instagram": "https://www.instagram.com/cooperbrewing/",
    "wednesday_Hours": "Closed",
    "Crawable": "TRUE",
    "UniqueID": 8652,
    "Zip": "29405",
    "facebook": "https://www.facebook.com/cooperbrewing/",
    "Brewery": "Cooper River Brewing Co.",
    "City": "Charleston",
    "StateProvince": "SC",
    "saturday_Hours": "12pm-10pm",
    "monday_hours": "Closed",
    "address": "2201-B Mechanic St",
    "Outdoor Seating": "TRUE",
    "logo": "wix:image://v1/8b7ff5_646d813de9074c21ba40d88f1b19402a~mv2.png/Cooper%20River%20Brewing%20Logo%20-%20Cropped.png#originWidth=200&originHeight=200",
    "Dog Friendly": "TRUE",
    "phone_Number": "(843) 830-3681",
    "BreweryType": "Micro",
    "Image": [
        "https://i.imgur.com/zsX2Inb.jpg",
        "https://i.imgur.com/OpTH3I4.jpg",
        "https://i.imgur.com/mxt7j2s.jpg",
        "https://i.imgur.com/yiwHgeY.jpg"
    ],
    "In House Kitchen": "FALSE",
    "friday_Hours": "4pm-10pm",
    "description": "Nestled in a corner of Charleston’s brewery district, cooper river brewing offers a great selection of beers with a focus on fruit infused ales (fact check). They’ve got a great patio ready for any pretty Saturday and an air-conditioned tap room for the really hot days. If you are looking to stray off the beaten path, this is a great place to go!",
    "WebSite": "http://www.CooperRiverBrewing.com"
},
{
    "Zip": "25301-2627",
    "Brewery": "Bad Shepherd Beer Company",
    "City": "Charleston",
    "phone_Number": "(304) 552-7569",
    "BreweryType": "Brewpub",
    "StateProvince": "WV",
    "Longitude": "-81.6353737",
    "Latitude": "38.3506425",
    "address": "702 Quarrier St",
    "UniqueID": 10807,
    "WebSite": "www.blacksheepwv.com"
},
{
    "Longitude": "-79.9527896",
    "Latitude": "32.8175419",
    "thursday_Hours": "11am-9pm",
    "sunday_Hours": "11am-8pm",
    "email": "brewery@edmundsoast.com",
    "Family Friendly": "TRUE",
    "tuesday_Hours": "12pm-8pm",
    "instagram": "https://www.instagram.com/edmundsoast/",
    "wednesday_Hours": "12pm-8pm",
    "Crawable": "TRUE",
    "UniqueID": 8658,
    "Zip": "29405",
    "facebook": "https://www.facebook.com/eobrewingco/",
    "Brewery": "Edmund’s Oast Brewing Co.",
    "City": "Charleston",
    "StateProvince": "SC",
    "saturday_Hours": "11am-9pm",
    "monday_hours": "12pm-8pm",
    "address": "1505 King St Extension",
    "Outdoor Seating": "TRUE",
    "logo": "wix:image://v1/8b7ff5_ad3de274597f4d9f89830a8bd6cb3e90~mv2.png/EObreweryLogo%20website%202.png#originWidth=300&originHeight=137",
    "Dog Friendly": "TRUE",
    "phone_Number": "(843) 718-3224",
    "BreweryType": "Micro",
    "Image": [
        "https://i.imgur.com/TGVYNAy.jpg",
        "https://i.imgur.com/jHvXe37.jpg",
        "https://i.imgur.com/IACA4nI.jpg",
        "https://i.imgur.com/yz5PZPK.jpg"
    ],
    "In House Kitchen": "TRUE",
    "friday_Hours": "11am-9pm",
    "description": "Ranked one of the ten best breweries in America (2019), Edmonds Oast is the perfect place to head after a long day of work at the end of the week. The taproom is a large interior space with a modern industrial vibe that is filled with a 65-foot bar, big screen TVs, and arcade games so there is plenty to do while you’re enjoying one of their award-winning brews. Want to enjoy a pretty day, there’s also plenty of comfortable seating in their courtyard patio. Whether you’re inside or out, you can enjoy a great meal from their in-house kitchen while listening to some live music or watching your favorite sporting event.",
    "WebSite": "www.edmundsoast.com"
},
{
    "Longitude": "-79.9683934",
    "Latitude": "32.7173433",
    "thursday_Hours": "11am-10pm",
    "sunday_Hours": "11am-10:30pm",
    "email": "justin@famspizza.com",
    "Family Friendly": "TRUE",
    "tuesday_Hours": "11am-10pm",
    "instagram": "https://www.instagram.com/famsbrewingco/",
    "wednesday_Hours": "11am-10pm",
    "Crawable": "TRUE",
    "UniqueID": 8661,
    "Zip": "29412",
    "facebook": "https://www.facebook.com/famsbrewingco/",
    "Brewery": "Fam's Brewing Co.",
    "City": "Charleston",
    "StateProvince": "SC",
    "saturday_Hours": "11am-10pm",
    "monday_hours": "11am-10pm",
    "address": "1291 Folly Rd",
    "Outdoor Seating": "TRUE",
    "logo": "wix:image://v1/8b7ff5_a0c93f174e8f42dab670633652048f7e~mv2.png/logo_edited.png#originWidth=960&originHeight=960",
    "Dog Friendly": "TRUE",
    "phone_Number": "(843) 225-4646",
    "BreweryType": "Brewpub",
    "Image": [
        "https://i.imgur.com/teVBDQF.jpg",
        "https://i.imgur.com/eutn1DC.jpg",
        "https://i.imgur.com/5NkPNEQ.jpg",
        "https://i.imgur.com/6YX5NL7.jpg"
    ],
    "In House Kitchen": "TRUE",
    "friday_Hours": "11am-10pm",
    "description": "Located in a suburban strip center on James Island, we weren’t really sure what to expect from Fam’s Brewing Company. What a great surprise to find a family friendly, comfortable location that combines fantastic beer (like their 2019 Gold Medal winning Problem Child Imperial India Pale) with delicious pizza which won the 2019 Charleston Choice Award for best pizza.  Even though Fam’s feels like a traditional neighborhood hangout with a plenty of tables for families, a huge bar and great outdoor deck area, don’t be fooled, these guys are serious about their beer. And to complete the mash up between food and beer the brewery is visible through glass walls as you dine. So, if you’re looking to try some award-winning craft beer over a great meal, Fam’s Brewing Company is the place.",
    "WebSite": "www.famsbrewingco.com"
},
{
    "Longitude": "-79.9531113",
    "Latitude": "32.8222044",
    "thursday_Hours": "12pm-8pm",
    "sunday_Hours": "12pm-6pm",
    "email": "chris@tradesmanbrewing.com",
    "Family Friendly": "TRUE",
    "tuesday_Hours": "12pm-8pm",
    "instagram": "https://www.instagram.com/tradesmanbrew/",
    "wednesday_Hours": "12pm-8pm",
    "Crawable": "TRUE",
    "UniqueID": 8742,
    "Zip": "29405",
    "facebook": "https://www.facebook.com/Tradesmanbrew/",
    "Brewery": "Tradesman Brewing Co.",
    "City": "Charleston",
    "StateProvince": "SC",
    "saturday_Hours": "12pm-10pm",
    "monday_hours": "12pm-8pm",
    "address": "1647 KING STREET EXT",
    "Outdoor Seating": "TRUE",
    "logo": "wix:image://v1/8b7ff5_71d1bd8791da4d9cb52c9716443d92c6~mv2.png/Tradesman%20Logo%202.png#originWidth=582&originHeight=199",
    "Dog Friendly": "TRUE",
    "phone_Number": "(843) 410-1315",
    "BreweryType": "Taproom",
    "Image": [
        "https://i.imgur.com/qSXlk2F.jpg",
        "https://i.imgur.com/iEczCL2.jpg",
        "https://i.imgur.com/81VFJqY.jpg",
        "https://i.imgur.com/gMYYiiB.jpg"
    ],
    "In House Kitchen": "FALSE",
    "friday_Hours": "12pm-10pm",
    "description": "This place is urban cool, inside and out! Tradesman’s patio is a great place to spend a Saturday afternoon, with a wide variety of beers on tap you can drink all day and have a different beer each pour. The modern, new building with an awesome wrench-turner aesthetic and loads of space is a great spot to relax with friends after a ride (they host weekly group bike rides.) Hungry, check out the food truck schedule on their website. Close to downtown and NOMO, but far enough away to have its own distinct urban vibe, Tradesman is a great hang out spot when you’re downtown Charleston.",
    "WebSite": "www.tradesmanbrewing.com"
},
{
    "Longitude": "-79.9969567",
    "Latitude": "32.8130217",
    "thursday_Hours": "11:30am-10pm",
    "sunday_Hours": "11am-9pm",
    "email": "info@frothybeard.com",
    "Family Friendly": "TRUE",
    "tuesday_Hours": "11:30am-9pm",
    "instagram": "https://www.instagram.com/frothybeardbrewing/",
    "wednesday_Hours": "11:30am-9pm",
    "Crawable": "TRUE",
    "UniqueID": 8667,
    "Zip": "29407-5031",
    "facebook": "https://www.facebook.com/FrothyBeardBrewing/",
    "Brewery": "Frothy Beard Brewing Co.",
    "City": "Charleston",
    "StateProvince": "SC",
    "saturday_Hours": "11:30am-10pm",
    "monday_hours": "11:30am-9pm",
    "address": "1401 Sam Rittenberg Blvd Ste 1",
    "Outdoor Seating": "TRUE",
    "logo": "wix:image://v1/8b7ff5_8fa7d7a8249040f5836639271a052f25~mv2.png/Frothy%20Beard%20Logo%20-%20circle.png#originWidth=1270&originHeight=1270",
    "Dog Friendly": "TRUE",
    "phone_Number": "(843) 872-1075",
    "BreweryType": "Micro",
    "Image": [
        "https://i.imgur.com/syWvWnQ.jpg",
        "https://i.imgur.com/gZgU0dd.jpg",
        "https://i.imgur.com/qIqavnX.jpg",
        "https://i.imgur.com/USdja2H.png"
    ],
    "In House Kitchen": "TRUE",
    "friday_Hours": "11:30am-10pm",
    "description": "The name Frothy Beard gives you the idea that you can expect a good beer and you certainly can! They boast 15+ taps and always have new brews coming out. What you may be surprised to find inside is a killer pizzeria, a retro video games corner, and walls covered in awesome retro/nerd culture art. Frothy Beard has something for everyone and is a great place to take the family for dinner, meet up with some friends for trivia night, or grab a slice and a beer for lunch.",
    "WebSite": "http://www.frothybeard.com"
},
{
    "Zip": "29407-4870",
    "Brewery": "Tideland Brewing",
    "City": "Charleston",
    "phone_Number": "(843) 608-1899",
    "StateProvince": "SC",
    "Longitude": "-80.021916",
    "BreweryType": "Planning",
    "Latitude": "32.798496",
    "UniqueID": 8741,
    "WebSite": "www.tidelandbrewing.com"
},
{
    "Zip": "29403",
    "Brewery": "Edmundu2019s Oast Restaurant",
    "City": "Charleston",
    "phone_Number": "(843) 718-3224",
    "BreweryType": "Brewpub",
    "StateProvince": "SC",
    "Longitude": "-79.9473813",
    "Latitude": "32.8098884",
    "address": "1081 Morrison Dr",
    "UniqueID": 8659
},
{
    "Zip": "29403-3825",
    "Brewery": "The Hold By Revelry Brewing",
    "City": "Charleston",
    "StateProvince": "SC",
    "Longitude": "-79.944933",
    "BreweryType": "Micro",
    "Latitude": "32.8083521",
    "address": "36 Romney St",
    "email": "info@revelrybrewingco.com",
    "UniqueID": 8735,
    "WebSite": "www.revelrybrewingco.com"
},
{
    "Longitude": "-79.94501",
    "Latitude": "32.807076",
    "thursday_Hours": "12pm-10pm",
    "sunday_Hours": "12pm-10pm",
    "email": "info@revelrybrewingco.com",
    "Family Friendly": "TRUE",
    "tuesday_Hours": "12pm-10pm",
    "instagram": "https://www.instagram.com/revelrybrewing/",
    "wednesday_Hours": "12pm-10pm",
    "Crawable": "TRUE",
    "UniqueID": 8710,
    "Zip": "29403-3815",
    "facebook": "https://www.facebook.com/revelrybrewing/",
    "Brewery": "Revelry Brewing",
    "City": "Charleston",
    "StateProvince": "SC",
    "saturday_Hours": "12pm-12am",
    "monday_hours": "12pm-10pm",
    "address": "10 Conroy St",
    "Outdoor Seating": "TRUE",
    "logo": "wix:image://v1/8b7ff5_d57d363f85594ec1a51aac3bfde5c79a~mv2.jpg/logo.jpg#originWidth=960&originHeight=960",
    "Dog Friendly": "TRUE",
    "phone_Number": "(843) 376-1303",
    "BreweryType": "Taproom",
    "Image": [
        "https://i.imgur.com/aQZCrGk.jpg",
        "https://i.imgur.com/s9l2vJT.jpg",
        "https://i.imgur.com/s87Asdu.jpg",
        "https://i.imgur.com/jbubGBa.jpg"
    ],
    "In House Kitchen": "FALSE",
    "friday_Hours": "12pm-12am",
    "description": "Located close to downtown, but off the busy downtown streets, there is ample parking for everyone trying one of their great brews and unwind after a long day. Almost completely outdoors, Revelry’s downstairs has a bar which feels like you’re sitting among the brew tanks; there are also outside tables where you can enjoy Revelry's famous fried sushi burrito. But make sure you head upstairs while you’re there because Revelry has a one of a kind rooftop bar with its own cool vibe which is one of the best spots in town to watch those beautiful Charleston sunsets.",
    "WebSite": "http://www.revelrybrewingco.com"
},
{
    "Longitude": "-79.9099559",
    "Latitude": "32.903528",
    "thursday_Hours": "4pm-9pm",
    "sunday_Hours": "11am-8pm",
    "email": "info@indigoreefbrewing.com",
    "Family Friendly": "TRUE",
    "tuesday_Hours": "4pm-9pm",
    "instagram": "https://www.instagram.com/indigoreefbrewing/",
    "wednesday_Hours": "4pm-9pm",
    "Crawable": "TRUE",
    "UniqueID": 8682,
    "Zip": "29492",
    "facebook": "https://www.facebook.com/IRBrewing/",
    "Brewery": "Indigo Reef Brewing Co.",
    "City": "Charleston",
    "StateProvince": "SC",
    "saturday_Hours": "12pm-10pm",
    "monday_hours": "Closed",
    "address": "2079 Wambaw Creek Rd Unit 1",
    "Outdoor Seating": "TRUE",
    "logo": "wix:image://v1/8b7ff5_abb88bcfa840425dab20bd573b204689~mv2.png/logo_edited.png#originWidth=624&originHeight=624",
    "Dog Friendly": "TRUE",
    "phone_Number": "(843) 867-6015",
    "BreweryType": "Taproom",
    "Image": [
        "https://i.imgur.com/WOoYm32.jpg",
        "https://i.imgur.com/uUEUjA1.jpg",
        "https://i.imgur.com/3OeTQVd.png",
        "https://i.imgur.com/7mUjk1c.png"
    ],
    "In House Kitchen": "TRUE",
    "friday_Hours": "3pm-10pm",
    "description": "Indigo reef is a great relaxing brewery. Everything about the place encourages you to have a drink and unwind. A good selection of beers with a focus on Ales and IPAs plus an in-house kitchen. Once you get here you will not want to leave.",
    "WebSite": "http://www.IndigoReefBrewing.com"
}
];
