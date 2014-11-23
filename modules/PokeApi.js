//Module making calls to PokeApi (pokeapi.co)
(function(angular)
{
	'use strict';
	
	var TOTAL_TYPES	=	20;
	
	angular
		.module('PokeApi', [])
		.service('PokeApi', function($http)
		{
			function PokeApi()
			{
				this._domain			=	'pokeapi.co';
				this._api_version	=	1;
				this._cached_data	=	{};
			}
			
			PokeApi.prototype.buildUriFromEndpoint	=	function(endpoint)
			{
				return '/api/v' + this._api_version + endpoint;
			};
			
			PokeApi.prototype.buildUrlFromURI	=	function(uri)
			{
				//PokeApi is not consistent and sometimes provide URI with /, sometimes not
				if(uri.charAt(0) !== '/')
					uri	=	'/' + uri;
					
				if(uri.charAt(uri.length - 1) !== '/')
					uri	+=	'/';
				
				return '//' + this._domain + uri + '?callback=JSON_CALLBACK';
			};
			
			PokeApi.prototype.get	=	function(uri, onSuccess, onError, get_params)
			{
				//If no success callback, no reason to continue
				if( ! onSuccess)
					return this;
				
				//If URI has already been fetched, no needs to call API again
				if(this._cached_data[uri])
				{
					onSuccess(this._cached_data[uri]);
					return this;
				}
				
				var	that			=	this,
						url			=	that.buildUrlFromURI(uri),
						promise;	
						
				if(get_params)
				{
					for(var key in get_params)
						url	+=	'&' + key + '=' + get_params[key];
				}
				
				promise	=	$http.jsonp(url);
				
				promise.success(function(data)
				{
					that._cached_data[uri]	=	data;
					onSuccess(data);
				});

				if(onError)
					promise.error(onError);
					
				return this;
			};
			
			//Helpers
			PokeApi.prototype.pokedex	=	function(onSuccess, onError)
			{
				return this.get(this.buildUriFromEndpoint('/pokedex/1'), onSuccess, onError);
			};
			
			PokeApi.prototype.randomPokemon	=	function(onSuccess, onError)
			{
				//If no success callback, no reason to continue
				if( ! onSuccess)
					return this;
					
				var that	=	this;
				
				return that.pokedex(function(pokedex)
				{
					var randomPokemon	=	pokedex.pokemon[Math.floor(Math.random() * pokedex.pokemon.length)];
					
					that.get(randomPokemon.resource_uri, onSuccess, onError);
					
				}, onError);
			};
			
			PokeApi.prototype.types	=	function(onSuccess, onError)
			{
				return this.get(this.buildUriFromEndpoint('/type'), function(data)
				{
					if(data.objects)
						onSuccess(data.objects);
					else
						onError(data);
				}, onError, {limit: TOTAL_TYPES});
			};
			
			return new PokeApi();
		});
})(angular);