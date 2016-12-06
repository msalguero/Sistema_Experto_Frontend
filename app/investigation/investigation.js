(function () {

'use strict';

  angular.module('InvestigationApp')

  .controller('InvestigationList', [
    '$scope', '$state', 'Investigation', '$mdDialog',
    function($scope, $state, Investigation, $mdDialog) {
      var ctrl = this;
      $scope.editInvestigationModel = {};
      $scope.deleteInvestigationModel = {};

      $scope.investigations = [];
      $scope.Create = function(){
        $state.go('main.createInvestigation');
      };

      $scope.ViewDetails = function(id){
        $state.go('main.viewInvestigation',{id: id} );
      };

      var loadInvestigations = function(){
        Investigation.find({filter:{include:  ['experts', 'variables']}},
          function(investigations){
            $scope.investigations = investigations.slice().reverse();
          });
      }

      loadInvestigations();
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