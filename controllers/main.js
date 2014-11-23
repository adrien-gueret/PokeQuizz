(function(window)
{
	'use strict';
	
	var SUPPORTED_LANGS	=	['en-US', 'fr-FR'];
	
	if( ! window.PokeQuizz)
		throw new ReferenceError('PokeQuizz app not found: did you include app.js?');
		
	window.PokeQuizz.controller('mainCtrl', ['$scope', '$i18n', function($scope, $i18n)
	{
		function updateLocale()
		{
			$i18n.setLocale($scope.user.locale);
		}
		
		//Check user lang and apply correpsonding i18n settings
		$scope.user	=	{
			locale:	window.navigator.userLanguage || window.navigator.language
		};
		
		if(SUPPORTED_LANGS.indexOf($scope.user_lang) === -1)
			$scope.user.locale	=	SUPPORTED_LANGS[0];
		
		$i18n.locales_path	=	'./locales';
		updateLocale();
		
		//Update i18n settings if user changes his locale
		$scope.$watch('user.locale', updateLocale);
	}]);
	
})(window);