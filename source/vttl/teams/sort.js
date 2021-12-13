import sortBy from '../../utilities/array/sort-by.js';
import { superRegex, nationalRegex, regionalRegex, provincialRegex } from '../regexes.js';
import { cupRegex, youthRegex, womenRegex, veteranRegex, recreantRegex } from '../regexes.js';

export default function sortTeams(array) {
	return sortBy(
		array,
		team => recreantRegex.test(team.division.name),
		team => cupRegex.test(team.division.name),
		team => veteranRegex.test(team.division.name),
		team => youthRegex.test(team.division.name),
		team => womenRegex.test(team.division.name),
		team => provincialRegex.test(team.division.name),
		team => regionalRegex.test(team.division.name),
		team => nationalRegex.test(team.division.name),
		team => superRegex.test(team.division.name),
		team => team.letter,
	);
}
