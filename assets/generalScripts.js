  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./sw.js')
      .then((reg) => { console.log('Service Worker Registered', reg); })
      .catch((error) => { console.log('Service Worker Failed.', error)})
  }

// window.addEventListener('beforeinstallprompt', (e) => {
//     // Prevent Chrome 67 and earlier from automatically showing the prompt
//     e.preventDefault();
//     // Stash the event so it can be triggered later.
//     deferredPrompt = e;
//     // Update UI to notify the user they can add to home screen
//     addBtn.style.display = 'block';
  
//     addBtn.addEventListener('click', () => {
//       // hide our user interface that shows our A2HS button
//       addBtn.style.display = 'none';
//       // Show the prompt
//       deferredPrompt.prompt();
//       // Wait for the user to respond to the prompt
//       deferredPrompt.userChoice.then((choiceResult) => {
//         if (choiceResult.outcome === 'accepted') {
//           console.log('User accepted the A2HS prompt');
//         } else {
//           console.log('User dismissed the A2HS prompt');
//         }
//         deferredPrompt = null;
//       });
//     });
//   });

//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)

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
  sessionStorage.setItem("currentBrewery", JSON.stringify(currentBrewery));
  console.log(currentBrewery);
  window.location.pathname = './breweryProfile.html';
  } else {
      loadBrewery(UniqueID);
      var currentBrewery = Breweries.get(Number(UniqueID));
      sessionStorage.setItem("currentBrewery", JSON.stringify(currentBrewery));
      console.log(currentBrewery);
      window.location.pathname = './breweryProfile.html';
  }
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
      return true;
    } else {
      return false;
    }
  }

  // Send request
  request.send()
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
  console.log("ID: " + profile.getId()); // Don't send this directly to your server!
  console.log('Full Name: ' + profile.getName());
  console.log('Given Name: ' + profile.getGivenName());
  console.log('Family Name: ' + profile.getFamilyName());
  console.log("Image URL: " + profile.getImageUrl());
  console.log("Email: " + profile.getEmail());

  // The ID token you need to pass to your backend:
  var id_token = googleUser.getAuthResponse().id_token;
  console.log("ID Token: " + id_token);
  var json = {};
  json['email'] = profile.getEmail();
  json['name'] = profile.getGivenName();
  json['fullName'] = profile.getName();
  json['familyName'] = profile.getFamilyName();
  json['image'] = profile.getImageUrl();
  json['token'] = id_token;

  var request = new XMLHttpRequest()
  // Open a new connection, using the GET request on the URL endpoint
  request.open('POST', 'https://mb1zattts4.execute-api.us-east-1.amazonaws.com/dev/login', false)

  request.onload = function () {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response)
    if (request.status >= 200 && request.status < 400) {
      User = json;
      User["loggedIn"] = true;
      return true;
    } else {
      return false;
    }
  }

  // Send request
  request.send(JSON.stringify(json))
}