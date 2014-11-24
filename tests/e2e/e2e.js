var ROOT_URL	=	'http://localhost/PokeQuizz/';

function formatURL(endpoint)
{
	return ROOT_URL + '#' + endpoint;
}

describe('First navigation', function()
{
	describe('Directly go to root URL', function()
	{
		it('should redirect to /home', function()
		{
			browser.get(ROOT_URL);
			expect(browser.getLocationAbsUrl()).toEqual(formatURL('/home'));
		});
	});
	
	describe('Go to non-existed page', function()
	{
		it('should redirect to /home', function()
		{
			browser.get(formatURL('/missingno'));
			expect(browser.getLocationAbsUrl()).toEqual(formatURL('/home'));
		});
	});
	
	describe('Go to /end', function()
	{
		it('should redirect to /game', function()
		{
			browser.get(formatURL('/end'));
			expect(browser.getLocationAbsUrl()).toEqual(formatURL('/game'));
		});
	});
});

describe('Game page', function()
{
	browser.get(formatURL('/game'));
	
	it('should display 10 Pikachu icons', function()
	{		
		element.all(by.css('.pikachu_icon')).then(function(icons)
		{
			expect(icons.length).toBe(10);
		});
	});
});