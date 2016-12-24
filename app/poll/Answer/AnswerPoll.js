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
        if(poll.type === "2" || poll.type === "3"){
          $scope.variables = poll.questions;
          $scope.currentVariable = $scope.variables[currentVariableNumber];
        }
      }

      $scope.hideItemInput = true;
      $scope.poll = Poll.findById({ 
        id: $stateParams.pollId 
      }, init);

      $scope.result = {
        "answers": [],
        "expertId": $stateParams.expertId ,
        "pollId": $stateParams.pollId 
      }

      $scope.itemInput = "";

      $scope.submit = function(){
        $scope.result.answers = $scope.poll.questions.map(function(element){
          return element.text;
        });
        Result.create($scope.result, function(){
          $scope.pollFilled = true;
          Expert.prototype$updateAttributes(
               {id:    $stateParams.expertId},
               {filled_poll: true}
            );
        });
      };

      $scope.submitDichotomic = function(){
        $scope.result.answers = [];
        for (var i = 0; i < $scope.variables.length; i++) {
          let variableValue = {};
          variableValue.values = []
          variableValue.variableId = $scope.variables[i].id;
          for (var j = 0; j < $scope.variables[i].items.length; j++) {
            let isDimensionImportant = $scope.variables[i].items[j].important === 'important';
            variableValue.values.push({name: $scope.variables[i].items[j].name, important: isDimensionImportant});
          };
          $scope.result.answers.push(variableValue);
        };
        Result.create($scope.result, function(){
          $scope.pollFilled = true;
          Expert.prototype$updateAttributes(
               {id:    $stateParams.expertId},
               {filled_poll: true}
            );
        });
      };

      $scope.submitLikert = function(){
        $scope.result.answers = $scope.poll.questions.map(function(element){
          return {
            id: element.id,
            name: element.name,
            items: element.items.map(function(item){
              return {name: item.name, weight: parseInt(item.weight)}
            })
          };
        });
        console.log($scope.result.answers);
        Result.create($scope.result, function(){
          $scope.pollFilled = true;
          Expert.prototype$updateAttributes(
               {id:    $stateParams.expertId},
               {filled_poll: true}
            );
        });
      };

      $scope.next = function(){
        $scope.currentVariable = $scope.variables[++currentVariableNumber];
        if(currentVariableNumber + 1 === $scope.variables.length){
          $scope.isFinalVariable = true;
        }
        $scope.isFirstVariable = false;
      }
      $scope.back = function(){
        $scope.currentVariable = $scope.variables[--currentVariableNumber];
        if(currentVariableNumber === 0){
          $scope.isFirstVariable = true;
        }
        $scope.isFinalVariable = false;
      }
    }
  ]);

}());