import * as Vttl from 'vttl-api';

import toUrl from '../utilities/string/to-url.js';
import sortBy from '../utilities/array/sort-by.js';

const abbreviations = {
	2: 'Vl.-B/Br.',
	3: 'B.B.W.',
	4: 'Antwerpen',
	5: 'Oost-Vl.',
	6: 'West-Vl.',
	7: 'Limburg',
	8: 'Hainaut',
	9: 'Lux.',
	10: 'Liège',
	11: 'Namur',
};

let provinces = sortBy(Vttl.provinces, 'name');
let provincesById = {};
let provincesByUrl = {};
let provincesByAbbreviations = {};
for (let province of provinces) {
	province.url = toUrl(province.name);
	province.abbreviation = abbreviations[province.id];
	provincesById[province.id] = province;
	provincesByUrl[province.url] = province;
	provincesByAbbreviations[province.abbreviation] = province;
}

export default provinces;
export { provincesById, provincesByUrl, provincesByAbbreviations };
