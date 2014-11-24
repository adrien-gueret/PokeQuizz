(function(window, angular, undefined)
{
	'use strict';
	
	var TOTAL_QUESTIONS	=	10;
		
	//Define Game controller.
	window._controller_gameCtrl	=	function($controllerProvider)
	{
		$controllerProvider.register('gameCtrl', ['$scope', '$rootScope', '$timeout', '$location', 'PokeApi', '$i18n', function($scope, $rootScope, $timeout, $location, PokeApi, $i18n)
		{
			$scope.busy					=	false;
			$scope.currentPokemon	=	{};
			$scope.answers			=	[];
			$scope.types				=	[];
			
			$scope.$parent.user.score	=	0;
			
			function updateTranslatedType()
			{
				if($scope.currentPokemon.types.length > 1)
					{
						$i18n.loadLocale(function()
						{
							$scope.currentPokemon.firstTypeTranslated	=	$i18n.get($scope.currentPokemon.types[0].name);
						});
					}
			}
			
			$rootScope.$on('i18nLocaleChange', updateTranslatedType);
			
			$scope.loadPokemon	=	function()
			{				
				$scope.currentPokemon.image	=	null;
				
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
					updateTranslatedType();
			
					PokeApi.get(pokemon.sprites[0].resource_uri, function(sprite)
					{
						$scope.currentPokemon.image	=	sprite.image;
					});
					
					$scope.busy	=	false;
				});
			};
			
			$scope.checkType	=	function(type, $event)
			{
				if($event)
				{
					$event.preventDefault();
					$event.stopPropagation();
				}
				
				if($scope.busy)
					return;
					
				$scope.busy	=	true;
				
				var	result,
						highlight_class,
						$element	=	$event ? angular.element($event.target) : undefined;

				if($scope.currentPokemon.types.length === 1)
					result	=	$scope.currentPokemon.types[0].name.toLowerCase() === type;
				else
					result	=	$scope.currentPokemon.types[1].name.toLowerCase() === type;
					
				if(result)
					$scope.$parent.user.score++;
					
				$scope.answers.push(result ? 1 : 0);
				
				if($element)
				{
					highlight_class	=	'highlight_' + (result ? 'success' : 'wrong');
				
					$element.addClass(highlight_class);
				}	
				
				$timeout(function()
				{
					if($element)
						$element.removeClass(highlight_class);
					
					if($scope.answers.length >= TOTAL_QUESTIONS)
						$location.path('/end')
					
				}, 1000);
				
				if($scope.answers.length < TOTAL_QUESTIONS)
					$scope.loadPokemon();
				
				return result;
			};
			
			PokeApi.types(function(types)
			{
				for(var i = 0, l = types.length; i < l; i++)
				{
					if(types[i].id < 1000) //Big IDs from API are "special" types like "Unknown" or "Shadow": we don't want them!
						$scope.types.push(types[i].name.toLowerCase());
				}
			});
		}]);
	};
	
})(window, angular);