import {test, vi, expect} from 'vitest';
import SimpleEventTarget from 'simple-event-target';

test('subscribe multiple', () => {
	const target = new SimpleEventTarget();
	const pull = vi.fn();
	const bop = vi.fn();
	target.subscribe(pull);
	target.subscribe(bop);
	target.subscribe(pull);
	target.emit();
	expect(pull).toHaveBeenCalledOnce();
	expect(bop).toHaveBeenCalledOnce();
});

test('subscribe and unsubscribe multiple', () => {
	const target = new SimpleEventTarget();
	const twist = vi.fn();
	const yank = vi.fn();
	target.subscribe(twist);
	target.subscribe(yank);

	target.unsubscribe(twist);
	target.emit();
	expect(twist).not.toHaveBeenCalled();
	expect(yank).toHaveBeenCalledOnce();
});

test('accept signal', () => {
	const target = new SimpleEventTarget();

	// Pre-aborted signal
	const launch = vi.fn();
	target.subscribe(launch, {signal: AbortSignal.abort()});
	target.emit();
	expect(launch).not.toHaveBeenCalled();

	// Post-aborted signal
	const jump = vi.fn();
	const controller = new AbortController();
	target.subscribe(jump, {signal: controller.signal});

	target.emit();
	expect(jump).toHaveBeenCalledOnce();

	controller.abort();

	target.emit();
	expect(jump).toHaveBeenCalledOnce();
});

test('accept once', () => {
	const target = new SimpleEventTarget();
	const freeze = vi.fn();
	target.subscribe(freeze, {once: true});
	target.emit();
	target.emit();
	expect(freeze).toHaveBeenCalledOnce();
});

test('pass details', () => {
	const target = new SimpleEventTarget<number>();
	const yeet = vi.fn();
	target.subscribe(yeet);
	target.emit(1);
	expect(yeet).toHaveBeenCalledWith(1);
});
