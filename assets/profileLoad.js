var currentBrewery;
function loadpage(currentBrewery){
  this.currentBrewery = currentBrewery;
  //console.log(id, Breweries, Breweries.get(id));
    //var currentBrewery = Breweries.get(id);
    if(currentBrewery.WebSite){
      profileWebSite.innerHTML = "<a href='" + validateText(currentBrewery.WebSite) + "' target='_blank'>" + currentBrewery.WebSite + '</a>';
    } else {
      str = "Website not found";
    }
    if(currentBrewery.phone_Number){
      var strippedNum = currentBrewery.phone_Number.replace(/\D/g,'');
      profilePhone_Number.innerHTML = "Phone:&nbsp<a href='tel:+1" + strippedNum + "'>"+currentBrewery.phone_Number+"</a>"
    } else {
      profilePhone_Number.innerHTML = "Phone: Unlisted"
    }
    profileBrewery.innerText = currentBrewery.Brewery;
    profileAddress.innerText = currentBrewery.address + ", " + currentBrewery.City + ", " + currentBrewery.StateProvince;
    //profilePhone_Number.innerText = currentBrewery.phone_Number;
    //profileWebSite.innerText = currentBrewery.WebSite || "No Website";
    profileFacebook.innerText = currentBrewery.Facebook || "No Facebook";
    profileInstagram.innerText = currentBrewery.Instagram || "No Instagram";
    var numfilters = 0;
    if(currentBrewery['Crawable'] == 'TRUE'){
        infoCra.style.display = "block";
        numfilters++;
      } else {
        infoCra.style.display = "none";
      }
      if(currentBrewery['Family Friendly'] == 'TRUE'){
        infoFam.style.display = "block";
        numfilters++;
      } else {
        infoFam.style.display = "none";
      }
      if(currentBrewery['Dog Friendly'] == 'TRUE'){
        infoDog.style.display = "block";
        numfilters++;
      } else {
        infoDog.style.display = "none";
      }
      if(currentBrewery['Outdoor Seating'] == 'TRUE'){
        infoOut.style.display = "block";
        numfilters++;
      } else {
        infoOut.style.display = "none";
      }
      if(currentBrewery['In House Kitchen'] == 'TRUE'){
        infoInH.style.display = "block";
        numfilters++;
      } else {
        infoInH.style.display = "none";
      }
      if(numfilters == 0){
        profileFilterHolder.style.display = "none";
      }
      if(currentBrewery.Verified){
        $('.recommendCatagories').hide();
      } else {
        $('.recommendCatagories').show();
      }
      var images = currentBrewery.Image || [];
      console.log('images', images);
      var slides = document.getElementsByClassName('picSlide');
      for(var i = slides.length-1; i >= 0; i--){
        slides[i].src = "assets/images/quenchedwithbg.png";
        if(i > images.length - 1 && slides.length > 1){
          slides[i].remove();
        } else if(images.length > 0) {
          console.log(images[i], i);
          slides[i].src = images[i];
        }
      }
    setFavoriteHeartState(currentBrewery.UniqueID);
    loadSocialImages();
}
function showRecommendations(){
  $('.recommendCatagories').hide();
  $('.recommendFilters').show();
}
function submitSuggestions(){
  submitRecommendations(currentBrewery.UniqueID, activeSuggestions);
  $('.recommendFilters').hide();
}
var activeSuggestions = {};
function toggleSuggestionFilter(btn){
    if(!btn.classList.contains('active')){
      activeSuggestions[btn.innerText] = true;
      btn.classList.add('active');
    } else {
      activeSuggestions[btn.innerText] = false;
      btn.classList.remove('active');
    }
  }
function setFavoriteHeartState(uniqueID){
  if(Favorites.has(uniqueID)){
    favoritesHeart.src = "./assets/images/favorite_plusRed.svg";
  } else {
    favoritesHeart.src = "./assets/images/favorite_plus.svg";
  }
}
function addOrRemoveFavorite(id){
  if(Favorites.has(id)){
    var json = {};
    json['email'] = User["email"];
    json['UniqueID'] = id;

    var request = new XMLHttpRequest()
    request.open('POST', 'https://mb1zattts4.execute-api.us-east-1.amazonaws.com/dev/remove_favorite', true);
    request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    
    // Open a new connection, using the GET request on the URL endpoint
    //request.open('POST', 'https://mb1zattts4.execute-api.us-east-1.amazonaws.com/dev/login', true)

    request.onload = function () {
      favsUpToDate = false;
      // Begin accessing JSON data here
      //var data = JSON.parse(this.response)
      if (request.status >= 200 && request.status < 400) {
        console.log("removed", json);
        Favorites.delete(id);
        setFavoriteHeartState(id);
        return true;
      } else {
        return false;
      }
    }
    
    // Send request
    request.send(JSON.stringify(json))
  } else {
    var json = {};
    json['email'] = User["email"];
    json['UniqueID'] = id;

    var request = new XMLHttpRequest()
    request.open('POST', 'https://mb1zattts4.execute-api.us-east-1.amazonaws.com/dev/add_favorite', true);
    request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    
    // Open a new connection, using the GET request on the URL endpoint
    //request.open('POST', 'https://mb1zattts4.execute-api.us-east-1.amazonaws.com/dev/login', true)

    request.onload = function () {
      favsUpToDate = false;
      // Begin accessing JSON data here
      //var data = JSON.parse(this.response)
      if (request.status >= 200 && request.status < 400) {
        Favorites.set(Number(id), Breweries.get(Number(UniqueID)));
        setFavoriteHeartState(id);
        return true;
      } else {
        return false;
      }
    }

    // Send request
    request.send(JSON.stringify(json))
  }
}
function validateText(str)
{
    var tarea = str;
    if (!tarea.indexOf("http://") == 0 && !tarea.indexOf("https://") == 0) {
        return "https://"+tarea;
    }
    return str;
}
var socialPosts = [];
function loadSocialImages(){
socialPosts = [];
var brewID = currentBrewery.UniqueID;
var request = new XMLHttpRequest()
// Open a new connection, using the GET request on the URL endpoint
request.open('GET', 'https://mb1zattts4.execute-api.us-east-1.amazonaws.com/dev/postsByBrewery/'+brewID, true)

request.onload = function () {
  var data = JSON.parse(this.response)
  if (request.status >= 200 && request.status < 400) {
    data.forEach((blog) => {
        socialPosts.push(blog);
    })
    createSocialImageBlog();
  } else {
    console.log('error')
  }
}
// Send request
request.send()
}
function createReportBreweryPopup(name, id){
  createPopup("Report Brewery",
  `
  <div class="col">
    <div class="row no-gutters">
      <div class="col-auto pr-2">
          Brewery:
        </div>
        <div class="col">
          ${name}
        </div>
      </div>
      <div class="row no-gutters">
        <div class="col-auto"">
          Issue Catagory:
        </div>
        <div class="col">
          <Select id="reportBreweryProfile">
            <option>Inaccurate Info</option>
            <option>Inappropriate Photos</option>
            <option>Hours Wrong</option>
            <option>Permanantly Closed</option>
            <option>Does Not Exist</option>
            <option>Other</option>
          </Select>
        </div>
      </div>
    </div>
    `,
    `
    <div class="col-12 text-left">
      Description:
    </div>
    <div class="col-12">
      <textarea class="w-100" id="reportBreweryTextArea" placeholder="description here"></textarea>
    </div>
    `
  , 
  ()=>{
    submitProfileReport(name, id, document.getElementById('reportBreweryProfile').value, document.getElementById('reportBreweryTextArea').value);
  }, false)
}
function createHoursPopup(){
  createPopup("Hours",
  `
    <div class="col">
      <div class="row no-gutters justify-content-center">
        <div class="col-4">
          Monday:
        </div>
        <div class="col-4">
          ${currentBrewery.monday_hours}
        </div>       
      </div>
      <div class="row no-gutters justify-content-center">
        <div class="col-4">
          Tuesday:
        </div>
        <div class="col-4">
          ${currentBrewery.tuesday_Hours}
        </div>       
      </div>
      <div class="row no-gutters justify-content-center">
        <div class="col-4">
          Wednesday:
        </div>
        <div class="col-4">
          ${currentBrewery.wednesday_Hours}
        </div>       
      </div>
      <div class="row no-gutters justify-content-center">
        <div class="col-4">
          Thursday:
        </div>
        <div class="col-4">
          ${currentBrewery.thursday_Hours}
        </div>       
      </div>
      <div class="row no-gutters justify-content-center">
        <div class="col-4">
          Friday:
        </div>
        <div class="col-4">
          ${currentBrewery.friday_Hours}
        </div>       
      </div>
      <div class="row no-gutters justify-content-center">
        <div class="col-4">
          Saturday:
        </div>
        <div class="col-4">
          ${currentBrewery.saturday_Hours}
        </div>       
      </div>
      <div class="row no-gutters justify-content-center">
        <div class="col-4">
          Sunday:
        </div>
        <div class="col-4">
          ${currentBrewery.sunday_Hours}
        </div>       
      </div>
      <div class="row">
      <div class="col text-center my-4">
        Last Updated: ${currentBrewery.lastUpdated}
      </div>   
      </div>
    </div>
    `,
""
  , 
  null, false)
}
function createSocialImageBlog() {
    createSocialPostBlocks(socialPosts, socialImagesScroller);
    makeImagesZoomable();
}
function createSocialPostsBreweryBlock(post, location){
    var div = document.createElement('div');
    div.setAttribute('class', 'col-4 no-gutters');
    div.setAttribute('id', post.id);
    div.innerHTML = document.getElementById('brewerySocialCardTemplate').innerHTML;

    // You could optionally even do a little bit of string templating
    var image = ""
    if(typeof post.imgurUrl !== 'undefined'){
        image = post.imgurUrl;
    } else {
        image = "/assets/images/quenchedwithbg.png";
    }
    div.innerHTML = div.innerHTML
        .replace(/src=""/g, 'src="' + image + '"');

    // Write the <div> to the HTML container
    //console.log(brewery);
    location.appendChild(div);
}

function createSocialPostBlocks(mapList, location){
    location.innerText = "";
    socialPosts.forEach((posts) => {
      createSocialPostsBreweryBlock(posts, location);
    })
    if(socialPosts.length == 0){
        location.innerText = "No user submissions yet! You could be the first!"
        //socialImagesWrapper.style.height = '60px';
        socialImagesWrapper.classList.add('justify-content-center');
    }
}
function mapsSelector() {
    window.open("https://www.google.com/maps/dir/?api=1&destination="+currentBrewery.Latitude+","+currentBrewery.Longitude+"&dir_action=navigate");
}