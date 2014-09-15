/**
 * navViewModel.js
 */

cr.define('cr.view.nav',function(){
    function initialize(){
        navTemplate = $.templates("#navTmpl");
        container = $("#nav-wrapper");
        var login = function(){
            var next = "shoppingvote/",
                url = cr.settings.login_url + (next ? '?next=' + next : ''),
                redirect = 'https://cas.ust.hk/cas/login?service=' + encodeURIComponent(url);
            //Do the jump
            location.href = redirect;
        }
        var logout = function(){
            var next = "shoppingvote/",
              url = cr.settings.logout_url + (next ? '?next=' + next : '');
            //Do the jump
            location.href = url;
        }
        $(document).on('authload',function(){
            renderData={};
            renderData.username = cr.user ? cr.user.full_name : '';
            container.html(navTemplate.render(renderData));
            $("#link-loginout").on("click",function(){
                if (cr.user) {
                    logout();
                } else {
                    login();
                }
            });
        });
    }
    return{
        initialize: initialize,
    }
});
$(document).on('ready',cr.view.nav.initialize);