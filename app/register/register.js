(function () {

'use strict';

  angular.module('InvestigationApp')

  .controller('Register', [
    '$scope', '$state', 
    function($scope, $state) {
      var ctrl = this;

      $scope.submit = function(){
      	$state.go("main.investigations");
      };

      $scope.login = function(){
        $state.go("login");
      };
    }
  ]);

}());