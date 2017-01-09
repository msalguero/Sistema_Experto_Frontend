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

      var setPreviusAnswers = function(_currentVariableNumber){
        try{
          if(!$scope.oldResult) return;
          $scope.variables[_currentVariableNumber].items.map((item, idx)=>{
            if($scope.oldResult.answers[_currentVariableNumber].values[idx].important)
              item.important = 'important';
            else
              item.important = 'notImportant';
            
          });


        }catch(e){
          console.log(e);
        }
      }

      var setItemsWeights= function(_dimensions, weights){
        _dimensions.map((dimen, index)=>{
          if(dimen.name === weights[index].name){
            dimen.weight = weights[index].votes;
          }
        });
      }

      var loadOldAnswers = function(){
        Result.findOne({
          filter: {
            include: ['poll'],
            where:{
              and: [{expertId:  $stateParams.expertId}, {pollId:$stateParams.pollId}, {iteration: $scope.poll.iteration-1}]
            } 
          }
        },function(oldResult){
          $scope.oldResult = oldResult;
          setPreviusAnswers(currentVariableNumber);

          Variable.find({
            filter: {
              where: {
                investigationId: oldResult.poll.investigationId
              }
            }
          }, function(variables){
            console.log("variables: ", variables);
            console.log("$scope.variables: ", $scope.variables);
            $scope.variables.map((_variable, index)=>{
              if(_variable.id === variables[index].id){
                setItemsWeights(_variable.items, variables[index].dimensions );
              }
              
            });
          })

        });


        

      // Poll.getConcordance({ id: $stateParams.pollId}, function(data){
      //       $scope.votes = data.kappa.toFixed(2);
      //       console.log($scope.votes);
      //       });
      }

      var init = function(poll){
        if(poll.type === "2" || poll.type === "3"){
          $scope.variables = poll.questions;
          $scope.currentVariable = $scope.variables[currentVariableNumber];
          
          if(poll.iteration > 0 && poll.type !== "3"){
            loadOldAnswers();

            
          }
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

      $scope.submitRanking = function(){
        $scope.result.answers = $scope.poll.questions.map(function(element){
          return {value: element.text};
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
        $scope.result.iteration = $scope.poll.iteration;
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
        setPreviusAnswers(currentVariableNumber);
        if(currentVariableNumber + 1 === $scope.variables.length){
          $scope.isFinalVariable = true;
        }
        $scope.isFirstVariable = false;
      }
      $scope.back = function(){
        $scope.currentVariable = $scope.variables[--currentVariableNumber];
        setPreviusAnswers(currentVariableNumber);
        if(currentVariableNumber === 0){
          $scope.isFirstVariable = true;
        }
        $scope.isFinalVariable = false;
      }
    }
  ]);

}());