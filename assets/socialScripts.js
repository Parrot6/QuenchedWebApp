function createCard(blog, showdelete = false, showdistance = false){
    var divholder = document.createElement('div');
    divholder.setAttribute('class', 'col-12 col-lg-6 pr-lg-2 my-lg-auto no-gutters');
    var div = document.createElement('div');
    div.setAttribute('class', 'cardFrame col-12');
    div.innerHTML = document.getElementById('socialCardTemplate').innerHTML;
    // You could optionally even do a little bit of string templating
    div.innerHTML = div.innerHTML
        .replace(/{User}/g, blog.username)
        .replace(/{Brewery}/g, blog.Brewery)
        .replace(/{Location}/g, blog.location)
        .replace(/{Likes}/g, blog.likes)
        .replace(/src=""/g, 'src="' + blog.imgurUrl + '"');
    var nameAndLoc = div.getElementsByClassName("socialNameAndLocHolder")[0];
    nameAndLoc.setAttribute('id', blog.UniqueID);
    nameAndLoc.onclick = function() {location.href='#openBrewery/'+this.id};
    var dropDownHolder = div.getElementsByClassName("dropdown-menu")[0];
    dropDownHolder.setAttribute('id', blog.id);
    var likes = div.getElementsByClassName('socialLikes')[0];
    var image = div.getElementsByClassName('socialVoteImage')[0];
    image.onclick = function(){voteThisSocialPost(blog.id, this, likes)};
    if(!showdelete){
      div.getElementsByClassName('socialDeleteButton')[0].style.display = "none";
    } else {
      div.getElementsByClassName('socialDeleteButton')[0].style.display = "block";
    }
    if(showdistance && blog.distance){
      div.getElementsByClassName('socialBreweryDistance')[0].style.display = "block";
      div.getElementsByClassName('socialBreweryDistance')[0].innerText = blog.distance;
    } else {
      div.getElementsByClassName('socialBreweryDistance')[0].style.display = "none";
    }
    //console.log(myLiked.has(blog.id))
    if(myLiked.has(blog.id)){
      if(myLiked.get(blog.id) == true) image.src = "./assets/images/mugFull.svg";
    }
    // Write the <div> to the HTML container
    divholder.appendChild(div);
    document.getElementById('socialPosts').appendChild(divholder);
}
var posts = new Map([]);
var fetched = false;
function fetchSocials(){
    if(fetched){
      if(!likesFetched){
        fetchMyLikedPosts();
      }
      document.getElementById('startSocialButton').click();
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
          posts.set(blog.id, blog);
        })
        document.getElementById('startSocialButton').click();
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
      if(fetched) document.getElementById('startSocialButton').click();
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
  var newPosts = new Map([...posts].sort((a, b) => {
    return a[1].Created < b[1].Created ? 1 : -1;
  }));
  drawPosts(newPosts);
}
function sortByTop(button){
  toggleSelectedSort(button);
  var newPosts = new Map([...posts].sort((a, b) => {
    return a[1].likes < b[1].likes ? 1 : -1;
  }));
  drawPosts(newPosts);
}
function sortByLocal(button){
  toggleSelectedSort(button);
  var newPosts = new Map([...posts].filter((post) => {
    return Breweries.has(Number(post[1].UniqueID));
  }));
  newPosts = new Map([...newPosts].sort((a, b) => {
    return calcCrow(currentUserLoc.lat, currentUserLoc.lng, Breweries.get(Number(a[1].UniqueID)).Latitude, Breweries.get(Number(a[1].UniqueID)).Longitude) > calcCrow(currentUserLoc.lat, currentUserLoc.lng, Breweries.get(Number(b[1].UniqueID)).Latitude, Breweries.get(Number(a[1].UniqueID)).Longitude) ? 1 : -1;
  }));
  newPosts.forEach((val)=>{
    val.distance = calcCrow(currentUserLoc.lat, currentUserLoc.lng, Breweries.get(Number(val.UniqueID)).Latitude, Breweries.get(Number(val.UniqueID)).Longitude).toFixed(1) + " miles";
  })
  drawPosts(newPosts, false, true);
}
function sortMyPosts(button){
  toggleSelectedSort(button);
  var id = User["email"]; 
  if(id == "" || id == undefined) return;
  var newPosts = new Map([...posts].filter((post) => {
    return post[1].userEmail == id;
  }));
  // var myposts = posts.filter((post) => {
  //   return post.userEmail == id;
  // })
  drawPosts(newPosts, true);
}
function drawPosts(altList, showdelete = false, showdistance = false){
  var postToDraw = posts;
  if(altList) postToDraw = altList;
  document.getElementById('socialPosts').innerHTML = "";
  postToDraw.forEach(blog => {
    createCard(blog, showdelete, showdistance);
  });
  makeImagesZoomable();
}
function toggleSelectedSort(button){
  var buttons = document.getElementsByClassName('socialSortButton');
  [].forEach.call(buttons, function (element) {
    element.classList.remove('activeSort');
  });
  button.classList.add('activeSort');
}
function socialDelete(PostID, labelnode){
  var json = {};
  json['userEmail'] = User["email"];
  json['id'] = PostID;
  var request = new XMLHttpRequest()
  request.open('POST', 'https://mb1zattts4.execute-api.us-east-1.amazonaws.com/dev/post_delete', true);
  request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

  request.onload = function () {
    // Begin accessing JSON data here
    //var data = JSON.parse(this.response)
    if (request.status >= 200 && request.status < 400) {
      labelnode.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
      posts.delete(PostID);
      return true;
    } else {
      return false;
    }
  }

  // Send request
  request.send(JSON.stringify(json))
}
function socialSaveImage(PostID){
  var selectedPost = posts.get(PostID);
  var a = $("<a>").attr("href", selectedPost.imgurUrl).attr("download", "img.png").appendTo("body");

  a[0].click();

  a.remove();
}
async function socialShareImage(PostID){
  var selectedPost = posts.get(PostID);
  const shareData = {
    title: 'Quenched',
    text: selectedPost.Brewery + " in " + selectedPost.location,
    url: selectedPost.imgurUrl,
  }
  try {
    await navigator.share(shareData)
    console.log('shared successfully');
  } catch(err) {
    console.log('Error: ' + err);
  }
}

function createReportBlogPopup(post){
  post = posts.get(post);
  createPopup("Report Social Post",
  `
  <div class="col">
    <div class="row no-gutters">
      <div class="col-auto pr-2">
          User:
        </div>
        <div class="col">
          ${post.username}
        </div>
      </div>
      <div class="row no-gutters">
        <div class="col-auto"">
          Issue Catagory:
        </div>
        <div class="col">
          <Select id="reportBlogPostCatagory">
            <option>Inappropriate Photo</option>
            <option>Inappropriate Username</option>
            <option>Wrong Brewery</option>
            <option>Wrong Location</option>
            <option>Not A Brewery Photo</option>
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
      <textarea class="w-100" id="reportBlogTextArea" placeholder="description here"></textarea>
    </div>
    <div class="col-12 mt-2">
    <img src="${post.imgurUrl}" style="height: 200px; width: 100%; object-fit: scale-down">
  </div>
    `
  , 
  ()=>{
    submitBlogReport(post, document.getElementById('reportBlogPostCatagory').value, document.getElementById('reportBlogTextArea').value);
  }, false)
}
function submitBlogReport(post, issueType, desc){
  var json = {};
  json['Brewery'] = post.Brewery;
  json['blogPostID'] = post.id;
  json['Catagory'] = issueType;
  json['Description'] = desc;
  json['Email'] = User["email"];

  var request = new XMLHttpRequest()
  request.open('POST', 'https://mb1zattts4.execute-api.us-east-1.amazonaws.com/dev/reportPost', true);
  request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  
  request.onload = function () {
    // Begin accessing JSON data here
    //var data = JSON.parse(this.response)
    if (request.status >= 200 && request.status < 400) {
      return true;
    } else {
      console.log(this.response)
      return false;
    }
  }

  // Send request
  request.send(JSON.stringify(json))
}