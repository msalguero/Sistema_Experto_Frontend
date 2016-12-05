(function () {

'use strict';

  angular.module('InvestigationApp')

  .controller('InvestigationList', [
    '$scope', '$state', 'Investigation', '$mdDialog',
    function($scope, $state, Investigation, $mdDialog) {
      var ctrl = this;
      $scope.editInvestigationModel = {};

      $scope.investigations = Investigation.find({filter:{include:  ['experts', 'variables']}});
      $scope.investigations.$promise.then((data)=>{
        $scope.expertsCount = data.length;
        console.log( data );
      })
      $scope.Create = function(){
        $state.go('main.createInvestigation');
      };

      $scope.ViewDetails = function(id){
        console.log(id);
        $state.go('main.viewInvestigation',{id: id} );
      };

      $scope.Delete = function(id){
        Investigation.deleteById({ id: id })
          .$promise
          .then(function() { 
            $scope.investigations = Investigation.find({filter:{include:  ['experts', 'variables']}}); 
          });
      };

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
            function(){
               $scope.investigations = Investigation.find({filter:{include:  ['experts', 'variables']}}); 
            });
        $mdDialog.hide();
      };

      $scope.closeDialog = function(){
        $mdDialog.hide();
      };
    }
  ]);

}());