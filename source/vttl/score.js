const scoreRegex = /(\d+)-(\d+)(.*)/;

export default function score(string) {
	let [, homeString, awayString, remainder] = string.match(scoreRegex);

	let home = parseInt(homeString, 10);
	let away = parseInt(awayString, 10);
	let forfeit = remainder.includes('af');

	return [home, away, { forfeit }];
}
