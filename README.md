ah-broadcaster-plugin
=====================

Helps broadcasting a message to every client connection in a channel. Most important difference from chat, it doesn't let clients broadcast anything to anyone.

## How to install
```sh
npm install ah-broadcaster-plugin --save
```
Don't forget to enable plugin in action hero config (config/api.js).

## How to use

There are three methods in this plugin: join, leave and broadcast.

### api.channel.join (connection id, channel id, callback)
You can add any connection to a channel by id anytime you need.
```js
api.channel.join(connection.id, 'my_channel');
```

### api.channel.leave (connection id, channel id, callback)
You can remove any connection from a channel by id anytime you need.
```js
api.channel.leave(connection.id, 'my_channel');
```

### api.channel.broadcast (channel id, callback)
You can broadcast any message to a channel using this method.
```js
api.channel.broadcast('my_channel', {message: 'hello'});
```
