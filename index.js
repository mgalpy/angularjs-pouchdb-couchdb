(function() {
  
  'use strict';
  
  runBootstrap.$inject = ['userSettings'];

  function runBootstrap(userSettings) {
    
    function dbSetup() {
      var db = new PouchDB('foo');
      
      db.info().then(function (info) {
        console.log('pouchDB info: ', info);
      })
    }
    
    userSettings.get();
    dbSetup();
  }
  
  function userSettings() {
    function get() {
      // get settings
    }
    
    function put(data) {
      // put settings
    }
    
    return {
      get: get,
      put: put
    }
  }
  
  function pouchCtrl() {
    function saveSetting(data) {
      // save settings using userSettings.put
    }
  };

  angular.module('pouchDemo', [])
    .run(runBootstrap)
    .factory('userSettings', userSettings)
    .controller('pouchCtrl', pouchCtrl);

})();