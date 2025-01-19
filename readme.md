# simple-event-target [![][badge-gzip]][link-bundlephobia]

[badge-gzip]: https://img.shields.io/bundlephobia/minzip/simple-event-target.svg?label=gzipped
[link-bundlephobia]: https://bundlephobia.com/result?p=simple-event-target

> Thinnest possible wrapper around native events. It simplifies typing the custom event detail.

## Install

```sh
npm install simple-event-target
```

## Usage

```ts
import SimpleEventTarget from 'simple-event-target';

type Info = {level: 'light' | 'right' | 'coal'};
const toasts = new SimpleEventTarget<Info>();

toasts.listen(info => {
	console.log('Toast popped as', info.level);
})

toasts.emit('right');
```

## API

### SimpleEventTarget

Creates the event target:

```js
const toasts = new SimpleEventTarget();
```

In TypeScript you can also specify the event contents type if used:

```ts
type Info = {level: 'light' | 'right' | 'coal'};
const toasts = new SimpleEventTarget<Info>();
```

#### SimpleEventTarget#listen(listener)

Adds a listener to the target, the listener will be called with the emitted value.

Calling it multiple times with the same listener will not add it multiple times, just like the native `EventTarget`.

```ts
toasts.listen(spread => console.log(`You’ve got a ${spread} toast`));
```

#### SimpleEventTarget#unlisten(listener)

Removes a previously-added listener from the target.


```ts
const listener = spread => console.log(`You’ve got a ${spread} toast`);
toasts.listen(listener);
toasts.unlisten(listener);
```

#### SimpleEventTarget#emit(value)

Calls all the registered listener by passing the value as the main argument:

```js
toasts.listen(console.log);
toasts.emit('Jam');
// -> logs 'Jam'
```

Error handling is the same as using `dispatchEvent` on `EventTarget`.

## License

MIT © [Federico Brigante](https://fregante.com)
