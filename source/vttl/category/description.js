export default function description(category) {
	if (category.shortname === 'ALL' && category.ranking == '1') return 'men';
	if (category.shortname === 'ALL' && category.ranking == '2') return 'women';
	if (category.shortname === 'YOU' && category.ranking == '1') return 'youth';
	if (category.shortname === 'VET' && category.ranking == '1') return 'veterans';
}
