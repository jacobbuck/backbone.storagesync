Backbone Storage Sync
=====================

Backbone Sync to Web Storage.

Getting Started
---------------

Replace the sync method on your model:

```js
var AwesomeModel = Backbone.Model.extend({
	sync: Backbone.storagesync()
	...
})
```

Or with custom namespace:

```
var AwesomeModel = Backbone.Model.extend({
	sync: Backbone.storagesync('awesome')
	...
})
```

And you're good to go!

Alternative Storage
-------------------

By default storagesync will use `localStorage`, however you may change it like so:

```
Backbone.storagesync.storage = window.sessionStorage
```

Or if you want a fallback for when Web Storage isn't avaiable:

```
Backbone.storagesync.storage = require('fake-storage')
```

*Note: this example uses my [fake-storage](https://github.com/jacobbuck/fake-storage) library*

Dependancies
------------

[Backbone](http://backbonejs.org) (obviously). Also `Backbone.$.Deferred` must be present.

License
-------

MIT - see [LICENSE](LICENSE)