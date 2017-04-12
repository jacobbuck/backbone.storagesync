# Backbone Storage Sync

Backbone Sync to Web Storage.

# Getting Started

Replace the sync method on your model:

```js
import storageSync from 'bacbone.storagesync';

const AwesomeModel = Backbone.Model.extend({
	sync: storageSync()
	...
})
```

Or with custom namespace:

```
const AwesomeModel = Backbone.Model.extend({
	sync: storageSync('awesome')
	...
})
```

Or with custom settings:

```
const AwesomeModel = Backbone.Model.extend({
	sync: storageSync({
		namespace: 'awesome',
		storage: window.sessionStorage
	})
	...
})
```

And you're good to go!

# Alternative Storage

By default storagesync will use globally `localStorage`, however you may change it like so:

```
storageSync.storage = window.sessionStorage
```

Or if you want a fallback for when Web Storage isn't available:

```
storageSync.storage = new FakeStorage()
```

*Note: this example uses my [fake-storage](https://github.com/jacobbuck/fake-storage) library*

# Dependancies

[Backbone](http://backbonejs.org), and `Backbone.$.Deferred` must be present.

# License

MIT - see [LICENSE](LICENSE)
