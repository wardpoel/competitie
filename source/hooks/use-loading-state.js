import { useRef, useState } from 'react';

import useMountedState from './use-mounted-state.js';
import useImmutableCallback from './use-immutable-callback.js';

export default function useLoadingState(func, options = {}) {
	let idRef = useRef(0);

	let [running, setRunning] = useMountedState(false);
	let [pending, setPending] = useMountedState(false);

	let { delayMs = 200, minBusyMs = 500 } = options;

	let callback = useImmutableCallback(async function (...args) {
		let count = ++idRef.current;
		let minBusyPromise;
		setTimeout(function () {
			if (count === idRef.current) {
				minBusyPromise = new Promise(function (resolve) {
					setTimeout(resolve, minBusyMs);
				});

				setPending(true);
			}
		}, delayMs);

		try {
			setRunning(true);

			return await func(...args);
		} finally {
			if (minBusyPromise) await minBusyPromise;
			if (count === idRef.current) {
				idRef.current = -1;
				setRunning(false);
				setPending(false);
			}
		}
	});

	return [callback, running, pending];
}
