const colors = {
	1: 'sky',
	2: 'fuchsia',
	3: 'amber',
	4: 'amber',
	13: 'green',
};

export default function color(categoryId, description) {
	if (description) {
		let normalizedDescription = description.toLowerCase();
		if (normalizedDescription.includes('beker')) {
			return 'violet';
		}

		if (normalizedDescription.includes('vrije tijd')) {
			return 'red';
		}
	}

	return colors[categoryId] ?? 'zinc';
}
