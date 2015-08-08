/*!
 * Backbone Storage Sync - Copyright (c) 2015 Jacob Buck
 * https://github.com/jacobbuck/fake-storage
 * Licensed under the terms of the MIT license.
 */
(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['backbone', 'underscore', 'fake-storage'], factory);
	} else if (typeof exports === 'object') {
		// CommonJS
		exports.storagesync = factory(
			require('backbone'),
			require('underscore'),
			require('fake-storage')
		);
	} else {
		// Browser global
		factory(root.Backbone, root.FakeStorage);
	}
}(this, function (Backbone, _, FakeStorage) {
	'use strict';

	// Get a storage object
	var storage = (function () {
		var test = 'test';

		// Try localStorage first
		try {
			localStorage.setItem(test, test);
			localStorage.removeItem(test);
			return localStorage;
		} catch(e) { }

		// Sometimes sessionStorage is availible as a fallback
		try {
			sessionStorage.setItem(test, test);
			sessionStorage.removeItem(test);
			return sessionStorage;
		} catch(e) { }

		// Otherwise if no DOM storage is available, then use Fake Storage
		return new FakeStorage();
	})();

	function storagesync (ns) {
		ns = (ns || '');

		return function (method, model, options) {
			var id = ns + (model.id || '');

			if (!id) {
				throw new Error('A namespace on storagesync or an id property on ("' + model.cid + '") must be specified');
			}

			// Default options
			_.defaults(options, {
				async: true
			});

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
			if (options.async) {
				_.defer(sync);
			} else {
				sync();
			}

			// Bind callback options
			deferred.then(options.success, options.error);

			model.trigger('request', model, deferred, options);

			return deferred;
		};
	}

	// Piggy-back onto Backbone object
	Backbone.storagesync = storagesync;

	return storagesync;
}));
