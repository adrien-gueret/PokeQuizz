(function(window, angular)
{
	'use strict';
	
	//Define Game controller.
	window._controller	=	function($controllerProvider)
	{
		$controllerProvider.register('gameCtrl', ['$scope', 'PokeApi', function($scope, PokeApi)
		{
			$scope.currentPokemon	=	{};
			$scope.answers			=	[];
			$scope.types				=	[];
			
			$scope.loadPokemon	=	function()
			{
				PokeApi.randomPokemon(function(pokemon)
				{			
					//Some Pokemons from API does not have any sprites: we have to skip them!
					if( ! pokemon.sprites || ! pokemon.sprites.length)
					{
						$scope.loadPokemon();
						return;
					}
					
					$scope.currentPokemon.name	=	pokemon.name;
					$scope.currentPokemon.types	=	pokemon.types;
			
					PokeApi.get(pokemon.sprites[0].resource_uri, function(sprite)
					{
						$scope.currentPokemon.image	=	sprite.image;
					});
				});
			};
			
			$scope.checkType	=	function(type)
			{
				var result;
								
				if($scope.currentPokemon.types.length === 1)
					result	=	$scope.currentPokemon.types[0].name.toLowerCase() === type;
				else
					result	=	$scope.currentPokemon.types[1].name.toLowerCase() === type;
					
				$scope.answers.push(result ? 1 : 0);
				
				$scope.loadPokemon();
			};
			
			PokeApi.types(function(types)
			{
				for(var i = 0, l = types.length; i < l; i++)
				{
					if(types[i].id < 1000) //Big IDs from API are "special" types like "Unknown" or "Shadow": we don't want them!
						$scope.types.push(types[i].name);
				}
			});
			
			$scope.loadPokemon();
		}]);
	};
	
})(window, angular);