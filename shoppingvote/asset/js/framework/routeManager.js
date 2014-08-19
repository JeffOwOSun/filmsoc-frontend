/**
 * routeManager.js
 */
 
 // Client-side routes    
 

cr.define("cr", function(){
    var routeManager = Sammy(function() {
        this.get("/~su_film/shoppingvoting", function(){
            this.redirect("#!shopping");
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