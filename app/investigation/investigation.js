(function () {

'use strict';

  angular.module('InvestigationApp')

  .controller('InvestigationList', [
    '$scope', '$state', 'Investigation',
    function($scope, $state, Investigation) {
      var ctrl = this;

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
    }
  ]);

}());