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

	function storagesync (ns) {
		ns = (ns || '');

		return function (method, model, options) {
			var id = ns + (model.id || '');

			if (!id) {
				throw new Error('A namespace on storagesync or an id property on ("' + model.cid + '") must be specified');
			}

			// Default options
			var async = options.async != void 0 ? options.async : true;

			// Use Deferred as a fake jqXHR Object
			var deferred = Backbone.$.Deferred();

			function sync () {
				var data; // Placeholder

				switch (method) {
					case 'read':
						data = storage.getItem(id);
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
						storage.setItem(id, data);
						deferred.resolve();
						break;

					case 'delete':
						storage.removeItem(id);
						deferred.resolve();
						break;
				}
			}

			// Read/write storage asynchronously, otherwise some browsers may hang
			if (async) {
				setTimeout(sync, 1);
			} else {
				sync();
			}

			// Bind callback options
			deferred.then(options.success, options.error);

			model.trigger('request', model, deferred, options);

			return deferred;
		};
	}

	// Get a storage object
	storagesync.storage = window.localStorage;

	// Piggy-back onto Backbone object
	Backbone.storagesync = storagesync;

	return storagesync;
}));
