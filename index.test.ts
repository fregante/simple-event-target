import {test, vi, expect} from 'vitest';
import SimpleEventTarget from './index.js';

test('listen multiple', () => {
	const target = new SimpleEventTarget();
	const pull = vi.fn();
	const bop = vi.fn();
	target.listen(pull);
	target.listen(bop);
	target.listen(pull);
	target.emit();
	expect(pull).toHaveBeenCalledOnce();
	expect(bop).toHaveBeenCalledOnce();
});

test('listen and unlisten multiple', () => {
	const target = new SimpleEventTarget();
	const twist = vi.fn();
	const yank = vi.fn();
	target.listen(twist);
	target.listen(yank);

	target.unlisten(twist);
	target.emit();
	expect(twist).not.toHaveBeenCalled();
	expect(yank).toHaveBeenCalledOnce();
});

test('accept signal', () => {
	const target = new SimpleEventTarget();

	// Pre-aborted signal
	const launch = vi.fn();
	target.listen(launch, {signal: AbortSignal.abort()});
	target.emit();
	expect(launch).not.toHaveBeenCalled();

	// Post-aborted signal
	const jump = vi.fn();
	const controller = new AbortController();
	target.listen(jump, {signal: controller.signal});

	target.emit();
	expect(jump).toHaveBeenCalledOnce();

	controller.abort();

	target.emit();
	expect(jump).toHaveBeenCalledOnce();
});

test('accept once', () => {
	const target = new SimpleEventTarget();
	const freeze = vi.fn();
	target.listen(freeze, {once: true});
	target.emit();
	target.emit();
	expect(freeze).toHaveBeenCalledOnce();
});

test('pass details', () => {
	const target = new SimpleEventTarget<number>();
	const yeet = vi.fn();
	target.listen(yeet);
	target.emit(1);
	expect(yeet).toHaveBeenCalledWith(1);
});
