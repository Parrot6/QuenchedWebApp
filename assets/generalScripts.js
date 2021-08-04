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
      "openBrewery/:id": "openBrewery",    // localhost:8080/#list
      "search/:id": "search",
      "other": "other",
      "appNavigation/:tab": "appNavigation",
      "about": "about",
      "help": "help",
      "favorite/:id": "favorite",
      "reportBug": "reportBug",
      "deadroute": "deadroute"
  },
  openBrewery: function(id) {
    console.log("routeropen");
      loadInFavorites();
      resetFragments();
      backButton.style.display = "block";
      document.getElementById('openBreweryFragment').classList.add("popopActive");
      openBrewerySocial(id);
  },
  search: function(id) {
    resetFragments();
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
  favorite: function(id){
    addOrRemoveFavorite(id);
  },
  appNavigation: function(tab){
    resetFragments();
    // document.getElementById("mapFragment").classList.remove("activeFrag");
    // document.getElementById("searchFragment").classList.remove("activeFrag");
    // document.getElementById("socialFragment").classList.remove("activeFrag");
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
});

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
      loadInFavorites();
      Backbone.history.loadUrl(Backbone.history.fragment);
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
    Backbone.history.navigate("#deadroute");
  };
  if(confirmFunction == null) confirm.style.display = "none";
  var cancel = div.getElementsByClassName("popupCancel")[0];
  cancel.onclick = function() {
    div.style.display = "none";
    if(killNavigation) Backbone.history.navigate("#deadroute");
  };
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
  }
function createBlogPopup(title, confirmFunction, breweryID = null){
  if(breweryID !== null) makeBlogPostBrewery = Breweries.get(breweryID);
  activeRecommendations = {};
  var div = document.getElementById('popupMakeBlogFrame');
  div.style.display = "block";
  div.setAttribute('class', 'popupFrame');
  div.innerHTML = document.getElementById('makeBlogPostTemplate').innerHTML;
  // You could optionally even do a little bit of string templating
  div.innerHTML = div.innerHTML 
      .replace(/{Title}/g, makeBlogPostBrewery.Brewery);
  var ImageInput = div.getElementsByClassName('ImageUpload')[0];
  var confirm = div.getElementsByClassName("popupConfirm")[0];
  confirm.onclick = function() {
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
        alert("No image selected")
        return;
    }
    div.style.display = "none";
  };
  if(confirmFunction == null) confirm.style.display = "none";
  var cancel = div.getElementsByClassName("popupCancel")[0];
  cancel.onclick = function() {
    div.style.display = "none";
  };
  //cancel.innerHTML = "Close";
  // Write the <div> to the HTML container
  //document.getElementById('socialPosts').appendChild(div);
}
function submitRecommendations(id, crawl, dog, family, outdoor, kitchen){
  if(User['email'] == undefined || User['email'] == ""){
    alert("Can't submit recommendations without logging in");
    return;
  }
  var json = {};
  json['userEmail'] = User['email'];
  json['UniqueID'] = String(id);
  if(family != null && family !== undefined) json['Family Friendly'] = makeBlogPostComment.value;
  if(dog != null && dog !== undefined) json['Dog Friendly'] = imgurlink;
  if(outdoor != null && outdoor !== undefined) json['Outdoor Seating'] = localStorage.getItem('username');
  if(kitchen != null && kitchen !== undefined) json['In House Kitchen'] = makeBlogPostBrewery.City + ", " + makeBlogPostBrewery.StateProvince;
  if(crawl != null && crawl !== undefined) json['Crawlable'] = makeBlogPostBrewery.Latitude;
  console.log(json);
  var request = new XMLHttpRequest()
  request.open('POST', 'https://mb1zattts4.execute-api.us-east-1.amazonaws.com/dev/post_create', true);
  request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  
  // Open a new connection, using the GET request on the URL endpoint
  //request.open('POST', 'https://mb1zattts4.execute-api.us-east-1.amazonaws.com/dev/login', true)

  request.onreadystatechange = function () {
    // Begin accessing JSON data here
    //var data = JSON.parse(this.response)
    if (request.status >= 200 && request.status < 400) {
      return true;
    } else {
      alert("Something went wrong with your upload!")
      console.log(this.response);
    }
  }

  // Send request
  request.send(JSON.stringify(json))
}