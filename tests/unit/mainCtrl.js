describe('Going to', function()
{  
	beforeEach(module('PokeQuizz'));

	var $controller, $scope, $controllerProvider;

	beforeEach(inject(function(_$controller_, _$rootScope_)
	{
		$controller 			=	_$controller_;
		$scope					=	_$rootScope_.$new();
		$parent					=	_$rootScope_.$new();
		$controllerProvider	=	angular.module('PokeQuizz').$controllerProvider;
	}));
	
	describe('mainCtrl', function()
	{  
		beforeEach(function()
		{
			$controller('mainCtrl', {$scope: $scope});
		});
		
		it('should create scope.user', function()
		{
			expect($scope.user).toBeDefined();
		});
		
		it('should set locale to either fr-FR or en-US', function()
		{
			expect((['fr-FR', 'en-US'].indexOf($scope.user.locale) > -1)).toBe(true);
		});
	});
	
	describe('gameCtrl', function()
	{  
		beforeEach(function()
		{
			$controller('mainCtrl', {$scope: $parent	});
			
			$scope.$parent	=	$parent;
			
			window._controller_gameCtrl($controllerProvider);
			$controller('gameCtrl', {$scope: $scope});
		});
		
		
		it('should set user score to 0', function()
		{
			expect($scope.$parent.user.score).toBe(0);
		});
		
		describe('and try to answer', function()
		{
			beforeEach(function()
			{
				$scope.currentPokemon	=	{
					name:	'ludicolo',
					types:	[{name: 'grass'}, {name: 'water'}]
				};
				
				//Overwritte calls to API
				spyOn($scope, 'loadPokemon').andCallFake(function()
				{
					$scope.currentPokemon.name	=	'Pikachu';
					$scope.currentPokemon.types	=	[{name: 'electric'}];
					$scope.currentPokemon.image	=	'dummy.png';
				});
				
			});
			
			it('should be wrong on wrong type', function()
			{
				expect($scope.checkType('fire')).toBe(false);
			});
			
			it('should be wrong if answer same as first type', function()
			{
				expect($scope.checkType('grass')).toBe(false);
			});
			
			it('should be good on right type', function()
			{
				expect($scope.checkType('water')).toBe(true);
			});
			
			it('should change the Pokémon to guess', function()
			{
				$scope.checkType('water');
				expect($scope.currentPokemon.name === 'ludicolo').toBe(false);
			});
		});
	});
});