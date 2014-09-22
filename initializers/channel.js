
var async = require('async');

exports.channel = function (api, next) {
	var redis = api.redis.client;
	var prefix = 'channels:';

	api.channel = {};

	api.channel.join = function (connection_id, channel_id, next) {
		redis.sadd(prefix + channel_id, connection_id, next);
	};

	api.channel.leave = function (connection_id, channel_id, next) {
		redis.srem(prefix + channel_id, connection_id, next);
	};

	api.channel.broadcast = function (channel_id, data, next) {
		async.waterfall([
			function (cb) {
				redis.smembers(prefix + channel_id, cb);
			},
			function (list, cb) {
				async.each(
					list,
					function (connection_id, cb) {
						api.connections.apply(connection_id, 'sendMessage', [JSON.stringify(data)], cb);
					},
					cb
				);
			}
		], next);
	};

	api.connections.addCreateCallback(function (connection) {
		api.channel.join(connection.id, 'all');
	});

	next();
};
