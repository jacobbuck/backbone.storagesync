'use strict';

var Backbone = require('backbone');

function storageSync(settings) {
  settings = typeof settings === 'string' ? { namespace: settings } :
    (settings || {});

  return function sync(method, model, options) {
    var key = (settings.namespace || '') + (model.id || '');

    if (!key) {
      throw new Error('A namespace on storageSync or an id property on ("' + model.cid + '") must be specified.');
    }

    // Get storage object
    var storage = options.storage || settings.storage || storageSync.storage;

    if (!storage) {
      throw new Error('A storage object must be available to storageSync.');
    }

    // Default options
    var async = options.async != void 0 ? options.async : true;

    // Use Deferred as a fake jqXHR Object
    var deferred = Backbone.$.Deferred();

    function internalSync() {
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
      window.setTimeout(internalSync, 1);
    } else {
      internalSync();
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
  storageSync.storage = window.localStorage;
} catch (e) {}

module.exports = storageSync;
