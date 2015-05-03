Backbone.storagesync
====================

Backbone Sync to Web Storage.

Documentation
-------------

Replace the sync method on your model:

```js
var MyModel = Backbone.Model.extend({
	sync: Backbone.storagesync
	...
});
```

**Important:** Your model must have an id set.

Dependancies
------------

[Backbone](http://backbonejs.org) (obviously), [Underscore](http://underscorejs.org)/[lodash](https://lodash.com) and [Fake Storage](https://github.com/jacobbuck/fake-storage).

License
-------

MIT - see [LICENSE](LICENSE)