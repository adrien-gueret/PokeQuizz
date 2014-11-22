(function(window, angular)
{
	'use strict';
	
	//Define Home controller.
	window._controller	=	function($controllerProvider)
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