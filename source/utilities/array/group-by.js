export default function groupBy(array, ...categorizers) {
	let fn;
	let map = {};
	let [categorizer, ...other] = categorizers;

	if (typeof categorizer === 'string') fn = element => element[categorizer];
	if (typeof categorizer === 'function') fn = categorizer;

	for (let [index, element] of array.entries()) {
		let category = fn(element, index, array);
		if (map[category] == undefined) {
			map[category] = [element];
		} else {
			map[category].push(element);
		}
	}

	if (other.length) {
		for (let key in map) {
			map[key] = groupBy(map[key], ...other);
		}
	}

	return map;
}
