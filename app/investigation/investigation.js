(function () {

'use strict';

  angular.module('InvestigationApp')

  .controller('InvestigationList', [
    '$scope', '$state', 'Investigation', '$mdDialog', 'Account',
    function($scope, $state, Investigation, $mdDialog, Account) {
      var ctrl = this;
      $scope.editInvestigationModel = {};
      $scope.deleteInvestigationModel = {};
      $scope.loadingInvestigations = true;
      var userId;
      $scope.investigations = [];
      $scope.Create = function(){
        $state.go('main.createInvestigation');
      };

      $scope.ViewDetails = function(investigation){
        console.log("investigation.type= "+investigation.type);
        if(!investigation.type || investigation.type === "rubric")
          $state.go('main.viewInvestigation',{id: investigation.id} );
        else if(investigation.type === "survey")
          $state.go('main.surveyDashboard',{id: investigation.id} );
      };

      var loadInvestigations = function(){
        $scope.loadingInvestigations = true;
        Investigation.find({filter:{where: { accountId: userId }, include:  ['experts', 'variables']}},
          function(investigations){
            $scope.loadingInvestigations = false;
            $scope.investigations = investigations.slice().reverse();
          });
      }

      Account.getCurrent(
          function(response) {
              var user = response;
              userId = user.id;
              loadInvestigations();
            });
      
      $scope.Delete = function(id){
        Investigation.deleteById({ id: id })
          .$promise
          .then(loadInvestigations);
        $mdDialog.hide();
      };

      $scope.DeleteDialog = function(investigation){
        $scope.deleteInvestigationModel = angular.copy(investigation);
        $scope.alert = $mdDialog.alert({
          contentElement: '#delete-investigation-dialog',
          parent: angular.element(document.body),
          ok: 'Close'
        });

        $mdDialog
          .show( $scope.alert )
          .finally(function() {
            $scope.alert = undefined;
            $("body").css({"overflow":""});
          });
          $("body").css({"overflow":"initial"});
      }

      $scope.editInvestigation = function(investigation){
        $scope.editInvestigationModel = angular.copy(investigation);
        $scope.alert = $mdDialog.alert({
          contentElement: '#edit-investigation-dialog',
          parent: angular.element(document.body),
          ok: 'Close'
        });

        $mdDialog
          .show( $scope.alert )
          .finally(function() {
            $scope.alert = undefined;
            $("body").css({"overflow":""});
          });
          $("body").css({"overflow":"initial"});
      };

      $scope.updateInvestigation = function(){
        Investigation.prototype$updateAttributes(
               {id:    $scope.editInvestigationModel.id},
               $scope.editInvestigationModel,
               loadInvestigations);
        $mdDialog.hide();
      };

      $scope.closeDialog = function(){
        $mdDialog.hide();
      };
    }
  ]);

}());