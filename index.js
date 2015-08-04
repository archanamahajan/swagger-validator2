//var stuff
var apiDefCrawler = require('./lib/apiDefCrawler.js'),
	linter = require('./lib/linterHandler.js'),
	_ = require('lodash');


module.exports = swaggerValidator = function(options){
	var report;
	options = options || {};
	if (options.reporter){
		report = require('./reporters/' + options.reporter);
	} else {
		report = require('./reporters/console');
	}

	this.run = function(callback){
		apiDefCrawler.getDefs(options.swagger, function(err, docs, root){
			linter(docs, root, function(result){
				report(docs, result);
				callback(null);
			});
		});
	};

	this.fetchAndValidate = function(swaggerEndpoint, reporter, callback){
		apiDefCrawler.getDefs(swaggerEndpoint, function(err, docs, root){
			linter(root, docs, function(err, result){
				if (_.isString(reporter)){
					try {
						var report = require('./reporters/' + reporter);
					} catch (ex) {
						console.log('could not find requested reporter');
					}
					report(docs, result);
				} else if (_.isFunction(reporter)) {
					callback = reporter;
				}
				if (_.isFunction(callback)){
					callback(result);
				}
			});
		});
	}

	this.validate = function(root, docs, callback){
		linter(root, docs, function(result){
			callback(result);
		});
	};
};