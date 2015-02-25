describe('pouchDemo', function() {
  
  beforeEach(module('pouchDemo'));

  beforeEach(inject(function($injector) {
    var suite = this;
    suite.controller = $injector.get('$controller');
    suite.$scope = $injector.get('$rootScope').$new();
    suite.userSettingsMock = {};
    
    suite.createCtrl = function() {
      suite.ctrl = suite.controller('pouchCtrl', {
        $scope: suite.$scope,
        userSettings: suite.userSettingsMock
      });
    };
    suite.createCtrl();
    
  }));
  
  describe('on initialisation', function() {
    
    it('should set scope values', function() {
      expect(this.ctrl).toBeDefined();
    });
    
  });
  
});