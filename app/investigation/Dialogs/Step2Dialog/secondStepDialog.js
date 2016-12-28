
(function () {

'use strict';

  angular.module('InvestigationApp')

  .controller('SecondStepDialog', [
    '$scope', '$state', '$stateParams' , 'Investigation', 'Expert', 'Poll',
    function($scope, $state, $stateParams, Investigation, Expert, Poll) {
      var ctrl = this;
      $scope.suggestedExperts = [];
      $scope.discardedExperts = [];
      $scope.investigation = Investigation.findById({
        id: $stateParams.id,
        filter:{include:  ['experts', 'polls']}
      }, function(investigation){
        if(investigation.polls){
          for (var k = 0; k < investigation.polls.length; k++) {
          	if(investigation.polls[k].type === "1"){
          		Poll.getSuggestions({id: investigation.polls[k].id}, 
		            function(result){
		              $scope.suggestedExperts = result.data.suggestion;
		              for (var i = 0; i < $scope.suggestedExperts.length; i++) {
		                for (var j = 0; j < $scope.investigation.experts.length; j++) {
		                  if($scope.investigation.experts[j].id !== $scope.suggestedExperts[i].id){
		                    $scope.discardedExperts.push($scope.investigation.experts[j]);
		                  }
		                };
		              };
		            }
		        );
		        break;
          	}
          };
        }
      });
  }]);

}());