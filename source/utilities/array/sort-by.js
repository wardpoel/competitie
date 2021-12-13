export default function sortBy(array, ...props) {
	let map = new WeakMap();
	return array.sort((a, b) => {
		for (let prop of props) {
			if (typeof prop === 'string') {
				let aProp = a[prop];
				let bProp = b[prop];
				if (aProp == undefined) return 1;
				if (bProp == undefined) return -1;
				if (aProp < bProp) return -1;
				if (aProp > bProp) return 1;
			} else if (typeof prop === 'function') {
				let propMap = map.get(prop);
				if (propMap == undefined) {
					propMap = new WeakMap();
					map.set(prop, propMap);
				}

				let aProp = propMap.get(a);
				let bProp = propMap.get(b);

				if (aProp == undefined) {
					aProp = prop(a);
					propMap.set(a, aProp);
				}
				if (bProp == undefined) {
					bProp = prop(b);
					propMap.set(b, bProp);
				}

				if (aProp == undefined) return 1;
				if (bProp == undefined) return -1;
				if (aProp < bProp) return -1;
				if (aProp > bProp) return 1;
			}
		}
		return 0;
	});
}
