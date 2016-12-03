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
				scope.$watch(attrs.activeStep, function(value) {
					//$( "#" + (value-1)  ).removeClass( "active" ).addClass( "complete" );
				   //$( "#" + value  ).removeClass( "disable" ).addClass( "active" );
				});
				scope.getNumber = function(num) {
					return new Array(num);   
				};
			},
			templateUrl: './directives/StepProgressBar/stepProgressBar.html'
	    };
	});

}());