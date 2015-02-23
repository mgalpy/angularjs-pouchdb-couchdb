(function() {

  'use strict';

  userSettings.$inject = ['COUCH'];
  pouchCtrl.$inject = ['userSettings', '$scope'];

  function userSettings(COUCH) {

    var db = new PouchDB(COUCH.host + COUCH.database);

    function get(user) {
      return db.get(user._id).then(function(doc) {
        return doc;
      });
    }

    function put(data) {
      get(data._id).then(function(doc) {
        doc.options = data.options;
        return db.put(doc);        
      }, function(doc) {
        return db.put(data);
      });
    }

    return {
      get: get,
      put: put
    }
  }

  function pouchCtrl(userSettings, $scope) {

    var vm = this;

    vm.user = {
      _id: null,
      options: [
      { id: 0,
        name: 'JavaScript',
        selected: false },
      { id: 1,
        name: 'Python',
        selected: false },
      { id: 2,
        name: 'Scala',
        selected: false },
    ]};    

    // @todo - feel like there's a cleaner way
    // to push things without user confirmation
    // deep watch not performant
    $scope.$watch(function() {
      return vm.user;
    }, function(newVal, oldVal) {
      if (newVal !== oldVal) {
        userSettings.get(vm.user).then(function(foo) {
          vm.user = foo;
          $scope.$apply();
        });        
        userSettings.put(vm.user);
      }
    }, true);

  };

  angular.module('pouchDemo', [])
    .constant('COUCH', {
      host: 'https://swirlycheetah.iriscouch.com/',
      database: 'user_settings'
    })
    .factory('userSettings', userSettings)
    .controller('pouchCtrl', pouchCtrl);

})();
