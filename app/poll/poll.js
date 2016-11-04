(function () {

'use strict';

  angular.module('InvestigationApp')

  .controller('PollList', [
    '$scope', '$state', 'Poll',
    function($scope, $state, Poll) {
      var ctrl = this;

      $scope.data = {
        label: "75%",
        percentage: 75
      }

      $scope.polls = Poll.find();

      $scope.Create = function(){
        $state.go('main.createPoll');
      };

      /*
      $scope.ViewDetails = function(id){
        console.log(id);
        $state.go('main.viewInvestigation',{id: id} );
      };

      $scope.Delete = function(id){
        Investigation.deleteById({ id: id })
          .$promise
          .then(function() { 
            $scope.investigations = Investigation.find({
                filter: { limit: 10 }
              }); 
          });
      };*/
    }
  ]);

}());