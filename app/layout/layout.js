(function () {

'use strict';

  angular.module('InvestigationApp')

  .controller('Layout', [
    '$rootScope', '$scope', '$state', 'Account',
    function($rootScope, $scope, $state, Account) {
      var ctrl = this;
      if(!$rootScope.user)
        $state.go("login");
      else
        $scope.userName = $rootScope.user.username;
      $scope.logout = function(){
        $rootScope.user = false;
        Account.logout(
          function() {
            $state.go("login");
          }, function(res) {
            $scope.error = true;
          });
      };

      $scope.investigations = function(){
        $state.go("main.investigations");
      };
    }
  ]);

}());