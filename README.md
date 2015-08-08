Backbone Storage Sync
=====================

Backbone Sync to Web Storage.

Documentation
-------------

Replace the sync method on your model:

```js
var AwesomeModel = Backbone.Model.extend({
	sync: Backbone.storagesync('awesome-namespace')
	...
});
```

Dependancies
------------

[Backbone](http://backbonejs.org) (obviously), [Underscore](http://underscorejs.org) (or [lodash](https://lodash.com)) and [Fake Storage](https://github.com/jacobbuck/fake-storage) for when Web Storage isn't avaiable.

License
-------

MIT - see [LICENSE](LICENSE)