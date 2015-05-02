/*!
 * Fake Storage - Copyright (c) 2015 Jacob Buck
 * https://github.com/jacobbuck/fake-storage
 * Licensed under the terms of the MIT license.
 */
(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['backbone', 'fake-storage'], factory);
	} else if (typeof exports === 'object') {
		// CommonJS
		exports.storagesync = factory();
	} else {
		// Browser global
		factory();
	}
}(this, function (Backbone, FakeStorage) {
	'use strict';

	// Get Storage object
	function getStorage () {
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
	}

	var storage = getStorage();

	function storagesync (method, model, options) {
		var id = model.id;

		if (!id) {
			throw new Error('An id property on ("' + model.cid + '") must be specified');
		}

		// Use Deferred as a fake jqXHR Object
		var deferred = Backbone.$.Deferred();

		// Read/write storage asynchronously, otherwise WebKit browsers will hang
		_.defer(function () {
			var data;
			switch (method) {
				case 'read':
					data = storage.getItem(id);
					if (_.isString(data)) {
						deferred.resolve(JSON.parse(data));
					} else {
						deferred.reject();
					}
					break;

				case 'create':
				case 'update':
				case 'patch':
					data = JSON.stringify(options.attrs || model.toJSON(options));
					storage.setItem(id, data);
					deferred.resolve(data);
					break;

				case 'delete':
					storage.removeItem(id);
					deferred.resolve();
					break;
			}
		});

		// Bind callback options
		deferred.then(options.success, options.error);

		model.trigger('request', model, deferred, options);
		return deferred;
	}

	// Piggy-back onto Backbone object
	Backbone.storagesync = storagesync;

	return storagesync;
}));