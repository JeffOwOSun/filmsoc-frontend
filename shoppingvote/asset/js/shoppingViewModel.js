/**
 * shoppingViewModel.js
 */

cr.define('cr.view.shopping',function(){
    function show(){
        //make requests

        //render template
            //when the state is ready
                //hide vote button
            //when the state is voting
                //display vote button
            //when the state is passed
                //display vote button
        //hook event handlers
            //click on the item to see detailed disk info
            //if voting
                //click vote to make vote requests
                //show message about remaining votes.
    }

    function initialize(){
        //hook show() onto routeManager      
        //
        
    }
    return{
        initialize: initialize
    }
});
$(document).on('authload',cr.view.shopping.initialize);