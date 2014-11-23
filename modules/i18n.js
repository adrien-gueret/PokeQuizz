(function (window, angular, undefined) {

	angular
		.module('i18n', [])
		.directive('i18n', function($rootScope, $i18n) {
			/*
			 * == Exemples of use ==
			 * <i18n>label</i18n>
			 * <i18n t-param1="Adrien" t-param2="Emilien">label_with_parameters</i18n>
			 * <tagName i18n="label"></tagName>
			 * */

			var _tokenNameToCamelCase	=	function(name){
					return 't' + name.charAt(0).toUpperCase() + name.slice(1);
				},
				_getI18nAttributesCM	=	function() {
					return ['i18n', 'i18nOn', 'i18nOne', 'i18nMany', 'i18nNone'];
				},
				_getI18nAttributes	=	function() {
					return ['i18n', 'i18n-on', 'i18n-one', 'i18n-many', 'i18n-none'];
				};

			return {
				restrict	: 'EA',	//Will be usable via tag Element <i18n> or attribute i18n
				transclude	: false,
				//Adding behavior to the template
				link: function($scope, element, attrs) {
					var label,
						watchingValues			=	0,
						usingAttrs				=	false,
						getTokensAttributes		=	function() {
							var list	=	{};
							angular.forEach(attrs, function (value, key) {
								if(key.charAt(0) === 't') {
									list[key]	=	value;
								}
							});
							return list;
						},

						updateText	=	function () {

							$i18n.loadLocale(function () {
								var tokens	=	{};

								angular.forEach(getTokensAttributes(), function (value, key){
									var var_name		=	key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase().substr(2);
									tokens[var_name]	=	value;
								});

								element.html($i18n.get(label, tokens));
								
								$rootScope.is_i18n_loaded	=	true;
							});							
						},

						updateI18nAttrs	=	function (){

							if(attrs.i18nOn !== undefined) {
								if( ! isNaN(watchingValues)) {
									if(watchingValues > 1 && attrs.i18nMany)
										label	=	attrs.i18nMany;
									else if(watchingValues > 0 && attrs.i18nOne)
										label	=	attrs.i18nOne;
									else if(attrs.i18nNone)
										label	=	attrs.i18nNone;
								}
							} else if(attrs.i18n !== undefined) {
								label	=	attrs.i18n;
							}

							updateText();
						},

						i18nAttributes	=	_getI18nAttributes();

					for(var i = 0, l = i18nAttributes.length; i < l; i++){
						if(element.attr(i18nAttributes[i]) !== undefined) {
							usingAttrs	=	true;
							break;
						}
					}


					//Look for i18n attributes changes for auto-updates
					if(usingAttrs)
					{
						angular.forEach(_getI18nAttributesCM(), function(attr) {
							attrs.$observe(attr, updateI18nAttrs);
						});

						//Add an observer on "switch" attribute if exist
						if(attrs.i18nOn) {
							attrs.$observe(_tokenNameToCamelCase(attrs.i18nOn), function(value) {
								watchingValues	=	parseInt(value, 10);

								updateI18nAttrs();
							});
						}
					}

					//Look for tokens changes
					angular.forEach(getTokensAttributes(), function(value, key) {
						attrs.$observe(key, updateText);
					});

					//Listen for locale changes
					$rootScope.$on('i18nLocaleChange', updateText);

					if(usingAttrs)
						updateI18nAttrs();
					else {
						label	=	element.text();
						updateText();
					}
				}
			};
		})

		.factory('$i18n', function ($http, $rootScope) {

			var $i18n	=	{
				debug				: true,
				locales_path		: '',
				cache_breaker		: 1,
				allLocales			: {},
				_locale				: '',
				_callbacksLocales	: {},
				localeIsLoaded	: function () {
					return $i18n.allLocales[$i18n._locale]	!== undefined;
				},
				getLocale		: function () {
					return $i18n._locale;
				},
				setLocale		: function (locale) {
					if(locale !== $i18n._locale)
					{
						$i18n._locale	=	locale;
						$rootScope.$broadcast('i18nLocaleChange', locale);
					}
				},
				loadLocale		: function (callback, locale) {
					if(locale)
						$i18n.setLocale(locale);

					if( ! $i18n._locale)
						throw new ReferenceError('i18n locale is not set.');

					if( ! $i18n._callbacksLocales[$i18n._locale])
						$i18n._callbacksLocales[$i18n._locale]	=	[];


					if( ! $i18n.allLocales[$i18n._locale]) {

						$i18n.allLocales[$i18n._locale]	=	true;

						if(callback)
							$i18n._callbacksLocales[$i18n._locale].push(callback);

						$http.get($i18n.locales_path + '/' + $i18n._locale + '.json?' + $i18n.cache_breaker)
						.success(function (data) {

							$i18n.allLocales[$i18n._locale]	=	angular.copy(data);

							for(var i = 0, l = $i18n._callbacksLocales[$i18n._locale].length; i < l; i++)
								$i18n._callbacksLocales[$i18n._locale][i]();
						});

					}
					else if(callback) {

						if($i18n.allLocales[$i18n._locale] === true)
							$i18n._callbacksLocales[$i18n._locale].push(callback);
						else
							callback();
					}
				},
				get		: function (label, tokens) {

					if( ! $i18n._locale)
						throw new ReferenceError('i18n locale is not set.');

					if( ! $i18n.localeIsLoaded())
					{
						var err	=	'Locale "' + $i18n._locale +
									'" is not loaded. Please call $i18n.loadLocale().';
							
						throw new ReferenceError(err);
					}

					var text	=	$i18n.allLocales[$i18n._locale][label];

					if( ! text) {
						text	=	label;

						if($i18n.debug && label) {
							window.console.log('Label "' + label + '" does not exist in locale "' + $i18n._locale + '".');
						}
					}

					if(text)
					{
						angular.forEach(tokens, function (value, key) {
							text	=	text.replace(new RegExp('%' + key, 'gi'), value);
						});

						return text;
					}

					return '';
				}
			};

			return $i18n;
		});
})(window, angular);