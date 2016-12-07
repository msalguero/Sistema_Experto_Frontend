(function () {

'use strict';

  angular.module('InvestigationApp')

  .controller('AnswerPoll', [
    '$scope', '$state', 'Poll', '$stateParams', 'Result', 'Expert', 'Variable',
    function($scope, $state, Poll, $stateParams, Result, Expert, Variable) {
      var ctrl = this;
      var currentVariableNumber = 0;
      $scope.isFirstVariable = true;
      $scope.answers = [];
      $scope.radioButtons = [];

      var init = function(poll){
        if(poll.type === "2"){
          $scope.variables = Variable.find({ 
            filter: { where: { investigationId: poll.investigationId } }
          }, function(){
            $scope.currentVariable = $scope.variables[currentVariableNumber];
          });
        }
      }

      $scope.hideItemInput = true;
      $scope.poll = Poll.findById({ 
        id: $stateParams.pollId 
      }, init);

      console.log("POLL:", $scope.poll);

      $scope.result = {
        "answers": [],
        "expertId": $stateParams.expertId ,
        "pollId": $stateParams.pollId 
      }

      $scope.itemInput = "";

      $scope.submit = function(){
        $scope.result.answers = $scope.poll.questions;
        Result.create($scope.result, function(){
          $scope.pollFilled = true;
          Expert.prototype$updateAttributes(
               {id:    $stateParams.expertId},
               {filled_poll: true}
            );
        });
      };

      $scope.next = function(){
        setAnswers();
        getAnswers();
        console.log($scope.answers);
        console.log($scope.radioButtons);

        $scope.currentVariable = $scope.variables[++currentVariableNumber];
        if(currentVariableNumber + 1 === $scope.variables.length){
          $scope.isFinalVariable = true;
        }
        $scope.isFirstVariable = false;
      }
      $scope.back = function(){
        getAnswers();
        console.log($scope.answers);
        console.log($scope.radioButtons);
        $scope.currentVariable = $scope.variables[--currentVariableNumber];
        if(currentVariableNumber === 0){
          $scope.isFirstVariable = true;
        }
        $scope.isFinalVariable = false;
      }

      var getAnswerIndex = function(){
        var answerIndex = 0;
        for (var i = 0; i < currentVariableNumber; i++) {
          answerIndex += $scope.variables[i].dimensions.length;
        };
        return answerIndex;
      }

      var setAnswers = function(){
        var answerIndex = getAnswerIndex();
        for (var i = 0; i < $scope.radioButtons.length; i++) {
          $scope.answers[i+answerIndex] = $scope.radioButtons[i];
        };
        $scope.radioButtons.length = 0;
      }

      var getAnswers = function(){
        var answerIndex = getAnswerIndex();
        if(answerIndex + $scope.radioButtons.length > $scope.answers.length)
          return;
        for (var i = 0; i < $scope.radioButtons.length; i++) {
          $scope.radioButtons[i] = $scope.answers[i+answerIndex];
        };
      }
    }
  ]);

}());