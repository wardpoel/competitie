export default function toTitleCase(string) {
	return string.toLowerCase().replace(/(^|\s)([a-z])/g, match => match.toUpperCase());
}
