var currentBrewery;
function loadpage(){
    currentBrewery = JSON.parse(sessionStorage.getItem("currentBrewery"));
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
    console.log(currentBrewery);
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
      var images = currentBrewery.Image || [];
      console.log(images);
      var i = 0;
      var slides = document.getElementsByClassName('picSlide');
      for(var i = slides.length-1; i >= 0; i--){
        if(i > images.length - 1 && slides.length > 1){
          console.log(slides.length);
          slides[i].remove();
        } else {
          slides[i].src = images[i];
        }
      }
    loadSocialImages();
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
function createSocialImageBlog() {
    createBlocks(socialPosts, socialImagesScroller);
}
function createBreweryBlock(post, location){
    var div = document.createElement('div');
    div.setAttribute('class', 'col-4 no-gutters');
    div.setAttribute('id', post.UniqueID);
    div.innerHTML = document.getElementById('socialCardTemplate').innerHTML;

    // You could optionally even do a little bit of string templating
    var image = ""
    if(typeof post.imgurUrl !== 'undefined'){
        image = post.imgurUrl;
    } else {
        image = "/assets/images/quenchedwithbg.png";
    }
    div.innerHTML = div.innerHTML
        .replace(/{imageUrl}/g, image);

    // Write the <div> to the HTML container
    //console.log(brewery);
    location.appendChild(div);
}

function createBlocks(mapList, location){
    socialPosts.forEach((posts) => {
        createBreweryBlock(posts, location);
    })
    if(socialPosts.length == 0){
        location.innerText = "No user submissions yet! You could be the first!"
        socialImagesWrapper.style.height = '60px';
    }
}
loadpage();