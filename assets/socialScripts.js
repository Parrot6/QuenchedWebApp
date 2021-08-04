
function createCard(blog){
    var div = document.createElement('div');
    div.setAttribute('class', 'cardFrame');
    div.innerHTML = document.getElementById('socialCardTemplate').innerHTML;
    // You could optionally even do a little bit of string templating
    div.innerHTML = div.innerHTML
        .replace(/{User}/g, blog.username)
        .replace(/{Brewery}/g, blog.Brewery)
        .replace(/{Location}/g, blog.location)
        .replace(/{Likes}/g, blog.likes)
        .replace(/{imageUrl}/g, blog.imgurUrl);
    var nameAndLoc = div.getElementsByClassName("socialNameAndLocHolder")[0];
    nameAndLoc.setAttribute('id', blog.UniqueID);
    nameAndLoc.onclick = function() {location.href='#openBrewery/'+this.id};
    var likes = div.getElementsByClassName('socialLikes')[0];
    var image = div.getElementsByClassName('socialVoteImage')[0];
    image.onclick = function(){voteThisSocialPost(blog.id, this, likes)};
    //console.log(myLiked.has(blog.id))
    if(myLiked.has(blog.id)){
      if(myLiked.get(blog.id) == true) image.src = "./assets/images/mugFull.svg";
    }
    // Write the <div> to the HTML container
    document.getElementById('socialPosts').appendChild(div);
}
var posts = [];
var fetched = false;
function fetchSocials(){
    if(fetched){
      if(!likesFetched){
        fetchMyLikedPosts();
      }
      return;
    }
    fetchMyLikedPosts();

    var request = new XMLHttpRequest()
    // Open a new connection, using the GET request on the URL endpoint
    request.open('GET', 'https://mb1zattts4.execute-api.us-east-1.amazonaws.com/dev/posts', true)

    request.onload = function () {
      var data = JSON.parse(this.response)
      if (request.status >= 200 && request.status < 400) {
        data.forEach((blog) => {
          posts.push(blog);
        })
        drawPosts();
        fetched = true;
      } else {
        console.log('error');
      }
    }
    // Send request
    request.send()
}
var myLiked = new Map([]);
var likesFetched = false;
function fetchMyLikedPosts(){
  if(User == undefined || User['email'] == undefined || likesFetched){
    return;
  }
  var request = new XMLHttpRequest()
  // Open a new connection, using the GET request on the URL endpoint
  request.open('GET', 'https://mb1zattts4.execute-api.us-east-1.amazonaws.com/dev/likes/'+User['email'], true)

  request.onload = function () {
    var data = JSON.parse(this.response)
    if (request.status >= 200 && request.status < 400) {
      likesFetched = true;
      data.forEach((postInteraction) => {
        myLiked.set(postInteraction.PostID, Boolean(postInteraction.liked));
      })
      if(fetched) drawPosts();
    } else {
      console.log('error fetching my likes')
    }
  }
  // Send request
  request.send()
}
function voteThisSocialPost(id, button, likesDisplay){
  if(myLiked.has(id) && myLiked.get(id) == true){
    var json = {};
    json['UserID'] = User['email'];
    json['PostID'] = id;
    var request = new XMLHttpRequest();
    request.open('POST', 'https://mb1zattts4.execute-api.us-east-1.amazonaws.com/dev/unvote', true);
    request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

    request.onload = function () {
      // Begin accessing JSON data here
      //var data = JSON.parse(this.response)
      if (request.status >= 200 && request.status < 400) {

      } else {

      }
    }
  
    // Send request
    request.send(JSON.stringify(json));
    likesDisplay.innerHTML = Number(likesDisplay.innerHTML) - 1;
    myLiked.set(id, false);
    button.src = "./assets/images/mugEmpty.svg";
  } else {
    var json = {};
    json['UserID'] = User['email'];
    json['PostID'] = id;
    var request = new XMLHttpRequest();
    request.open('POST', 'https://mb1zattts4.execute-api.us-east-1.amazonaws.com/dev/like', true);
    request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

    request.onload = function () {
      // Begin accessing JSON data here
      //var data = JSON.parse(this.response)
      if (request.status >= 200 && request.status < 400) {

      } else {

      }
    }
  
    // Send request
    request.send(JSON.stringify(json))
    myLiked.set(id, true);
    likesDisplay.innerHTML = Number(likesDisplay.innerHTML) + 1;
    button.src = "./assets/images/mugFull.svg";
  }
}
function sortByNew(button){
  toggleSelectedSort(button);
  posts.sort((a, b) => {
    return a.Created < b.Created ? 1 : -1;
  })
  drawPosts();
}
function sortByTop(button){
  toggleSelectedSort(button);
  posts.sort((a, b) => {
    return a.likes < b.likes ? 1 : -1;
  })
  drawPosts();
}
function sortByLocal(button){
  toggleSelectedSort(button);
}
function sortMyPosts(button){
  toggleSelectedSort(button);
  var id = User["email"]; 
  if(id == "" || id == undefined) return; 
  var myposts = posts.filter((post) => {
    return post.userEmail == id;
  })
  drawPosts(myposts);
}
function drawPosts(altList){
  var postToDraw = posts;
  if(altList) postToDraw = altList;
  document.getElementById('socialPosts').innerHTML = "";
  postToDraw.forEach(blog => {
    createCard(blog);
})
}
function toggleSelectedSort(button){
  var buttons = document.getElementsByClassName('socialSortButton');
  [].forEach.call(buttons, function (element) {
    element.classList.remove('activeSort');
  });
  button.classList.add('activeSort');
}