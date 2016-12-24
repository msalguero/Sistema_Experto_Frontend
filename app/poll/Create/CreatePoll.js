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
      else if ($scope.type === "3") 
        $scope.pollName = "Likert";

      $scope.submit = function(){
        Investigation.polls.create(
           { id: $stateParams.id },
          $scope.poll, 
          function(poll){
            var nextStep = 2;
            if($scope.type === "2")
              nextStep = 4;

            Investigation.prototype$updateAttributes(
               {id:    $stateParams.id},
               {step: nextStep},
            function(){
              $state.go('main.viewInvestigation',{id: $stateParams.id} );
            });
            Poll.sendEmails(
              { id: poll.id }
            );
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
          if($scope.type === "1")
            loadRankingQuestions(variables);
          else if($scope.type === "2" || $scope.type === "3")
            loadDichotomicQuestions(variables);
        });
      }

      loadVariables();

      var loadRankingQuestions = function(variables){
        $scope.poll.questions = variables.map(function(variable){
            return { text: variable.name };
          });
      }

      var loadDichotomicQuestions = function(variables){
        $scope.poll.questions = variables.map(function(variable){
            return { name: variable.name, id: variable.id,  items: variable.dimensions.map(function(dimension){return {name: dimension.name, important: false}}) };
          });
      }
    }
  ]);

}());