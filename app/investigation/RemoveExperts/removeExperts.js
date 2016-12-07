(function () {

'use strict';

  angular.module('InvestigationApp')

  .controller('RemoveExperts', [
    '$scope', '$state', '$stateParams' , 'Investigation', 'Expert', 'Poll',
    function($scope, $state, $stateParams, Investigation, Expert, Poll) {
      var ctrl = this;

      $scope.investigation = Investigation.findById({
        id: $stateParams.id,
        filter:{include:  ['experts', 'polls']}
      }, function(investigation){
        if(investigation.polls && investigation.polls.length === 1){
          Poll.getSuggestions({id: investigation.polls[0].id}, 
            function(result){
              var suggestedExperts = result.data.suggestion;
              for (var i = 0; i < suggestedExperts.length; i++) {
                for (var j = 0; j < $scope.investigation.experts.length; j++) {
                  if($scope.investigation.experts[j].id === suggestedExperts[i].id){
                    $scope.investigation.experts[j].checked = true;
                  }
                };
              };
            });
        }
      });

      $scope.submit =function(){
        for (var i = 0; i < $scope.investigation.experts.length; i++) {
          if(!$scope.investigation.experts[i].checked){
            Expert.deleteById({ id: $scope.investigation.experts[i].id });
          }
        }
        Investigation.prototype$updateAttributes(
           {id:    $stateParams.id},
           {step: 3},
           function(){
            $state.go('main.viewInvestigation',{id: $stateParams.id} );
           }
        );
        
      }
    }
  ]);

}());