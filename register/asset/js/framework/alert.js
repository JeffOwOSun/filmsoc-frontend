/**
 * @fileoverview Provide alert utility.
 */

cr.define('cr.ui', function() {
  var alertTimeout = null;
  
  function showAlert(text, type, opt_delay) {

    var dialogInstance = new BootstrapDialog({
        message: '<div class="alert alert-'+type+'" role="alert">'+text+'</div>',
    });
    dialogInstance.realize()
    dialogInstance.getModalHeader().hide();
    dialogInstance.getModalFooter().hide();
    
    var delay = opt_delay || 5000;
    
    function delayHide(){
        window.clearTimeout(alertTimeout);
        alertTimeout = window.setTimeout(hide, delay);
    }
  
    function show() {

        dialogInstance.open();
        delayHide();
    }

    function hide() {
        window.clearTimeout(alertTimeout);
        //check if user already closes the dialog by hand.
        if (dialogInstance){
            dialogInstance.close()
        }
    }

    

    show();
  }

  return  {
    showAlert: showAlert,
  };
});
