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

      var updateVariable = function(variableId, newDimensions){
        Variable.prototype$updateAttributes(
           {id:    variableId},
           {dimensions: newDimensions},
           function(err, cb){
            console.log("ok: ", cb);
            console.log("error: ", err);
            // $state.go('main.viewInvestigation',{id: $stateParams.id} );
           }
        );
      }

      $scope.submit = function(){

        for(var i = 0; i<$scope.investigation.variables.length; i++){
          var newDimensions = []
          for(var x = 0; x<$scope.investigation.variables[i].dimensions.length; x++){

            if($scope.investigation.variables[i].dimensions[x].checked){
              // $scope.investigation.variables[i].dimensions = $scope.investigation.variables[i].dimensions.splice(x,1);
              newDimensions.push($scope.investigation.variables[i].dimensions[x])
            }
          }
          //$scope.investigation.variables[i].dimensions = newDimensions;
          updateVariable($scope.investigation.variables[i].id, newDimensions);

        }
        
        Investigation.prototype$updateAttributes(
           {id:    $stateParams.id},
           {step: 5},
           function(){
            $state.go('main.viewInvestigation',{id: $stateParams.id} );
           }
        );
        
      }
    }
  ]);

}());