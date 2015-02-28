(function() {

  'use strict';

  userSettings.$inject = ['COUCH'];
  pouchCtrl.$inject = ['$scope', 'userSettings', 'SELECTIONS'];

  function userSettings(COUCH) {

    var db = new PouchDB(COUCH.host + COUCH.database);

    function get(user, data) {
      return db.get(user).then(function(doc) {
        console.log('user preferences retrieved:', doc);
        return doc;
      }, function(err) {
        console.log('new user added:', user);
        db.put(data);
        return data;
      });
    }

    function put(user, data) {
      return db.get(user).then(function(doc) {
        doc.options = data;
        return db.put(doc);
      }).then(function() {
        return db.get(user);
      }).then(function(doc) {
        console.log('user preferences updated:', doc);
      });
    }

    return {
      get: get,
      put: put
    };
  }

  function pouchCtrl($scope, userSettings, SELECTIONS) {

    var vm = this;

    vm.user = {
      _id: null,
      options: SELECTIONS
    }    
    
    $scope.$watch(function() {
      return vm.user._id;
    }, function(newVal, oldVal) {
      if (newVal !== oldVal) {
        userSettings.get(newVal, vm.user).then(function(store) {
          vm.user = store;
          trackOptions();
          $scope.$apply();          
        });
      }
    });

    function trackOptions() {
      $scope.$watch(function() {
        return vm.user.options;
      }, function(newVal, oldVal) {
        if (newVal !== oldVal) {
          userSettings.put(vm.user._id, newVal).then(function() {
            console.log('user preferences sent:', newVal);
          });
        }
      }, true);
    }

    function resetSelected(selections) {
      return selections.map(function(selection) {
        selection.selected = false;
      });
    }

    resetSelected(SELECTIONS);

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
