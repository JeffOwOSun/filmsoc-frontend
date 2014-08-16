/**
 * @fileoverview Main application control.
 */

cr.define('Application', function() {
  'use strict';




 /**
  * Make initializations.
  */
  function initialization() {
    //cr.ui.showLoading();

    $(document).load(function() {
      var r = new cr.APIRequest(cr.model.User, 'GET', '/current_user/', true);

      r.onload = function(ev) {
        /* The example format of ev.recObj
          admin: true
          borrow_history: Array[7]
          borrowed: Array[1]
          errno: 0
          error: ""
          expire_at: "2017-09-01"
          full_name: "SUN, Yushi"
          id: 975
          itsc: "wcitsc"
          join_at: "2013-09-05"
          last_login: "2014-08-08 14:16:40"
          login_count: 48
          member_type: "Full"
          mobile: "00000000"
          pennalized: false
          reserved: Array[0]
          rfs_count: 1
          student_id: "00000000"
          this_login: "2014-08-11 07:14:17"
          university_id: "000000000"
        */
        //define cr.user, while making it as read-only as possible.
        cr.define("cr", function(){ 
          var privateUser=deepCopy(ev.recObj)
          var user={}
          for (var key in privateUser){
            if (privateUser.hasOwnProperty(key)){
              Object.defineProperty(user,key,{
                value: privateUser[key],
              })
            }
          };
          return {
            user: user
          }; 
        });
        
        
        cr.ui.showAlert(ev.recObj.full_name + ', Welcome back!', 'success');
        cr.model.SiteSettings.loadSettings(function() {
          //CUSTOM EVENT to indicate user has been loaded
          $(document).trigger('authload');
          //display login panel
          //determine what button should be shown.
        });
      };
      r.onerror = function(ev) {
        if (ev.recObj.errno === 2) {
          //Not logged in
          //Hook Guest panel
          $('user-wrapper').querySelector('.link-login').addEventListener('click', function() {
            var next = location.hash.substr(1),
                url = cr.settings.login_url + (next ? '?next=' + next : ''),
                redirect = 'https://cas.ust.hk/cas/login?service=' + encodeURIComponent(url);
            //Do the jump
            location.href = redirect;
          });
          //Always fetch SiteSettings
          cr.model.SiteSettings.loadSettings(function() {
            cr.dispatchSimpleEvent(window, 'authload', false, false);
          });
        }
        else {
          //Give it to error handler
          errorHandler(ev);
        }
      };
      r.send();
    });

    window.addEventListener('authload', cr.ui.hideLoading);
    cr.define('cr', function() {
      return {
        errorHandler: errorHandler,
        notFoundHandler: notFoundHandler,
      };
    });
    
    cr.define('cr', function() {
      return {
        errorHandler: errorHandler,
        notFoundHandler: notFoundHandler,
      };
    });

  }



  /**
  * Handle errors.
  * @param {Event} ev The event of error
  */
  function errorHandler(ev) {
    var errno = ev.recObj.errno,
        error = ev.recObj.error || 'Connection Failed';
    switch(errno) {
      case 0: //Client Network Problem
      case 1: //Format Error
      case 2: //Authentication Error
      case 3: //Procedure Error
        cr.ui.showAlert(error, 'danger');
        break;
      case 404: //Not Found Error
        notFoundHandler();
        break;
      default: //Other Server Error
        cr.ui.showAlert('Server: ' + error+', try again later', 'warning');
    }
  }

  /**
  * Handle not found error.
  */
  function notFoundHandler() {
    
  }

  

  return {
    initialization: initialization,
  };
});

$(document).ready(Application.initialization);
