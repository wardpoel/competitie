import { useRef, useState } from 'react';

export default function useDerivedState(data) {
	let base = useRef(data);
	let [state, setState] = useState(data);

	if (base.current !== data) {
		base.current = data;
		setState(data);
	}

	return [state, setState];
}
