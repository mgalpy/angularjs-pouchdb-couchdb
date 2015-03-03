function userSettings(COUCH, $window) {

  const db = new $window.PouchDB(COUCH.host + COUCH.database);

  function get(user, data) {
    return db.get(user).then((doc) => {
      console.log('user preferences retrieved:', doc);
      return doc;
    }, () => {
      console.log('new user added:', user);
      db.put(data);
      return data;
    });
  }

  function put(user, data) {
    return db.get(user).then((doc) => {
      doc.options = data;
      return db.put(doc);
    }).then(() => {
      return db.get(user);
    }).then((doc) => {
      console.log('user preferences updated:', doc);
    });
  }

  return {
    get,
    put
  };
}

function pouchCtrl($scope, $window, userSettings, SELECTIONS) {

  let vm = this;

  vm.user = {
    _id: $window.localStorage.getItem('user') || '',
    options: SELECTIONS
  };

  function resetSelected(selections) {
    return selections.map((selection) => {
      selection.selected = false;
      return selection;
    });
  }

  vm.reset = () => {
    $window.localStorage.removeItem('user');
    vm.user = {
      _id: '',
      options: resetSelected(vm.user.options)
    };
  };

  vm.pushChange = (pushedValue) => {
    vm.user.options[pushedValue.id] = pushedValue;
    userSettings.put(vm.user._id, vm.user.options).then(() => {
      console.log('user preferences sent:', vm.user.options);
    });
  }

  $scope.$watch(() => {
    return vm.user._id;
  }, (newVal) => {
    if (newVal) {
      $window.localStorage.setItem('user', newVal);
      userSettings.get(newVal, vm.user).then((store) => {
        vm.user = store;
        $scope.$apply();
      });
    }
  });

}

userSettings.$inject = ['COUCH', '$window'];
pouchCtrl.$inject = ['$scope', '$window', 'userSettings', 'SELECTIONS'];

angular.module('pouchDemo', [])
  .constant('COUCH', {
    host: 'https://swirlycheetah.iriscouch.com:6984/',
    database: 'user_preferences'
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
