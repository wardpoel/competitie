import { provincesByAbbreviations } from '../provinces';
import { superRegex, nationalRegex, regionalRegex, provincialRegex } from '../regexes';

export default function path(name) {
	let match;
	if ((match = name.match(provincialRegex))) {
		let province = provincesByAbbreviations[match[1]];
		return `provincial/${province.url}`;
	} else if (superRegex.test(name)) {
		return 'super';
	} else if (nationalRegex.test(name)) {
		return 'national';
	} else if ((match = name.match(regionalRegex))) {
		let region = match[1];
		if (region === 'RegionVTTL') {
			return 'regional/flanders';
		} else if (region === 'RegionIWB') {
			return 'regional/wallonia';
		}
	}
}

export { superRegex, nationalRegex, regionalRegex, provincialRegex };
