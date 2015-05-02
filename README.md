Backbone.storagesync
====================

Backbone Sync to Web Storage.

Documentation
-------------

Replace the sync method on your model:

```
var MyModel = Backbone.Model.extend({
	sync: Backbone.storagesync
	...
});
``

**Important:** Your model must have an id set.

License
-------

MIT - see [LICENSE](LICENSE)