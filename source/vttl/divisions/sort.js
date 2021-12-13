import sortBy from '../../utilities/array/sort-by.js';
import { cupRegex, youthRegex, womenRegex, veteranRegex, recreantRegex } from '../regexes.js';

export default function sort(divisions) {
	return sortBy(
		divisions,
		division => recreantRegex.test(division.name),
		division => veteranRegex.test(division.name),
		division => youthRegex.test(division.name),
		division => cupRegex.test(division.name),
		division => womenRegex.test(division.name),
		division => division.shortname,
		division => division.name,
	);
}
