(function () {

'use strict';

  angular.module('InvestigationApp')

  .controller('SurveyList', [
    '$scope', '$state', 'Investigation', '$mdDialog', 'Account','$stateParams' ,
    function($scope, $state, Investigation, $mdDialog, Account, $stateParams) {
      
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