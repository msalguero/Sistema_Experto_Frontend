(function () {

'use strict';

  angular.module('InvestigationApp')

  .controller('CreateInvestigation', [
    '$scope', '$state', 'Investigation',
    function($scope, $state, Investigation) {
      var ctrl = this;
      $scope.investigation = {step:1};

      $scope.submit = function(){
        Investigation.create($scope.investigation, 
          function(){
            $state.go("main.investigations");
          });
      };
    }
  ]);

}());