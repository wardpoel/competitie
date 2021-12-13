const letterRegex = /\s(?<letter>[a-zA-Z])(\s\(af\))?$/i;

export default function teamLetter(name) {
	let match = name.match(letterRegex);
	return match ? match.groups.letter : '';
}
