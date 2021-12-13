export default function toUrl(string) {
	return encodeURIComponent(string.replace(/\s/g, '').toLowerCase());
}
