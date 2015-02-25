(function() {

  'use strict';

  userSettings.$inject = ['COUCH'];
  pouchCtrl.$inject = ['$scope', 'userSettings'];

  function userSettings(COUCH) {

    var db = new PouchDB(COUCH.host + COUCH.database);

    function get(user) {
      return db.get(user._id).then(function(doc) {
        return doc;
      });
    }

    function put(data) {
      db.get(data._id).then(function (doc) {
        doc = data;
        return db.put(doc);
      }).then(function () {
        return db.get(data._id);
      }).then(function (doc) {
        console.log(doc);
      });
    }

    return {
      get: get,
      put: put
    };
  }

  function pouchCtrl($scope, userSettings) {

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
        userSettings.get(vm.user).then(function(update) {
          vm.user = update;
          $scope.$apply();
        });
      }
    }, true);

  }

  angular.module('pouchDemo', [])
    .constant('COUCH', {
      host: 'https://swirlycheetah.iriscouch.com/',
      database: 'user_settings'
    })
    .factory('userSettings', userSettings)
    .controller('pouchCtrl', pouchCtrl);

})();
