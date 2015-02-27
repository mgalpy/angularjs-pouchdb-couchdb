(function() {

  'use strict';

  userSettings.$inject = ['COUCH'];
  pouchCtrl.$inject = ['$scope', 'userSettings', 'SELECTIONS'];

  function userSettings(COUCH) {

    var db = new PouchDB(COUCH.host + COUCH.database);

    function get(user) {
      return db.get(user._id).then(function(doc) {
        return doc;
      });
    }

    function put(data) {
      return db.get(data._id).then(function(data) {
        return db.put(data);
      }).then(function() {
        return db.get(data._id);
      }).then(function(data) {
        console.log(data);
      });
    }

    return {
      get: get,
      put: put
    };
  }

  function pouchCtrl($scope, userSettings, SELECTIONS) {

    var vm = this;

    function resetSelected(selections) {
      return selections.map(function(selection) {
        selection.selected = false;
      });
    }

    resetSelected(SELECTIONS);

    vm.user = {
      _id: null,
      options: SELECTIONS
    }

    $scope.$watch(function() {
      return vm.user;
    }, function(newVal, oldVal) {
      if (newVal !== oldVal) {
        userSettings.put(newVal).then(function(update) {
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
    .value('SELECTIONS', [
      { id: 0,
        name: 'JavaScript'
      },
      { id: 1,
        name: 'Python'
      },
      { id: 2,
        name: 'Scala'
      }
    ])
    .factory('userSettings', userSettings)
    .controller('pouchCtrl', pouchCtrl);

})();
