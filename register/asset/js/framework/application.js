/**
 * @fileoverview Main application control.
 */

cr.define('Application', function() {
  'use strict';

  var membership_table = {
    Full: 'Full Member',
    OneSem: 'One Semester Member',
    OneYear: 'One Year Member',
    TwoYear: 'Two Year Member',
    ThreeYear: 'Three Year Member',
    Honour: 'Honour Member',
    Assoc: 'Asscocitate Member',
  };

  /**
  * Make initializations.
  */
  function initialization() {
    //cr.ui.showLoading();
    
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

document.addEventListener('DOMContentLoaded', Application.initialization);
