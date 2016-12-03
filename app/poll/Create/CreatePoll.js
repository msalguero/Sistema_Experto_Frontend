(function () {

'use strict';

  angular.module('InvestigationApp')

  .controller('CreatePoll', [
    '$scope', '$state', 'Poll', '$stateParams', 'Investigation',
    function($scope, $state, Poll, $stateParams,  Investigation) {
      var ctrl = this;
      $scope.hideItemInput = true;
      $scope.poll = {
        questions:[],
        type: $stateParams.type
      };
      console.log($stateParams);
      $scope.itemInput = "";
      $scope.type = $stateParams.type;

      if($scope.type === "1")
        $scope.pollName = "Ranking";
      else if($scope.type === "2")
        $scope.pollName = "Dichotomic";

      $scope.submit = function(){
        Investigation.polls.create(
           { id: $stateParams.id },
          $scope.poll, 
          function(poll){
            console.log(poll);
            Investigation.prototype$updateAttributes(
               {id:    $stateParams.id},
               {step: 2}
            );
            Poll.sendEmails(
              { id: poll.id }
            );
            $state.go('main.viewInvestigation',{id: $stateParams.id} );
          });
      };

      $scope.addItem = function(){
        if(event.which === 13) {
          $scope.poll.questions.push($scope.itemInput);
          $scope.hideItemInput = true;
          $scope.itemInput = "";
          
        }
      };

      $scope.showItemInput = function(){
        $scope.hideItemInput = false;
        setTimeout(function() { $( "#new-item-input" ).focus(); }, 100);
      }

      var loadVariables = function(){
         Investigation.variables({
          id: $stateParams.id
        }, function(variables){
          console.log(variables);
          $scope.poll.questions = variables.map(function(variable){
            return variable.name;
          });
        });
      }

      loadVariables();
    }
  ]);

}());