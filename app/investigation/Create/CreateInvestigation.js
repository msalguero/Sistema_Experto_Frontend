(function () {

'use strict';

  angular.module('InvestigationApp')

  .controller('CreateInvestigation', [
    '$scope', '$state', 'Investigation', 'Account',
    function($scope, $state, Investigation, Account) {
      var ctrl = this;
      $scope.investigation = {step:1};
      Account.getCurrent(
          function(user) {
              $scope.investigation.accountId = user.id;
            });

      $scope.submit = function(){
        Investigation.create($scope.investigation, 
          function(){
            $state.go("main.investigations");
          });
      };
    }
  ]);

}());