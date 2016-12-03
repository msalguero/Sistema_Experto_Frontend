(function () {

'use strict';

  angular.module('InvestigationApp')

  .controller('RemoveExperts', [
    '$scope', '$state', '$stateParams' , 'Investigation', 'Expert',
    function($scope, $state, $stateParams, Investigation, Expert) {
      var ctrl = this;

      $scope.investigation = Investigation.findById({
        id: $stateParams.id,
        filter:{include:  ['experts']}
      });

      $scope.submit =function(){
        for (var i = 0; i < $scope.investigation.experts.length; i++) {
          if(!$scope.investigation.experts[i].checked){
            Expert.deleteById({ id: $scope.investigation.experts[i].id });
          }
        }
        Investigation.prototype$updateAttributes(
           {id:    $stateParams.id},
           {step: 3}
        );
        $state.go('main.viewInvestigation',{id: $stateParams.id} );
      }
    }
  ]);

}());