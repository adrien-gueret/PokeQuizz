(function(angular, undefined)
{
	angular
		.module('Pokemon', [])
		
		.directive('pokemon', ['$i18n', function($i18n)
		{
			return {
				restrict: 'E',
				scope: {
					pokemon:	'='
				},
				templateUrl:	'./modules/Pokemon/directives/pokemon.html',
				controller: function($scope)
				{
					var that	=	this;
					
					$scope.pokemon	=	$scope.pokemon || {};
					
					function showLoading()
					{
						$scope.imageLoaded	=	false;
						$scope.internalPokemon	=	{
							name:	null,
							image:	'./images/loading.gif'
						};
						
						$i18n.loadLocale(function()
						{
							if( ! $scope.internalPokemon.name)
								$scope.internalPokemon.name	=	$i18n.get('loading');
						});
					};
					
					showLoading();
					
					that.ready	=	function()
					{
						$scope.imageLoaded	=	true;
						$scope.internalPokemon.name	=	$scope.pokemon.name;
						$scope.internalPokemon.image	=	'//pokeapi.co' + $scope.pokemon.image;
						$scope.$apply();
					};
					
					$scope.$watch('pokemon.image', function()
					{
						showLoading();
						
						if($scope.pokemon.image && $scope.pokemon.image.length)
							that.asyncLoad($scope.pokemon.image);
					});
				}
			};
		}])
		
		.directive('asyncLoading', function()
		{
			return {
				restrict: 'A',
				require: '^pokemon',
				scope: {
					asyncLoading:	'@'
				},
				link: function($scope, element, attrs, pokemonCtrl)
				{
					pokemonCtrl.asyncLoad	=	function(image_src)
					{
						var img	=	new Image();
						
						img.onload	=	pokemonCtrl.ready;
						
						img.src	=	'//pokeapi.co' + image_src;
					};
				}
			};
		})
		
		.filter('pikachuIcon', ['$sce', function($sce)
		{
			return function(input)
			{
				var icon	=	'<span class="pikachu_icon ';
				
				switch(input)
				{
					case 1: icon	+=	'win'; break;
					case 0: icon	+=	'loose'; break;
					default: icon	+=	'pending'; break;
				}
						
				return $sce.trustAsHtml(icon + '"></span>');
			};
		}]);

})(angular);