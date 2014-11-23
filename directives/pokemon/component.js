(function(angular, undefined)
{
	angular
		.module('Pokemon', [])
		.directive('pokemon', function()
		{
			return {
				restrict: 'E',
				scope: {
					pokemon:	'='
				},
				templateUrl:	'./directives/pokemon/template.html'
			};
		});

})(angular);