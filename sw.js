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
  'https://mb1zattts4.execute-api.us-east-1.amazonaws.com/dev/breweries',
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

self.addEventListener('fetch', (e) => {
    //console.log('fetch', e);
    e.respondWith(
      caches.match(e.request).then((response) => response || fetch(e.request).then(fetchRes => {
        return caches.open(dynamicCache).then(cache => {
          if(fetchRes.status == 200){
             cache.put(e.request.url, fetchRes.clone());
          }
          return fetchRes;
        })
      })
      )
      );
});