(function () {

  'use strict';

  function userSettings(COUCH, $window) {

    var db = new $window.PouchDB(COUCH.host + COUCH.database);

    function get(user, data) {
      return db.get(user).then(function (doc) {
        console.log('user preferences retrieved:', doc);
        return doc;
      }, function () {
        console.log('new user added:', user);
        db.put(data);
        return data;
      });
    }

    function put(user, data) {
      return db.get(user).then(function (doc) {
        doc.options = data;
        return db.put(doc);
      }).then(function () {
        return db.get(user);
      }).then(function (doc) {
        console.log('user preferences updated:', doc);
      });
    }

    return {
      get: get,
      put: put
    };
  }

  function pouchCtrl($scope, $window, userSettings, SELECTIONS) {

    var vm = this;

    vm.user = {
      _id: $window.localStorage.getItem('user') || '',
      options: SELECTIONS
    };

    function resetSelected(selections) {
      return selections.map(function (selection) {
        selection.selected = false;
        return selection;
      });
    }


    vm.reset = function () {
      $window.localStorage.removeItem('user');
      vm.user = {
        _id: '',
        options: resetSelected(vm.user.options)
      };
    };

    function trackOptions() {
      $scope.$watch(function () {
        return vm.user.options;
      }, function (newVal, oldVal) {
        if (newVal !== oldVal && vm.user._id) {
          userSettings.put(vm.user._id, newVal).then(function () {
            console.log('user preferences sent:', newVal);
          });
        }
      }, true);
    }

    $scope.$watch(function () {
      return vm.user._id;
    }, function (newVal) {
      if (newVal) {
        $window.localStorage.setItem('user', newVal);
        userSettings.get(newVal, vm.user).then(function (store) {
          vm.user = store;
          trackOptions();
          $scope.$apply();
        });
      }
    });

  }

  userSettings.$inject = ['COUCH', '$window'];
  pouchCtrl.$inject = ['$scope', '$window', 'userSettings', 'SELECTIONS'];

  angular.module('pouchDemo', [])
    .constant('COUCH', {
      host: 'https://swirlycheetah.iriscouch.com/',
      database: 'user_settings'
    })
    .value('SELECTIONS', [{
      id: 0,
      name: 'JavaScript'
    }, {
      id: 1,
      name: 'Python'
    }, {
      id: 2,
      name: 'Scala'
    }])
    .factory('userSettings', userSettings)
    .controller('pouchCtrl', pouchCtrl);

}());