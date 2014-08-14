/**
 * @fileoverview Provide alert utility.
 */

cr.define('cr.ui', function() {
  var alertTimeout = null;
  
  function showAlert(text, type, opt_delay) {
    var alertTemplate = $.templates("#alertTmpl");
    var alertWrapper = $("#alertWrapper");
    alertWrapper.html(alertTemplate.render({
        type:type,
        info:text,
    }));
    
    var buttonDismiss= $("#buttonAlertDismiss");
    var delay = opt_delay || 5000;
    
    function delayHide(){
        window.clearTimeout(alertTimeout);
        alertTimeout = window.setTimeout(hide, delay);
    }
  
    function show() {
        delayHide();
    }

    function hide() {
        window.clearTimeout(alertTimeout);
        buttonDismiss.click();
    }

    
    alertWrapper.mouseover(show);
    alertWrapper.mouseout(delayHide);
    buttonDismiss.focus(show);
    buttonDismiss.blur(delayHide);
    // Enable tabbing to the link now that it is shown.
    buttonDismiss.tabIndex = 0;

    show();
  }

  return  {
    showAlert: showAlert,
  };
});
