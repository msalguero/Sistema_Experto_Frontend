(function () {

'use strict';

  angular.module('InvestigationApp')

  .controller('Layout', [
    '$rootScope', '$scope', '$state', 'Account', '$translate',
    function($rootScope, $scope, $state, Account, $translate) {
      var ctrl = this;
      
      $scope.changeLanguage = function(langKey) {
        $translate.use(langKey);
      };

      $scope.logout = function(){
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

      $scope.init = function(){
        Account.getCurrent(
          function(response) {
              var user = response;
              $scope.userName = user.username;
            }, function(res) {
              $state.go("login");
            });
      }

      $scope.init();
      // $state.go("main.investigations");
    }
  ]);

}());