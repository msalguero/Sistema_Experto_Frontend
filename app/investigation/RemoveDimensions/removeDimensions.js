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
        
        for(var i = 0; i<$scope.investigation.variables.length; i++){
          for(var x = 0; x<$scope.investigation.variables[i].dimensions.length; x++){
            if($scope.investigation.variables[i].dimensions[x].votes != 0){
              $scope.investigation.variables[i].dimensions[x].checked = true;
            }
          }
        }
        console.log("$scope.variables ", $scope.investigation.variables);
      });

      $scope.submit = function(){


        
        // Investigation.prototype$updateAttributes(
        //    {id:    $stateParams.id},
        //    {step: 5},
        //    function(){
        //     $state.go('main.viewInvestigation',{id: $stateParams.id} );
        //    }
        // );
        
      }
    }
  ]);

}());