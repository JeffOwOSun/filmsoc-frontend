/**
 * globalSettings.js Where global variables live.
 */
 
cr.define("cr.settings", function(){
    return {
    //urlBase is used in Sammy.js router to do default routing.
    //Must end with a "/" to match the default behavior of links to ihome.
    //e.g. http://ihome.ust.hk/~itsc will be rewritten as http://ihome.ust.hk/~itsc/ automatically.
    urlBase: "/~su_film/",
    
    
    
    //apiBase The URL to backendAPI base
    apiBase: "http://dml003.resnet.ust.hk:49000/film/api/",
    
    loginUrl: 'http://dml003.resnet.ust.hk:49000/film/member/login/',
    logoutUrl: 'http://dml003.resnet.ust.hk:49000/film/member/logout/',
    
    resourceBase: 'http://ihome.ust.hk/~su_film/asset/',
    uploadBase: 'http://ihome.ust.hk/~su_film/upload/',
    scribdID: 'pub-51573345608846754358',
    }
})