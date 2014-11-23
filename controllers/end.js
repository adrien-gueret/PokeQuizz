(function(window, angular)
{
	'use strict';
	
	//Define End controller.
	window._controller	=	function($controllerProvider)
	{
		$controllerProvider.register('endCtrl', ['$scope', '$location', function($scope, $location)
		{
			if( ! $scope.user || $scope.user.score === undefined)
			{
				$location.path('/game');
				return;
			}
			
			$scope.percent	=	$scope.user.score * 10;
		}]);
	};
	
})(window, angular);