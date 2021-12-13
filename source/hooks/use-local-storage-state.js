import { useState } from 'react';
import useImmutableCallback from './use-immutable-callback';

const initialState = initialValue => {
	if (typeof initialValue === 'function') {
		return initialValue();
	} else {
		return initialValue;
	}
};

export default function useLocalStorageState(key, initialValue) {
	let [data, setState] = useState(function () {
		try {
			let localData = window.localStorage.getItem(key);
			if (localData) {
				return JSON.parse(window.localStorage.getItem(key));
			} else {
				return initialState(initialValue);
			}
		} catch (error) {
			return initialState(initialValue);
		}
	});

	let setData = useImmutableCallback(function (value) {
		window.localStorage.setItem(key, JSON.stringify(value));
		setState(value);
	});

	return [data, setData];
}
