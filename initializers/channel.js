
var async = require('async');

module.exports = {
	loadPriority:  2000,
	startPriority: 2000,
	stopPriority:  2000,
	initialize: function(api, next){
		var redis = api.redis.client;

		var channel_prefix = 'connections_in_channel:';
		var connection_prefix = 'channels_in_connection:';

		api.channel = {};

		// Add connection id to connection set of channel
		// Add channel id to channel set of connection
		api.channel.join = function (connection_id, channel_id, next) {
			async.parallel([
				function (cb) {
					redis.sadd(channel_prefix + channel_id, connection_id, cb);
					redis.expire(channel_prefix + channel_id, 18000);
				},
				function (cb) {
					redis.sadd(connection_prefix + connection_id, channel_id, cb);
					redis.expire(connection_prefix + connection_id, 18000);
				}
			], next);
		};

		// Remove connection id from connection set of channel
		// Remove channel id from channel set of connection
		api.channel.leave = function (connection_id, channel_id, next) {
			async.parallel([
				function (cb) {
					redis.srem(channel_prefix + channel_id, connection_id, cb);
				},
				function (cb) {
					redis.srem(connection_prefix + connection_id, channel_id, cb);
				}
			], next);
		};

		// Send messsage to every connection in connection set of channel
		api.channel.broadcast = function (channel_id, data, next) {
			async.waterfall([
				function (cb) {
					redis.smembers(channel_prefix + channel_id, cb);
				},
				function (list, cb) {
					async.each(
						list,
						function (connection_id, cb) {
							api.connections.apply(connection_id, 'sendMessage', [data], function(conn) {
								if (!conn.id) remove_connection(connection_id);
							});
							cb();
						},
						cb
					);
				}
			], next);
		};

		api.connections.addMiddleware({
			name: 'broadcaster',
			priority: 1000,
			// Join every connection to a channel named 'all'
			create: function (connection) {
				api.channel.join(connection.id, 'all');
			},
			// Remove being destroyed connection from connection set of every channel
			// Also drop channel set of being destroyed connection
			destroy: function (connection) {
				remove_connection(connection.id);
			}
		});

		function remove_connection (connection_id) {
			async.waterfall([
				function (cb) {
					redis.smembers(connection_prefix + connection_id, cb);
				},
				function (list, cb) {
					async.each(
						list,
						function (channel_id, cb) {
							redis.srem(channel_prefix + channel_id, connection_id, cb);
						},
						cb
					);
				}
			], function () {
				redis.del(connection_prefix + connection_id);
			});
		}

		next();
	}
};
