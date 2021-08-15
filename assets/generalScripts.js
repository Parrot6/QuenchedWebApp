if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./sw.js')
    .then((reg) => { console.log('Service Worker Registered', reg); })
    .catch((error) => { console.log('Service Worker Failed.', error)})
}
function resetFragments(){
  $('.fragment').each(function(i, obj) {
    obj.classList.remove("activeFrag");
    obj.classList.remove("popopActive");
  });
  backButton.style.display = "none";
}
var Router = Backbone.Router.extend({
  routes: {//List of URL routes with the corresponding function name which will get called when user will visit a page having URL containing this route
      "" : "landing",
      "openBrewery/:id": "openBrewery",    // localhost:8080/#list
      "search/:id": "search",
      "other": "other",
      "appNavigation/:tab": "appNavigation",
      "about": "about",
      "help": "help",
      "favorite/:id": "favorite",
      "reportBug": "reportBug",
      "deadroute": "deadroute",
      "options": "options"
  },
  landing: function(){
    location.href='#appNavigation/mapNav';
  },
  openBrewery: function(id) {
      loadInFavorites();
      resetFragments();
      document.getElementById('dropdownMenuLink').style.display = "none";
      backButton.style.display = "block";
      document.getElementById('openBreweryFragment').classList.add("popopActive");
      openBrewerySocial(id);
  },
  search: function(id) {
    resetFragments();
    document.getElementById('dropdownMenuLink').style.display = "none";
    backButton.style.display = "block";
    document.getElementById('openSearchFragment').classList.add("popopActive");
    loadInsearchResults();
  },
  other: function(){
      resetButtons();
  },
  about: function(){
    createPopup("What is Quenched", 
                "Quenched is all about the craft brewery experience. We want to help you find the right brewery, for the right night, for the right group. We do this by letting you filter our library of breweries through a few key brewery features (such as Dog Friendly, or In House Kitchen) Ready to start your next adventure?", 
      `<div class="col-12 text-center mt-4">Follow us on social media!</div>
      <div class="col text-right mt-4"><a target="_blank"id="breweryFacebook" href="https://www.facebook.com/im.quenched">
      <i class="fab fa-facebook-square fa-4x"></i>
      </a></div>
      <div class="col text-left mt-4 pr-6">
        <a target="_blank" id="breweryInstagram" href="https://www.facebook.com/im.quenched">
          <i class="fab fa-instagram fa-4x"></i>
        </a>
      </div>`
      , 
      null)
  },
  options: function(){
    createPopup("Options", "",
    `
      <div>
        <b>Delete All Cache And Reload App</b><button id="deleteCache" onclick="deleteCache()">Delete Cache</button>
      </div>
      `
    , 
    null)
  },
  help: function(){
    createPopup("Help", "",
    `
      <div class="col-12 text-center mb-1">
        <Strong><u>Filter Descriptions</u></Strong>
      </div>
      <div class="helpText">
      <div>
        <b>Dog Friendly:</b> This brewery allows you to bring your dog(s) as long as they are well behaved and on a leash. This ONLY applies to the OUTDOOR area, you will need to ask the brewery if you can bring your dog inside.
      </div>
      <div>
        <Strong>Crawlable:</Strong> This brewery is within a 10 minute walk of other places to eat or drink.
      </div>
      <div>
        <Strong>In House Kitchen:</Strong> This brewery either makes and sells food or has a restaurant attached.\nDoes not include food trucks.
      </div>
      <div>
        <Strong>Family Friendly:</Strong> This brewery is suitable for a family with children to go to.
      </div>
      <div>
        <Strong>Outdoor Seating:</Strong> This brewery has an outdoor area where you can drink your beer.
      </div>
    </div>`
    , 
    null)
  },
  reportBug: function(){
    createPopup("Report Bug",
    `
      <div class="col">
        Issue Catagory:
      </div>
      <div class="col">
        <Select id="reportBugSelect">
          <option>App Crash</option>
          <option>Navigation Issue</option>
          <option>Image Issue</option>
          <option>Bug</option>
          <option>Typo</option>
          <option>Other</option>
        </Select>
      </div>
      
      `,
      `
      <div class="col-12 text-left">
        Description:
      </div>
      <div class="col-12">
        <textarea class="w-100" id="reportBugTextArea"></textarea>
      </div>
      `
    , 
    ()=>{
      submitBugReport(document.getElementById('reportBugSelect').value, document.getElementById('reportBugTextArea').value);
    })
  },
  appNavigation: function(tab){
    resetFragments();
    // document.getElementById("mapFragment").classList.remove("activeFrag");
    // document.getElementById("searchFragment").classList.remove("activeFrag");
    // document.getElementById("socialFragment").classList.remove("activeFrag");
    document.getElementById('dropdownMenuLink').style.display = "block";
    document.getElementById("mapNav").classList.remove("activeNav");
    document.getElementById("searchNav").classList.remove("activeNav");
    document.getElementById("socialNav").classList.remove("activeNav");
    document.getElementById("mapNavSelector").classList.remove("activeTab");
    document.getElementById("searchNavSelector").classList.remove("activeTab");
    document.getElementById("socialNavSelector").classList.remove("activeTab");
    switch(tab){
      case "mapNav":
        document.getElementById(tab).classList.add("activeNav");
        document.getElementById(tab+"Selector").classList.add("activeTab");
        document.getElementById("mapFragment").classList.add("activeFrag");
        break;
      case "searchNav":
        loadInFavorites();
        document.getElementById(tab).classList.add("activeNav");
        document.getElementById(tab+"Selector").classList.add("activeTab");
        document.getElementById("searchFragment").classList.add("activeFrag");
        break;
      case "socialNav":
        fetchSocials();
        document.getElementById(tab).classList.add("activeNav");
        document.getElementById(tab+"Selector").classList.add("activeTab");
        document.getElementById("socialFragment").classList.add("activeFrag");
        break;
      default:
        break;
    }
  }
});
jQuery(document).ready(function() {
  // When the document is ready we instantiate the router
  var router = new Router();
  // And tell Backbone to start routing
  Backbone.history.start();
  getBreweryNames();
});
function deleteCache(){
  console.log("attempting hard reload");
    caches.keys().then((keyList) => Promise.all(keyList.map((key) => caches.delete(key))))
    window.location.reload(true);
}
function calcCrow(lat1, lon1, lat2, lon2) 
{
  var R = 6371; // km
  var dLat = toRad(lat2-lat1);
  var dLon = toRad(lon2-lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;
  return d;
}

// Converts numeric degrees to radians
function toRad(Value) 
{
    return Value * Math.PI / 180;
}
function openBrewery(UniqueID){
  var currentBrewery = Breweries.get(Number(UniqueID));
  sessionStorage.setItem("currentBrewery", JSON.stringify(currentBrewery));
  console.log(currentBrewery);
  window.location.pathname = './breweryProfile.html';
}
async function openBrewerySocial(UniqueID){
  var currentBrewery = Breweries.get(Number(UniqueID));
  if(currentBrewery){
  //sessionStorage.setItem("currentBrewery", JSON.stringify(currentBrewery));
  console.log(currentBrewery);
  //window.location.pathname = './breweryProfile.html';
  } else {
      loadBrewery(UniqueID);
      var currentBrewery = Breweries.get(Number(UniqueID));
  }
  loadpage(currentBrewery);
}
function loadBrewery(UniqueID){
  var request = new XMLHttpRequest()
  // Open a new connection, using the GET request on the URL endpoint
  request.open('GET', 'https://mb1zattts4.execute-api.us-east-1.amazonaws.com/dev/brewery/'+UniqueID, false)

  request.onload = function () {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response)
    if (request.status >= 200 && request.status < 400) {
      Breweries.set(data.UniqueID, data);
      return data;
    } else {
      return false;
    }
  }

  // Send request
  request.send()
}
var BreweryNamesList = new Map([]);
var BreweryNames = [];
function getBreweryNames(){
  var request = new XMLHttpRequest()
  // Open a new connection, using the GET request on the URL endpoint
  request.open('GET', 'https://mb1zattts4.execute-api.us-east-1.amazonaws.com/dev/breweryNames', true)

  request.onload = function () {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response)
    if (request.status >= 200 && request.status < 400) {
      for (var i = 0; i < data.length; i++){
        var obj = data[i];
        BreweryNamesList.set(obj.Brewery, obj);
        BreweryNames.push(obj.Brewery);
      }
      autocomplete(document.getElementById("myInputSearch"), BreweryNames);
    } else {
      return false;
    }
  }

  // Send request
  request.send()
}
function submitBugReport(bugType, desc){
  var json = {};
  json['email'] = User["email"];
  json['catagory'] = bugType;
  json['description'] = desc;

  var request = new XMLHttpRequest()
  request.open('POST', 'https://mb1zattts4.execute-api.us-east-1.amazonaws.com/dev/userReportBug', true);
  request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  
  // Open a new connection, using the GET request on the URL endpoint
  //request.open('POST', 'https://mb1zattts4.execute-api.us-east-1.amazonaws.com/dev/login', true)

  request.onreadystatechange = function () {
    // Begin accessing JSON data here
    //var data = JSON.parse(this.response)
    if (request.status >= 200 && request.status < 400) {
      return true;
    } else {
      return false;
    }
  }

  // Send request
  request.send(JSON.stringify(json))
}
function submitProfileReport(breweryName, breweryID, issueType, desc){
  var json = {};
  json['Email'] = User["email"];
  json['Brewery'] = breweryName;
  json['Catagory'] = issueType;
  json['Description'] = desc;
  json['UniqueID'] = breweryID;

  var request = new XMLHttpRequest()
  request.open('POST', 'https://mb1zattts4.execute-api.us-east-1.amazonaws.com/dev/reportBrewery', true);
  request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  
  request.onreadystatechange = function () {
    // Begin accessing JSON data here
    //var data = JSON.parse(this.response)
    if (request.status >= 200 && request.status < 400) {
      return true;
    } else {
      return false;
    }
  }

  // Send request
  request.send(JSON.stringify(json))
}
$(":button").mousedown(function(e){
    e.preventDefault();
    //alert("1");
    })
var currentSlide = 0;
function slideChange(inc, button){
  var slides = document.getElementsByClassName("picSlide");
  currentSlide += inc;
  if(currentSlide > slides.length-1) currentSlide = 0;
  if(currentSlide < 0) currentSlide = slides.length-1;
  for(element of slides) {
    element.classList.remove("activeSlide");
  };
  slides[currentSlide].classList.add("activeSlide");
}
var User;
function onSignIn(googleUser) {
  // Useful data for your client-side scripts:
  var profile = googleUser.getBasicProfile();

  // The ID token you need to pass to your backend:
  var id_token = googleUser.getAuthResponse().id_token;
  var json = {};
  json['email'] = profile.getEmail();
  json['name'] = profile.getGivenName();
  json['fullName'] = profile.getName();
  json['familyName'] = profile.getFamilyName();
  json['image'] = profile.getImageUrl();
  json['token'] = id_token;

  var request = new XMLHttpRequest()
  request.open('POST', 'https://mb1zattts4.execute-api.us-east-1.amazonaws.com/dev/login', true);
  request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  
  // Open a new connection, using the GET request on the URL endpoint
  //request.open('POST', 'https://mb1zattts4.execute-api.us-east-1.amazonaws.com/dev/login', true)

  request.onload = function () {
    // Begin accessing JSON data here
    //var data = JSON.parse(this.response)
    if (request.status >= 200 && request.status < 400) {
      //console.log(this.response);
      User = json;
      User["loggedIn"] = true;
      console.log(User, favsUpToDate)
      loadInFavorites();
      console.log(Backbone.history.fragment)
      if(Backbone.history.fragment.includes('Backbone.history.fragment')){
         Backbone.history.loadUrl(Backbone.history.fragment);
      }
     
      return true;
    } else {
      return false;
    }
  }

  // Send request
  request.send(JSON.stringify(json))
}
function createPopup(title, rowOneInnerHtml, rowTwoInnerHtml, confirmFunction, killNavigation = true){
  var div = document.getElementById('popupFrame');
  div.style.display = "block";
  div.setAttribute('class', 'popupFrame');
  div.innerHTML = document.getElementById('popupTemplate').innerHTML;
  // You could optionally even do a little bit of string templating
  div.innerHTML = div.innerHTML 
      .replace(/{Title}/g, title)
      .replace(/{Row1}/g, rowOneInnerHtml)
      .replace(/{Row2}/g, rowTwoInnerHtml)
  var confirm = div.getElementsByClassName("popupConfirm")[0];
  confirm.onclick = function() {
    confirmFunction()
    div.style.display = "none";
    //Backbone.history.navigate("#deadroute");
  };
  if(confirmFunction == null) confirm.style.display = "none";
  $(".popupCancel").on('click', function(event){
    div.style.display = "none";
    //if(killNavigation) Backbone.history.navigate("#deadroute");
  });

}
var makeBlogPostBrewery = null;
var activeRecommendations = {};
function toggleMakePostFilter(btn){
  if(!btn.classList.contains('active')){
    activeRecommendations[btn.innerText] = true;
    btn.classList.add('active');
  } else {
    activeRecommendations[btn.innerText] = false;
    btn.classList.remove('active');
  }
};

function createBlogPopup(breweryID = null){
  var inputBrewery;
  if(breweryID !== null){
    makeBlogPostBrewery = Breweries.get(breweryID);
    inputBrewery = makeBlogPostBrewery.Brewery;
  } else {
    inputBrewery = `
                      <div class="autocomplete">
                        <input autocomplete="off" id="myInput" type="text" name="breweryChoice" placeholder="Choose Brewery">
                      </div>
                    `;
  }
  activeRecommendations = {};
  var div = document.getElementById('popupMakeBlogFrame');
  div.style.display = "block";
  div.setAttribute('class', 'popupFrame');
  div.innerHTML = document.getElementById('makeBlogPostTemplate').innerHTML;
  // You could optionally even do a little bit of string templating
  div.innerHTML = div.innerHTML 
      .replace(/{Title}/g, inputBrewery);
  if(breweryID == null){
    autocomplete(document.getElementById("myInput"), BreweryNames);
  }
  var ImageInput = div.getElementsByClassName('ImageUpload')[0];
  $(ImageInput).change( function(event) {
    var tmppath = URL.createObjectURL(event.target.files[0]);
    $("#makeBlogPostImage").attr('src',tmppath);
  });
  var confirm = div.getElementsByClassName("popupConfirm")[0];
  confirm.onclick = function() {
    $('.errorText').remove();
    $('#myInput').css('border', '1px solid black');
    $('#Image1').css('border', '1px solid black');
    if(breweryID == null){
      if(BreweryNamesList.has(myInput.value)){
        makeBlogPostBrewery = BreweryNamesList.get(myInput.value)
      } else {
        $('#myInput').css('border', '1px solid red');
        $('#myInput').after('<div class="errorText">You must choose an brewery from the list</div>');
        return;
      }
    }
    if(makeBlogPostBrewery == null){
      alert("No brewery selected")
      return;
    }
    var $files = $(ImageInput).get(0).files;
    var thisItem = $(ImageInput).get(0);
    if ($files.length) {

        // Reject big files
        if ($files[0].size > $(ImageInput).data("max-size") * 1024) {
            console.log("Please select a smaller file");
            return false;
        }

        // Replace ctrlq with your own API key
        var apiUrl = 'https://imgur-apiv3.p.rapidapi.com/3/image';
        var apiKey = '7a33fb023dmsh26f191c59816e64p1168dfjsn5e1e67646390';

        var formData = new FormData();
        formData.append("image", $files[0]);

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": apiUrl,
            "method": "POST",
            "datatype": "json",
            "headers": {
                "Authorization": "Client-ID d977a7cc9464eca",
                "x-rapidapi-key": apiKey,
                "x-rapidapi-host": "imgur-apiv3.p.rapidapi.com"
            },
            "processData": false,
            "contentType": false,
            "data": formData,
            beforeSend: function (xhr) {
                console.log("Uploading | 上传中");
            },
            success: function (res) {
                console.log($(ImageInput));
                console.log($(ImageInput).attr('id'))
                var imgurlink = res.data.link;
                var json = {};
                json['Brewery'] = makeBlogPostBrewery.Brewery;
                json['UniqueID'] = String(makeBlogPostBrewery.UniqueID);
                json['privateComment'] = makeBlogPostComment.value;
                json['imgurUrl'] = imgurlink;
                json['username'] = localStorage.getItem('username');
                //json['Roles'] = desc;
                json['location'] = makeBlogPostBrewery.City + ", " + makeBlogPostBrewery.StateProvince;
                json['Latitude'] = makeBlogPostBrewery.Latitude;
                json['Longitude'] = makeBlogPostBrewery.Longitude;
                json['userEmail'] = User["email"];
                console.log(json);
                var request = new XMLHttpRequest()
                request.open('POST', 'https://mb1zattts4.execute-api.us-east-1.amazonaws.com/dev/post_create', true);
                request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
                
                // Open a new connection, using the GET request on the URL endpoint
                //request.open('POST', 'https://mb1zattts4.execute-api.us-east-1.amazonaws.com/dev/login', true)

                request.onload = function () {
                  // Begin accessing JSON data here
                  //var data = JSON.parse(this.response)
                  if (request.status >= 200 && request.status < 400) {
                    submitRecommendations(makeBlogPostBrewery.UniqueID, activeRecommendations);
                    return true;
                  } else {
                    alert("Something went wrong with your upload!")
                    console.log(this.response);
                  }
                }

                // Send request
                request.send(JSON.stringify(json))
            },
            error: function () {
                alert("Failed | 上传失败");
            }
        }
        $.ajax(settings).done(function (response) {
            console.log("Done | 成功");
        });
    } else {
      $('#Image1').after('<div class="errorText">You must select an image</div>');
      $('#Image1').css('border', '1px solid red');
        return;
    }
    div.style.display = "none";
  };
  $(".popupCancel").on('click', function(event){
    div.style.display = "none";
    //if(killNavigation) Backbone.history.navigate("#deadroute");
});
  //cancel.innerHTML = "Close";
  // Write the <div> to the HTML container
  //document.getElementById('socialPosts').appendChild(div);
}
function submitRecommendations(id, recommendations){
  family = recommendations['Family Friendly'];
  dog = recommendations['Dog Friendly'];
  outdoor = recommendations['Outdoor Seating'];
  kitchen = recommendations['In House Kitchen'];
  crawl = recommendations['Crawlable'];
  if(User['email'] == undefined || User['email'] == ""){
    alert("Can't submit recommendations without logging in");
    return;
  }
  var json = {};
  json['userEmail'] = User['email'];
  json['UniqueID'] = String(id);
  if(family !== null && family !== undefined && family == true) json['Family Friendly'] = true;
  if(dog !== null && dog !== undefined && dog == true) json['Dog Friendly'] = true;
  if(outdoor !== null && outdoor !== undefined && outdoor == true) json['Outdoor Seating'] = true;
  if(kitchen !== null && kitchen !== undefined && kitchen == true) json['In House Kitchen'] = true;
  if(crawl !== null && crawl !== undefined && crawl == true) json['Crawlable'] = true;
  console.log(json);
  var request = new XMLHttpRequest()
  request.open('POST', 'https://mb1zattts4.execute-api.us-east-1.amazonaws.com/dev/recs_create', true);
  request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  
  // Open a new connection, using the GET request on the URL endpoint
  //request.open('POST', 'https://mb1zattts4.execute-api.us-east-1.amazonaws.com/dev/login', true)

  request.onload = function () {
    // Begin accessing JSON data here
    //var data = JSON.parse(this.response)
    if (request.status >= 200 && request.status < 400) {
      return true;
    } else {
      return false;
    }
  }

  // Send request
  request.send(JSON.stringify(json))
}
//AUTO COMPLETE BREWERY NAMES
function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  })
};
function makeImagesZoomable(){
  $("img.Zoom").unbind("click");
  $("img.Zoom").click(function(e){
      imageClickImage.src = e.target.src;
      if(imageClick.style.display !== "block"){
        imageClick.style.display = "block";
      } else {
        closeImage();
      }
  })
}
function closeImage(){
  imageClick.style.display = "none";
  resetImage();
}
function resetImage(){
  document.querySelector("#imageClickImage").style.transform = "";
  document.querySelector("#imageClickImage").style.transformOrigin = "";
  document.querySelector("#imageClickImage").style.height = "";
  document.querySelector("#imageClickImage").style.width = "";
  rotateImageButton.style.display = "block";
  rotateImageBackButton.style.display = "none";
}
function rotateImage(){
  rotateImageButton.style.display = "none";
  rotateImageBackButton.style.display = "block";
  if(document.querySelector("#imageClickImage").naturalWidth < document.querySelector("#imageClickImage").naturalHeight){
    document.querySelector("#imageClickImage").style.height = "100vw";
    document.querySelector("#imageClickImage").style.width = "unset";
  } else {
    document.querySelector("#imageClickImage").style.height = "unset";
    document.querySelector("#imageClickImage").style.width = "100vh";
  }
  document.querySelector("#imageClickImage").style.transform = "rotate(90deg) translateY(-100%)";
  document.querySelector("#imageClickImage").style.transformOrigin = "top left";
  // document.querySelector("#imageClickImage").style.height = "100vw";
  // document.querySelector("#imageClickImage").style.width = "unset";
}