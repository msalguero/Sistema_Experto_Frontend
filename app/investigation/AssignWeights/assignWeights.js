(function () {

'use strict';

  angular.module('InvestigationApp')

  .controller('AssignWeights', [
    '$scope', '$state', '$stateParams' , 'Investigation', 'Expert', 'Poll','Variable',
    function($scope, $state, $stateParams, Investigation, Expert, Poll, Variable) {
      var ctrl = this;
      var pollId;
      $scope.investigation = Investigation.findById({
        id: $stateParams.id,
        filter: {include:  ['variables', 'polls']}
      }, function(investigation){
        for (var i = 0; i < investigation.polls.length; i++) {
          if(investigation.polls[i].type === '3'){
            pollId = investigation.polls[i].id;
          }
        };
        Poll.assignWeights({id: pollId}, 
        function(result){
          for (var i = 0; i < investigation.variables.length; i++) {
            for (var j = 0; j < investigation.variables[i].dimensions.length; j++) {
              investigation.variables[i].dimensions[j].weight =
              result.weights[investigation.variables[i].id][investigation.variables[i].dimensions[j].name];
            };
          };
        });
      });

      var updateVariable = function(variableId, newDimensions){
        Variable.prototype$updateAttributes(
           {id:    variableId},
           {dimensions: newDimensions},
           function(err, cb){
            // $state.go('main.viewInvestigation',{id: $stateParams.id} );
           }
        );
      }

      $scope.submit = function(){

        for(var i = 0; i<$scope.investigation.variables.length; i++){
          updateVariable($scope.investigation.variables[i].id, $scope.investigation.variables[i].dimensions);
        }
        
        Investigation.prototype$updateAttributes(
           {id:    $stateParams.id},
           {step: 7},
           function(){
            $state.go('main.viewInvestigation',{id: $stateParams.id} );
           }
        );
        
      }
    }
  ]);

}());