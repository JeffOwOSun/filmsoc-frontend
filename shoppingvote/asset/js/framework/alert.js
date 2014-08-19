/**
 * @fileoverview Provide alert utility.
 */

cr.define('cr.ui', function() {
  var alertTimeout = null;
  
  function showAlert(text, type, opt_delay) {

    var dialogInstance = new BootstrapDialog();
    dialogInstance.realize()
    dialogInstance.getModalContent().html('<div class="alert alert-'+type+'" role="alert" style="margin-bottom: 0">'+text+'</div>');
    
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
