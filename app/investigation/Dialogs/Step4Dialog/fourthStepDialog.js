
(function () {

'use strict';

  angular.module('InvestigationApp')

  .controller('FourthStepDialog', [
    '$scope', '$state', '$stateParams' , 'Investigation', 'Expert', 'Poll',
    function($scope, $state, $stateParams, Investigation, Expert, Poll) {
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
  }]);

}());