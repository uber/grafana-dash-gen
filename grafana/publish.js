'use strict';
var request = require('request');
var config = require('./config');

function publish(dashboard) {
	var dashboardTitle = dashboard.state.title;
  var dashboardSlug = dashboard.state.meta.slug;
	var dashboardJson = dashboard.generate();

	var url = config.getConfig().url;
	var putUrl = url + dashboardSlug;
	var putData = {
		user: config.getConfig().user,
		group: config.getConfig().group,
		title: dashboardTitle,
		dashboard: dashboardJson,
		tags: []
	};

	var j = request.jar();
	var cookie = request.cookie(config.getConfig().cookie);
	j.setCookie(cookie, url);

	request({
		url: putUrl,
		method: 'PUT',
		json: putData,
		jar: j
	}, function responseHandler(err, response) {
		if (err) {
			console.log('Unable to publish dashboard ' + dashboardTitle);
		} else {
			if ([200, 201].indexOf(response.statusCode) === -1) {
				console.log('Unable to publish dashboard ' + dashboardTitle);
				console.log(response.body);
				console.log('Got statusCode' + response.statusCode);
				console.log('An invalid auth token results in a 302 error!');
			} else {
				console.log('Published the dashboard ' + dashboardTitle);
			}
		}
	});
}

module.exports = publish;
