const staticCacheName = "quenched-static-v0";
const dynamicCache ="quenched-dynamic-v0"
const assets = [
  //'/',
  //'/index.html',
  //'/assets/mapScripts.js',
  //'/scss/main.css',
  //'/assets/generalScripts.js',
  'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://code.jquery.com/jquery-3.2.1.slim.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js',
  //'https://mb1zattts4.execute-api.us-east-1.amazonaws.com/dev/breweries',
  //'https://mb1zattts4.execute-api.us-east-1.amazonaws.com/dev/breweryNames'
  //'https://maps.googleapis.com/maps/api/js?key=AIzaSyACqFLMX07OSsE_OPdmoyyxDXKdOVt7QJ4&callback=myMap'
];

self.addEventListener('install', function(event){
  //console.log('service worker has been installed')  
  event.waitUntil(
      caches.open(staticCacheName).then(function(cache) {
        return cache.addAll(assets);
      })
    );
  });
  
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => {
       return Promise.all(keys.filter(key => key !== staticCacheName).map(key => caches.delete(key)));
    })
  )
})

self.addEventListener('fetch', (event) => {
  let request = event.request;
  if (request.url.includes('mb1zattts4') && request.method != "POST") {
    event.respondWith(
      caches.match(request).then(function (response) {
  
        // If there's a cached API and it's still valid, use it
        if (isValid(response)) {
          return response;
        }
  
        // Otherwise, make a fresh API call
        return fetch(request).then(function (response) {
  
          // Cache for offline access
          var copy = response.clone();
          event.waitUntil(caches.open(dynamicCache).then(function (cache) {
            var headers = new Headers(copy.headers);
            headers.append('sw-fetched-on', new Date().getTime());
            return copy.blob().then(function (body) {
              return cache.put(request, new Response(body, {
                status: copy.status,
                statusText: copy.statusText,
                headers: headers
              }));
            });
          }));
  
          // Return the requested file
          return response;
  
        }).catch(function (error) {
          return caches.match(request).then(function (response) {
            return response || fetch(event.request).then(function(response) {
              cache.put(event.request, response.clone());
              return response;
            });
          });
        });
      })
    );
  } else {
    event.respondWith(
        caches.open(dynamicCache).then(function(cache) {
          return cache.match(event.request).then(function (response) {
            return response || fetch(event.request).then(function(response) {
              if(response.status == 200 && event.request.method != "POST"){
              cache.put(event.request, response.clone());
              }
              return response;
            });
          });
        })
    );
  }
})
/**
 * Check if cached API data is still valid
 * @param  {Object}  response The response object
 * @return {Boolean}          If true, cached data is valid
 */
 var isValid = function (response) {
	if (!response) return false;
	var fetched = response.headers.get('sw-fetched-on');
	if (fetched && (parseFloat(fetched) + (1000 * 60 * 60 * 72)) > new Date().getTime()) return true;
	return false;
};