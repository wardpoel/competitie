export default function color(category) {
	if (category.shortname === 'ALL' && category.ranking == '1') return 'sky';
	if (category.shortname === 'ALL' && category.ranking == '2') return 'fuchsia';
	if (category.shortname === 'YOU' && category.ranking == '1') return 'green';
	if (category.shortname === 'VET' && category.ranking == '1') return 'amber';

	return 'zinc';
}
