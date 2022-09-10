let colors = [
	['beker', 'violet'],
	['vrije tijd', 'red'],
	['veterans', 'amber'],
	['veteranen', 'amber'],
	['youth', 'green'],
	['jeugd', 'green'],
	['women', 'fuchsia'],
	['dames', 'fuchsia'],
	['men', 'sky'],
	['heren', 'sky'],
];

export default function color(description) {
	let text = description.toLowerCase();
	for (let [match, color] of colors) {
		if (text.includes(match)) return color;
	}

	return 'zinc';
}
