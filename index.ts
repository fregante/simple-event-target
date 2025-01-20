export type SimpleEventListener<Detail> = (detail: Detail) => void;
export type SimpleEventListenerOptions = {
	signal?: AbortSignal;
	once?: boolean;
};

const eventType = 'batik';

/**
 * Thinnest possible wrapper around native events
 *
 * @usage
 *   const smokeSignals = new SimpleEventTarget();
 *   smokeSignals.add(details => console.log(details))
 *   smokeSignals.emit('The BBQ is ready');
 */
export default class SimpleEventTarget<Detail = void> {
	readonly #target = new EventTarget();
	readonly #weakListeners = new WeakMap<SimpleEventListener<Detail>, EventListener>();

	subscribe(callback: SimpleEventListener<Detail>, options?: SimpleEventListenerOptions): void {
		this.#target.addEventListener(eventType, this.#getNativeListener(callback), options);
	}

	unsubscribe(callback: SimpleEventListener<Detail>): void {
		this.#target.removeEventListener(eventType, this.#getNativeListener(callback));
	}

	emit(detail: Detail): void {
		this.#target.dispatchEvent(new CustomEvent(eventType, {detail}));
	}

	// Permanently map simplified callbacks to native listeners.
	// This acts as a memoization/deduplication which matches the native behavior.
	// Calling `add(cb); add(cb); remove(cb)` should only add it once and remove it once.
	#getNativeListener(
		callback: SimpleEventListener<Detail>,
	): EventListener {
		if (this.#weakListeners.has(callback)) {
			return this.#weakListeners.get(callback)!;
		}

		const native = ((event: CustomEvent<Detail>) => {
			callback(event.detail);
		}) as EventListener;

		this.#weakListeners.set(callback, native);
		return native;
	}
}
