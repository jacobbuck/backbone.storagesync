/*!
 * Backbone Storage Sync - Copyright (c) 2015 Jacob Buck
 * https://github.com/jacobbuck/fake-storage
 * Licensed under the terms of the MIT license.
 */
(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['backbone'], factory);
	} else if (typeof exports === 'object') {
		// CommonJS
		exports.storagesync = factory(
			require('backbone')
		);
	} else {
		// Browser global
		factory(root.Backbone);
	}
}(this, function (Backbone) {
	'use strict';

	function storagesync (settings) {
		settings = (typeof settings === 'string') ? {namespace: settings} :
			(settings || {});

		return function (method, model, options) {
			var key = (settings.namespace || '') + (model.id || '');

			if (!key) {
				throw new Error('A namespace on storagesync or an id property on ("' + model.cid + '") must be specified.');
			}

			// Get storage object
			var storage = options.storage || settings.storage || storagesync.storage;

			if (!storage) {
				throw new Error('A storage object must be available to storagesync.');
			}

			// Default options
			var async = options.async != void 0 ? options.async : true;

			// Use Deferred as a fake jqXHR Object
			var deferred = Backbone.$.Deferred();

			function sync () {
				var data; // Placeholder

				switch (method) {
					case 'read':
						data = storage.getItem(key);
						// Wrap in try/catch for JSON parsing issues
						try {
							data = JSON.parse(data);
							deferred.resolve(data);
						} catch (error) {
							deferred.reject(error);
						}
						break;

					case 'create':
					case 'update':
					case 'patch':
						data = JSON.stringify(options.attrs || model.toJSON(options));
						storage.setItem(key, data);
						deferred.resolve();
						break;

					case 'delete':
						storage.removeItem(key);
						deferred.resolve();
						break;
				}
			}

			// Read/write storage asynchronously, otherwise some browsers may block
			if (async) {
				window.setTimeout(sync, 1);
			} else {
				sync();
			}

			// Bind callback options
			deferred.then(options.success, options.error);

			model.trigger('request', model, deferred, options);

			return deferred;
		};
	}

	// Get the default storage object
	// Wrap in try-catch to avoid a SecurityError when user has cookies disabled
	try {
		storagesync.storage = window.localStorage;
	} catch (e) {}

	// Piggy-back onto Backbone object
	Backbone.storagesync = storagesync;

	return storagesync;
}));
