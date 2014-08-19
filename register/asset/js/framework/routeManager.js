/**
 * routeManager.js
 */
 
 // Client-side routes    
 

cr.define("cr", function(){
    var routeManager = Sammy(function() {
        this.get("/~ysunai/", function(){
            location.hash="#!home";
        });
    });

    routeManager.pushState=function(hash){
        location.hash = hash;
    }
    $(document).on("ready",function(){
        routeManager.run();
    });
    return {
        routeManager: routeManager,
    }
});