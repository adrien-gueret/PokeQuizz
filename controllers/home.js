(function(window, angular)
{
	'use strict';
	
	//Define Home controller.
	window._controller_homeCtrl	=	function($controllerProvider)
	{
		$controllerProvider.register('homeCtrl', ['$scope', 'PokeApi', function($scope, PokeApi)
		{
			$scope.totalPokemons	=	'-';
			
			PokeApi.pokedex(function(pokedex)
			{
				$scope.totalPokemons	=	pokedex.pokemon.length;
			});
		}]);
	};
	
})(window, angular);