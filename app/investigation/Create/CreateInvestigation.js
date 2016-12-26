(function () {

'use strict';

  angular.module('InvestigationApp')

  .controller('CreateInvestigation', [
    '$scope', '$state', 'Investigation', 'Account',
    function($scope, $state, Investigation, Account) {
      var ctrl = this;
      $scope.investigation = {step:1, notes:[]};
      $scope.itemInput = "";
      Account.getCurrent(
          function(user) {
              $scope.investigation.accountId = user.id;
            });

      $scope.submit = function(type){
        $scope.investigation.type = type;
        Investigation.create($scope.investigation, 
          function(){
            $state.go("main.investigations");
          });
      };

      $scope.addItem = function(){
        if(event.which === 13) {
          $scope.investigation.notes.push($scope.itemInput);
          $scope.showNewNote = false;
          $scope.itemInput = "";
          
        }
      };
    }
  ]);

}());