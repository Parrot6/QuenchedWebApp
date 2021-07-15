
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
    nameAndLoc.onclick = function() {openBrewerySocial(this.id)};
    // Write the <div> to the HTML container
    document.getElementById('socialPosts').appendChild(div);
}
var posts = [];
var fetched = false;
function fetchSocials(){
    if(fetched){
        return;
    }
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
        console.log('error')
      }
    }
    // Send request
    request.send()
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
  var myposts = posts.filter((post) => {
    return post.userEmail == "killerparrot6@gmail.com";
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