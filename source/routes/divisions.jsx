import { getDivisions } from 'vttl-api';

import divisionPath from '../vttl/divisions/path.js';
import divisionShortname from '../vttl/divisions/shortname.js';

export async function fetchDivisions() {
	let divisions = await getDivisions({ ShowDivisionName: 'yes' });
	for (let division of divisions) {
		division.path = divisionPath(division.name);
		division.shortname = divisionShortname(division.name);
	}
	return divisions;
}

export default function Divisions(props) {
	return props.children;
}
