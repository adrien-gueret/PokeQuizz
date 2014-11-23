(function(angular, undefined)
{
	angular
		.module('PikachuFilter', [])
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