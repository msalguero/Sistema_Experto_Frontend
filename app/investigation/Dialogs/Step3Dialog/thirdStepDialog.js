
(function () {

'use strict';

  angular.module('InvestigationApp')

  .controller('ThirdStepDialog', [
    '$scope', '$state', '$stateParams' , 'Investigation', 'Expert', 'Poll',
    function($scope, $state, $stateParams, Investigation, Expert, Poll) {
      var ctrl = this;

      console.log("test");
  }]);

}());