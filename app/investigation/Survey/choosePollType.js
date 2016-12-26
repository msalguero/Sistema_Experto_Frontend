(function () {

'use strict';

  angular.module('InvestigationApp')

  .controller('ChoosePollType', [
    '$scope', '$state', 'Investigation', '$mdDialog', 'Account','$stateParams' ,
    function($scope, $state, Investigation, $mdDialog, Account, $stateParams) {
      
      
      $scope.CreateSurvey = function(type){
          $state.go('main.createPoll', {id: $stateParams.id, type: type});
      }
    }
  ]);

}());