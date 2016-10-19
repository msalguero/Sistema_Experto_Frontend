(function () {

'use strict';

  angular.module('InvestigationApp')

  .controller('InvestigationList', [
    '$scope', '$state', 'Investigation',
    function($scope, $state, Investigation) {
      var ctrl = this;

      $scope.investigations = Investigation.find({
        filter: { limit: 10 }
      });

      $scope.Create = function(){
        $state.go('main.createInvestigation');
      };
    }
  ]);

}());