(function () {

'use strict';

  angular.module('InvestigationApp')

  .controller('Login', [
    '$scope', '$state', 
    function($scope, $state) {
      var ctrl = this;

      $scope.submit = function(){
      	$state.go("main.investigations");
      };

      $scope.register = function(){
      	$state.go("register");
      };
    }
  ]);

}());