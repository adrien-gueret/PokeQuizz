/*How to run:

1° Open a console, go to project root folder and start Selenium process with:
		webdriver-manager start
2°	Open another console, go to tests folder, and lunch e2e tests with:
		protractor e2e/conf.js
		
(go further with http://ramonvictor.github.io/protractor/slides)
*/
exports.config	=	{
	seleniumAddress:	'http://localhost:4444/wd/hub',
	capabilities:	{
		browserName:	'chrome'
	},
	specs:	['e2e.js'],
	jasmineNodeOpts:	{
		showColors:	true,
		defaultTimeoutInterval:	30000
	}
};