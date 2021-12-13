export default function classnames(...args) {
	return args.filter(a => typeof a === 'string').join(' ');
}
