(function () {

'use strict';

  angular.module('InvestigationApp')

  .controller('RemoveDimensions', [
    '$scope', '$state', '$stateParams' , 'Investigation', 'Expert', 'Poll','Variable',
    function($scope, $state, $stateParams, Investigation, Expert, Poll, Variable) {
      var ctrl = this;
      $scope.investigation = Investigation.findById({
        id: $stateParams.id,
        filter: {include:  ['variables']}
      }, function(investigation){
        $scope.variables = investigation.variables;
        console.log("$scope.variables ", $scope.variables);
      });

      $scope.submit = function(){
        
        // Investigation.prototype$updateAttributes(
        //    {id:    $stateParams.id},
        //    {step: 3},
        //    function(){
        //     $state.go('main.viewInvestigation',{id: $stateParams.id} );
        //    }
        // );
        
      }
    }
  ]);

}());