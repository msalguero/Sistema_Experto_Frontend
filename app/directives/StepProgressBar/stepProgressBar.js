(function () {

'use strict';

  angular.module('InvestigationApp')

  .directive('stepProgressBar', function() {

		return {
			restrict: 'E',
			scope: {
			  steps: '=steps',
			  activeStep: '=activeStep'
			},
			link: function (scope, element, attrs) {

				scope.getNumber = function(num) {
					return new Array(num);   
				};
			},
			templateUrl: './directives/StepProgressBar/stepProgressBar.html'
	    };
	});

}());