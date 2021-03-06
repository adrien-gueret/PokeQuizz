/*== Angular app definition ==*/
(function(window, document, angular)
{
	'use strict';
	
	var	PokeQuizz			=	angular.module('PokeQuizz', ['ngRoute', 'i18n', 'PokeApi', 'Pokemon']),
			loadedControllers	=	{};

	PokeQuizz
		.config([
			'$compileProvider',
			function($compileProvider)
			{   
				$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file):|data:image\//);
			}
		])
		.config([
			'$routeProvider',
			'$controllerProvider',
			function($routeProvider, $controllerProvider)
			{
				var routes	=	['home', 'game', 'end'];
				
				//Exposte $controllerProvider for units testings
				PokeQuizz.$controllerProvider	=	$controllerProvider;
				
				for(var i = 0, l = routes.length; i < l; i++)
				{
					(function(routeName)
					{
						$routeProvider.when('/' + routeName,
						{
							templateUrl:	'./views/' + routeName + '.html',
							controller:		routeName + 'Ctrl',
							//Handle preloading
							resolve:			{
								preload:	function($q)
								{
									//If controller already loaded, no need to reload it
									if( ! loadedControllers[routeName])
									{
										var	deferred	=	$q.defer(),
												script		=	document.createElement('script');
										
										script.onload	=	function()
										{
											loadedControllers[routeName]	=	true;
											//Call function we've just loaded: it contains the new controller definition
											var ctrlNameProvider	=	'_controller_' + routeName + 'Ctrl';
											window[ctrlNameProvider]($controllerProvider);
											delete window[ctrlNameProvider];
											
											//All is ready, we can tell AngularJS it can proceeds routing
											deferred.resolve();
										};
										script.src		=	'./controllers/' + routeName + '.js';
										document.body.appendChild(script);
										
										return deferred.promise;
									}
								}
							}
						});
					})(routes[i]);
				}
					
				$routeProvider.otherwise({redirectTo: '/home'});
			}]);
	
	window.PokeQuizz	=	PokeQuizz;
	
})(window, document, angular);