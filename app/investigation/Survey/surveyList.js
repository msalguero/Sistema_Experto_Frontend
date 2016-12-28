(function () {

'use strict';

  angular.module('InvestigationApp')

  .controller('SurveyList', [
    '$scope', '$state', 'Investigation', '$mdDialog', 'Account','$stateParams' ,
    function($scope, $state, Investigation, $mdDialog, Account, $stateParams) {

      $scope.setStyle = function(poll){
        var myObj = {
          "box-shadow": "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
          "margin": "1%",
          "border-radius": "5px",
          "overflow": "hidden",
          "width": "30%"

        };
        switch(poll.type){
          case "1":
            myObj["background-color"] = "white";
          break;
          case "2":
            myObj["background-color"] = "white";
            break;
          case "3":
            myObj["background-color"] = "white";
            break;
        }

        return myObj;

      }





      $scope.investigation = Investigation.findById({
        id: $stateParams.id,
        filter: {include:  ['polls']}
      }, function(investigation){
        console.log(investigation);

        
      });
      
      $scope.CreateSurvey = function(){
        $state.go('main.pollType', {id: $stateParams.id});
      }
    }
  ]);

}());